import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { BuildingFillAdd, XLg, ZoomIn } from "react-bootstrap-icons";
import DynamicIcon from "../../components/DynamicIcon";
import ZoomableImage from "../../components/ZoomableImage";
import ButtonSliderWrapper from "../../components/ButtonSliderWrapper";
import { useApi, get, del, put } from "../../hooks/apiHooks";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { jwtDecode } from "jwt-decode";
import { SAMPLE_STATUS, USER_ROLES } from "../../constants";

const SampleDetailsPage = () => {
  const { state: { sample } } = useLocation();
  const [token,] = useState(jwtDecode(localStorage.getItem('token'), ""));
  const [role,] = useState(token.role);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isImageOverlayShown, setIsImageOverlayShown] = useState(false);
  const [isShowZoomWindow, setIsShowZoomWindow] = useState(false);
  const mainImageRef = React.createRef();
  const [zoomWindowImageRef, setZoomWindowImageRef] = React.useState(null);
  const [imageList, setImageList] = React.useState([]);
  const [timelineList, setTimelineList] = React.useState([]);

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

  const openConversation = () => {
    console.log("dddd", token, role)
  }

  const getMostRecentTimeline = () => {
    if (sample.timeline.length > 0) {
      return sample.timeline[0];
    }
    return null;
  }

  const getIconNameFromStatus = (timeline) => {
    switch (timeline.status) {
      case SAMPLE_STATUS.NEW:
        return {iconName: "NodePlusFill", title: "New Sample"};
      case SAMPLE_STATUS.EDIT:
        return {iconName: "Exposure", title: "Edit Sample"};
      case SAMPLE_STATUS.IN_REVIEW:
        return {iconName: "Eyeglasses", title: "In Review"};
      case SAMPLE_STATUS.IN_DEVELOPMENT:
        return {iconName: "FileDiffFill", title: "Under Development"};
      case SAMPLE_STATUS.DEVELOPMENT_DONE:
        return {iconName: "FileCodeFill", title: "Development Done"};
      case SAMPLE_STATUS.EXTERNAL_TASK:
        return {iconName: "BoxArrowUpLeft", title: "External Task"};
      case SAMPLE_STATUS.IN_PRODUCTION:
        return {iconName: "FiletypeExe", title: "In Production"};
      case SAMPLE_STATUS.TESTING:
        return {iconName: "BracesAsterisk", title: "Testing"};
      case SAMPLE_STATUS.ACCEPTED:
        return {iconName: "BookmarkCheckFill", title: "Accepted"};
      case SAMPLE_STATUS.REJECTED:
        return {iconName: "BookmarkXFill", title: "Rejected"};
      case SAMPLE_STATUS.READJUSTMENT:
        return {iconName: "WrenchAdjustableCircleFill", title: "Readjustment"};
      case SAMPLE_STATUS.CUT_PHASE:
        return {iconName: "Scissors", title: "In Cut Phase"};
      case SAMPLE_STATUS.PREPARING_TRACES:
        return {iconName: "SignRailroadFill", title: "Preparing Traces"};
      case SAMPLE_STATUS.READY:
        return {iconName: "BookmarkStarFill", title: "Ready"};
      default:
        return {iconName: "Ban", title: "Unknown Status"};
    }
  }

  React.useEffect(() => {
    // debugger 
    fetchSamples_Images();
    console.log(sample)
    const tempTimeline = []
    /**
     * task logic: blue badge: next task
     */
    const lastTimeline = getMostRecentTimeline();
    const mold = {
      style: {
        colors: {
          background: 'rgb(33, 150, 243)',
          foreground: 'white',
          iconBackground: 'rgb(33, 150, 243)',
          iconForeground: 'white',
        },
        iconName: undefined
      },
      content: {
        title: undefined,
        subtitle: undefined,
        text: "",
        date: undefined
      }
    }
    switch(role) {
      case USER_ROLES.STYLIST:
        if (lastTimeline.status === SAMPLE_STATUS.NEW) {
          mold.style.iconName = "PatchQuestionFill";
          mold.content.title    = "End Current Task"
          mold.content.subtitle = `to: ${USER_ROLES.MANAGER}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_REVIEW)}>Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.EDIT) {
          mold.style.iconName = "PatchQuestionFill";
          mold.content.title    = "End Current Task"
          mold.content.subtitle = `to: ${USER_ROLES.MANAGER}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_REVIEW)}>Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        break;
      case USER_ROLES.MANAGER:
        if (lastTimeline.status === SAMPLE_STATUS.IN_REVIEW) {
          mold.style.iconName = "PatchQuestionFill";
          mold.content.title    = "End Current Task"
          mold.content.subtitle = `to: ${USER_ROLES.MODELIST} or to ${USER_ROLES.STYLIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.EDIT)}>Reject</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_DEVELOPMENT)}>Approve</span>
                                  </div>
          tempTimeline.push(mold)
        }
        break;
    }
    /**
     * end of task logic
     */
    for (let i = 0; i < sample.timeline.length; i++) {
      const { iconName, title } = getIconNameFromStatus(sample.timeline[i]);
      tempTimeline.push({
        style: {
          colors: {
            background: 'var(--primary-color)',
            foreground: 'white',
            iconBackground: 'var(--primary-color)',
            iconForeground: 'white',
          },
          iconName: iconName // "NodePlusFill"
        },
        content: {
          title: title,
          subtitle: `by: ${sample.timeline[i].user.role}: ${sample.timeline[i].user.name}`,
          text: "",
          date: sample.timeline[i].timestamp
        }
      })
    }
    setTimelineList(tempTimeline)
  },[])

  const changeStatusTo = async (newStatus) => {
    const res = await put(apiFetch, `/api/samples/${sample.id}`, {
      status: newStatus
    });
    console.log(res)
  }

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
          <span style={{position: "absolute", right: 7, bottom: 0}} onClick={openConversation}>
            <DynamicIcon iconName="ChatFill" size={30} color="#fff" />
          </span>
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
              { (role === USER_ROLES.STYLIST) &&
                <button className="btn-add-image" onClick={addImageToSample}>
                  <BuildingFillAdd color="white" size={20} />
                </button>
              }
            </div>
            <div style={{maxWidth: 80}}>
                <ButtonSliderWrapper>
                    <section style={{minWidth: '100%'}}>
                      <img src={sample.image} alt="secondary main-image" className="thumbnail-image active" />
                    </section>
                    <button className="btn-delete-image" onClick={() => deleteImage(sample.id)}>Delete</button>
                </ButtonSliderWrapper>
            </div>
            {
              imageList && imageList.map((image, index) => (
                // {console.log(image)}
                <div style={{maxWidth: 80}} key={index}>
                    <ButtonSliderWrapper key={index}>
                        <section style={{minWidth: '100%'}}>
                          <img src={image.image_url} alt="secondary image" className="thumbnail-image active" />
                        </section>
                        <button className="btn-delete-image" onClick={() => deleteImage(image.id)}>Delete</button>
                    </ButtonSliderWrapper>
                </div>
              ))
            }
        </div>
      </div>
      <section className="sample-details-section">
      <VerticalTimeline>
      {
        timelineList.map((data, index) => 
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            contentStyle={{ background: data.style.colors.background, color: data.style.colors.foreground, "--after-content": `"${data.content.date}"`}}
            contentArrowStyle={{ borderRight: `7px solid  ${data.style.colors.background}` }}
            // date={data.content.date}
            iconStyle={{ background: data.style.colors.iconBackground, color: data.style.colors.iconForeground }}
            icon={<DynamicIcon iconName={data.style.iconName} size={32} color="white" />}
            onClick={() => console.log(data)}
          >
            <h3 className="vertical-timeline-element-title">{data.content.title}</h3>
            <h6 className="vertical-timeline-element-subtitle">{data.content.subtitle}</h6>
            {/* <p>
              {data.content.text}
            </p> */}
            <span className="vertical-timeline-bottom-badge">{data.content.date}</span>
          </VerticalTimelineElement>
        )
      }
      </VerticalTimeline>
      </section>
    </div>
  );
};

export default SampleDetailsPage;
