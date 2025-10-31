export const getDynamicIndex = (baseprefix: string): string => {
  try {
    const mainJs = 'index-react.js'
    const mainCss = 'style.css'
    const titleText = process.env.TITLE_TEXT || 'OpenAPI UI'
    const iconSvg = process.env.ICON_SVG || ''

    // Create environment variables object
    const envVars = {
      VITE_LOGO_SVG: process.env.LOGO_SVG || '',
      VITE_LOGO_TEXT: process.env.LOGO_TEXT || '',
      VITE_TENANT_TEXT: process.env.TENANT_TEXT || '',
      VITE_TITLE_TEXT: process.env.TITLE_TEXT || 'OpenAPI UI',
      VITE_FOOTER_TEXT: process.env.FOOTER_TEXT || 'PRO Robotech',
      VITE_ICON_SVG: iconSvg
    }

    // Generate favicon from SVG if provided
    const generateFavicon = () => {
      if (!iconSvg) {
        return ''
      }
      try {
        const decodedSvg = Buffer.from(iconSvg, 'base64').toString('utf-8')
        const dataUri = `data:image/svg+xml;base64,${iconSvg}`
        return `<link rel="icon" type="image/svg+xml" href="${dataUri}">`
      } catch (error) {
        console.error('Error processing icon SVG:', error)
        return ''
      }
    }

    return `<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
      rel="stylesheet"
    />
    <title>${titleText}</title>
    ${generateFavicon()}
    <script>
      window.__ENV__ = ${JSON.stringify(envVars)};
    </script>
    <script src="${baseprefix}/env.js"></script>
    <script type="module" crossorigin src="${baseprefix}/${mainJs}"></script>
    <link rel="stylesheet" crossorigin href="${baseprefix}/${mainCss}">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`
  } catch {
    return 'Error while trying'
  }
}
