import { z } from 'zod';

const idRegex = /^[a-z0-9_-]+$/;

export const rawRowSchema = z.object({
  section: z.string().min(1, "section cannot be empty").regex(idRegex, "section must use only lowercase letters, numbers, underscores, or hyphens"),
  item_id: z.string().min(1, "item_id cannot be empty").regex(idRegex, "item_id must use only lowercase letters, numbers, underscores, or hyphens"),
  item_type: z.string().min(1, "item_type cannot be empty").regex(idRegex, "item_type must use only lowercase letters, numbers, underscores, or hyphens"),
  field: z.string().min(1, "field cannot be empty").regex(idRegex, "field must use only lowercase letters, numbers, underscores, or hyphens"),
  value: z.string().min(1, "value cannot be empty"),
  item_order: z.string().regex(/^[1-9]\d*$/, "item_order must be a positive integer"),
  value_order: z.string().regex(/^[1-9]\d*$/, "value_order must be a positive integer"),
  enabled: z.string().regex(/^(true|false)$/i, "enabled must be exactly true or false")
});

export function validateCsvRow(row: unknown, rowNumber: number) {
  const result = rawRowSchema.safeParse(row);
  if (!result.success) {
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Row ${rowNumber}: ${errors}`);
  }
  return {
    ...result.data,
    item_order: parseInt(result.data.item_order, 10),
    value_order: parseInt(result.data.value_order, 10),
    enabled: result.data.enabled.toLowerCase() === 'true',
    rowNumber
  };
}
