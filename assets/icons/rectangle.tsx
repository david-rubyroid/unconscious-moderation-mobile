import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Defs, G, Rect } from 'react-native-svg'

function RectangleIcon({ color = '#FFFFFF', ...props }: SvgProps) {
  return (
    <Svg
      width={256}
      height={264}
      fill="none"
      {...props}
    >
      <G filter="url(#a)">
        <Rect
          width={236}
          height={244}
          x={10}
          y={6}
          stroke={color}
          strokeWidth={12}
          rx={21}
        />
      </G>
      <Defs></Defs>
    </Svg>
  )
}
export default RectangleIcon
