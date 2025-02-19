import React from "react";

function ButtonSliderWrapper({ children }) {
  const [scrollValue, setScrollValue] = React.useState(0);
  const [maxScrollHorizontalValue, setMaxScrollHorizontalValue] = React.useState(0);
  const divWrapper = React.useRef(null);
  const [countingInterval, setCountingInterval] = React.useState(null);


  const handleScroll = (e) => {
    if (countingInterval) {
      clearInterval(countingInterval);
      setCountingInterval(null);
      // console.log('clearing interval');
    }
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
    
    // wait 100 ms to end the scroll event and set the interval
    setTimeout(() => {
      const interval = setTimeout(() => {
        fixScroll = 0
        requestAnimationFrame(() => {
          div.scrollTo({ left: fixScroll, behavior: "smooth" });
        });
      }, 10000); // force close if stay opened and IDLE for 10 seconds
      setCountingInterval(interval);
      // console.log('setting interval');
    }, 1000)
  };

  return (
    <div ref={divWrapper} className="button-slider-wrapper" onScroll={handleScroll} onTouchEnd={endScroll}>
      {children}
    </div>
  );
}

export default ButtonSliderWrapper;
