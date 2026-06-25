module.exports = (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://votre-domaine.com';
  const pages = [
    '', 'index.html', 'login.html', 'vehicules.html',
    'maintenance.html', 'mission.html', 'trajets.html',
    'carburant.html', 'rapports.html', 'administration.html'
  ];
  const today = new Date().toISOString().split('T')[0];
  const urls = pages.map(page => `
    <url>
      <loc>${baseUrl}/${page}</loc>
      <lastmod>${today}</lastmod>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('');
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>
  `);
};