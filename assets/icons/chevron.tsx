import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function ChevronIcon({ color = '#013054', ...props }: SvgProps) {
  return (
    <Svg
      width={17}
      height={30}
      viewBox="0 0 17 30"
      fill="none"
      {...props}
    >
      <Path
        fill={color}
        d="M1.035 30a1.033 1.033 0 0 1-.731-1.766L13.536 15 .303 1.766A1.033 1.033 0 1 1 1.766.303L15.73 14.268a1.034 1.034 0 0 1 0 1.463L1.766 29.696a1.03 1.03 0 0 1-.731.304Z"
      />
    </Svg>
  )
}
export default ChevronIcon
