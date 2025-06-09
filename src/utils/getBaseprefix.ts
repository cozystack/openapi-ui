/* eslint-disable no-underscore-dangle */
export const getBasePrefix = (isFederation?: boolean) => {
  if (isFederation) {
    return '/openapi-ui-federation'
  }
  return window._env_.BASEPREFIX || import.meta.env.BASE_URL || '/openapi-ui'
}
