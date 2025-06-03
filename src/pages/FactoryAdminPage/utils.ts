/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils.ts
import type { ComponentType, TDynamicComponentsAppTypeMap } from './types'

export const generateDefaultData = (type: ComponentType): TDynamicComponentsAppTypeMap[ComponentType] => {
  const base = { id: Math.floor(Math.random() * 100000) } // Simplified ID generation
  switch (type) {
    case 'antdText':
      return { ...base, text: '' }
    case 'antdCard':
      return { ...base, title: '' }
    case 'antdFlex':
      return { ...base, justify: 'start', align: 'start' }
    case 'antdRow':
      return { ...base }
    case 'antdCol':
      return { ...base, span: 12 }
    case 'partsOfUrl':
    case 'multiQuery':
    case 'parsedText':
      return { ...base, text: '' }
    default:
      return base
  }
}

// Define property metadata for each component
type PropertyMeta = {
  label: string
  inputType: 'text' | 'textarea' | 'json' | 'boolean' | 'select' | 'number'
  options?: { label: string; value: any }[]
}

type ComponentMetaMap = {
  [key in ComponentType]: Record<string, PropertyMeta>
}

export const componentMetaMap: ComponentMetaMap = {
  antdText: {
    text: { label: 'Text', inputType: 'textarea' },
    type: {
      label: 'Type',
      inputType: 'select',
      options: [
        { label: 'Default', value: '' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' },
      ],
    },
    style: { label: 'Style (JSON)', inputType: 'json' },
  },
  antdCard: {
    title: { label: 'Title', inputType: 'text' },
    bordered: { label: 'Bordered', inputType: 'boolean' },
    cover: { label: 'Cover Image URL', inputType: 'text' },
    size: {
      label: 'Size',
      inputType: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Small', value: 'small' },
      ],
    },
    extra: { label: 'Extra Content', inputType: 'text' },
    style: { label: 'Style (JSON)', inputType: 'json' },
  },
  antdFlex: {
    justify: {
      label: 'Justify',
      inputType: 'select',
      options: [
        { label: 'Start', value: 'start' },
        { label: 'End', value: 'end' },
        { label: 'Center', value: 'center' },
        { label: 'Space Around', value: 'space-around' },
        { label: 'Space Between', value: 'space-between' },
      ],
    },
    align: {
      label: 'Align',
      inputType: 'select',
      options: [
        { label: 'Start', value: 'start' },
        { label: 'End', value: 'end' },
        { label: 'Center', value: 'center' },
        { label: 'Baseline', value: 'baseline' },
        { label: 'Stretch', value: 'stretch' },
      ],
    },
    gap: { label: 'Gap (number)', inputType: 'number' },
  },
  antdRow: {
    gutter: { label: 'Gutter', inputType: 'number' },
    style: { label: 'Style (JSON)', inputType: 'json' },
  },
  antdCol: {
    span: { label: 'Span (1-24)', inputType: 'number' },
    offset: { label: 'Offset', inputType: 'number' },
  },
  partsOfUrl: {
    text: { label: 'Text', inputType: 'textarea' },
  },
  multiQuery: {
    text: { label: 'Text', inputType: 'textarea' },
  },
  parsedText: {
    text: { label: 'Text', inputType: 'textarea' },
  },
}
