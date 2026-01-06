import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function MasterClassIcon(props: SvgProps) {
  return (
    <Svg
      width={41}
      height={22}
      fill="none"
      viewBox="0 0 41 22"
      {...props}
    >
      <Path
        fill="#013054"
        d="m31.694 0 5.316 18.364c.666 1.482 1.541 1.794 3.15 1.623v1.983h-9.545L24.311 0h7.383ZM16.297 0c1.423 3.95 2.392 8.15 3.654 12.191.502 1.214 1.25 1.608 2.559 1.675l-2.266 8.114c-.772-.144-4.541.234-4.853-.185L10.223 3.913c-.688-1.743-1.464-2.19-3.382-2.11V0h9.456ZM8.464 20.169H0v1.8h8.464v-1.8Z"
      />
    </Svg>
  )
}
export default MasterClassIcon
