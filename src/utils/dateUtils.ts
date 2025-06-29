/**
 * Formats a date string from the backend to a user-friendly format
 * Handles the backend date format "2025-06-29T23:03:39.267"
 */
export const formatDate = (dateString: string): string => {
  try {
    // Handle the backend date format "2025-06-29T23:03:39.267"
    // Add 'Z' to treat it as UTC if no timezone is specified
    const date = new Date(dateString + (dateString.includes('Z') ? '' : 'Z'));
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Formats a date string to show only the date (no time)
 */
export const formatDateOnly = (dateString: string): string => {
  try {
    const date = new Date(dateString + (dateString.includes('Z') ? '' : 'Z'));
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}; 