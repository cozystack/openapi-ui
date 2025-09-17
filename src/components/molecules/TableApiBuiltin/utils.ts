export const getBackLinkToBuiltinTable = ({
  cluster,
  baseprefix,
  namespace,
  syntheticProject,
  typeName,
  inside,
}: {
  cluster: string
  baseprefix?: string
  namespace?: string
  syntheticProject?: string
  typeName: string
  inside?: boolean
}): string => {
  const root = `${baseprefix}${inside ? '/inside' : ''}/${cluster}`
  const mainRoute = `${root}${namespace ? `/${namespace}` : ''}${syntheticProject ? `/${syntheticProject}` : ''}`

  return `${mainRoute}/builtin-table/${typeName}`
}

export const getBackLinkToApiTable = ({
  cluster,
  baseprefix,
  namespace,
  syntheticProject,
  apiGroup,
  apiVersion,
  typeName,
  inside,
}: {
  cluster: string
  baseprefix?: string
  namespace?: string
  syntheticProject?: string
  apiGroup?: string // api
  apiVersion?: string // api
  typeName: string
  inside?: boolean
}): string => {
  const root = `${baseprefix}${inside ? '/inside' : ''}/${cluster}`
  const mainRoute = `${root}${namespace ? `/${namespace}` : ''}${syntheticProject ? `/${syntheticProject}` : ''}`

  return `${mainRoute}/api-table/${apiGroup}/${apiVersion}/${typeName}`
}

export const getBackLinkToTable = ({
  resourceType,
  ...rest
}: {
  resourceType: 'builtin' | 'api'
  cluster: string
  baseprefix?: string
  namespace?: string
  syntheticProject?: string
  apiGroup?: string // api
  apiVersion?: string // api
  typeName: string
  inside?: boolean
}): string => {
  return resourceType === 'builtin' ? getBackLinkToBuiltinTable({ ...rest }) : getBackLinkToApiTable({ ...rest })
}

export const getLinkToBuiltinForm = ({
  cluster,
  baseprefix,
  namespace,
  syntheticProject,
  typeName,
  inside,
}: {
  cluster: string
  baseprefix?: string
  namespace?: string
  syntheticProject?: string
  typeName: string
  inside?: boolean
}): string => {
  const root = `${baseprefix}${inside ? '/inside' : ''}/${cluster}`
  const mainRoute = `${root}${namespace ? `/${namespace}` : ''}${syntheticProject ? `/${syntheticProject}` : ''}`
  const backlink = getBackLinkToBuiltinTable({ cluster, baseprefix, namespace, syntheticProject, typeName, inside })

  return `${mainRoute}/forms/builtin/v1/${typeName}?backlink=${backlink}`
}

export const getLinkToApiForm = ({
  cluster,
  baseprefix,
  namespace,
  syntheticProject,
  apiGroup,
  apiVersion,
  typeName,
  inside,
}: {
  cluster: string
  baseprefix?: string
  namespace?: string
  syntheticProject?: string
  apiGroup?: string // api
  apiVersion?: string // api
  typeName: string
  inside?: boolean
}): string => {
  const root = `${baseprefix}${inside ? '/inside' : ''}/${cluster}`
  const mainRoute = `${root}${namespace ? `/${namespace}` : ''}${syntheticProject ? `/${syntheticProject}` : ''}`
  const backlink = getBackLinkToApiTable({
    cluster,
    baseprefix,
    namespace,
    syntheticProject,
    apiGroup,
    apiVersion,
    typeName,
    inside,
  })

  return `${mainRoute}/forms/apis/${apiGroup}/${apiVersion}/${typeName}?backlink=${backlink}`
}

export const getLinkToForm = ({
  resourceType,
  ...rest
}: {
  resourceType: 'builtin' | 'api'
  cluster: string
  baseprefix?: string
  namespace?: string
  syntheticProject?: string
  apiGroup?: string // api
  apiVersion?: string // api
  typeName: string
  inside?: boolean
}): string => {
  return resourceType === 'builtin' ? getLinkToBuiltinForm({ ...rest }) : getLinkToApiForm({ ...rest })
}
