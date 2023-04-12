import {hues} from '@sanity/color'
import {MouseEvent} from 'react'
import styled, {css} from 'styled-components'

type Props = {
  onClick?: (e: MouseEvent) => void
  showCheckerboard?: boolean
  src: string
  style?: any
}

const Image = styled.img<Props>`
  --checkerboard-dark: #ddd;
  --checkerboard-light: #fff;

  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;

  ${props =>
    props.showCheckerboard &&
    css`
      background-image: linear-gradient(45deg, var(--checkerboard-light) 25%, transparent 25%),
        linear-gradient(-45deg, var(--checkerboard-dark) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--checkerboard-light) 75%),
        linear-gradient(-45deg, transparent 75%, var(--checkerboard-dark) 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0;
    `}
`

export default Image
