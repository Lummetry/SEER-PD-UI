import React from "react";

export const LensLogo = props => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26">
        <defs />
        <path
          fill="#D6F1FF"
          stroke="#0055AE"
          strokeWidth="1.773"
          d="M25.114 13c0 6.69-5.424 12.114-12.114 12.114S.886 19.69.886 13 6.31.886 13 .886 25.114 6.31 25.114 13z"
        />
        <mask
          id="a"
          width="24"
          height="24"
          x="1"
          y="1"
          maskUnits="userSpaceOnUse"
        >
          <path
            fill="#C4C4C4"
            stroke="url(#paint0_linear)"
            strokeWidth="1.679"
            d="M23.387 13c0 5.737-4.65 10.387-10.387 10.387S2.612 18.737 2.612 13 7.263 2.612 13 2.612 23.387 7.263 23.387 13z"
          />
        </mask>
        <g stroke="#0055AE" mask="url(#a)">
          <path
            fill="url(#paint1_linear)"
            strokeWidth=".627"
            d="M3.895 18.092l-.214-.094-.15.177L-7.628 31.26l-.431.506.664.01 42.784.723.51.009-.223-.459-9.391-19.345-.013-.025-.016-.023-2.409-3.291-.245-.335-.255.327-3.191 4.104-3.45-2.325-.292-.197-.162.314-2.682 5.211-3.432-1.268-.23-.085-.138.202-2.823 4.12-3.053-1.34z"
          />
          <path
            fill="#5FB3FD"
            strokeWidth=".157"
            d="M4.252 17.977a.564.564 0 11-1.128 0 .564.564 0 011.128 0zM10.513 14.927a.564.564 0 11-1.128 0 .564.564 0 011.128 0zM7.302 19.262a.564.564 0 11-1.128 0 .564.564 0 011.128 0zM14.206 16.372a.564.564 0 11-1.128 0 .564.564 0 011.128 0zM20.627 13.322a.564.564 0 11-1.127 0 .564.564 0 011.127 0zM16.935 10.753a.564.564 0 11-1.128 0 .564.564 0 011.128 0zM23.998 8.666a.403.403 0 11-.806 0 .403.403 0 01.806 0z"
          />
        </g>
        <g opacity=".8">
          <mask
            id="b"
            width="22"
            height="22"
            x="2"
            y="2"
            maskUnits="userSpaceOnUse"
          >
            <circle cx="13" cy="13" r="10.636" fill="#fff" />
          </mask>
          <g fill="#fff" mask="url(#b)">
            <path d="M-4.955 11.765L15.78-4.558l2.236 2.84-20.736 16.323zM-1.344 16.355L19.393.032l2.236 2.84L.892 19.196z" />
          </g>
        </g>
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="13"
            x2="13"
            y1="1.773"
            y2="24.227"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear"
            x1="14.003"
            x2="14.182"
            y1="9.549"
            y2="37.227"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#399EFD" />
            <stop offset="1" stopColor="#3A9FFD" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  };