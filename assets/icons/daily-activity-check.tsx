import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

function DailyActivityCheck(props: SvgProps) {
  return (
    <Svg
      width={14}
      height={14}
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <Circle cx={7} cy={7} r={6.5} fill="white" stroke="black" />
      <Path
        fill="black"
        d="m6 10-.4.3a.5.5 0 0 0 .816-.023L6 10ZM4.4 7.033a.5.5 0 0 0-.8.6l.4-.3.4-.3Zm6.016-2.756a.5.5 0 1 0-.832-.554L10 4l.416.277ZM6 10l.4-.3-2-2.667-.4.3-.4.3 2 2.667.4-.3Zm4-6-.416-.277-4 6L6 10l.416.277 4-6L10 4Z"
      />
    </Svg>
  )
}
export default DailyActivityCheck
