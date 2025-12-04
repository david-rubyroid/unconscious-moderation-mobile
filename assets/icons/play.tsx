import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function Play(props: SvgProps) {
  return (
    <Svg width={48} height={60} fill="none" {...props}>
      <Path
        fill="#2E7D60"
        d="M40.308 30L12 8.308L12 51.692Z"
      />
    </Svg>
  )
}
export default Play
