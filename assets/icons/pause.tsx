import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function Pause(props: SvgProps) {
  return (
    <Svg width={48} height={60} fill="none" {...props}>
      <Path
        fill="#2E7D60"
        d="M16.615 51.336a8.308 8.308 0 0 1-16.615 0V8.307a8.308 8.308 0 0 1 16.615 0v43.029ZM47.793 51.336a8.308 8.308 0 0 1-16.615 0V8.307a8.308 8.308 0 0 1 16.615 0v43.029Z"
      />
    </Svg>
  )
}
export default Pause
