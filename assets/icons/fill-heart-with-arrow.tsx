import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function FillHeartWithArrowIcon({ color = '#2E7D60', ...props }: SvgProps) {
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
      <Path
        fill="#911E3D"
        d="M15.75 5c.075 0 .225.075.3.15l4.875 5.25c.075.075.075.225.075.375a.412.412 0 0 1-.375.225H18v5.625c0 .225-.15.375-.375.375h-3.75c-.225 0-.375-.15-.375-.375V11h-2.625c-.15 0-.3-.075-.375-.225-.075-.15 0-.3.075-.375l4.875-5.25c.075-.075.225-.15.3-.15Z"
      />
    </Svg>
  )
}
export default FillHeartWithArrowIcon
