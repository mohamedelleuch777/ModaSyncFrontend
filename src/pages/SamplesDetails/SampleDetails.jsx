import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { BuildingFillAdd, XLg, ZoomIn } from "react-bootstrap-icons";
import ZoomableImage from "../../components/ZoomableImage";
import ButtonSliderWrapper from "../../components/ButtonSliderWrapper";
import { useApi, get, del } from "../../hooks/apiHooks";

const SampleDetailsPage = () => {
  const { state: { sample } } = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isImageOverlayShown, setIsImageOverlayShown] = useState(false);
  const [isShowZoomWindow, setIsShowZoomWindow] = useState(false);
  const mainImageRef = React.createRef();
  // const zoomWindowImageRef = React.createRef();
  const [zoomWindowImageRef, setZoomWindowImageRef] = React.useState(null);
  const [imageList, setImageList] = React.useState([]);

  const apiFetch = useApi();

  const selectImage = (e) => {
    e.stopPropagation();
    let selectedHtmlElement = e.target;
    if(selectedHtmlElement.tagName !== 'IMG') return;
    while (!selectedHtmlElement.classList.contains('thumbnail-container')) {
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

  const fetchSamples_Images = async () => {
    const images = await get(apiFetch, `/api/pictures/${sample.id}`, {});
    setImageList(images);
  }

  const addImageToSample = (e) => {
    e.preventDefault();
    navigate('/add-image-sample', { state: {selectedSample: sample} });
  }

  const deleteImage = async (imageId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Image?");
    if (!confirmDelete) return;
    await del(apiFetch, `/api/pictures/${imageId}`, {});
    fetchSamples_Images();
  }

  React.useEffect(() => {
    // debugger 
    fetchSamples_Images();
    console.log(sample)
  },[])

  return (
    <div className="sample-details-container">

      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="sample-details-upper-images-container">
        <img 
          ref={mainImageRef} 
          src={sample.image}
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
            <div>
              <button className="btn-add-image" onClick={addImageToSample}>
                <BuildingFillAdd color="white" size={20} />
              </button>
            </div>
            <ButtonSliderWrapper>
                <section style={{minWidth: '100%'}}>
                  <img src={sample.image} alt="secondary main-image" className="thumbnail-image active" />
                </section>
                <button className="btn-delete-image" onClick={() => deleteImage(sample.id)}>Delete</button>
            </ButtonSliderWrapper>
            {
              imageList && imageList.map((image, index) => (
                // {console.log(image)}
                <ButtonSliderWrapper key={index}>
                    <section style={{minWidth: '100%'}}>
                      <img src={image.image_url} alt="secondary image" className="thumbnail-image active" />
                    </section>
                    <button className="btn-delete-image" onClick={() => deleteImage(image.id)}>Delete</button>
                </ButtonSliderWrapper>
              ))
            }
        </div>
      </div>
      <section className="sample-details-section">
      </section>
    </div>
  );
};

export default SampleDetailsPage;
