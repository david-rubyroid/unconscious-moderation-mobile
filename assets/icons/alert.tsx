import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function AlertIcon({ color = '#013766', ...props }: SvgProps) {
  return (
    <Svg
      width={19}
      height={19}
      viewBox="0 0 19 19"
      fill="none"
      {...props}
    >
      <Path
        fill={color}
        d="M9.457 0A9.456 9.456 0 0 0 0 9.457a9.456 9.456 0 0 0 9.457 9.457 9.457 9.457 0 0 0 9.457-9.457A9.456 9.456 0 0 0 9.457 0Zm1.33 14.178a1.33 1.33 0 1 1-2.66 0v-5.56a1.33 1.33 0 1 1 2.66 0v5.56Zm-1.33-8.112a1.33 1.33 0 1 1 0-2.66 1.33 1.33 0 1 1 0 2.66Z"
      />
    </Svg>
  )
}

export default AlertIcon
