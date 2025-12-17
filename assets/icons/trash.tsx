import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function TrashIcon({ color = '#013766', ...props }: SvgProps) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill="none"
      {...props}
    >
      <Path
        fill={color}
        d="M8.5 6.5h8a1 1 0 0 1 1 1v1h-10v-1a1 1 0 0 1 1-1Z"
      />
      <Path
        fill={color}
        d="M7.5 9.5v10a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-10h-10Zm2 8v-6h1.5v6h-1.5Zm4-6v6h1.5v-6h-1.5Z"
      />
      <Path
        fill={color}
        d="M10.5 4.5h4a1 1 0 0 1 1 1v1h-6v-1a1 1 0 0 1 1-1Z"
      />
    </Svg>
  )
}

export default TrashIcon
