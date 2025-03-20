// src/constants.js
export const API_BASE_URL = 'http://192.168.1.13:9613';
// export const API_BASE_URL = 'http://api-modasync.xilyor.com';
export const IMAGE_SOURCE_URL = 'http://static.xilyor.com';
export const IMAGE_SOURCE_PATHNAME = '/736x/g*';
export const DEFAULT_TIMEOUT = 5000;
export const USER_ROLES = {
    // 'Stylist', 'Manager', 'Modelist', 'ExecutiveWorker', 'Tester'
  MANAGER: 'Manager',
  MODELIST: 'Modelist',
  STYLIST: 'Stylist',
  EXECUTIVE_WORKER: 'ExecutiveWorker',
  TESTER: 'Tester'
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
  READY: 'ready'
}
export const APP_TITLE = "ModaSync";
export const APP_VERSION = "1.0.0";

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
      case SAMPLE_STATUS.READY:
        return {iconName: "BookmarkStarFill", title: "Ready", status: SAMPLE_STATUS.READY};
      default:
        return {iconName: "Ban", title: "Unknown Status", status: null};
    }
  }