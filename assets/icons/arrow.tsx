import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function ArrowIcon({ color = '#013054', ...props }: SvgProps) {
  return (
    <Svg
      width={16}
      height={15}
      fill="none"
      viewBox="0 0 16 15"
      {...props}
    >
      <Path
        fill={color}
        d="M15.707 8.071a1 1 0 0 0 0-1.414L9.343.293A1 1 0 0 0 7.93 1.707l5.657 5.657-5.657 5.657a1 1 0 1 0 1.414 1.414l6.364-6.364ZM0 7.364v1h15v-2H0v1Z"
      />
    </Svg>
  )
}
export default ArrowIcon
