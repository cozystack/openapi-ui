/* eslint-disable max-lines-per-function */
import React, { FC, Fragment, useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  Search as PackageSearch,
  Spacer,
  TRequestError,
  TKindIndex,
  TKindWithVersion,
  getKinds,
  getSortedKinds,
  // kindByGvr,
} from '@prorobotech/openapi-k8s-toolkit'
import { ConfigProvider, theme as antdtheme, Form, Spin, Alert } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { HEAD_FIRST_ROW, HEAD_SECOND_ROW, FOOTER_HEIGHT, NAV_HEIGHT, CONTENT_CARD_PADDING } from 'constants/blocksSizes'
import {
  FIELD_NAME,
  FIELD_NAME_STRING,
  FIELD_NAME_LABELS,
  FIELD_NAME_FIELDS,
  TYPE_SELECTOR,
  QUERY_KEY,
  NAME_QUERY_KEY,
  LABELS_QUERY_KEY,
  FIELDS_QUERY_KEY,
} from './constants'
import { useDebouncedCallback, getArrayParam, setArrayParam, getStringParam, setStringParam } from './utils'
import { SearchEntry } from './molecules'
import { Styled } from './styled'

export const Search: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const { token } = antdtheme.useToken()

  const cluster = useSelector((state: RootState) => state.cluster.cluster)
  const theme = useSelector((state: RootState) => state.openapiTheme.theme)

  const [form] = Form.useForm()

  const [error, setError] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [kindIndex, setKindIndex] = useState<TKindIndex>()
  const [kindsWithVersion, setKindWithVersion] = useState<TKindWithVersion[]>()

  const [height, setHeight] = useState(0)

  useEffect(() => {
    const height =
      window.innerHeight - HEAD_FIRST_ROW - HEAD_SECOND_ROW - NAV_HEIGHT - CONTENT_CARD_PADDING * 2 - FOOTER_HEIGHT - 1
    setHeight(height)

    const handleResize = () => {
      setHeight(height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setError(undefined)
    getKinds({
      clusterName: cluster,
    })
      .then(data => {
        setKindIndex(data)
        setKindWithVersion(getSortedKinds(data))
        setIsLoading(false)
        setError(undefined)
      })
      .catch(error => {
        setIsLoading(false)
        setError(error)
      })
  }, [cluster])

  const watchedKinds = Form.useWatch<string[] | undefined>(FIELD_NAME, form)
  const watchedName = Form.useWatch<string | undefined>(FIELD_NAME_STRING, form)
  const watchedLabels = Form.useWatch<string[] | undefined>(FIELD_NAME_LABELS, form)
  const watchedFields = Form.useWatch<string[] | undefined>(FIELD_NAME_FIELDS, form)
  const watchedTypedSelector = Form.useWatch<string | undefined>(TYPE_SELECTOR, form)

  // Apply current values from search params on mount / when URL changes
  useEffect(() => {
    const fromKinds = getArrayParam(searchParams, QUERY_KEY)
    const currentKinds = form.getFieldValue(FIELD_NAME)
    const kindsDiffer =
      (fromKinds.length || 0) !== (currentKinds?.length || 0) || fromKinds.some((v, i) => v !== currentKinds?.[i])

    // name
    const fromName = getStringParam(searchParams, NAME_QUERY_KEY)
    const currentName = form.getFieldValue(FIELD_NAME_STRING) as string | undefined
    const nameDiffer = (fromName || '') !== (currentName || '')

    // labels
    const fromLabels = getArrayParam(searchParams, LABELS_QUERY_KEY)
    const currentLabels = form.getFieldValue(FIELD_NAME_LABELS) as string[] | undefined
    const labelsDiffer =
      (fromLabels.length || 0) !== (currentLabels?.length || 0) || fromLabels.some((v, i) => v !== currentLabels?.[i])

    // labels
    const fromFields = getArrayParam(searchParams, FIELDS_QUERY_KEY)
    const currentFields = form.getFieldValue(FIELD_NAME_FIELDS) as string[] | undefined
    const fieldsDiffer =
      (fromFields.length || 0) !== (currentFields?.length || 0) || fromFields.some((v, i) => v !== currentFields?.[i])

    // decide type from params
    const currentType = form.getFieldValue(TYPE_SELECTOR)
    let inferredType: string | undefined
    if (fromName) {
      inferredType = 'name'
    } else if (fromLabels.length > 0) {
      inferredType = 'labels'
    } else if (fromFields.length > 0) {
      inferredType = 'fields'
    }
    const typeDiffer = inferredType !== currentType

    // Only update the form if URL differs from form (prevents loops)
    if (kindsDiffer || nameDiffer || labelsDiffer || fieldsDiffer) {
      form.setFieldsValue({
        [FIELD_NAME]: kindsDiffer ? fromKinds : currentKinds,
        [FIELD_NAME_STRING]: nameDiffer ? fromName : currentName,
        [FIELD_NAME_LABELS]: labelsDiffer ? fromLabels : currentLabels,
        [FIELD_NAME_FIELDS]: fieldsDiffer ? fromFields : currentFields,
        [TYPE_SELECTOR]: typeDiffer ? inferredType : currentType,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]) // react to back/forward, external URL edits

  // Watch field changes to push to URL (debounced)
  const debouncedPush = useDebouncedCallback((values: string[]) => {
    const next = setArrayParam(searchParams, QUERY_KEY, values)
    setSearchParams(next, { replace: true }) // replace to keep history cleaner
  }, 250)

  const debouncedPushName = useDebouncedCallback((value: string) => {
    const next = setStringParam(searchParams, NAME_QUERY_KEY, value)
    setSearchParams(next, { replace: true })
  }, 250)

  const debouncedPushLabels = useDebouncedCallback((values: string[]) => {
    const next = setArrayParam(searchParams, LABELS_QUERY_KEY, values)
    setSearchParams(next, { replace: true })
  }, 250)

  const debouncedPushFields = useDebouncedCallback((values: string[]) => {
    const next = setArrayParam(searchParams, FIELDS_QUERY_KEY, values)
    setSearchParams(next, { replace: true })
  }, 250)

  useEffect(() => {
    debouncedPush(watchedKinds || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedKinds])

  useEffect(() => {
    debouncedPushName((watchedName || '').trim())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedName])

  useEffect(() => {
    debouncedPushLabels(watchedLabels || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedLabels])

  useEffect(() => {
    debouncedPushFields(watchedFields || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFields])

  useEffect(() => {
    if (watchedTypedSelector === 'name') {
      // Clear labels when switching to "name"
      // const cur = form.getFieldValue(FIELD_NAME_LABELS) as string[] | undefined
      // if (cur?.length) {
      form.setFieldsValue({ [FIELD_NAME_LABELS]: [], [FIELD_NAME_FIELDS]: [] })
      // }
    } else if (watchedTypedSelector === 'labels') {
      // Clear name when switching to "labels"
      // const cur = (form.getFieldValue(FIELD_NAME_STRING) as string | undefined) ?? ''
      // if (cur) {
      form.setFieldsValue({ [FIELD_NAME_STRING]: '', [FIELD_NAME_FIELDS]: [] })
      // }
    } else if (watchedTypedSelector === 'fields') {
      // Clear name when switching to "labels"
      // const cur = (form.getFieldValue(FIELD_NAME_STRING) as string | undefined) ?? ''
      // if (cur) {
      form.setFieldsValue({ [FIELD_NAME_STRING]: '', [FIELD_NAME_LABELS]: [] })
      // }
    }
    // Optional: if undefined (e.g., initial), choose a default behavior:
    // else { form.setFieldsValue({ [FIELD_NAME_STRING]: '', [FIELD_NAME_MULTIPLE]: [] }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTypedSelector])

  if (error) {
    return <Alert type="error" message="Error while loading kinds" description={error?.response?.data?.message} />
  }

  if (isLoading || !kindsWithVersion) {
    return <Spin />
  }

  if (!kindsWithVersion) {
    return <Alert type="error" message="Error while loading kinds" description="Empty" />
  }

  return (
    <Styled.Container $height={height}>
      <Styled.OverflowContainer>
        <PackageSearch
          cluster={cluster}
          theme={theme}
          form={form}
          constants={{
            FIELD_NAME,
            FIELD_NAME_STRING,
            FIELD_NAME_LABELS,
            FIELD_NAME_FIELDS,
            TYPE_SELECTOR,
          }}
          kindsWithVersion={kindsWithVersion}
        />
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: token.colorBgContainer,
              },
            },
          }}
        >
          {watchedKinds?.map(item => (
            <Fragment key={item}>
              <Spacer $space={20} $samespace />
              <SearchEntry
                kindsWithVersion={kindsWithVersion}
                form={form}
                constants={{
                  FIELD_NAME,
                }}
                resource={item}
                name={watchedName}
                labels={watchedLabels}
                fields={watchedFields}
              />
            </Fragment>
          ))}
        </ConfigProvider>
        <Spacer $space={20} $samespace />
      </Styled.OverflowContainer>
    </Styled.Container>
  )
}
