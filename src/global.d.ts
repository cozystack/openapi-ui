declare global {
  interface Window {
    _env_: Record<string, string>
    __ENV__: {
      VITE_LOGO_SVG?: string
      VITE_LOGO_TEXT?: string
      VITE_TENANT_TEXT?: string
      VITE_TITLE_TEXT?: string
      VITE_FOOTER_TEXT?: string
      VITE_ICON_SVG?: string
    }
  }
}
export {}
