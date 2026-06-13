# Portfolio Project

## 1. Project Purpose
A professional portfolio website designed to showcase projects, skills, and professional experience. The system is built with a unique "build-time CSV content engine" that separates content from code.

## 2. Technology Stack
- Next.js 16.2.9 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Node.js 24 (production target)
- Vercel Hosting
- Papa Parse & Zod (CSV parsing and validation)

## 3. How the CSV model works
All textual content for the portfolio lives in `content/portfolio.csv`. During the build process, the CSV is parsed, validated, and normalized into structured JSON data. Next.js components then read this data using server-side repository functions, ensuring high performance (no database calls at runtime) and type safety.

## 4. Exact Column Definitions
The CSV must use the exact following header:
`section,item_id,item_type,field,value,item_order,value_order,enabled`

- **section**: High-level grouping (e.g., `site`, `social`, `proof`, `projects`).
- **item_id**: Unique identifier within the section (e.g., `identity`, `github`, `education`). Use lowercase kebab-case.
- **item_type**: Type of the item (e.g., `profile`, `link`, `proof_item`).
- **field**: The specific attribute being set (e.g., `full_name`, `url`, `value`).
- **value**: The text value of the field.
- **item_order**: Number used to sort items within a section.
- **value_order**: Number used to sort repeated fields within an item.
- **enabled**: `true` or `false` to show or hide the item.

## 5. How to edit text
Modify the `value` column in `content/portfolio.csv`. For text containing commas, wrap the value in double quotes.

## 6. How to add repeated fields
Some fields (like `technology`, `bullet`, `paragraph`) are configured as repeated fields. Add a new row with the exact same `section`, `item_id`, `item_type`, `item_order`, and `enabled` values, specifying the repeated field name and the new `value`. Increment the `value_order` to determine its order in the array.

## 7. How to hide an item
Change the `enabled` column to `false` for all rows associated with the `item_id`. Ensure the value is consistently `false` across all rows for that item.

## 8. How to reorder items
Change the `item_order` column. All rows belonging to the same item must have the exact same `item_order`. Lower numbers appear first. 

## 9. Rules for quoted commas
If your text contains commas or double quotes, you must enclose the entire value in double quotes. If you have quotes inside the text, escape them with double quotes (e.g., `"She said ""Hello"", and left"`).

## 10. Why item IDs should not be changed after publishing
Item IDs may be used to generate URL slugs or hardcoded in specific layout sections. Changing them might break links or layout references.

## 11. Commands
- `npm run dev`: Start development server
- `npm run validate:content`: Run the CSV validation script
- `npm run lint`: Check for code issues
- `npm run build`: Validate CSV and build production bundle
- `npm run check`: Run lint and build sequentially

## 12. Vercel deployment flow
Pushing code to the `main` branch automatically triggers Vercel deployment. Vercel runs `npm run build`, which executes the CSV validation step before bundling the site. If the CSV is invalid, the build fails and the bad data is not deployed.

## 13. Warning
**Do not run `npm audit fix --force` without reviewing breaking changes.** It may upgrade fundamental dependencies (like Next.js or React) beyond the supported versions for this project.

## 14. Supported Sections
The CSV engine safely identifies: `site`, `seo`, `theme`, `navigation`, `hero`, `hero_cta`, `proof`, `about`, `project`, `publication`, `experience`, `capability`, `skill_group`, `education`, `achievement`, `social`, `contact`, `footer`. Any unlisted section will trigger a build warning but pass.

## 15. URL and Asset Rules
Fields ending in `_url` must use `https://`, `mailto:`, start with `/`, or be `REPLACE_WITH_`.
Fields ending in `_path` (plus `image`, `diagram`, `resume_path`, `static_image`, `frame_path`) must be relative public assets starting with `assets/`, `/`, or `REPLACE_WITH_`. Asset paths cannot contain `..`. Image files remain under `public/assets` while the CSV only stores their string paths.

## 16. Boolean and Numeric Field Rules
Fields like `cinematic_enabled`, `featured`, `open_to_work` must be explicitly string matched to `true` or `false`.
Configurations like `frame_count`, `animation_duration`, `display_limit` must be positive integers. 

## 17. Placeholder Behaviour
Any value prefixed with `REPLACE_WITH_` is safely parsed but logged as a warning during the content validation build step. Use this to trace unfinalized content.

## 18. Reference: Project, Publication, Experience, Education Fields
- **project**: Requires `title`, `slug`, `category`, `summary`. Supports arrays like `technology`, `metric`, `finding`.
- **publication**: Requires `title`, `summary`. Supports arrays like `author`, `finding`, `contribution`.
- **experience**: Requires `organization`, `role`, `start_date`, `end_date`, `summary`. Supports arrays like `bullet`.
- **education**: Requires `institution`, `degree`, `start_date`, `end_date`. Supports arrays like `achievement`.

## 19. Examples
### Adding a Project
```csv
project,ai_sys,standard,title,AI Agent System,1,1,true
project,ai_sys,standard,slug,ai-agent-system,1,2,true
project,ai_sys,standard,category,Engineering,1,3,true
project,ai_sys,standard,summary,An autonomous agent.,1,4,true
project,ai_sys,standard,technology,Python,1,5,true
project,ai_sys,standard,technology,Next.js,1,6,true
```
### Adding an Experience
```csv
experience,exp_1,experience,organization,Tech Corp,1,1,true
experience,exp_1,experience,role,Engineer,1,2,true
experience,exp_1,experience,start_date,2022-01,1,3,true
experience,exp_1,experience,end_date,Present,1,4,true
experience,exp_1,experience,summary,Developed AI systems.,1,5,true
```
