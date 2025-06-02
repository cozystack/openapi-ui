import type {
  CardProps as AntdCardProps,
  FlexProps as AntdFlexProps,
  RowProps as AntdRowProps,
  ColProps as AntdColProps,
} from 'antd'
import { TextProps as AntdTextProps } from 'antd/es/typography/Text'

export type TDynamicComponentsAppTypeMap = {
  antdText: { id: number; text: string } & Omit<AntdTextProps, 'id'>
  antdCard: { id: number } & Omit<AntdCardProps, 'id'>
  antdFlex: { id: number } & Omit<AntdFlexProps, 'id' | 'children'>
  antdRow: { id: number } & Omit<AntdRowProps, 'id' | 'children'>
  antdCol: { id: number } & Omit<AntdColProps, 'id' | 'children'>
  partsOfUrl: { id: number; text: string }
  multiQuery: { id: number; text: string }
  parsedText: { id: number; text: string }
}

export type ComponentType = keyof TDynamicComponentsAppTypeMap

export type Component = {
  type: ComponentType
  data: TDynamicComponentsAppTypeMap[ComponentType]
  children?: Component[]
}
