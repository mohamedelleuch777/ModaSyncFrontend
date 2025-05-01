import React from 'react';

const PromptToast = ({ label, closeToast, onSubmit }) => {
    const [value, setValue] = React.useState('');
    const boxRef = React.useRef(null);

    // React.useEffect(() => {
    //   const handleClickOutside = (event) => {
    //     if (boxRef.current && !boxRef.current.contains(event.target)) {
    //       closeToast(); // Close toast on outside click
    //     }
    //   };

    //   document.addEventListener("mousedown", handleClickOutside);
    //   return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, []);


    return (
      <>
        {/* <div className="prompt-toast-overlay"></div> */}
        <div ref={boxRef} className="prompt-toast-content">
          <p style={{ marginBottom: '8px' }}>{label}:</p>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your input..."
            style={{ padding: '6px', width: '100%' }}
          />
          <button
            onClick={() => {
              closeToast();
              onSubmit(value);
            }}
          >
            Submit
          </button>
        </div>
      </>
    );
  };

export default PromptToast