import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function Skip(props: SvgProps) {
  return (
    <Svg
      width={14}
      height={14}
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <Path
        fill="#76E5A9"
        d="m8.888 8.253-6.227 5.264C1.606 14.41 0 13.653 0 12.264V1.736C0 .347 1.607-.41 2.661.483l6.227 5.264A1.633 1.633 0 0 1 9.468 7a1.647 1.647 0 0 1-.58 1.253ZM14 12.676V1.324a1.33 1.33 0 0 0-.384-.936A1.307 1.307 0 0 0 12.688 0h-.404c-.348 0-.682.14-.928.388a1.33 1.33 0 0 0-.384.936v11.352c0 .351.138.688.383.936.246.248.58.388.927.388h.404a1.303 1.303 0 0 0 .929-.387 1.325 1.325 0 0 0 .385-.937Z"
      />
    </Svg>
  )
}
export default Skip
