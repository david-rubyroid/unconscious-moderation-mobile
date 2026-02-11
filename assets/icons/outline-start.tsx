import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function OutlineStartIcon({ color = '#fff', ...props }: SvgProps) {
  return (
    <Svg
      width={37}
      height={35}
      viewBox="0 0 37 35"
      fill="none"
      {...props}
    >
      <Path
        fill={color}
        stroke="#013054"
        strokeMiterlimit={10}
        d="m20.47 1.885 4.138 8.383 9.25 1.345c2.037.296 2.85 2.8 1.376 4.237l-6.693 6.526 1.58 9.214c.348 2.03-1.782 3.577-3.604 2.619l-8.273-4.35-8.273 4.35c-1.822.958-3.952-.59-3.604-2.619l1.58-9.214-6.693-6.526C-.221 14.413.593 11.91 2.63 11.613l9.25-1.345 4.137-8.383c.91-1.847 3.543-1.847 4.455 0h-.001Z"
      />
    </Svg>
  )
}
export default OutlineStartIcon
