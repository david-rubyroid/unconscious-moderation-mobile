import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function CheckIcon(props: SvgProps) {
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      {...props}
    >
      <Path
        fill={props.color}
        d="m5.333 14-.8.6a1 1 0 0 0 1.632-.045L5.333 14ZM1.8 7.622a1 1 0 1 0-1.6 1.2l.8-.6.8-.6Zm13.032-6.067a1 1 0 1 0-1.664-1.11L14 1l.832.555ZM5.333 14l.8-.6L1.8 7.622l-.8.6-.8.6L4.533 14.6l.8-.6ZM14 1l-.832-.555-8.667 13 .832.555.832.555 8.667-13L14 1Z"
      />
    </Svg>
  )
}
export default CheckIcon
