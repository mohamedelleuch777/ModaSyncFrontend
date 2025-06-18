import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PromptToast from "./components/PromptToast";

let API_BASE_URL = '';

switch (window.location.host) {
  case "localhost":
  case "127.0.0.1":
  case "localhost:5173":
  case "127.0.0.1:5173":
    API_BASE_URL = 'http://localhost:9613/api/v1';
    break;

  default:
    const hostWithoutPort = window.location.hostname;
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    
    if (ipRegex.test(hostWithoutPort)) {
      API_BASE_URL = `http://${hostWithoutPort}:9613/api/v1`;
    } else {
      API_BASE_URL = 'https://api-modasync.xilyor.com/api/v1';
    }
    break;
}

export { API_BASE_URL };
// export const API_BASE_URL = 'https://api-modasync.xilyor.com/api/v1';
export const IMAGE_SOURCE_URL = 'https://static.xilyor.com';
export const FORCE_HTTPS = true;
export const IMAGE_SOURCE_PATHNAME = '/736x/g*';
export const DEFAULT_TIMEOUT = 5000;
export const USER_ROLES = {
    // 'Stylist', 'Manager', 'Modelist', 'ExecutiveWorker', 'Tester', 'ProductionResponsible'
  MANAGER: 'Manager',
  MODELIST: 'Modelist',
  STYLIST: 'Stylist',
  EXECUTIVE_WORKER: 'ExecutiveWorker',
  TESTER: 'Tester',
  PRODUCTION_RESPONSIBLE: 'ProductionResponsible'
};
export const SAMPLE_STATUS = {
  // 'new',                  // responsable: stylist
  // 'edit',                 // responsable: stylist
  // 'in_review',            // responsable: Manager
  // 'in_development',       // responsable: Modelist
  // 'development_done',     // responsable: Stylist
  // 'external_task',        // responsable: Stylist
  // 'external_task_done',   // responsable: Stylist
  // 'in_production',        // responsable: ExecutiveWorker
  // 'testing',              // responsable: Tester
  // 'accepted',             // responsable: Modelist
  // 'rejected',             // responsable: isActive = false
  // 'readjustment',         // responsable: Modelist
  // 'cut_phase',            // responsable: Modelist
  // 'preparing_traces',     // responsable: Modelist
  // 'ready'                 // responsable: isActive = false  
  NEW: 'new',
  EDIT: 'edit',
  IN_REVIEW: 'in_review',
  IN_DEVELOPMENT: 'in_development',
  DEVELOPMENT_DONE: 'development_done',
  EXTERNAL_TASK: 'external_task',
  EXTERNAL_TASK_DONE: "external_task_done",
  IN_PRODUCTION: 'in_production',
  TESTING: 'testing',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  READJUSTMENT: 'readjustment',
  CUT_PHASE: 'cut_phase',
  PREPARING_TRACES: 'preparing_traces',
  GETTING_PROD_INFO: 'getting_prod_info',
  READY: 'ready'
}
export const APP_TITLE = "ModaSync";
export const APP_VERSION = "1.5.56";

export const getIconNameFromStatus = (timeline) => {
    switch (timeline.status) {
      case SAMPLE_STATUS.NEW:
        return {iconName: "NodePlusFill", title: "New Sample", status: SAMPLE_STATUS.NEW};
      case SAMPLE_STATUS.EDIT:
        return {iconName: "Exposure", title: "Edit Sample", status: SAMPLE_STATUS.EDIT};
      case SAMPLE_STATUS.IN_REVIEW:
        return {iconName: "Eyeglasses", title: "In Review", status: SAMPLE_STATUS.IN_REVIEW};
      case SAMPLE_STATUS.IN_DEVELOPMENT:
        return {iconName: "FileDiffFill", title: "Under Development", status: SAMPLE_STATUS.IN_DEVELOPMENT};
      case SAMPLE_STATUS.DEVELOPMENT_DONE:
        return {iconName: "FileCodeFill", title: "Development Done", status: SAMPLE_STATUS.DEVELOPMENT_DONE};
      case SAMPLE_STATUS.EXTERNAL_TASK_DONE:
        return {iconName: "FileCodeFill", title: "External Task Done", status: SAMPLE_STATUS.EXTERNAL_TASK_DONE};
      case SAMPLE_STATUS.EXTERNAL_TASK:
        return {iconName: "BoxArrowUpLeft", title: "External Task", status: SAMPLE_STATUS.EXTERNAL_TASK};
      case SAMPLE_STATUS.IN_PRODUCTION:
        return {iconName: "FiletypeExe", title: "In Production", status: SAMPLE_STATUS.IN_PRODUCTION};
      case SAMPLE_STATUS.TESTING:
        return {iconName: "BracesAsterisk", title: "Testing", status: SAMPLE_STATUS.TESTING};
      case SAMPLE_STATUS.ACCEPTED:
        return {iconName: "BookmarkCheckFill", title: "Accepted", status: SAMPLE_STATUS.ACCEPTED};
      case SAMPLE_STATUS.REJECTED:
        return {iconName: "BookmarkXFill", title: "Rejected", status: SAMPLE_STATUS.REJECTED};
      case SAMPLE_STATUS.READJUSTMENT:
        return {iconName: "WrenchAdjustableCircleFill", title: "Readjustment", status: SAMPLE_STATUS.READJUSTMENT};
      case SAMPLE_STATUS.CUT_PHASE:
        return {iconName: "Scissors", title: "In Cut Phase", status: SAMPLE_STATUS.CUT_PHASE};
      case SAMPLE_STATUS.PREPARING_TRACES:
        return {iconName: "SignRailroadFill", title: "Preparing Traces", status: SAMPLE_STATUS.PREPARING_TRACES};
      case SAMPLE_STATUS.GETTING_PROD_INFO:
        return {iconName: "InfoCircleFill", title: "Getting Production Info", status: SAMPLE_STATUS.GETTING_PROD_INFO};
      case SAMPLE_STATUS.READY:
        return {iconName: "BookmarkStarFill", title: "Ready", status: SAMPLE_STATUS.READY};
      default:
        return {iconName: "Ban", title: "Unknown Status", status: null};
    }
  }

  export const isNextTaskMine = (timeline) => {
    const token = jwtDecode(localStorage.getItem('token'));
    const role = token.role;
    switch(role) {
      case USER_ROLES.STYLIST:
        if (timeline.status === SAMPLE_STATUS.NEW) {
          return true;
        }
        else if (timeline.status === SAMPLE_STATUS.EDIT) {
          return true;
        }
        else if (timeline.status === SAMPLE_STATUS.DEVELOPMENT_DONE ||
                  timeline.status === SAMPLE_STATUS.EXTERNAL_TASK_DONE
        ) {
          return true;
        }
        else if (timeline.status === SAMPLE_STATUS.EXTERNAL_TASK) {
          return true;
        }
        break;
      case USER_ROLES.MANAGER:
        if (timeline.status === SAMPLE_STATUS.IN_REVIEW) {
          return true;
        }
        break;
      case USER_ROLES.MODELIST:
        if (timeline.status === SAMPLE_STATUS.IN_DEVELOPMENT ||
            timeline.status === SAMPLE_STATUS.READJUSTMENT) {
              return true;
        }
        else if (timeline.status === SAMPLE_STATUS.CUT_PHASE) {
          return true;
        }
        else if (timeline.status === SAMPLE_STATUS.PREPARING_TRACES) {
          return true;
        }
        break;
      case USER_ROLES.EXECUTIVE_WORKER:
        if (timeline.status === SAMPLE_STATUS.IN_PRODUCTION) {
          return true;
        }
        break;
      case USER_ROLES.TESTER:
        if (timeline.status === SAMPLE_STATUS.TESTING) {
          return true;
        }
        break;
      case USER_ROLES.PRODUCTION_RESPONSIBLE:
        if (timeline.status === SAMPLE_STATUS.GETTING_PROD_INFO) {
          return true;
        }
        break;
    }
  }

  export const messageBox = (msg, type = "info") => {
    
    const types = {
      success: toast.success,
      error: toast.error,
      warning: toast.warn,
      info: toast.info,
    };
  
    (types[type] || toast.info)(msg);
  }

  export const inputBox = (label, onSubmit) => {
    // Create overlay manually in DOM
    // const overlay = document.createElement('div');
    // overlay.className = 'prompt-toast-overlay';
    // document.body.appendChild(overlay);
    const overlay = document.createElement('div');
    const toastElement = document.querySelector('#toast');
    const waitForToastThenAddOverlay = () => {
      const observer = new MutationObserver((mutations, obs) => {
        
        if (toastElement) {
          // ✅ Create overlay
          overlay.className = 'prompt-toast-overlay';
          // ✅ Insert overlay before the toast element
          toastElement.parentNode.insertBefore(overlay, toastElement);
          // ✅ Stop observing
          obs.disconnect();
        }
      });
    
      // Start observing the document for DOM changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    };

    waitForToastThenAddOverlay();

    toast((t) => (
      <PromptToast 
        label={label}
        closeToast={
          () => { 
            toast.dismiss(t.id); 
            document.body.removeChild(overlay); 
          }
        }
        onSubmit={(value) => {
          onSubmit(value);
           (document.body.contains(overlay)) && document.body.removeChild(overlay); // remove overlay manually
        }}
      />
    ), {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });
  };
  
  export const formatUrl = (paramImageURL) => {
    let imageUrl = paramImageURL;
    if (imageUrl && FORCE_HTTPS) {
      imageUrl =  imageUrl.replace('http:', '');
      imageUrl = "https:" + imageUrl;
    }
    return imageUrl;
  }

  export function notifyApp({ title, text }){
    const message = {
      action: "showNotification",
      payload: {
        title,
        text
      }
    };
  
    window.parent.postMessage(message, "*");
};