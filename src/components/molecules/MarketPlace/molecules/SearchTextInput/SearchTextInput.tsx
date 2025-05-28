import React, { FC } from 'react'
import { Input } from 'antd'

type TSearchTextInputProps = {
  onSearchTextChange: (searchText: string) => void
  searchText: string
}

export const SearchTextInput: FC<TSearchTextInputProps> = ({ searchText, onSearchTextChange }) => (
  <Input
    placeholder="Поиск"
    allowClear
    onClear={() => {
      onSearchTextChange('')
    }}
    value={searchText}
    onChange={e => onSearchTextChange(e.target.value)}
  />
)
