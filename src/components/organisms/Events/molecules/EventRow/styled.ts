import styled from 'styled-components'

type TCardProps = {
  $colorText: string
}

const Card = styled.div<TCardProps>`
  border-radius: 6px;
  padding: 16px 8px;
  border: 1px solid ${({ $colorText }) => $colorText};
  gap: 12px;
  margin-bottom: 16px;
  position: relative;

  &:before {
    position: absolute;
    content: '';
    width: 36px;
    height: 1px;
    background: ${({ $colorText }) => $colorText};
    left: -37px;
    top: 50%; /* halfway down parent */
    transform: translateY(-50%); /* center vertically */
  }

  &:after {
    position: absolute;
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $colorText }) => $colorText};
    left: -39px;
    top: 50%;
    transform: translateY(-50%);
  }
`

type TAbbrProps = {
  $bgColor: string
}

const Abbr = styled.span<TAbbrProps>`
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 13px;
  padding: 1px 5px;
  font-size: 13px;
  height: min-content;
  margin-right: 4px;
`

const TimeStamp = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
`

const Title = styled.div`
  font-weight: 700;
`

export const Styled = {
  Card,
  Abbr,
  TimeStamp,
  Title,
}
