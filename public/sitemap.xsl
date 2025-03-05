<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:template match="/">
    <html>
      <head>
        <title>Plan du site - My CineApp</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f9f9f9;
            color: #333;
            margin: 20px;
            text-align: center;
          }
          h1 {
            color: #2c3e50;
          }
          table {
            width: 100%;
            max-width: 1000px;
            margin: 20px auto;
            border-collapse: collapse;
            background: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          th, td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          th {
            background: #3498db;
            color: white;
            text-transform: uppercase;
          }
          tr:hover {
            background: #f1f1f1;
          }
          a {
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
          .icon {
            width: 16px;
            height: 16px;
            margin-right: 5px;
          }
        </style>
      </head>
      <body>
        <h1>Plan du site - My CineApp 🎬</h1>
        <p>Dernière mise à jour : <xsl:value-of select="urlset/url[1]/lastmod"/></p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Dernière modif</th>
              <th>Fréquence</th>
              <th>Priorité</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="urlset/url">
              <tr>
                <td>
                  <img class="icon" src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="🔗"/>
                  <a href="{loc}">
                    <xsl:value-of select="loc"/>
                  </a>
                </td>
                <td><xsl:value-of select="lastmod"/></td>
                <td><xsl:value-of select="changefreq"/></td>
                <td><xsl:value-of select="priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
