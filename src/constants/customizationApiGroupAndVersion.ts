/* eslint-disable no-underscore-dangle */
export const BASE_API_GROUP = window._env_.CUSTOMIZATION_API_GROUP || import.meta.env.VITE_CUSTOMIZATION_API_GROUP
export const BASE_API_VERSION = window._env_.CUSTOMIZATION_API_VERSION || import.meta.env.VITE_CUSTOMIZATION_API_VERSION
export const BASE_PROJECTS_VERSION = window._env_.PROJECTS_VERSION || import.meta.env.VITE_PROJECTS_VERSION
export const BASE_PROJECTS_RESOURCE_NAME =
  window._env_.PROJECTS_RESOURCE_NAME || import.meta.env.VITE_PROJECTS_RESOURCE_NAME
export const BASE_MARKETPLACE_RESOURCE_NAME =
  window._env_.MARKETPLACE_RESOURCE_NAME || import.meta.env.VITE_MARKETPLACE_RESOURCE_NAME
export const BASE_MARKETPLACE_KIND = window._env_.MARKETPLACE_KIND || import.meta.env.VITE_MARKETPLACE_KIND
export const BASE_INSTANCES_VERSION = window._env_.INSTANCES_VERSION || import.meta.env.VITE_INSTANCES_VERSION
