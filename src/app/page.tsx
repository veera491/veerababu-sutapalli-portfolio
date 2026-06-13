import { getSection, requireItem, requireStringField, getField, getOptionalStringField } from '@/lib/csv/repository';

export default async function Home() {
  const identityItem = await requireItem('site', 'identity');
  
  const fullName = requireStringField(identityItem, 'full_name');
  const primaryRole = requireStringField(identityItem, 'primary_role');
  const tagline = requireStringField(identityItem, 'tagline');
  const location = getField(identityItem, 'location') as string | undefined;

  const socialItems = await getSection('social');
  const proofItems = await getSection('proof');

  // New Step 5A items
  const seoGlobal = await requireItem('seo', 'global');
  const seoTitle = getOptionalStringField(seoGlobal, 'title');
  const themeGlobal = await requireItem('theme', 'global');
  const navItems = await getSection('navigation');

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{fullName}</h1>
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>{primaryRole}</p>
        <p style={{ margin: '0 0 0.5rem 0' }}>{tagline}</p>
        {location && <p style={{ color: '#555' }}>{location}</p>}
      </header>

      {seoTitle && (
        <section style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>
          <p><strong>SEO Title:</strong> {seoTitle}</p>
          <p><strong>Theme Accent:</strong> {getOptionalStringField(themeGlobal, 'accent')}</p>
          <p><strong>Navigation Items:</strong> {navItems.length}</p>
        </section>
      )}

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Proof of Work</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
          {proofItems.map(item => {
            const val = requireStringField(item, 'value');
            return <li key={item.itemId}>{val}</li>;
          })}
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Connect</h2>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', gap: '1rem' }}>
          {socialItems.map(item => {
            const label = requireStringField(item, 'label');
            const url = requireStringField(item, 'url');
            
            if (url.startsWith('REPLACE_WITH_')) {
              return (
                <li key={item.itemId} style={{ color: '#888' }}>
                  {label} (Coming Soon)
                </li>
              );
            }

            return (
              <li key={item.itemId}>
                <a 
                  href={url} 
                  target={url.startsWith('mailto:') ? undefined : '_blank'} 
                  rel={url.startsWith('mailto:') ? undefined : 'noreferrer'}
                  style={{ color: '#0066cc', textDecoration: 'none' }}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
