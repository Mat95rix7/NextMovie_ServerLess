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
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
            background: #e0e0e0;
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
            background: #ff8f00;
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
        <h1>Plan du site - NextMovie 🎬</h1>
        <p>Dernière mise à jour : 
          <xsl:call-template name="format-date">
            <xsl:with-param name="date" select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/>
          </xsl:call-template>
        </p>
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
              <td>
                <xsl:call-template name="format-date">
                  <xsl:with-param name="date" select="sitemap:lastmod"/>
                </xsl:call-template>
              </td>
              <td><xsl:value-of select="sitemap:changefreq"/></td>
              <td><xsl:value-of select="sitemap:priority"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>

  <!-- Template pour formater la date en dd mm yyyy -->
  <xsl:template name="format-date">
    <xsl:param name="date"/>
    <xsl:value-of select="substring($date, 9, 2)"/> <!-- Jour -->
    <xsl:text>-</xsl:text>
    <xsl:value-of select="substring($date, 6, 2)"/> <!-- Mois -->
    <xsl:text>-</xsl:text>
    <xsl:value-of select="substring($date, 1, 4)"/> <!-- Année -->
  </xsl:template>

</xsl:stylesheet>