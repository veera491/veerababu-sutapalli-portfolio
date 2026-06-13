import { parseCsv } from '../src/lib/csv/parser';
import { KNOWN_SECTIONS } from '../src/lib/csv/constants';

async function main() {
  try {
    const { content, warnings } = await parseCsv();
    
    let enabledItems = 0;
    let disabledItems = 0;
    const sectionCounts: Record<string, number> = {};
    const itemTypeCounts: Record<string, number> = {};
    let totalRows = 0;

    const sectionsUsed = Object.keys(content);
    const knownSectionsUsed = sectionsUsed.filter(s => KNOWN_SECTIONS.includes(s));
    const unknownSectionsUsed = sectionsUsed.filter(s => !KNOWN_SECTIONS.includes(s));

    for (const [section, items] of Object.entries(content)) {
      sectionCounts[section] = items.length;
      for (const item of items) {
        if (item.enabled) {
          enabledItems++;
        } else {
          disabledItems++;
        }
        totalRows += item.sourceRows.length;
        
        itemTypeCounts[item.itemType] = (itemTypeCounts[item.itemType] || 0) + 1;
      }
    }

    const placeholderWarnings = warnings.filter(w => w.includes('Placeholder value present'));
    const otherWarnings = warnings.filter(w => !w.includes('Placeholder value present'));

    console.log(`=== CSV VALIDATION REPORT ===`);
    console.log(`Total data rows: ${totalRows}`);
    console.log(`Enabled items: ${enabledItems}`);
    console.log(`Disabled items: ${disabledItems}`);
    
    console.log(`\nKnown sections used (${knownSectionsUsed.length}):`);
    knownSectionsUsed.forEach(s => console.log(`- ${s}: ${sectionCounts[s]} items`));
    
    if (unknownSectionsUsed.length > 0) {
      console.log(`\nUnknown sections used (${unknownSectionsUsed.length}):`);
      unknownSectionsUsed.forEach(s => console.log(`- ${s}: ${sectionCounts[s]} items`));
    }

    console.log(`\nItem counts by item_type:`);
    for (const [type, count] of Object.entries(itemTypeCounts)) {
      console.log(`- ${type}: ${count}`);
    }

    console.log(`\nPlaceholder values still present: ${placeholderWarnings.length}`);
    placeholderWarnings.forEach(w => console.log(`  [WARNING] ${w}`));

    console.log(`\nOther warnings: ${otherWarnings.length}`);
    otherWarnings.forEach(w => console.log(`  [WARNING] ${w}`));
    
    console.log(`\nErrors: 0`);
    
    console.log(`\nPortfolio content validation passed with ${warnings.length} warning(s).`);
    
    process.exit(0);
  } catch (error) {
    console.error("\n=== VALIDATION ERROR ===");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
