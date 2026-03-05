import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function Cross({ width = 13, height = 13, ...props }: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 13 13"
      {...props}
    >
      <Path
        stroke="#013766"
        strokeLinecap="square"
        strokeWidth={2}
        d="m6.414 6.415-5 5m5-5 5 5m-5-5-5-5m5 5 5-5"
      />
    </Svg>
  )
}
export default Cross
