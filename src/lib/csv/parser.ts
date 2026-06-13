import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import Papa from 'papaparse';
import { validateCsvRow } from './schema';
import { CsvPortfolioRow, PortfolioContent, ParsedCsvResult } from './types';
import { REPEATED_FIELDS, KNOWN_SECTIONS, KNOWN_ITEM_TYPES } from './constants';

type RawCsvRecord = Record<string, unknown>;

export async function parseCsv(): Promise<ParsedCsvResult> {
  const filePath = path.resolve(process.cwd(), 'content', 'portfolio.csv');
  let fileContent: string;
  try {
    fileContent = await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read CSV file at ${filePath}: ${error instanceof Error ? error.message : error}`);
  }

  const parseResult: Papa.ParseResult<RawCsvRecord> = Papa.parse<RawCsvRecord>(fileContent, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  });

  if (parseResult.errors.length > 0) {
    const errorMessages = parseResult.errors.map(e => `Row ${e.row !== undefined ? e.row + 2 : 'unknown'}: ${e.message}`).join('; ');
    throw new Error(`CSV parsing failed: ${errorMessages}`);
  }

  const rows: CsvPortfolioRow[] = [];
  const expectedColumns = ['section', 'item_id', 'item_type', 'field', 'value', 'item_order', 'value_order', 'enabled'];

  if (!parseResult.meta.fields) {
    throw new Error("No columns found in CSV");
  }
  
  const actualColumns = parseResult.meta.fields;
  const missingColumns = expectedColumns.filter(c => !actualColumns.includes(c));
  const unexpectedColumns = actualColumns.filter(c => !expectedColumns.includes(c));

  if (missingColumns.length > 0) {
    throw new Error(`Missing expected columns: ${missingColumns.join(', ')}`);
  }
  if (unexpectedColumns.length > 0) {
    throw new Error(`Unexpected columns: ${unexpectedColumns.join(', ')}`);
  }

  const warnings: string[] = [];

  parseResult.data.forEach((rawRow, index) => {
    // skip completely blank objects
    if (Object.keys(rawRow).length === 1 && rawRow[actualColumns[0]] === '') return;
    
    const rowNumber = index + 2; 
    try {
        const validatedRow = validateCsvRow(rawRow, rowNumber);
        
        if (!KNOWN_SECTIONS.includes(validatedRow.section)) {
            warnings.push(`Row ${rowNumber}: Unknown section '${validatedRow.section}'`);
        }
        if (!KNOWN_ITEM_TYPES.includes(validatedRow.item_type)) {
            warnings.push(`Row ${rowNumber}: Unknown item_type '${validatedRow.item_type}'`);
        }
        if (validatedRow.value.startsWith('REPLACE_WITH_')) {
            warnings.push(`Row ${rowNumber}: Placeholder value present for field '${validatedRow.field}'`);
        }

        rows.push(validatedRow);
    } catch (e) {
        throw new Error(e instanceof Error ? e.message : String(e));
    }
  });

  const itemsMap = new Map<string, CsvPortfolioRow[]>();
  rows.forEach(row => {
    const key = `${row.section}:::${row.item_id}`;
    if (!itemsMap.has(key)) {
      itemsMap.set(key, []);
    }
    itemsMap.get(key)!.push(row);
  });

  const content: PortfolioContent = {};

  for (const [, itemRows] of itemsMap.entries()) {
    const firstRow = itemRows[0];
    const { section, item_id: itemId, item_type: itemType, item_order: itemOrder, enabled } = firstRow;
    const sourceRows = itemRows.map(r => r.rowNumber);

    const inconsistentRows = itemRows.filter(r => 
      r.section !== section || 
      r.item_id !== itemId || 
      r.item_type !== itemType || 
      r.item_order !== itemOrder || 
      r.enabled !== enabled
    );

    if (inconsistentRows.length > 0) {
      const allRowNumbers = itemRows.map(r => r.rowNumber).join(', ');
      throw new Error(`Inconsistent item metadata for ${section}/${itemId}. Rows affected: ${allRowNumbers}`);
    }

    const fields: Record<string, string | string[]> = {};
    const fieldValuesOrderMap: Record<string, number[]> = {};

    for (const row of itemRows) {
      const isRepeated = REPEATED_FIELDS.includes(row.field.toLowerCase());
      if (isRepeated) {
        if (!fields[row.field]) {
          fields[row.field] = [];
          fieldValuesOrderMap[row.field] = [];
        }
        const arr = fields[row.field] as string[];
        const orderArr = fieldValuesOrderMap[row.field];
        
        if (arr.includes(row.value)) {
          throw new Error(`Duplicate value '${row.value}' for repeated field '${row.field}' in ${section}/${itemId}. Row: ${row.rowNumber}`);
        }
        if (orderArr.includes(row.value_order)) {
          throw new Error(`Duplicate value_order ${row.value_order} for repeated field '${row.field}' in ${section}/${itemId}. Row: ${row.rowNumber}`);
        }
        
        arr.push(row.value);
        orderArr.push(row.value_order);
      } else {
        if (fields[row.field] !== undefined) {
          throw new Error(`Singleton field '${row.field}' occurs more than once in ${section}/${itemId}. Row: ${row.rowNumber}`);
        }
        fields[row.field] = row.value;
      }
    }

    for (const field of Object.keys(fields)) {
      if (REPEATED_FIELDS.includes(field.toLowerCase())) {
        const arr = fields[field] as string[];
        const orderArr = fieldValuesOrderMap[field];
        const combined = arr.map((val, i) => ({ val, order: orderArr[i] }));
        combined.sort((a, b) => a.order - b.order);
        fields[field] = combined.map(c => c.val);
      }
    }

    if (!content[section]) {
      content[section] = [];
    }
    
    content[section].push({
      section,
      itemId,
      itemType,
      itemOrder,
      enabled,
      fields,
      sourceRows
    });
  }

  const allEnabledSlugs = new Set<string>();

  for (const [section, items] of Object.entries(content)) {
    items.sort((a, b) => a.itemOrder - b.itemOrder);

    const orders = items.map(i => i.itemOrder);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
        const counts = new Map<number, number>();
        orders.forEach(o => counts.set(o, (counts.get(o) || 0) + 1));
        const dupes = Array.from(counts.entries()).filter(([, c]) => c > 1).map(([o]) => o);
        throw new Error(`Duplicate item_order(s) ${dupes.join(', ')} found in section '${section}'`);
    }

    for (const item of items) {
      if (item.enabled && item.fields['slug'] && section === 'project') {
        const slug = item.fields['slug'] as string;
        if (allEnabledSlugs.has(slug)) {
          throw new Error(`Duplicate slug '${slug}' found in enabled project items. Affected: ${section}/${item.itemId}.`);
        }
        allEnabledSlugs.add(slug);
      }

      // Section-specific required fields
      if (item.enabled) {
        if (section === 'site' && item.itemId === 'identity') {
          ['full_name', 'primary_role', 'tagline', 'location', 'email'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in site/identity`);
          });
        }
        if (section === 'seo' && item.itemId === 'global') {
          ['title', 'description'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in seo/global`);
          });
        }
        if (section === 'theme' && item.itemId === 'global') {
          ['background', 'surface', 'text', 'muted', 'accent'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in theme/global`);
          });
        }
        if (section === 'navigation') {
          ['label', 'target'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in navigation/${item.itemId}`);
          });
        }
        if (section === 'hero' && item.itemType === 'phase') {
          if (!item.fields['text'] && !item.fields['title'] && !item.fields['eyebrow'] && !item.fields['supporting']) {
            throw new Error(`hero phase ${item.itemId} requires at least one of: text, title, eyebrow, supporting`);
          }
        }
        if (section === 'hero_cta') {
          ['label', 'target'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in hero_cta/${item.itemId}`);
          });
        }
        if (section === 'proof') {
          if (!item.fields['value']) throw new Error(`Missing required field 'value' in proof/${item.itemId}`);
        }
        if (section === 'project') {
          ['title', 'slug', 'category', 'summary'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in project/${item.itemId}`);
          });
        }
        if (section === 'publication') {
          ['title', 'summary'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in publication/${item.itemId}`);
          });
        }
        if (section === 'experience') {
          ['organization', 'role', 'start_date', 'end_date', 'summary'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in experience/${item.itemId}`);
          });
        }
        if (section === 'capability') {
          ['title', 'description'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in capability/${item.itemId}`);
          });
        }
        if (section === 'skill_group') {
          if (!item.fields['title']) throw new Error(`Missing required field 'title' in skill_group/${item.itemId}`);
          if (!item.fields['skill'] || !Array.isArray(item.fields['skill']) || item.fields['skill'].length === 0) {
            throw new Error(`skill_group/${item.itemId} requires at least one repeated 'skill'`);
          }
        }
        if (section === 'education') {
          ['institution', 'degree', 'start_date', 'end_date'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in education/${item.itemId}`);
          });
        }
        if (section === 'achievement') {
          ['title', 'description'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in achievement/${item.itemId}`);
          });
        }
        if (section === 'social') {
          ['label', 'url'].forEach(f => {
            if (!item.fields[f]) throw new Error(`Missing required field '${f}' in social/${item.itemId}`);
          });
        }
        if (section === 'contact') {
          if (!item.fields['email'] && !item.fields['url'] && !item.fields['value']) {
             throw new Error(`contact/${item.itemId} requires at least one of: email, url, value`);
          }
        }
      }
    }
  }

  // Check site/identity existance (kept from previous implementation)
  const identityItem = content['site']?.find(i => i.itemId === 'identity');
  if (!identityItem) {
    throw new Error(`The CSV must contain site/identity`);
  }
  
  if (identityItem.fields['full_name'] !== 'VEERABABU SUTAPALLI') {
    throw new Error(`full_name must equal VEERABABU SUTAPALLI`);
  }

  return { content, warnings: Array.from(new Set(warnings)) };
}
