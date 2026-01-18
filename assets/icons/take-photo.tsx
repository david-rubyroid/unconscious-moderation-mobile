import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function TakePhotoIcon(props: SvgProps) {
  return (
    <Svg
      width={41}
      height={40}
      viewBox="0 0 41 40"
      fill="none"
      {...props}
    >
      <Path
        fill="#2E7D60"
        fillRule="evenodd"
        d="M16.694 5.396a3.237 3.237 0 0 0-2.895 1.79l-.852 1.702a5.395 5.395 0 0 1-4.825 2.982H5.395a3.237 3.237 0 0 0-3.237 3.237v19.42a3.237 3.237 0 0 0 3.237 3.238h30.21a3.237 3.237 0 0 0 3.237-3.237v-20.5H41v20.5a5.395 5.395 0 0 1-5.395 5.395H5.395A5.395 5.395 0 0 1 0 34.528V15.107a5.395 5.395 0 0 1 5.395-5.395h2.727a3.237 3.237 0 0 0 2.895-1.79l.851-1.702a5.395 5.395 0 0 1 4.826-2.982h5.964v2.158h-5.964Z"
        clipRule="evenodd"
      />
      <Path
        fill="#2E7D60"
        fillRule="evenodd"
        d="M20.5 16.185a7.553 7.553 0 1 0 0 15.106 7.553 7.553 0 0 0 0-15.106Zm-9.71 7.553c0-5.363 4.347-9.71 9.71-9.71s9.71 4.347 9.71 9.71-4.347 9.71-9.71 9.71-9.71-4.347-9.71-9.71ZM39.92 6.474H29.132V4.316h10.79v2.158Z"
        clipRule="evenodd"
      />
      <Path
        fill="#2E7D60"
        fillRule="evenodd"
        d="M35.605 0v10.79h-2.158V0h2.158Z"
        clipRule="evenodd"
      />
    </Svg>
  )
}
export default TakePhotoIcon
