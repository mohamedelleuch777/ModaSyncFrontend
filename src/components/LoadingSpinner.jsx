const LoadingSpinner = ({ 
    size = 40, 
    primaryColor = "#f3f3f3", 
    secondaryColor = "#6da49c", 
    spinnerWidth = 7 
}) => {
    return (
        <div className="loading-spinner">
            <div className="loader"
                 style={{ 
                    width: size, 
                    height: size, 
                    border: spinnerWidth + "px solid " + primaryColor,
                    borderTop: spinnerWidth + "px solid " + secondaryColor 
                }}></div>
        </div>
    );
};

export default LoadingSpinner;
