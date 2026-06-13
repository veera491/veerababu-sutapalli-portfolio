export interface CsvPortfolioRow {
  section: string;
  item_id: string;
  item_type: string;
  field: string;
  value: string;
  item_order: number;
  value_order: number;
  enabled: boolean;
  rowNumber: number;
}

export interface PortfolioItem {
  section: string;
  itemId: string;
  itemType: string;
  itemOrder: number;
  enabled: boolean;
  fields: Record<string, string | string[]>;
  sourceRows: number[];
}

export type PortfolioContent = Record<string, PortfolioItem[]>;

export interface ParsedCsvResult {
  content: PortfolioContent;
  warnings: string[];
}
