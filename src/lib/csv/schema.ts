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

  const data = result.data;
  const field = data.field.toLowerCase();
  const val = data.value;

  if (field.endsWith('_url')) {
    if (!val.startsWith('https://') && !val.startsWith('mailto:') && !val.startsWith('/') && !val.startsWith('REPLACE_WITH_')) {
      throw new Error(`Row ${rowNumber}: Field ${field} must be https://, mailto:, /, or REPLACE_WITH_ placeholder. Found: ${val}`);
    }
  }

  const pathFields = ['image', 'diagram', 'resume_path', 'static_image', 'frame_path'];
  if (field.endsWith('_path') || pathFields.includes(field)) {
    if (val.includes('..')) {
      throw new Error(`Row ${rowNumber}: Asset path ${field} cannot contain '..'`);
    }
    if (!val.startsWith('assets/') && !val.startsWith('/') && !val.startsWith('REPLACE_WITH_')) {
      throw new Error(`Row ${rowNumber}: Asset path ${field} must start with assets/, /, or REPLACE_WITH_. Found: ${val}`);
    }
  }

  if (field === 'slug') {
    if (!/^[a-z0-9-]+$/.test(val)) {
      throw new Error(`Row ${rowNumber}: slug must be lowercase kebab-case. Found: ${val}`);
    }
  }

  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val) && !val.startsWith('REPLACE_WITH_')) {
      throw new Error(`Row ${rowNumber}: email must be a valid email address or REPLACE_WITH_. Found: ${val}`);
    }
  }

  const colorSettings = ['background', 'surface', 'text', 'muted', 'accent'];
  if (colorSettings.includes(field) && data.item_type === 'setting') {
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(val)) {
      throw new Error(`Row ${rowNumber}: Colour setting ${field} must be #RGB, #RGBA, #RRGGBB, or #RRGGBBAA. Found: ${val}`);
    }
  }

  const booleanConfigs = ['cinematic_enabled', 'featured', 'downloadable', 'open_to_work', 'show_in_navigation'];
  if (booleanConfigs.includes(field)) {
    if (val !== 'true' && val !== 'false') {
      throw new Error(`Row ${rowNumber}: Boolean configuration ${field} must be exactly true or false. Found: ${val}`);
    }
  }

  const intConfigs = ['frame_count', 'animation_duration', 'display_limit'];
  if (intConfigs.includes(field)) {
    if (!/^[1-9]\d*$/.test(val)) {
      throw new Error(`Row ${rowNumber}: Configuration ${field} must be a positive integer. Found: ${val}`);
    }
  }

  if (field === 'scroll_height') {
    if (!/^\d+(vh|px)$/.test(val)) {
      throw new Error(`Row ${rowNumber}: scroll_height must be a safe CSS value (e.g. 500vh, 1200px). Found: ${val}`);
    }
  }

  const dateFields = ['start_date', 'end_date', 'date', 'year'];
  if (dateFields.includes(field)) {
    if (!/^[a-zA-Z0-9 -]+$/.test(val)) {
      throw new Error(`Row ${rowNumber}: Date field ${field} contains unexpected characters. Found: ${val}`);
    }
  }

  return {
    ...data,
    field: field,
    item_order: parseInt(data.item_order, 10),
    value_order: parseInt(data.value_order, 10),
    enabled: data.enabled.toLowerCase() === 'true',
    rowNumber
  };
}
