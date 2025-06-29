const path = require('path')
const fs = require('fs').promises
import express, { Express } from 'express'
const { createProxyMiddleware } = require('http-proxy-middleware')
import dotenv from 'dotenv'
import { getDynamicIndex } from './getDynamicIndex'

dotenv.config()

const basePrefix = process.env.BASEPREFIX

let options: dotenv.DotenvParseOutput | undefined
if (process.env.LOCAL === 'true') {
  const { parsed } = dotenv.config({ path: './.env.options' })
  options = parsed
}

const KUBE_API_URL = process.env.LOCAL === 'true' ? options?.KUBE_API_URL : process.env.KUBE_API_URL
const CUSTOMIZATION_API_GROUP =
  process.env.LOCAL === 'true' ? options?.CUSTOMIZATION_API_GROUP : process.env.CUSTOMIZATION_API_GROUP
const CUSTOMIZATION_API_VERSION =
  process.env.LOCAL === 'true' ? options?.CUSTOMIZATION_API_VERSION : process.env.CUSTOMIZATION_API_VERSION
const PROJECTS_API_GROUP = process.env.LOCAL === 'true' ? options?.PROJECTS_API_GROUP : process.env.PROJECTS_API_GROUP
const PROJECTS_VERSION = process.env.LOCAL === 'true' ? options?.PROJECTS_VERSION : process.env.PROJECTS_VERSION
const PROJECTS_RESOURCE_NAME =
  process.env.LOCAL === 'true' ? options?.PROJECTS_RESOURCE_NAME : process.env.PROJECTS_RESOURCE_NAME
const MARKETPLACE_RESOURCE_NAME =
  process.env.LOCAL === 'true' ? options?.MARKETPLACE_RESOURCE_NAME : process.env.MARKETPLACE_RESOURCE_NAME
const MARKETPLACE_KIND = process.env.LOCAL === 'true' ? options?.MARKETPLACE_KIND : process.env.MARKETPLACE_KIND
const INSTANCES_API_GROUP =
  process.env.LOCAL === 'true' ? options?.INSTANCES_API_GROUP : process.env.INSTANCES_API_GROUP
const INSTANCES_VERSION = process.env.LOCAL === 'true' ? options?.INSTANCES_VERSION : process.env.INSTANCES_VERSION
const INSTANCES_RESOURCE_NAME =
  process.env.LOCAL === 'true' ? options?.INSTANCES_RESOURCE_NAME : process.env.INSTANCES_RESOURCE_NAME
const BFF_URL = process.env.LOCAL === 'true' ? options?.BFF_URL : process.env.BFF_URL

const healthcheck = require('express-healthcheck')
const promBundle = require('express-prom-bundle')

const metricsMiddleware = promBundle({ includeMethod: true, metricsPath: `${basePrefix ? basePrefix : ''}/metrics` })
const winston = require('winston')
const expressWinston = require('express-winston')

const app: Express = express()
const port = process.env.PORT || 8080

app.use(`${basePrefix ? basePrefix : ''}/healthcheck`, healthcheck())
app.use(metricsMiddleware)

if (process.env.LOGGER === 'true') {
  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      timeStamp: true,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.json(),
      ),
      expressFormat: true,
      colorize: false,
      requestWhitelist: ['body'],
      responseWhitelist: ['body'],
    }),
  )
}

// Only add proxies if LOCAL=true
if (process.env.LOCAL === 'true') {
  console.log('✅ Proxies are enabled.')
  // Proxy: /api/clusters/.*/k8s/
  app.use(
    '/api/clusters/:clusterId/k8s',
    createProxyMiddleware({
      target: `${KUBE_API_URL}/api/clusters`,
      changeOrigin: true,
      secure: false,
      ws: true,
      pathRewrite: (path, req) => path.replace(/^\/api\/clusters\//, '/'),
      // logLevel: 'debug',
      // onProxyReq: (proxyReq, req, res) => {
      //   console.debug(`[PROXY] ${req.method} ${req.originalUrl} -> ${proxyReq.getHeader('host')}${proxyReq.path}`)
      // },
    }),
  )

  // Proxy: /clusterlist
  app.use(
    '/clusterlist',
    createProxyMiddleware({
      target: `${KUBE_API_URL}/clusterlist`,
      changeOrigin: true,
      secure: false,
      pathRewrite: (path, req) => path.replace(/^\/clusterlist/, ''),
      // logLevel: 'debug',
      // onProxyReq: (proxyReq, req, res) => {
      //   console.debug(`[PROXY] ${req.method} ${req.originalUrl} -> ${proxyReq.getHeader('host')}${proxyReq.path}`)
      // },
    }),
  )

  // Proxy: /openapi-bff
  app.use(
    '/openapi-bff',
    createProxyMiddleware({
      target: BFF_URL,
      changeOrigin: true,
      secure: false,
      // pathRewrite: (path, req) => path.replace(/^\/bff/, ''),
      // logLevel: 'debug',
      // onProxyReq: (proxyReq, req, res) => {
      //   console.debug(`[PROXY] ${req.method} ${req.originalUrl} -> ${proxyReq.getHeader('host')}${proxyReq.path}`)
      // },
    }),
  )
} else {
  console.log('🚫 Proxies are disabled.')
}

app.get(`${basePrefix ? basePrefix : ''}/env.js`, (_, res) => {
  res.set('Content-Type', 'text/javascript')
  res.send(
    `
    window._env_ = {
    ${basePrefix ? `  BASEPREFIX: "${basePrefix}",` : ''}
      CUSTOMIZATION_API_GROUP: ${JSON.stringify(CUSTOMIZATION_API_GROUP) || '"check envs"'},
      CUSTOMIZATION_API_VERSION: ${JSON.stringify(CUSTOMIZATION_API_VERSION) || '"check envs"'},
      PROJECTS_API_GROUP: ${JSON.stringify(PROJECTS_API_GROUP) || '"check envs"'},
      PROJECTS_VERSION: ${JSON.stringify(PROJECTS_VERSION) || '"check envs"'},
      PROJECTS_RESOURCE_NAME: ${JSON.stringify(PROJECTS_RESOURCE_NAME) || '"check envs"'},
      MARKETPLACE_RESOURCE_NAME: ${JSON.stringify(MARKETPLACE_RESOURCE_NAME) || '"check envs"'},
      MARKETPLACE_KIND: ${JSON.stringify(MARKETPLACE_KIND) || '"check envs"'},
      INSTANCES_API_GROUP: ${JSON.stringify(INSTANCES_API_GROUP) || '"check envs"'},
      INSTANCES_VERSION: ${JSON.stringify(INSTANCES_VERSION) || '"check envs"'},
      INSTANCES_RESOURCE_NAME: ${JSON.stringify(INSTANCES_RESOURCE_NAME) || '"check envs"'}
    }
    `,
  )
})

app.get(`${basePrefix ? basePrefix : ''}/docs`, (_, res) => {
  res.redirect(process.env.DOCUMENTATION_URI || '/')
})

const tryFiles = async (req, res, next) => {
  try {
    const unsafeReqPath = basePrefix ? req.path.replace(basePrefix, '') : req.path
    const safeReqPath = path.normalize(unsafeReqPath).replace(/^(\.\.(\/|\\|$))+/, '')
    const filePath = path.join(__dirname, safeReqPath.replace(/^\//, ''))
    await fs.access(filePath)
    return res.sendFile(filePath)
  } catch (error: any) {
    if (basePrefix) {
      const indexText = getDynamicIndex(basePrefix)
      res.set('Content-Type', 'text/html')
      return res.send(indexText)
    }
    return res.sendFile('/index.html', {
      root: path.join(__dirname),
    })
  }
}

app.get(`${basePrefix ? basePrefix : ''}/`, (_, res) => {
  if (basePrefix) {
    const indexText = getDynamicIndex(basePrefix)
    res.set('Content-Type', 'text/html')
    return res.send(indexText)
  }
  res.sendFile('/index.html', {
    root: path.join(__dirname),
  })
})

app.get('*', (req, res, next) => {
  tryFiles(req, res, next)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
