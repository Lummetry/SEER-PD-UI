export const ModalDefaultAnimation = {
  Glass: {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    },
    transition: { ease: "easeOut", duration: 0.23, staggerChildren: 0.3 }
  },
  Window: {
    initial: { scale: 0.6 },
    animate: { scale: 1 },
    exit: { scale: 0.5 },
    transition: { ease: "easeOut", duration: 0.23 }
  }
};

export const ModalDefaultClasses = {
  Glass: "absolute left-0 right-0 top-0 bottom-0 flex",
  Overlay: "absolute w-full h-full",
  Window: "flex",
  Contents: "select-none relative flex rounded-lg shadow-lg bg-white"
};

export const ModalDefaultStyles = {
  Glass: {},
  Overlay: {},
  Window: {},
  Contents: {}
};
