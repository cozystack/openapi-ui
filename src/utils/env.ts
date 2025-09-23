// Environment variables for UI customization
export const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // Try to get from window.__ENV__ first (runtime variables)
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__[key] || defaultValue
  }
  
  // Fallback to import.meta.env (build-time variables)
  return import.meta.env[key] || defaultValue
}

export const getLogo = (): string => {
  return getEnvVar('VITE_LOGO_SVG')
}

export const getLogoText = (): string | false => {
  const logoText = getEnvVar('VITE_LOGO_TEXT')
  if (logoText === 'false') {
    return false
  }
  return logoText || 'In-Cloud'
}

export const getTenantText = (): string => {
  return getEnvVar('VITE_TENANT_TEXT')
}

export const getTitleText = (): string => {
  return getEnvVar('VITE_TITLE_TEXT', 'OpenAPI UI')
}

export const getFooterText = (): string => {
  return getEnvVar('VITE_FOOTER_TEXT', 'PRO Robotech')
}

export const getIconSvg = (): string => {
  return getEnvVar('VITE_ICON_SVG')
}
