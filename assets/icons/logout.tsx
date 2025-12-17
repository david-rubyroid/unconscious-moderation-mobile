import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function LogoutIcon({ color = '#013766', ...props }: SvgProps) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill="none"
      {...props}
    >
      <Path
        fill={color}
        d="M5.5 4.5h9a2 2 0 0 1 2 2v2h-2v-2h-9v10h9v-2h2v2a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2Z"
      />
      <Path
        fill={color}
        d="M16.5 8.5l3 3-3 3v-2h-4v-2h4v-2Z"
      />
    </Svg>
  )
}

export default LogoutIcon
