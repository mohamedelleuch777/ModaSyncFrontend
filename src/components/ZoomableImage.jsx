import { useEffect, useRef } from "react";
import { formatUrl } from "../constants";

const ZoomableImage = ({ ref, src, alt }) => {
    const img = useRef(null);
    let startDistance = 0;
    let startScale = 1;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let lastTouch = { x: 0, y: 0 };

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

        // 🖱️ Desktop: Mouse Drag for Panning
        const handleMouseDown = (e) => {
            e.preventDefault();
            isDragging = true;
            dragStart = { x: e.clientX - tx, y: e.clientY - ty };
            img.current.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            tx = e.clientX - dragStart.x;
            ty = e.clientY - dragStart.y;
            applyTransform();
        };

        const handleMouseUp = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            isDragging = false;
            img.current.style.cursor = 'grab';
        };

        // 📱 Mobile: Touch Events for Zoom and Pan
        const handleTouchStart = (e) => {
            e.preventDefault();
            
            if (e.touches.length === 2) {
                // Two fingers: zoom gesture
                startDistance = getDistance(e.touches);
                startScale = scale;
            } else if (e.touches.length === 1) {
                // One finger: pan gesture
                isDragging = true;
                const touch = e.touches[0];
                dragStart = { x: touch.clientX - tx, y: touch.clientY - ty };
                lastTouch = { x: touch.clientX, y: touch.clientY };
            }
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            
            if (e.touches.length === 2) {
                // Two fingers: zoom
                let newDistance = getDistance(e.touches);
                scale = startScale * (newDistance / startDistance);
                applyTransform();
            } else if (e.touches.length === 1 && isDragging) {
                // One finger: pan
                const touch = e.touches[0];
                tx = touch.clientX - dragStart.x;
                ty = touch.clientY - dragStart.y;
                lastTouch = { x: touch.clientX, y: touch.clientY };
                applyTransform();
            }
        };

        const handleTouchEnd = (e) => {
            e.preventDefault();
            if (e.touches.length === 0) {
                isDragging = false;
            }
        };

        const getDistance = (touches) => {
            let dx = touches[0].pageX - touches[1].pageX;
            let dy = touches[0].pageY - touches[1].pageY;
            return Math.sqrt(dx * dx + dy * dy);
        };

        const applyTransform = () => {
            // Clamp scale to reasonable bounds
            scale = Math.max(0.5, Math.min(5, scale));
            img.current.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
            img.current.style.opacity = Math.min(1, scale);
        };

        // 🎯 Add Event Listeners
        img.current.addEventListener("wheel", handleWheel);
        
        // Mouse events for desktop
        img.current.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        
        // Touch events for mobile
        img.current.addEventListener("touchstart", handleTouchStart, { passive: false });
        img.current.addEventListener("touchmove", handleTouchMove, { passive: false });
        img.current.addEventListener("touchend", handleTouchEnd, { passive: false });
        
        // Set initial cursor style
        img.current.style.cursor = 'grab';
        
        ref(img);

        return () => {
            // 🔄 Cleanup Listeners on Unmount
            if (!img.current) return;
            img.current.removeEventListener("wheel", handleWheel);
            img.current.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            img.current.removeEventListener("touchstart", handleTouchStart);
            img.current.removeEventListener("touchmove", handleTouchMove);
            img.current.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    return (
        <img ref={img} src={formatUrl(src)} id="zoomable-img" alt={alt} style={{ width: "100%", maxWidth: "400px", touchAction: "none" }} />
    );
};

export default ZoomableImage;
