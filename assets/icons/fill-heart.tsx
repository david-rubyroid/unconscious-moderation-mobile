import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function FillHeartIcon({ color = '#2E7D60', ...props }: SvgProps) {
  return (
    <Svg
      width={21}
      height={18}
      fill="none"
      viewBox="0 0 21 18"
      {...props}
    >
      <Path
        fill={color}
        d="M15.288 0A5.74 5.74 0 0 1 21 5.712c0 5.768-10.5 11.48-10.5 11.48S0 11.396 0 5.712A5.712 5.712 0 0 1 5.712 0 5.656 5.656 0 0 1 10.5 2.576 5.712 5.712 0 0 1 15.288 0Z"
      />
    </Svg>
  )
}
export default FillHeartIcon
