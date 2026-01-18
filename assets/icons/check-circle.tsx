import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'

function CheckCircleIcon(props: SvgProps) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <Rect width={20} height={20} fill="#ADFFC3" rx={10} />
      <Path
        fill="#1E1F1C"
        d="m9 14-.841.54a1 1 0 0 0 1.71-.044L9 14Zm-1.159-3.652A1 1 0 0 0 6.16 11.43l1.682-1.082Zm6.027-2.852a1 1 0 1 0-1.736-.992l1.736.992ZM9 14l.841-.54-2-3.112-.841.54-.841.542 2 3.11L9 14Zm4-7-.868-.496-4 7L9 14l.868.496 4-7L13 7Z"
      />
    </Svg>
  )
}
export default CheckCircleIcon
