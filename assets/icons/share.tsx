import type { SvgProps } from 'react-native-svg'

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function ShareIcon({ color = '#fff', ...props }: SvgProps) {
  return (
    <Svg
      width={12}
      height={10}
      fill="none"
      viewBox="0 0 12 10"
      {...props}
    >
      <Path
        fill={color}
        d="M11.993 3.856a2.2 2.2 0 0 1 0 .35c-.02.182-.148.47-.252.624-.954.919-1.878 2.036-2.872 2.9-.27.235-.615.45-.973.246-.214-.123-.374-.462-.374-.701V6.26c-2.08.064-4.091.887-5.642 2.252-.375.33-.706.695-1.03 1.074-.176.208-.269.486-.61.397-.285-.075-.241-.472-.232-.7.135-3.43 2.649-6.444 5.973-7.255.506-.124 1.02-.184 1.538-.228.04-.495-.153-1.47.4-1.738.299-.146.632-.014.867.188l2.868 2.859c.162.193.311.495.339.747Z"
      />
    </Svg>
  )
}
export default ShareIcon
