export const ASSET_FALLBACKS: Record<string, string> = {
  project: '/assets/projects/fallback-cover.svg',
  publication: '/assets/projects/fallback-cover.svg',
  diagram: '/assets/placeholders/system-diagram.svg',
  application: '/assets/placeholders/application-cover.svg',
  education: '/assets/placeholders/education-cover.svg',
};

export const ALLOWED_IMAGE_EXTENSIONS = ['.webp', '.avif', '.png', '.jpg', '.jpeg', '.svg'];
export const ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf'];

export const ASSET_FIELDS = [
  'image', 'diagram', 'static_image', 'mobile_image', 'profile_image', 
  'frame_path', 'resume_path', 'preview_image', 'favicon_path', 'logo_path', 
  'cover_image', 'pdf_url'
];
