import { format } from "date-fns";
import { enGB } from "date-fns/locale";

/**
 * Convert server timestamp to Tunisia local time and format it
 * Tunisia timezone: Africa/Tunis (CET/CEST - UTC+1/UTC+2)
 */
export const formatTimestampToTunisiaTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    // Create date object from timestamp
    const date = new Date(timestamp);
    
    // Convert to Tunisia timezone using toLocaleString
    // This will automatically handle DST (Daylight Saving Time)
    const tunisiaTime = new Date(date.toLocaleString("en-US", {
      timeZone: "Africa/Tunis"
    }));
    
    // Format the Tunisia time using date-fns
    return format(tunisiaTime, "📅 EEE dd-MM-yyyy ⌚ HH:mm", { locale: enGB });
  } catch (error) {
    console.error('Error formatting timestamp to Tunisia time:', error);
    return '';
  }
};

/**
 * Convert server timestamp to Tunisia local date only
 */
export const formatDateToTunisiaTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    const tunisiaTime = new Date(date.toLocaleString("en-US", {
      timeZone: "Africa/Tunis"
    }));
    
    return format(tunisiaTime, "dd-MM-yyyy", { locale: enGB });
  } catch (error) {
    console.error('Error formatting date to Tunisia time:', error);
    return '';
  }
};

/**
 * Get current Tunisia time
 */
export const getCurrentTunisiaTime = () => {
  try {
    const now = new Date();
    const tunisiaTime = new Date(now.toLocaleString("en-US", {
      timeZone: "Africa/Tunis"
    }));
    
    return tunisiaTime;
  } catch (error) {
    console.error('Error getting current Tunisia time:', error);
    return new Date();
  }
};

/**
 * Convert server timestamp to Tunisia timezone for comparisons
 * Returns a Date object in Tunisia timezone
 */
export const convertToTunisiaTime = (timestamp) => {
  if (!timestamp) return null;
  
  try {
    const date = new Date(timestamp);
    return new Date(date.toLocaleString("en-US", {
      timeZone: "Africa/Tunis"
    }));
  } catch (error) {
    console.error('Error converting to Tunisia time:', error);
    return new Date(timestamp);
  }
};