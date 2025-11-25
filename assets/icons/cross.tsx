import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function Cross() {
  return (
    <Svg
      width={13}
      height={13}
      fill="none"
    >
      <Path
        stroke="#013766"
        strokeLinecap="square"
        strokeWidth={2}
        d="m6.414 6.415-5 5m5-5 5 5m-5-5-5-5m5 5 5-5"
      />
    </Svg>
  )
}
export default Cross
