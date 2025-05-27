import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin-top: 4px;
`

const CustomLink = styled(Link)`
  text-decoration: none;
  margin-right: 8px;
  vertical-align: middle;

  span {
    vertical-align: middle;
  }
`

export const Styled = {
  Container,
  CustomLink,
}
