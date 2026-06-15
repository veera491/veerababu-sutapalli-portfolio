import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const reportDir = path.join(process.cwd(), 'docs/lighthouse/step-13b');
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

const CHROME_FLAGS = '--headless --no-sandbox --disable-dev-shm-usage';

function runLighthouse(url, preset, outputPath) {
  const flags = preset === 'desktop'
    ? `--preset=desktop`
    : `--form-factor=mobile --screenEmulation.disabled=false`;
  
  const cmd = `npx lighthouse "${url}" ${flags} --output=json --output-path="${outputPath}" --chrome-flags="${CHROME_FLAGS}"`;
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function getMetric(json, id) {
  // Extract audit values
  const audit = json.audits[id];
  if (!audit) return 0;
  return audit.numericValue !== undefined ? audit.numericValue : audit.score;
}

function getCategoryScore(json, id) {
  const cat = json.categories[id];
  return cat ? Math.round(cat.score * 100) : 0;
}

function getNetworkTransfer(json) {
  // Total byte weight of the page
  const audit = json.audits['network-requests'];
  if (!audit || !audit.details || !audit.details.items) return 0;
  let totalBytes = 0;
  for (const item of audit.details.items) {
    totalBytes += item.transferSize || 0;
  }
  return Math.round(totalBytes / 1024); // return KiB
}

function getMainThreadWork(json) {
  return getMetric(json, 'mainthread-work-breakdown') || 0;
}

function getJsExecutionTime(json) {
  return getMetric(json, 'bootup-time') || 0;
}

function extractData(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return {
    performance: getCategoryScore(data, 'performance'),
    accessibility: getCategoryScore(data, 'accessibility'),
    bestPractices: getCategoryScore(data, 'best-practices'),
    seo: getCategoryScore(data, 'seo'),
    fcp: getMetric(data, 'first-contentful-paint') / 1000, // seconds
    lcp: getMetric(data, 'largest-contentful-paint') / 1000, // seconds
    cls: getMetric(data, 'cumulative-layout-shift'),
    tbt: getMetric(data, 'total-blocking-time'), // ms
    speedIndex: getMetric(data, 'speed-index') / 1000, // seconds
    transferKiB: getNetworkTransfer(data),
    mainThreadMs: getMainThreadWork(data),
    jsExecMs: getJsExecutionTime(data)
  };
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function computeMedians(runs) {
  const keys = Object.keys(runs[0]);
  const medians = {};
  for (const key of keys) {
    medians[key] = median(runs.map(r => r[key]));
  }
  return medians;
}

// MAIN RUN SEQUENCE
const url3D = 'http://localhost:3000/3d-lab';
const urlStatic = 'http://localhost:3000/3d-lab?disable-3d=true';

console.log('=== STEP 13B LIGHTHOUSE AUDIT COMMENCING ===');

// Warm-up runs (discarded)
console.log('\n--- WARM-UP RUNS ---');
runLighthouse(urlStatic, 'desktop', path.join(reportDir, 'warmup-desktop-static.json'));
runLighthouse(url3D, 'desktop', path.join(reportDir, 'warmup-desktop-3d.json'));
runLighthouse(urlStatic, 'mobile', path.join(reportDir, 'warmup-mobile-static.json'));
runLighthouse(url3D, 'mobile', path.join(reportDir, 'warmup-mobile-prod.json'));

// Desktop Runs: static, 3D, 3D, static, static, 3D
console.log('\n--- DESKTOP AUDITS ---');
const desktopStaticPaths = [
  path.join(reportDir, 'desktop-static-1.json'),
  path.join(reportDir, 'desktop-static-2.json'),
  path.join(reportDir, 'desktop-static-3.json')
];
const desktop3DPaths = [
  path.join(reportDir, 'desktop-3d-1.json'),
  path.join(reportDir, 'desktop-3d-2.json'),
  path.join(reportDir, 'desktop-3d-3.json')
];

runLighthouse(urlStatic, 'desktop', desktopStaticPaths[0]); // static 1
runLighthouse(url3D, 'desktop', desktop3DPaths[0]);       // 3D 1
runLighthouse(url3D, 'desktop', desktop3DPaths[1]);       // 3D 2
runLighthouse(urlStatic, 'desktop', desktopStaticPaths[1]); // static 2
runLighthouse(urlStatic, 'desktop', desktopStaticPaths[2]); // static 3
runLighthouse(url3D, 'desktop', desktop3DPaths[2]);       // 3D 3

// Mobile Runs: static, mobile-fallback, mobile-fallback, static, static, mobile-fallback
console.log('\n--- MOBILE AUDITS ---');
const mobileStaticPaths = [
  path.join(reportDir, 'mobile-static-1.json'),
  path.join(reportDir, 'mobile-static-2.json'),
  path.join(reportDir, 'mobile-static-3.json')
];
const mobileProdPaths = [
  path.join(reportDir, 'mobile-prod-1.json'),
  path.join(reportDir, 'mobile-prod-2.json'),
  path.join(reportDir, 'mobile-prod-3.json')
];

runLighthouse(urlStatic, 'mobile', mobileStaticPaths[0]); // static 1
runLighthouse(url3D, 'mobile', mobileProdPaths[0]);       // prod 1
runLighthouse(url3D, 'mobile', mobileProdPaths[1]);       // prod 2
runLighthouse(urlStatic, 'mobile', mobileStaticPaths[1]); // static 2
runLighthouse(urlStatic, 'mobile', mobileStaticPaths[2]); // static 3
runLighthouse(url3D, 'mobile', mobileProdPaths[2]);       // prod 3

console.log('\n=== RUNS COMPLETE, EXTRACTING MEDIANS ===');

const dsRuns = desktopStaticPaths.map(extractData);
const d3dRuns = desktop3DPaths.map(extractData);
const msRuns = mobileStaticPaths.map(extractData);
const mprodRuns = mobileProdPaths.map(extractData);

const dsMedian = computeMedians(dsRuns);
const d3dMedian = computeMedians(d3dRuns);
const msMedian = computeMedians(msRuns);
const mprodMedian = computeMedians(mprodRuns);

// Helper to format values nicely
const fNum = (val, dec = 1) => typeof val === 'number' ? val.toFixed(dec) : val;
const fInt = (val) => typeof val === 'number' ? Math.round(val) : val;

console.log('\n### LIGHTHOUSE MEDIAN RESULTS SUMMARY');
console.log('| Metric | Desktop Static | Desktop 3D Lab | Mobile Static | Mobile Prod Fallback |');
console.log('| :--- | :---: | :---: | :---: | :---: |');
console.log(`| **Performance** | ${fInt(dsMedian.performance)} | ${fInt(d3dMedian.performance)} | ${fInt(msMedian.performance)} | ${fInt(mprodMedian.performance)} |`);
console.log(`| **Accessibility** | ${fInt(dsMedian.accessibility)} | ${fInt(d3dMedian.accessibility)} | ${fInt(msMedian.accessibility)} | ${fInt(mprodMedian.accessibility)} |`);
console.log(`| **Best Practices** | ${fInt(dsMedian.bestPractices)} | ${fInt(d3dMedian.bestPractices)} | ${fInt(msMedian.bestPractices)} | ${fInt(mprodMedian.bestPractices)} |`);
console.log(`| **SEO** | ${fInt(dsMedian.seo)} | ${fInt(d3dMedian.seo)} | ${fInt(msMedian.seo)} | ${fInt(mprodMedian.seo)} |`);
console.log(`| **LCP** | ${fNum(dsMedian.lcp)} s | ${fNum(d3dMedian.lcp)} s | ${fNum(msMedian.lcp)} s | ${fNum(mprodMedian.lcp)} s |`);
console.log(`| **CLS** | ${fNum(dsMedian.cls, 3)} | ${fNum(d3dMedian.cls, 3)} | ${fNum(msMedian.cls, 3)} | ${fNum(mprodMedian.cls, 3)} |`);
console.log(`| **TBT** | ${fInt(dsMedian.tbt)} ms | ${fInt(d3dMedian.tbt)} ms | ${fInt(msMedian.tbt)} ms | ${fInt(mprodMedian.tbt)} ms |`);
console.log(`| **Speed Index** | ${fNum(dsMedian.speedIndex)} s | ${fNum(d3dMedian.speedIndex)} s | ${fNum(msMedian.speedIndex)} s | ${fNum(mprodMedian.speedIndex)} s |`);
console.log(`| **Total Transfer** | ${fInt(dsMedian.transferKiB)} KiB | ${fInt(d3dMedian.transferKiB)} KiB | ${fInt(msMedian.transferKiB)} KiB | ${fInt(mprodMedian.transferKiB)} KiB |`);
console.log(`| **Main-Thread Work** | ${fInt(dsMedian.mainThreadMs)} ms | ${fInt(d3dMedian.mainThreadMs)} ms | ${fInt(msMedian.mainThreadMs)} ms | ${fInt(mprodMedian.mainThreadMs)} ms |`);
console.log(`| **JS Execution** | ${fInt(dsMedian.jsExecMs)} ms | ${fInt(d3dMedian.jsExecMs)} ms | ${fInt(msMedian.jsExecMs)} ms | ${fInt(mprodMedian.jsExecMs)} ms |`);

// Write results summary to a text file for record
const summaryMarkdown = `
# Step 13B Lighthouse Median Results

| Metric | Desktop Static | Desktop 3D Lab | Mobile Static | Mobile Prod Fallback |
| :--- | :---: | :---: | :---: | :---: |
| **Performance** | ${fInt(dsMedian.performance)} | ${fInt(d3dMedian.performance)} | ${fInt(msMedian.performance)} | ${fInt(mprodMedian.performance)} |
| **Accessibility** | ${fInt(dsMedian.accessibility)} | ${fInt(d3dMedian.accessibility)} | ${fInt(msMedian.accessibility)} | ${fInt(mprodMedian.accessibility)} |
| **Best Practices** | ${fInt(dsMedian.bestPractices)} | ${fInt(d3dMedian.bestPractices)} | ${fInt(msMedian.bestPractices)} | ${fInt(mprodMedian.bestPractices)} |
| **SEO** | ${fInt(dsMedian.seo)} | ${fInt(d3dMedian.seo)} | ${fInt(msMedian.seo)} | ${fInt(mprodMedian.seo)} |
| **LCP** | ${fNum(dsMedian.lcp)} s | ${fNum(d3dMedian.lcp)} s | ${fNum(msMedian.lcp)} s | ${fNum(mprodMedian.lcp)} s |
| **CLS** | ${fNum(dsMedian.cls, 3)} | ${fNum(d3dMedian.cls, 3)} | ${fNum(msMedian.cls, 3)} | ${fNum(mprodMedian.cls, 3)} |
| **TBT** | ${fInt(dsMedian.tbt)} ms | ${fInt(d3dMedian.tbt)} ms | ${fInt(msMedian.tbt)} ms | ${fInt(mprodMedian.tbt)} ms |
| **Speed Index** | ${fNum(dsMedian.speedIndex)} s | ${fNum(d3dMedian.speedIndex)} s | ${fNum(msMedian.speedIndex)} s | ${fNum(mprodMedian.speedIndex)} s |
| **Total Transfer** | ${fInt(dsMedian.transferKiB)} KiB | ${fInt(d3dMedian.transferKiB)} KiB | ${fInt(msMedian.transferKiB)} KiB | ${fInt(mprodMedian.transferKiB)} KiB |
| **Main-Thread Work** | ${fInt(dsMedian.mainThreadMs)} ms | ${fInt(d3dMedian.mainThreadMs)} ms | ${fInt(msMedian.mainThreadMs)} ms | ${fInt(mprodMedian.mainThreadMs)} ms |
| **JS Execution** | ${fInt(dsMedian.jsExecMs)} ms | ${fInt(d3dMedian.jsExecMs)} ms | ${fInt(msMedian.jsExecMs)} ms | ${fInt(mprodMedian.jsExecMs)} ms |
`;
fs.writeFileSync(path.join(reportDir, 'results-summary.md'), summaryMarkdown, 'utf8');
console.log('\nSaved results summary to docs/lighthouse/step-13b/results-summary.md');
