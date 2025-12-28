import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function ClockIcon({ color = '#013054', ...props }: SvgProps) {
  return (
    <Svg
      width={21}
      height={21}
      viewBox="0 0 21 21"
      {...props}
    >
      <Path
        fill={color}
        stroke={color}
        strokeWidth={0.4}
        d="M10.4.198c5.63 0 10.2 4.57 10.2 10.2 0 5.63-4.57 10.2-10.2 10.2-5.63 0-10.2-4.57-10.2-10.2 0-5.63 4.57-10.2 10.2-10.2Zm0 1.734c-4.673 0-8.467 3.794-8.467 8.466 0 4.673 3.794 8.467 8.467 8.467s8.467-3.794 8.467-8.467c0-4.672-3.794-8.466-8.467-8.466Zm0 2.266c.479 0 .866.389.866.867v4.943l2.71 2.409a.866.866 0 0 1 .127 1.154l-.056.07a.866.866 0 0 1-1.223.072v-.001l-2.777-2.467a1.535 1.535 0 0 1-.513-1.146V5.065c0-.478.388-.867.866-.867Z"
      />
    </Svg>
  )
}
export default ClockIcon
