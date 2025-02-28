import { useEffect, useRef } from "react";

const ZoomableImage = ({ ref, src, alt }) => {
    const img = useRef(null);
    let startDistance = 0;
    let startScale = 1;

    useEffect(() => {
        if (!img.current) return;

        var tx = 0;
        var ty = 0;
        var scale = 1;

        // 🖱️ Desktop: Zoom with Mouse Wheel (CTRL + Scroll)
        const handleWheel = (e) => {
            e.preventDefault();
            if (e.ctrlKey) {
                let s = Math.exp(-e.deltaY / 100);
                scale *= s;
            } else {
                let direction = -1;
                tx += e.deltaX * direction;
                ty += e.deltaY * direction;
            }
            applyTransform();
        };

        // 📱 Mobile: Zoom with Pinch Gesture
        const handleTouchStart = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                startDistance = getDistance(e.touches);
                startScale = scale;
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                let newDistance = getDistance(e.touches);
                scale = startScale * (newDistance / startDistance);
                applyTransform();
            }
        };

        const getDistance = (touches) => {
            let dx = touches[0].pageX - touches[1].pageX;
            let dy = touches[0].pageY - touches[1].pageY;
            return Math.sqrt(dx * dx + dy * dy);
        };

        const applyTransform = () => {
            img.current.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
            img.current.style.opacity = scale;
        };

        // 🎯 Add Listeners
        img.current.addEventListener("wheel", handleWheel);
        img.current.addEventListener("touchstart", handleTouchStart);
        img.current.addEventListener("touchmove", handleTouchMove);
        ref(img);

        return () => {
            // 🔄 Cleanup Listeners on Unmount
            if (!img.current) return;
            img.current.removeEventListener("wheel", handleWheel);
            img.current.removeEventListener("touchstart", handleTouchStart);
            img.current.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    return (
        <img ref={img} src={src} id="zoomable-img" alt={alt} style={{ width: "100%", maxWidth: "400px", touchAction: "none" }} />
    );
};

export default ZoomableImage;
