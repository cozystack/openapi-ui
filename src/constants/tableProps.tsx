import { TEnrichedTableProps, EditIcon, DeleteIcon } from '@prorobotech/openapi-k8s-toolkit'

export const TABLE_PROPS: TEnrichedTableProps['tableProps'] = {
  borderless: true,
  paginationPosition: ['bottomRight'],
  isTotalLeft: true,
  editIcon: <EditIcon />,
  deleteIcon: <DeleteIcon />,
}
