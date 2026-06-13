import { validateAssets } from '../src/lib/assets/validator';

async function runAssetValidation() {
  console.log('Validating Portfolio Assets...');
  try {
    const report = await validateAssets();
    
    console.log(`\n--- Asset Validation Report ---`);
    console.log(`Total References: ${report.totalReferences}`);
    console.log(`Unique References: ${report.uniqueReferences}`);
    console.log(`Existing Files: ${report.existingFiles}`);
    console.log(`Missing Required Files: ${report.missingRequiredFiles}`);
    console.log(`Missing Optional Files: ${report.missingOptionalFiles}`);
    console.log(`Invalid Paths: ${report.invalidPaths}`);
    console.log(`Fallback Assets Used: ${report.fallbackAssets}`);
    console.log(`Oversized Assets: ${report.oversizedAssets}`);
    
    if (report.warnings.length > 0) {
      console.log('\nWarnings:');
      report.warnings.forEach(w => console.log(` - ${w}`));
    }
    
    if (report.errors.length > 0) {
      console.log('\nErrors:');
      report.errors.forEach(e => console.log(` - ${e}`));
      console.log('\nValidation failed with errors.');
      process.exit(1);
    }
    
    console.log('\nValidation successful!');
    process.exit(0);
  } catch (error) {
    console.error('\nFatal Validation Error:', error);
    process.exit(1);
  }
}

runAssetValidation();
