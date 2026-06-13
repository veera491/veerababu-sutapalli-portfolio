import 'server-only';
import { cache } from 'react';
import { parseCsv } from './parser';
import { PortfolioItem, PortfolioContent, ParsedCsvResult } from './types';

// Cache the parsing so it only happens once per request/build process
const getCachedResult = cache(async (): Promise<ParsedCsvResult> => {
  return await parseCsv();
});

export interface RepoOptions {
  includeDisabled?: boolean;
}

export async function getPortfolioContent(options?: RepoOptions): Promise<PortfolioContent> {
  const result = await getCachedResult();
  const content = result.content;
  if (options?.includeDisabled) {
    return content;
  }
  
  const filteredContent: PortfolioContent = {};
  for (const [section, items] of Object.entries(content)) {
    const enabledItems = items.filter(item => item.enabled);
    if (enabledItems.length > 0) {
      filteredContent[section] = enabledItems;
    }
  }
  return filteredContent;
}

export async function getSection(section: string, options?: RepoOptions): Promise<ReadonlyArray<PortfolioItem>> {
  const content = await getPortfolioContent(options);
  return content[section] || [];
}

export async function getItem(section: string, itemId: string, options?: RepoOptions): Promise<PortfolioItem | undefined> {
  const sectionItems = await getSection(section, options);
  return sectionItems.find(item => item.itemId === itemId);
}

export async function requireItem(section: string, itemId: string, options?: RepoOptions): Promise<PortfolioItem> {
  const item = await getItem(section, itemId, options);
  if (!item) {
    throw new Error(`Required item ${section}/${itemId} not found${options?.includeDisabled ? '' : ' or is disabled'}.`);
  }
  return item;
}

export function getField(item: PortfolioItem, field: string): string | string[] | undefined {
  return item.fields[field];
}

export function requireStringField(item: PortfolioItem, field: string): string {
  const value = item.fields[field];
  if (value === undefined) {
    throw new Error(`Required field '${field}' missing in item ${item.section}/${item.itemId}`);
  }
  if (Array.isArray(value)) {
    throw new Error(`Field '${field}' in item ${item.section}/${item.itemId} is an array, expected a string`);
  }
  return value;
}

export function getStringArrayField(item: PortfolioItem, field: string): string[] {
  const value = item.fields[field];
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`Field '${field}' in item ${item.section}/${item.itemId} is a string, expected an array`);
  }
  return value;
}

export async function getEnabledSections(): Promise<ReadonlyArray<string>> {
  const content = await getPortfolioContent();
  return Object.keys(content);
}

export async function getItemsByType(section: string, itemType: string, options?: RepoOptions): Promise<ReadonlyArray<PortfolioItem>> {
  const items = await getSection(section, options);
  return items.filter(item => item.itemType === itemType);
}

export async function getItemsWithField(section: string, field: string, options?: RepoOptions): Promise<ReadonlyArray<PortfolioItem>> {
  const items = await getSection(section, options);
  return items.filter(item => item.fields[field] !== undefined);
}

export function getBooleanField(item: PortfolioItem, field: string, defaultValue?: boolean): boolean {
  const value = item.fields[field];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Required boolean field '${field}' missing in item ${item.section}/${item.itemId}`);
  }
  if (Array.isArray(value)) {
    throw new Error(`Field '${field}' in item ${item.section}/${item.itemId} is an array, expected a boolean string`);
  }
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  throw new Error(`Field '${field}' in item ${item.section}/${item.itemId} is not a valid boolean: ${value}`);
}

export function getNumberField(item: PortfolioItem, field: string, defaultValue?: number): number {
  const value = item.fields[field];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Required numeric field '${field}' missing in item ${item.section}/${item.itemId}`);
  }
  if (Array.isArray(value)) {
    throw new Error(`Field '${field}' in item ${item.section}/${item.itemId} is an array, expected a numeric string`);
  }
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Field '${field}' in item ${item.section}/${item.itemId} is not a valid number: ${value}`);
  }
  return num;
}

export function getOptionalStringField(item: PortfolioItem, field: string): string | undefined {
  const value = item.fields[field];
  if (value === undefined) return undefined;
  if (Array.isArray(value)) {
    throw new Error(`Field '${field}' in item ${item.section}/${item.itemId} is an array, expected a string`);
  }
  return value;
}

export function hasField(item: PortfolioItem, field: string): boolean {
  return item.fields[field] !== undefined;
}
