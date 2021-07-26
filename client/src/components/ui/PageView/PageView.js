import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback
} from "react";

import SwipeableViews from "react-swipeable-views";
import { virtualize } from "react-swipeable-views-utils";
import { Column } from "components/ui/basic";

import { echoFor } from "components";
const PageViewBuilder = virtualize(SwipeableViews);

const styles = {
  root: {
    height: "100%"
  },
  container: {
    height: "100%"
  }
};

export const PageView = forwardRef(
  ({ currentPage: customCurrentPageArray }, ref) => {
    // let echo = echoFor("PageView");
    let echo = () => {};
    let customCurrentPage = {
      render: customCurrentPageArray[0],
      params: customCurrentPageArray[1]
    };
    const [state, setState] = useState({
      index: 1,
      currentPage: customCurrentPage,
      prevPage: { render: null, params: null }
    });

    const [direction, setDirection] = useState("right");

    const [stack, setStack] = useState([customCurrentPage]);
    echo("stack is: ", stack);

    if (typeof customCurrentPageArray === "undefined") {
      echo("No current page defined");
      return null;
    }

    const setDirectionPublic = direction => {
      echo("Changing direction to: ", direction);
      setDirection(direction);
    };

    const goTo = ([renderFunction, renderParams]) => {
      // let echo = echoFor("goTo");
      if (!renderFunction) {
        echo(`no renderFunction`);
        return;
      }
      let stackLocal = [...stack];
      echo("stack before push: ", stackLocal);
      let newPage = { render: renderFunction, params: renderParams };
      stackLocal.push(newPage);
      echo("stack after push: ", stackLocal);
      setStack(stackLocal);
      //   echo(`goToPage: ${renderFunction.name}`, " - params: ", renderParams);
      let newIndex = direction === "right" ? state.index + 1 : state.index - 1;
      setState({
        currentPage: { render: renderFunction, params: renderParams },
        prevPage: {
          render: state.currentPage.render,
          params: state.currentPage.params
        },
        index: newIndex
      });
    };
    const goBackTo = ([renderFunction, renderParams]) => {
      let echo = echoFor("goBackTo");
      if (!renderFunction) {
        echo(`no renderFunction`);
        return;
      }
      let stackLocal = [...stack];
      echo("stack before pop: ", stackLocal);
      echo("stack.length before pop: ", stackLocal.length);
      stackLocal.pop();
      echo("stack after pop: ", stackLocal);
      echo("stack.length after pop: ", stackLocal.length);
      setStack(stackLocal);
      setState({
        currentPage: { render: renderFunction, params: renderParams },
        prevPage: {
          render: state.currentPage.render,
          params: state.currentPage.params
        },
        index: state.index - 1
      });
    };
    const goBack = () => {
      let echo = echoFor("goBack");

      let stackLocal = stack;
      echo("stack before pop: ", stackLocal);
      echo("stack.length before pop: ", stackLocal.length);
      let prevPage = stackLocal.pop();
      echo("prevPage este: ", prevPage);
      echo("stack after pop: ", stack);
      echo("stack.length after pop: ", stackLocal.length);
      let lastElement = stackLocal[stackLocal.length - 1];
      echo("lastElement este: ", lastElement);
      let newIndex = direction === "right" ? state.index - 1 : state.index + 1;
      setState({
        prevPage: {
          render: state.currentPage.render,
          params: state.currentPage.params
          // render: prevPage.render,
          // params: prevPage.params
        },
        currentPage: {
          render: lastElement.render,
          params: lastElement.params
          // render: prevPage.renderFunction,
          // params: prevPage.renderParams
        },
        index: newIndex
      });
    };

    const getState = () => state;

    useImperativeHandle(ref, () => ({
      goTo,
      goBack,
      goBackTo,
      getState,
      setDirection: setDirectionPublic
    }));

    const renderSlide = useCallback(
      params => {
        // let echo = echoFor("renderSlide");

        const { index, key } = params;
        let renderFunction;
        let renderParams;
        let diff = index - state.index;

        if (diff === -1) {
          //   echo("Rendering prev page");
          renderFunction = state.prevPage.render;
          renderParams = state.prevPage.params;
        } else if (diff === 0) {
          //   echo("Rendering current page");
          renderFunction = state.currentPage.render;
          renderParams = state.currentPage.params;
        } else {
          //   echo("Rendering next page");
          renderFunction = state.prevPage.render;
          renderParams = state.prevPage.params;
        }
        let content;
        if (renderFunction) {
          content = renderFunction; //(renderParams);
        } else {
          //   echo(`No render function specified for index: ${index}`);
          content = null;
        }

        // if (renderFunction) {
        //   echo("renderFunction : ", renderFunction.name);
        //   echo("renderParams: ", renderParams);
        // }
        //   let keyString = `index-${index}-${pageType}=${
        //     renderFunction ? renderFunction.name : "noRenderFunction"
        //   }`;
        //   echo(`Creating slide with key: ${keyString}`);
        return (
          <Column key={key} className="h-full max-h-full">
            {content}
          </Column>
        );
      },
      [state]
    );

    return (
      <PageViewBuilder
        index={state.index}
        style={styles.root}
        //   onChangeIndex={handleChangeIndex}
        containerStyle={styles.container}
        springConfig={{
          duration: "0.25s",
          easeFunction: "cubic-bezier(0.15, 0.3, 0.25, 1)",
          delay: "0s"
        }}
        slideClassName=""
        slideRenderer={renderSlide}
        overscanSlideBefore={1}
        overscanSlideAfter={1}
      />
    );
  }
);
