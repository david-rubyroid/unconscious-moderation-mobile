import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Ellipse } from 'react-native-svg'

function DotsIcon(props: SvgProps) {
  return (
    <Svg
      width={28}
      height={6}
      fill="none"
      viewBox="0 0 28 6"
      {...props}
    >
      <Ellipse cx={24.723} cy={2.979} fill="#013054" rx={3.277} ry={2.979} />
      <Ellipse cx={3.277} cy={2.979} fill="#013054" rx={3.277} ry={2.979} />
      <Ellipse cx={14} cy={2.979} fill="#013054" rx={3.277} ry={2.979} />
    </Svg>
  )
}
export default DotsIcon
