import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function ShieldIcon(props: SvgProps) {
  return (
    <Svg
      width={19}
      height={24}
      viewBox="0 0 19 24"
      fill="none"
      {...props}
    >
      <Path
        fill="#2E7D60"
        d="M18.623 5.017 9.862.095a.739.739 0 0 0-.724 0L.377 5.017A.738.738 0 0 0 0 5.66v5.265c0 2.967.856 5.577 2.546 7.758 1.596 2.06 3.919 3.648 6.718 4.592a.74.74 0 0 0 .472 0c2.8-.944 5.123-2.532 6.718-4.592 1.69-2.18 2.546-4.79 2.546-7.758V5.661a.738.738 0 0 0-.377-.644Z"
      />
    </Svg>
  )
}
export default ShieldIcon
