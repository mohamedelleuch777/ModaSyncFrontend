import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { CircleFill, XLg, ZoomIn } from "react-bootstrap-icons";
import ZoomableImage from "../../components/ZoomableImage";

const SampleDetailsPage = () => {
  const { sample } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isImageOverlayShown, setIsImageOverlayShown] = useState(false);
  const [isShowZoomWindow, setIsShowZoomWindow] = useState(false);
  const mainImageRef = React.createRef();
  // const zoomWindowImageRef = React.createRef();
  const [zoomWindowImageRef, setZoomWindowImageRef] = React.useState(null);

  const selectImage = (e) => {
    e.stopPropagation();
    let selectedHtmlElement = e.target;
    while (selectedHtmlElement.tagName !== 'DIV') {
      selectedHtmlElement = selectedHtmlElement.parentElement;
    }
    const listOfAllStories = selectedHtmlElement.querySelectorAll('.thumbnail-image');
    listOfAllStories.forEach(thumbnailImage => {
      thumbnailImage.classList.remove('active');
    });
    selectedHtmlElement = e.target;
    selectedHtmlElement.classList.add('active');
    mainImageRef.current.src = selectedHtmlElement.src;
  };

  const makeZoom = () => {
    zoomWindowImageRef.current.src = mainImageRef.current.src
    setIsShowZoomWindow(true)
  }

  React.useEffect(() => {
    // console.log(sample)
  },[])

  return (
    <div className="sample-details-container">

      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="sample-details-upper-images-container">
        <img 
          ref={mainImageRef} 
          src="https://t3.ftcdn.net/jpg/03/34/79/68/360_F_334796865_VVTjg49nbLgQPG6rgKDjVqSb5XUhBVsW.jpg" 
          alt="main image"
          onClick={() => setIsImageOverlayShown(true)}
        />
        { isImageOverlayShown && <div className="main-image-overlay" onClick={() => setIsImageOverlayShown(false)}>
          <div className="zoom-in-container">
            <ZoomIn  color="#444" size={52} style={{position: 'absolute', top: 10, left: 11}}/>
            <ZoomIn onClick={makeZoom} color="#fff" size={50} style={{position: 'relative', zIndex: 1}}/>
          </div>
        </div> }
        <div className="zoom-window" style={{display: isShowZoomWindow ? 'flex' : 'none'}}>
          <XLg size={35} color="#df0000" style={{position: 'absolute', top: 10, right: 11, zIndex: 1}} onClick={() => setIsShowZoomWindow(false)}/>
          {/* <img 
            ref={zoomWindowImageRef}
            className="zoom-window-image" 
            src="https://t3.ftcdn.net/jpg/03/34/79/68/360_F_334796865_VVTjg49nbLgQPG6rgKDjVqSb5XUhBVsW.jpg" 
            alt="main image"
          /> */}
          <ZoomableImage 
            ref={setZoomWindowImageRef}
            src="https://t3.ftcdn.net/jpg/03/34/79/68/360_F_334796865_VVTjg49nbLgQPG6rgKDjVqSb5XUhBVsW.jpg" 
            alt="main image" 
          />
        </div>
        <div className="thumbnail-container" onClick={selectImage}>
            <section><img src="https://t3.ftcdn.net/jpg/03/34/79/68/360_F_334796865_VVTjg49nbLgQPG6rgKDjVqSb5XUhBVsW.jpg" alt="secondary image" className="thumbnail-image active" /></section>
            <section><img src="https://www.shutterstock.com/image-photo/clothes-on-clothing-hanger-260nw-2338282257.jpg" alt="secondary image" className="thumbnail-image" /></section>
            <section><img src="https://t3.ftcdn.net/jpg/01/38/94/62/360_F_138946263_EtW7xPuHRJSfyl4rU2WeWmApJFYM0B84.jpg" alt="secondary image" className="thumbnail-image" /></section>
            <section><img src="https://media.burford.co.uk/images/SNY04089.jpg_edit.width-1440_05001m7uKQ0crRoI.jpg" alt="secondary image" className="thumbnail-image" /></section>
            <section><img src="https://www.shutterstock.com/image-photo/clothes-on-clothing-hanger-260nw-2338282257.jpg" alt="secondary image" className="thumbnail-image" /></section>
            <section><img src="https://media.burford.co.uk/images/SNY04089.jpg_edit.width-1440_05001m7uKQ0crRoI.jpg" alt="secondary image" className="thumbnail-image" /></section>
        </div>
      </div>
      <section className="sample-details-section">
      </section>
    </div>
  );
};

export default SampleDetailsPage;
