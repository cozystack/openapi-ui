import React, { FC, useState } from 'react'
import { Card, Flex, Segmented } from 'antd'
import { BlackholeForm, FlexEnd } from 'components'

type TCreateBuiltinFormProps = {
  namespace?: string
  typeName: string
  backLink?: string | null
}

export const CreateBuiltinForm: FC<TCreateBuiltinFormProps> = ({ namespace, typeName, backLink }) => {
  const [currentMode, setCurrentMode] = useState<string>('OpenAPI')
  const [currentModeDisabled, setCurrentModeDisabled] = useState<boolean>(false)

  const onCurrentModeChange = (value: string) => {
    setCurrentMode(value)
  }

  const onCurrentModeDisabled = () => {
    setCurrentModeDisabled(true)
  }

  const modeData = {
    current: currentMode,
    onChange: onCurrentModeChange,
    onDisabled: onCurrentModeDisabled,
  }

  return (
    <Card
      title={
        <Flex>
          Create {namespace ? `${namespace}/` : ''}v1/{typeName}
          <FlexEnd>
            <Segmented<string>
              options={['OpenAPI', 'Manual']}
              value={currentMode}
              onChange={value => {
                setCurrentMode(value)
              }}
              disabled={currentModeDisabled}
            />
          </FlexEnd>
        </Flex>
      }
    >
      <BlackholeForm
        data={{
          type: 'builtin',
          typeName,
          prefillValueNamespaceOnly: namespace,
        }}
        isCreate
        backlink={backLink}
        modeData={modeData}
      />
    </Card>
  )
}
