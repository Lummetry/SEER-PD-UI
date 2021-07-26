import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { virtualize } from "react-swipeable-views-utils";
import { useTabState } from "components/ui/Tabs";
import { mod } from "react-swipeable-views-core";
import { echo } from "components";
import { duration } from "moment";

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

const styles = {
  slide: {
    padding: 15,
    minHeight: 100,
    color: "#fff"
  },
  slide1: {
    backgroundColor: "#FEA900"
  },
  slide2: {
    backgroundColor: "#B3DC4A"
  },
  slide3: {
    backgroundColor: "#6AC0FF"
  }
};

export const ProductPatterns = () => {
  const [index, setIndex] = useState(0);

  const [goForward] = useState(() => {
    if (index < 3 - 1) {
      setIndex(index + 1);
    }
  });

  const [goBack] = useState(() => {
    if (index >= 1) {
      setIndex(index - 1);
    }
  });

  const [slideRenderer] = useState(() => params => {
    const { index, key } = params;
    let style;

    echo("slideRendered - params: ", params);

    switch (mod(index, 3)) {
      case 0:
        style = styles.slide1;
        break;

      case 1:
        style = styles.slide2;
        break;

      case 2:
        style = styles.slide3;
        break;

      default:
        break;
    }

    return (
      <div style={Object.assign({}, styles.slide, style)} key={key}>
        {`slide n°${index + 1}`}
        <button onClick={goBack}>{"Prev"}</button>
        <button onClick={goForward}>{"Next"}</button>
      </div>
    );
  });

  return (
    <div className="p-4 bg-blue-100 h-full">
      <VirtualizeSwipeableViews
        springConfig={{
          duration: "0.2s",
          easeFunction: "cubic-bezier(0.15, 0.3, 0.25, 1)",
          delay: "0s"
        }}
        overscanSlideAfter={1}
        overscanSlideBefore={1}
        slideCount={3}
        index={index}
        onChangeIndex={index => setIndex(index)}
        slideRenderer={slideRenderer}
      />
      <br />
    </div>
  );
};
