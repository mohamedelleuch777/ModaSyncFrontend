import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { BuildingFillAdd, InfoCircleFill, XLg, ZoomIn } from "react-bootstrap-icons";
import DynamicIcon from "../../components/DynamicIcon";
import ZoomableImage from "../../components/ZoomableImage";
import ButtonSliderWrapper from "../../components/ButtonSliderWrapper";
import DimensionsPopup from "../../components/DimensionsPopup";
import ExternalTaskPopup from "../../components/ExternalTaskPopup";
import { useApi, get, del, put, post } from "../../hooks/apiHooks";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { jwtDecode } from "jwt-decode";
import { SAMPLE_STATUS, USER_ROLES, formatUrl, getIconNameFromStatus, inputBox, messageBox } from "../../constants";
import { format } from "date-fns";
import { enGB, fr } from "date-fns/locale"; // Import French locale

const SampleDetailsPage = () => {
  const { state: { sample } } = useLocation();
  if(!sample) {
    return <>loading...</>;
  }
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
  const [cssPrimaryColor, setCssPrimaryColor] = useState(null);
  const [cssQuaternaryColor, setCssQuaternaryColor] = useState(null);
  const [showDimensionsPopup, setShowDimensionsPopup] = useState(false);
  const [currentDimensions, setCurrentDimensions] = useState({ width: '', height: '', id: '' });
  const [showExternalTaskPopup, setShowExternalTaskPopup] = useState(false);

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

  function formatTimestamp(timestamp) {
    return format(new Date(timestamp), "📅 EEE dd-MM-yyyy ⌚ HH:mm", { locale: enGB });
  }

  const makeZoom = () => {
    zoomWindowImageRef.current.src = mainImageRef.current.src
    setIsShowZoomWindow(true)
  }

  const fetchSamples_Images = async () => {
    const images = await get(apiFetch, `/pictures/${sample.id}`, {});
    setImageList(images);
  }

  const addImageToSample = (e) => {
    e.preventDefault();
    navigate('/add-image-sample', { state: {selectedSample: sample} });
  }

  const deleteImage = async (imageId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Image?");
    if (!confirmDelete) return;
    await del(apiFetch, `/pictures/${imageId}`, {});
    fetchSamples_Images();
  }

  const openConversation = () => {
    navigate('/conversation', { state: { sample} });
  }

  const getMostRecentTimeline = () => {
    if (sample.timeline.length > 0) {
      return sample.timeline[0];
    }
    return null;
  }

  const hasReadjustmentInHistory = () => {
    return sample.timeline.some(timeline => timeline.status === SAMPLE_STATUS.READJUSTMENT);
  }

  const readCssVariables = () => {
    const rootStyle = getComputedStyle(document.documentElement);
    const primaryColor = rootStyle.getPropertyValue("--primary-color").trim();
    const quaternaryColor = rootStyle.getPropertyValue("--quaternary-color").trim();
    setCssPrimaryColor(primaryColor);
    setCssQuaternaryColor(quaternaryColor);
  }

  React.useEffect(() => {
    readCssVariables();
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
          background: 'var(--quaternary-color)',
          foreground: 'white',
          iconBackground: 'var(--quaternary-color)',
          iconForeground: 'white'
        },
        iconName: "PatchQuestionFill"
      },
      content: {
        title: "End Current Task",
        subtitle: undefined,
        text: "",
        date: undefined
      },
      classes: {
        badge: 'next-task'
      }
    }
    switch(role) {
      case USER_ROLES.STYLIST:
        if (lastTimeline.status === SAMPLE_STATUS.NEW) {
          mold.content.subtitle = `to: ${USER_ROLES.MANAGER}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_REVIEW)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.EDIT) {
          mold.content.subtitle = `to: ${USER_ROLES.MANAGER}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_REVIEW)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.DEVELOPMENT_DONE ||
                 lastTimeline.status === SAMPLE_STATUS.EXTERNAL_TASK_DONE
        ) {
          mold.content.subtitle = `to: ${USER_ROLES.STYLIST} or ${USER_ROLES.EXECUTIVE_WORKER} `;
          mold.content.date     = <div>
                                    <span onClick={() => handleExternalTaskSelection()}>↖️ External Task</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_PRODUCTION)}>⏭️ Execution</span>
                                    {hasReadjustmentInHistory() && (
                                      <span onClick={() => changeStatusTo(SAMPLE_STATUS.TESTING)}>🚀 Skip to Testing</span>
                                    )}
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.EXTERNAL_TASK) {
          mold.content.subtitle = `to: ${USER_ROLES.STYLIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.EXTERNAL_TASK_DONE)}>🔚 End External Task</span>
                                  </div>
          tempTimeline.push(mold)
        }
        break;
      case USER_ROLES.MANAGER:
        if (lastTimeline.status === SAMPLE_STATUS.IN_REVIEW) {
          mold.content.subtitle = `to: ${USER_ROLES.MODELIST} or to ${USER_ROLES.STYLIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.EDIT)}>❌ Reject</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_DEVELOPMENT)}>✅ Approve</span>
                                  </div>
          tempTimeline.push(mold)
        }
        break;
      case USER_ROLES.MODELIST:
        if (lastTimeline.status === SAMPLE_STATUS.IN_DEVELOPMENT ||
            lastTimeline.status === SAMPLE_STATUS.READJUSTMENT) {
          mold.content.subtitle = `to: ${USER_ROLES.STYLIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.DEVELOPMENT_DONE)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.CUT_PHASE) {
          mold.content.subtitle = `to: ${USER_ROLES.MODELIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.READY)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.PREPARING_TRACES) {
          mold.content.subtitle = `to: ${USER_ROLES.MANAGER}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.CUT_PHASE)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        break;
      case USER_ROLES.EXECUTIVE_WORKER:
        if (lastTimeline.status === SAMPLE_STATUS.IN_PRODUCTION) {
          mold.content.subtitle = `to: ${USER_ROLES.TESTER}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.TESTING)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        break;
      case USER_ROLES.TESTER:
        if (lastTimeline.status === SAMPLE_STATUS.TESTING) {
          mold.content.subtitle = `to: ${USER_ROLES.PRODUCTION_RESPONSIBLE} or ${USER_ROLES.MODELIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.GETTING_PROD_INFO)}>✅ Confirm</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.READJUSTMENT)}>📏 Readjust</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.REJECTED)}>❌ Reject</span>
                                  </div>
          tempTimeline.push(mold)
        }
        break;
      case USER_ROLES.PRODUCTION_RESPONSIBLE:
        if (lastTimeline.status === SAMPLE_STATUS.GETTING_PROD_INFO) {
          mold.content.subtitle = `to: ${USER_ROLES.MODELIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => handleDimensionsEntry()}>📏 Enter Dimensions</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.PREPARING_TRACES)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        break;
      case USER_ROLES.JOKER:
        // JOKER can perform any action based on current status
        if (lastTimeline.status === SAMPLE_STATUS.NEW) {
          mold.content.subtitle = `to: ${USER_ROLES.MANAGER}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_REVIEW)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.EDIT) {
          mold.content.subtitle = `to: ${USER_ROLES.MANAGER}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_REVIEW)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.IN_REVIEW) {
          mold.content.subtitle = `to: ${USER_ROLES.MODELIST} or to ${USER_ROLES.STYLIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.EDIT)}>❌ Reject</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_DEVELOPMENT)}>✅ Approve</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.IN_DEVELOPMENT ||
                 lastTimeline.status === SAMPLE_STATUS.READJUSTMENT) {
          mold.content.subtitle = `to: ${USER_ROLES.STYLIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.DEVELOPMENT_DONE)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.DEVELOPMENT_DONE ||
                 lastTimeline.status === SAMPLE_STATUS.EXTERNAL_TASK_DONE) {
          mold.content.subtitle = `to: ${USER_ROLES.STYLIST} or ${USER_ROLES.EXECUTIVE_WORKER} `;
          mold.content.date     = <div>
                                    <span onClick={() => handleExternalTaskSelection()}>↖️ External Task</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.IN_PRODUCTION)}>⏭️ Execution</span>
                                    {hasReadjustmentInHistory() && (
                                      <>
                                      <span onClick={() => changeStatusTo(SAMPLE_STATUS.TESTING)}>🚀 Skip to Testing</span>
                                      </>
                                    )}
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.EXTERNAL_TASK) {
          mold.content.subtitle = `to: ${USER_ROLES.STYLIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.EXTERNAL_TASK_DONE)}>🔚 End External Task</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.IN_PRODUCTION) {
          mold.content.subtitle = `to: ${USER_ROLES.TESTER}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.TESTING)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.TESTING) {
          mold.content.subtitle = `to: ${USER_ROLES.PRODUCTION_RESPONSIBLE} or ${USER_ROLES.MODELIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.GETTING_PROD_INFO)}>✅ Confirm</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.READJUSTMENT)}>📏 Readjust</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.REJECTED)}>❌ Reject</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.GETTING_PROD_INFO) {
          mold.content.subtitle = `to: ${USER_ROLES.MODELIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => handleDimensionsEntry()}>📏 Enter Dimensions</span>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.PREPARING_TRACES)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.CUT_PHASE) {
          mold.content.subtitle = `to: ${USER_ROLES.MODELIST}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.READY)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
        else if (lastTimeline.status === SAMPLE_STATUS.PREPARING_TRACES) {
          mold.content.subtitle = `to: ${USER_ROLES.MANAGER}`;
          mold.content.date     = <div>
                                    <span onClick={() => changeStatusTo(SAMPLE_STATUS.CUT_PHASE)}>✅ Confirm</span>
                                  </div>
          tempTimeline.push(mold)
        }
      break;
    }
    /**
     * end of task logic
     */
    for (let i = 0; i < sample.timeline.length; i++) {
      const { iconName, title, status } = getIconNameFromStatus(sample.timeline[i]);
      
      // Create subtitle with external provider info if it's an external task
      let subtitle = `by: ${sample.timeline[i].user.role}: ${sample.timeline[i].user.name}`;
      if (sample.timeline[i].status === 'external_task' && sample.timeline[i].provider_name) {
        subtitle += ` → 🏢 ${sample.timeline[i].provider_name}`;
      }
      
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
          subtitle: subtitle,
          text: "",
          date: formatTimestamp(sample.timeline[i].timestamp),
          comment: sample.timeline[i].comment
        },
        classes: {
          badge: status+"-badge" // === SAMPLE_STATUS.READY ? "ready-badge" : (status === SAMPLE_STATUS.NEW ? "new-badge" : "")
        }
      })
    }
    setTimelineList(tempTimeline)
  },[])

  const changeStatusTo = async (newStatus) => {
    inputBox('Add Comment?', async (comment) => {
      const res = await put(apiFetch, `/samples/${sample.id}`, {
        status: newStatus,
        comment
      });
      if (res.error) {
        messageBox(res.error, 'error');
      } else {
        messageBox(res.message);
        navigate(-1);
      }
    })
    
  }

  const fetchDimensions = async () => {
    try {
      const dimensions = await get(apiFetch, `/samples/sample/${sample.id}/dimensions`);
      setCurrentDimensions(dimensions || { width: '', height: '', id: '' });
    } catch (error) {
      console.error('Failed to fetch dimensions:', error);
    }
  };

  const handleDimensionsEntry = async () => {
    await fetchDimensions();
    setShowDimensionsPopup(true);
  };

  const handleDimensionsConfirm = async (dimensions) => {
    try {
      const res = await post(apiFetch, `/samples/sample/${sample.id}/dimensions`, dimensions);
      if (res.error) {
        messageBox(res.error, 'error');
      } else {
        messageBox('Dimensions saved successfully', 'success');
        setCurrentDimensions(dimensions);
        setShowDimensionsPopup(false);
      }
    } catch (error) {
      messageBox('Failed to save dimensions: ' + error.message, 'error');
    }
  };

  const handleDimensionsCancel = () => {
    setShowDimensionsPopup(false);
  };

  const handleExternalTaskSelection = () => {
    setShowExternalTaskPopup(true);
  };

  const handleExternalTaskConfirm = async (selectedProvider) => {
    try {
      inputBox('Add Comment?', async (comment) => {
        console.log('Attempting external task assignment:', {
          sample_id: sample.id,
          provider: selectedProvider,
          comment: comment
        });
        
        // Use the new external provider assignment endpoint
        const statusRes = await put(apiFetch, `/samples/sample/${sample.id}/external-provider`, {
          status: SAMPLE_STATUS.EXTERNAL_TASK,
          external_provider_id: selectedProvider.id,
          comment: comment || `External task assigned to ${selectedProvider.name}`,
          due_date: null // Could add due date picker later
        });
        
        console.log('External task assignment response:', statusRes);
        
        if (statusRes.error) {
          messageBox(statusRes.error, 'error');
          console.error('External task assignment error:', statusRes.error);
        } else {
          messageBox(`Sample assigned to ${selectedProvider.name}`, 'success');
          // Fetch fresh sample data instead of page reload
          try {
            const freshSampleData = await get(apiFetch, `/samples/sample/${sample.id}`);
            console.log('Fresh sample data after assignment:', freshSampleData);
            // Navigate back with fresh data
            navigate('/sample-details', { 
              state: { sample: freshSampleData },
              replace: true 
            });
          } catch (refreshError) {
            console.error('Error fetching fresh data:', refreshError);
            // Fallback to page reload if fresh data fetch fails
            window.location.reload();
          }
        }
      });
    } catch (error) {
      console.error('External task assignment exception:', error);
      messageBox('Failed to assign external task: ' + error.message, 'error');
    }
    setShowExternalTaskPopup(false);
  };

  const handleExternalTaskCancel = () => {
    setShowExternalTaskPopup(false);
  };

  if(!sample) {
    return <div>Loading...</div>
  }

  return (
    <div className="sample-details-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="sample-details-upper-images-container">
        <img 
          ref={mainImageRef} 
          src={formatUrl(sample.image)}
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
                      <img src={formatUrl(sample.image)} alt="secondary main-image" className="thumbnail-image active" />
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
                          <img src={formatUrl(image.image_url)} alt="secondary image" className="thumbnail-image active" />
                        </section>
                        <button className="btn-delete-image" onClick={() => deleteImage(image.id)}>Delete</button>
                    </ButtonSliderWrapper>
                </div>
              ))
            }
        </div>
      </div>
      <section className="sample-details-section">
        <div className="bottom-overlay-shadow"></div>
        <VerticalTimeline
          layout="1-column-left"
          lineColor={cssPrimaryColor} 
        >
          {
            timelineList.map((data, index) => 
              <VerticalTimelineElement
                key={index}
                className={"vertical-timeline-element--work " + data.classes.badge}
                contentStyle={{ background: data.style.colors.background, color: data.style.colors.foreground, "--after-content": `"${data.content.date}"`}}
                contentArrowStyle={{ borderRight: `7px solid  ${data.style.colors.background}` }}
                // date={data.content.date}
                iconStyle={{ background: data.style.colors.iconBackground, color: data.style.colors.iconForeground }}
                icon={<DynamicIcon iconName={data.style.iconName} size={32} color="white" />}
                onClick={() => console.log(data)}
              >
                <h3 className="vertical-timeline-element-title">
                  {data.content.title}
                  {data.content.comment && data.content.comment !== '' && 
                    <InfoCircleFill 
                      size={20} 
                      style={{position: 'relative', top: -2, left: 5}}
                      onClick={() => messageBox(data.content.comment)}
                    />
                  }
                </h3>
                <h6 className="vertical-timeline-element-subtitle">{data.content.subtitle}</h6>
                {/* <p>
                  {data.content.text}
                </p> */}
                <span className="vertical-timeline-bottom-badge">{data.content.date}</span>
              </VerticalTimelineElement>
            )
          }
          <EmptyElementN_Times count={1} /> 
        </VerticalTimeline>
      </section>

      <DimensionsPopup
        isOpen={showDimensionsPopup}
        onClose={handleDimensionsCancel}
        onConfirm={handleDimensionsConfirm}
        initialDimensions={currentDimensions}
        isEditing={currentDimensions.width !== '' || currentDimensions.height !== '' || currentDimensions.id !== ''}
      />

      <ExternalTaskPopup
        isOpen={showExternalTaskPopup}
        onClose={handleExternalTaskCancel}
        onConfirm={handleExternalTaskConfirm}
      />
    </div>
  );
};

export default SampleDetailsPage;


const EmptyElementN_Times = ({ count }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <VerticalTimelineElement
        key={index} // Unique key for React
        className="vertical-timeline-element--work last-child"
        contentStyle={{ background: "#fff", color: "#fff" }}
        iconStyle={{ background: "#fff", color: "#fff" }}
      >
        <h3 className="vertical-timeline-element-title">{" "}</h3>
        <h6 className="vertical-timeline-element-subtitle">{" "}</h6>
        <span className="vertical-timeline-bottom-badge">{" "}</span>
      </VerticalTimelineElement>
      ))}
    </>
  );
};