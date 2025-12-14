import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function ThropyWayIcon(props: SvgProps) {
  return (
    <Svg
      width={283}
      height={538}
      viewBox="0 0 283 538"
      fill="none"
      {...props}
    >
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={12}
        d="M276.889 6H71.714C35.422 6 6.004 35.419 6.004 71.707c0 21.774 10.592 41.075 26.901 53.032a65.617 65.617 0 0 0 13.477 7.618c7.792 3.261 16.35 5.06 25.328 5.06h136.511a66.098 66.098 0 0 1 2.962-.064c36.291 0 65.706 29.419 65.706 65.707s-29.418 65.707-65.706 65.707H71.71C35.42 268.767 6 298.185 6 334.477c0 20.585 9.467 38.96 24.284 51.007a65.686 65.686 0 0 0 14.487 8.942c8.22 3.699 17.337 5.758 26.94 5.758h139.175c36.288 0 65.707 29.418 65.707 65.71 0 36.291-29.415 65.707-65.707 65.707H6.003"
      />
    </Svg>
  )
}
export default ThropyWayIcon
