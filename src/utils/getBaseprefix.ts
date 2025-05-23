export const getBasePrefix = (isFederation?: boolean) => {
  if (isFederation) {
    return '/openapi-ui-federation'
  }
  return import.meta.env.BASE_URL || '/openapi-ui'
}
