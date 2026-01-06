import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function YouTubeIcon(props: SvgProps) {
  return (
    <Svg
      width={36}
      height={25}
      fill="none"
      viewBox="0 0 36 25"
      {...props}
    >
      <Path
        fill="#2E7D60"
        d="M15.843.012c3.864-.05 7.801.054 11.65.326 3.956.28 6.32.408 7.053 4.898.65 3.985.63 9.187.115 13.194-.534 4.156-1.73 5.312-5.911 5.696-5.151.474-10.655.406-15.84.287-2.527-.058-5.266-.07-7.77-.408-3.936-.532-4.555-2.893-4.895-6.427a57.782 57.782 0 0 1 0-10.635C.625 2.959 1.33.942 5.648.453 8.93.084 12.536.058 15.843.014ZM14.025 7.03v10.407l9.036-5.232-9.036-5.175Z"
      />
    </Svg>
  )
}
export default YouTubeIcon
