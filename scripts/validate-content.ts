import { parseCsv } from '../src/lib/csv/parser';

async function main() {
  try {
    const content = await parseCsv();
    
    let enabledItems = 0;
    let disabledItems = 0;
    const sectionCounts: Record<string, number> = {};
    let totalRows = 0;

    for (const [section, items] of Object.entries(content)) {
      sectionCounts[section] = items.length;
      for (const item of items) {
        if (item.enabled) {
          enabledItems++;
        } else {
          disabledItems++;
        }
        totalRows += item.sourceRows.length;
      }
    }

    console.log(`Validation successful!`);
    console.log(`Total data rows: ${totalRows}`);
    console.log(`Total enabled items: ${enabledItems}`);
    console.log(`Total disabled items: ${disabledItems}`);
    console.log(`\nItems per section:`);
    for (const [section, count] of Object.entries(sectionCounts)) {
      console.log(`- ${section}: ${count}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("VALIDATION ERROR:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
