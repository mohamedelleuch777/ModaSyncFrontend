import React, { useState } from "react";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';

const SampleDetailsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainImageRef = React.createRef();

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

  return (
    <div className="sample-details-container">

      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="sample-details-upper-images-container">
        <img ref={mainImageRef} src="https://t3.ftcdn.net/jpg/03/34/79/68/360_F_334796865_VVTjg49nbLgQPG6rgKDjVqSb5XUhBVsW.jpg" alt="main image" />
        <div className="thumbnail-container" onClick={selectImage}>
            <img src="https://t3.ftcdn.net/jpg/03/34/79/68/360_F_334796865_VVTjg49nbLgQPG6rgKDjVqSb5XUhBVsW.jpg" alt="secondary image" className="thumbnail-image active" />
            <img src="https://www.shutterstock.com/image-photo/clothes-on-clothing-hanger-260nw-2338282257.jpg" alt="secondary image" className="thumbnail-image" />
            <img src="https://t3.ftcdn.net/jpg/01/38/94/62/360_F_138946263_EtW7xPuHRJSfyl4rU2WeWmApJFYM0B84.jpg" alt="secondary image" className="thumbnail-image" />
            <img src="https://media.burford.co.uk/images/SNY04089.jpg_edit.width-1440_05001m7uKQ0crRoI.jpg" alt="secondary image" className="thumbnail-image" />
            <img src="https://www.shutterstock.com/image-photo/clothes-on-clothing-hanger-260nw-2338282257.jpg" alt="secondary image" className="thumbnail-image" />
            <img src="https://media.burford.co.uk/images/SNY04089.jpg_edit.width-1440_05001m7uKQ0crRoI.jpg" alt="secondary image" className="thumbnail-image" />
        </div>
      </div>
      <section className="sample-details-section">
      </section>
    </div>
  );
};

export default SampleDetailsPage;
