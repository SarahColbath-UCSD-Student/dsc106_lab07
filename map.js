// Import Mapbox as an ESM module
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';

// Check that Mapbox GL JS is loaded
console.log('Mapbox GL JS Loaded:', mapboxgl);

// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyYWgtY29sYmF0aC11Y3NkIiwiYSI6ImNtcHg3bnZ1czA3bmwycW91cGkxdmVqcmwifQ.6IRHW-NZSYBbuiL8PppRtg';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // ID of the div where the map will render
  style: 'mapbox://styles/sarah-colbath-ucsd/cmpx8sac600ap01sy9l5i1no1', // Map style
  center: [-71.10577389462593, 42.366522355939864], // [longitude, latitude]
  zoom: 12, // Initial zoom level
  minZoom: 5, // Minimum allowed zoom
  maxZoom: 18, // Maximum allowed zoom
});