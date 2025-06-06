import styled from 'styled-components'

type TCursorPointerProps = {
  $svgHoverFill: string
}

const CursorPointer = styled.div<TCursorPointerProps>`
  cursor: pointer;

  &&:hover {
    path {
      fill: ${({ $svgHoverFill }) => $svgHoverFill};
    }
  }
`

const LogoText = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
`

type TTenantTextProps = {
  $color: string
}

const TenantText = styled.div<TTenantTextProps>`
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  color: ${({ $color }) => $color};
`

export const Styled = {
  CursorPointer,
  LogoText,
  TenantText,
}
