import styled, { css } from 'styled-components'

const Card = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
  padding: 10px;
  margin: 6px 4px;
  border: 1px solid #eef1f4;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
`

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: #eef2ff;
  color: #3730a3;
  user-select: none;
  letter-spacing: 0.3px;
`

const Primary = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
`

const Secondary = styled.div`
  font-size: 12px;
  color: #334155;
`

const Meta = styled.div`
  font-size: 11px;
  color: #64748b;
`

type TBadgeProps = {
  $tone?: 'warning' | 'normal'
}

const Badge = styled.span<TBadgeProps>`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 600;
  ${({ $tone = 'normal' }) =>
    $tone === 'warning'
      ? css`
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        `
      : css`
          background: #e5f4ff;
          color: #0b5394;
          border: 1px solid #cfe8ff;
        `}
`

export const Styled = {
  Card,
  Avatar,
  Primary,
  Secondary,
  Meta,
  Badge,
}
