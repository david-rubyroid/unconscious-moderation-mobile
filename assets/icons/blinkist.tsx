import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function BlinkistIcon(props: SvgProps) {
  return (
    <Svg
      width={32}
      height={31}
      fill="none"
      viewBox="0 0 32 31"
      {...props}
    >
      <Path
        fill="#013054"
        d="m8.929 0 7.023 6.888L23.023 0c4.756 2.344 8.146 6.983 8.83 12.272 2.13 16.517-19.412 24.89-28.95 11.306C-2.749 15.53.165 4.293 8.93 0Zm7.08 6.958c-1.595 1.637-3.285 3.19-4.813 4.888-2.485 3.342-.875 8.234 3.138 9.35 5.92 1.648 10.101-5.373 6.07-9.846l-4.397-4.392h.002Z"
      />
    </Svg>
  )
}
export default BlinkistIcon
