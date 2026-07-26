import ReactGA from 'react-ga4';

/**
 * Initialize Google Analytics
 * Replace 'G-XXXXXXXXXX' with your actual Measurement ID from Google Analytics.
 */
export const initGA = () => {
  const measurementId = 'G-XXXXXXXXXX'; 
  
  if (measurementId !== 'G-XXXXXXXXXX') {
    ReactGA.initialize(measurementId);
  } else {
    console.warn('Google Analytics Measurement ID is missing. Analytics is disabled.');
  }
};

/**
 * Send a pageview event
 * @param {string} path - The page path (e.g., '/portfolio')
 */
export const logPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};
