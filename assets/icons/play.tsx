import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function Play() {
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
    >
      <Path
        fill="#76E5A9"
        d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0Zm3.975 10.35L8.142 14.1a.415.415 0 0 1-.642-.35v-7.5a.416.416 0 0 1 .642-.35l5.833 3.75a.417.417 0 0 1 0 .7Z"
      />
    </Svg>
  )
}
export default Play
