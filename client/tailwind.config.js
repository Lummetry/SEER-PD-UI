const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    fontFamily: {
      sans: [`Inter`, `"Work Sans"`, ...defaultTheme.fontFamily.sans]
    },
    container: {
      center: true
    },
    extend: {
      colors: {
        "semi-75": "rgba(0, 0, 0, 0.75)"
      }
    },
    transitionProperty: {
      // defaults to these values
      none: "none",
      all: "all",
      color: "color",
      bg: "background-color",
      border: "border-color",
      colors: ["color", "background-color", "border-color"],
      opacity: "opacity",
      transform: "transform"
    },
    transitionDuration: {
      // defaults to these values
      default: "250ms",
      "0": "0ms",
      "100": "100ms",
      "250": "250ms",
      "500": "500ms",
      "750": "750ms",
      "1000": "1000ms"
    },
    transitionTimingFunction: {
      // defaults to these values
      default: "ease",
      linear: "linear",
      ease: "ease",
      "ease-in": "ease-in",
      "ease-out": "ease-out",
      "ease-in-out": "ease-in-out"
    },
    transitionDelay: {
      // defaults to these values
      default: "0ms",
      "0": "0ms",
      "100": "100ms",
      "250": "250ms",
      "500": "500ms",
      "750": "750ms",
      "1000": "1000ms"
    },
    willChange: {
      // defaults to these values
      auto: "auto",
      scroll: "scroll-position",
      contents: "contents",
      opacity: "opacity",
      transform: "transform"
    }
  },
  variants: {
    borderColor: [
      "responsive",
      "hover",
      "focus",
      "focus-within",
      "group-hover"
    ],
    backgroundColor: [
      "responsive",
      "hover",
      "focus",
      "focus-within",
      "group-hover",
      "odd",
      "even",
    ],
    opacity: ["group-hover"],
    transitionProperty: ["responsive"],
    transitionDuration: ["responsive"],
    transitionTimingFunction: ["responsive"],
    transitionDelay: ["responsive"],
    willChange: ["responsive"]
  },
  plugins: [require("tailwindcss-transitions")()]
};
