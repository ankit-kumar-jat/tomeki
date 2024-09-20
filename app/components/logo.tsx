import React, { SVGProps } from 'react'

function Logo({ ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 60 80"
      {...rest}
    >
      <rect
        x="5"
        y="15"
        width="40"
        height="60"
        rx="5"
        ry="5"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
      />
      <rect
        x="15"
        width="40"
        height="60"
        rx="5"
        ry="5"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        y="5"
      />
    </svg>
  )
}

export default Logo
