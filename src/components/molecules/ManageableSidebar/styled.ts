import styled from 'styled-components'

const Container = styled.div`
  width: 250px;
  padding: 10px;

  &:empty {
    display: none;
  }
`

export const Styled = {
  Container,
}
