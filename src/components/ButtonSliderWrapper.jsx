import React from "react";

function ButtonSliderWrapper({ children }) {
  const [scrollValue, setScrollValue] = React.useState(0);
  const [maxScrollHorizontalValue, setMaxScrollHorizontalValue] = React.useState(0);
  const divWrapper = React.useRef(null);


  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    setMaxScrollHorizontalValue(scrollWidth - clientWidth)
    setScrollValue(scrollLeft);
  };

  const endScroll = () => {
    const div = divWrapper.current;
    let fixScroll = -1;
    if(scrollValue > maxScrollHorizontalValue / 2) {
      fixScroll = maxScrollHorizontalValue
    } else {
      fixScroll = 0
    }
    requestAnimationFrame(() => {
      div.scrollTo({ left: fixScroll, behavior: "smooth" });
    });
  };

  return (
    <div ref={divWrapper} className="sub-collection-wrapper" onScroll={handleScroll} onTouchEnd={endScroll}>
      {children}
    </div>
  );
}

export default ButtonSliderWrapper;
