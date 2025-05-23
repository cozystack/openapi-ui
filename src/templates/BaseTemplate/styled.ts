import styled from 'styled-components'

type TContainerProps = {
  $isDark: boolean
}

const Container = styled.div<TContainerProps>`
  min-height: 100vh;
`

const TitleAndThemeToggle = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
export const Styled = {
  Container,
  TitleAndThemeToggle,
}
