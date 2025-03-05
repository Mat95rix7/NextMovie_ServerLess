<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:template match="/">
    <html>
      <head>
        <title>Plan du site - NextMovie</title>
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
        <h1>Plan du site - NextMovie  🎬</h1>
        <p>Dernière mise à jour : <xsl:value-of select="urlset/url[1]/lastmod"/></p>
        <table>
          <tr>
            <th>URL</th>
            <th>Dernière modification</th>
            <th>Fréquence de changement</th>
            <th>Priorité</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
              <td><xsl:value-of select="sitemap:lastmod"/></td>
              <td><xsl:value-of select="sitemap:changefreq"/></td>
              <td><xsl:value-of select="sitemap:priority"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>