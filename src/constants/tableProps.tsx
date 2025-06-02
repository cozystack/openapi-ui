import { TEnrichedTableProps } from '@prorobotech/openapi-k8s-toolkit'
import { EditIcon, DeleteIcon } from 'components/atoms'

export const TABLE_PROPS: TEnrichedTableProps['tableProps'] = {
  borderless: true,
  paginationPosition: ['bottomRight'],
  isTotalLeft: true,
  editIcon: <EditIcon />,
  deleteIcon: <DeleteIcon />,
}
