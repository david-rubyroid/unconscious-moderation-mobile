import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { G, Path } from 'react-native-svg'

function CrownIcon(props: SvgProps) {
  const { color = '#013766', ...rest } = props
  return (
    <Svg
      width={34}
      height={26}
      fill="none"
      {...rest}
    >
      <G fill={color} opacity={0.99}>
        <Path d="M33.558 5.41a.895.895 0 0 0-1.107-.002l-6.179 4.7L17.704.334a.912.912 0 0 0-1.408 0l-8.568 9.776-6.18-4.7a.895.895 0 0 0-1.106 0c-.335.257-.502.717-.423 1.168l2.048 11.684h29.866L33.98 6.577c.079-.45-.088-.912-.423-1.167ZM2.286 20.531v4.081c0 .628.446 1.137.996 1.137h27.436c.55 0 .996-.51.996-1.137v-4.08H2.286Z" />
      </G>
    </Svg>
  )
}
export default CrownIcon
