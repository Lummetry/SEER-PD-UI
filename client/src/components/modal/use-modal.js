import React, { useState, useEffect } from "react";

const UseModal = ({ trigger, content }) => {
  const [isVisible, setIsShown] = useState(false);
  const hide = () => setIsShown(false);
  const show = () => setIsShown(true);

  useEffect(() => {
    if (isVisible) document.body.style.overflow = "hidden";
    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  return (
    <>
      {trigger(show)}
      {isVisible && content(hide)}
    </>
  );
};

export { UseModal };
