// src/constants.js
// export const API_BASE_URL = 'http://192.168.0.100:9613';
export const API_BASE_URL = 'http://api-modasync.xilyor.com';
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
    // 'new',              
    // 'in_review',        
    // 'in_development',   
    // 'development_done', 
    // 'external_task',    
    // 'in_production',    
    // 'testing',          
    // 'accepted',         
    // 'rejected',         
    // 'readjustment',     
    // 'cut_phase',        
    // 'preparing_traces', 
    // 'ready'    
  NEW: 'new',
  IN_REVIEW: 'in_review',
  IN_DEVELOPMENT: 'in_development',
  DEVELOPMENT_DONE: 'development_done',
  EXTERNAL_TASK: 'external_task',
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
