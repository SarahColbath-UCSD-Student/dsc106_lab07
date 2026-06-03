// Import Mapbox as an ESM module
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Check that Mapbox GL JS is loaded
console.log('Mapbox GL JS Loaded:', mapboxgl);

// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyYWgtY29sYmF0aC11Y3NkIiwiYSI6ImNtcHg3bnZ1czA3bmwycW91cGkxdmVqcmwifQ.6IRHW-NZSYBbuiL8PppRtg';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // ID of the div where the map will render
  style: 'mapbox://styles/sarah-colbath-ucsd/cmpx9de7o000001r92cehbir9', // Map style
  center: [-71.10577389462593, 42.366522355939864], // [longitude, latitude]
  zoom: 12, // Initial zoom level
  minZoom: 5, // Minimum allowed zoom
  maxZoom: 18, // Maximum allowed zoom
});

const styling = {
        'line-color': '#ffaa64',  // A bright green using hex code
        'line-width': 2,          // Thicker lines
        'line-opacity': 0.6       // Slightly less transparent
};

map.on('load', async () => {
    map.addSource('boston_route', {
        type: 'geojson',
        data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson',
    });
    map.addSource('cambridge_route', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson',
    });
    map.addLayer({
        id: 'bike-lanes-boston',
        type: 'line',
        source: 'boston_route',
        paint: styling,
    });
    map.addLayer({
        id: 'bike-lanes-cambridge',
        type: 'line',
        source: 'cambridge_route',
        paint: styling
    });


    let jsonData;
    let csvData;
    try {
        const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
        const csvurl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv';
        const jsonData = await d3.json(jsonurl);
        let stations = jsonData.data.stations;
        // Await JSON fetch
        const trips = await d3.csv(csvurl);
        //const trips = csvData.data;
        console.log(trips);
        const departures = d3.rollup(
            trips,
            (v) => v.length,
            (d) => d.start_station_id,
        );
        const arrivals = d3.rollup(
            trips,
            (v) => v.length,
            (d) => d.end_station_id,
        );
        stations = stations.map((station) => {
            let id = station.short_name;
            station.arrivals = arrivals.get(id) ?? 0;
            station.departures = departures.get(id) ?? 0;
            station.totalTraffic = arrivals.get(id) ?? 0 + departures.get(id) ?? 0;
            return station;
        });
        const radiusScale = d3
            .scaleSqrt()
            .domain([0, d3.max(stations, (d) => d.totalTraffic)])
            .range([0, 25]);
        const circles = svg
            .selectAll('circle')
            .data(stations)
            .enter()
            .append('circle')
            .attr('r', d => radiusScale(d.totalTraffic)) // Radius of the circle
            .attr('fill', 'steelblue') // Circle fill color
            .attr('stroke', 'white') // Circle border color
            .attr('stroke-width', 1) // Circle border thickness
            .attr('opacity', 0.8) // Circle opacity
            .each(function (d) {
            // Add <title> for browser tooltips
            d3.select(this)
                .append('title')
                .text(
                `${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`,
                );
            });
        function updatePositions() {
            circles
                .attr('cx', (d) => getCoords(d).cx) // Set the x-position using projected coordinates
                .attr('cy', (d) => getCoords(d).cy); // Set the y-position using projected coordinates
        }
        updatePositions();
        map.on('move', updatePositions); // Update during map movement
        map.on('zoom', updatePositions); // Update during zooming
        map.on('resize', updatePositions); // Update on window resize
        map.on('moveend', updatePositions); // Final adjustment after movement ends


    } catch (error) {
        console.error('Error loading CSV:', error); // Handle errors
    }



    const timeSlider = document.getElementById('slider');
    const selectedTime = document.getElementById('selected-time');
    const anyTimeLabel = document.getElementById('any-time');
    console.log(timeSlider);
    function updateTimeDisplay() {
        timeFilter = Number(timeSlider.value); // Get slider value

        if (timeFilter === -1) {
            selectedTime.textContent = ''; // Clear time display
            anyTimeLabel.style.display = 'block'; // Show "(any time)"
        } else {
            selectedTime.textContent = formatTime(timeFilter); // Display formatted time
            anyTimeLabel.style.display = 'none'; // Hide "(any time)"
        }
    }
    timeSlider.addEventListener('input', updateTimeDisplay);
    updateTimeDisplay();

});

function formatTime(minutes) {
  const date = new Date(0, 0, 0, 0, minutes); // Set hours & minutes
  return date.toLocaleString('en-US', { timeStyle: 'short' }); // Format as HH:MM AM/PM
}


const svg = d3.select('#map').select('svg');

function getCoords(station) {
    const point = new mapboxgl.LngLat(+station.lon, +station.lat); // Convert lon/lat to Mapbox LngLat
    const { x, y } = map.project(point); // Project to pixel coordinates
    return { cx: x, cy: y }; // Return as object for use in SVG attributes
}

function computeStationTraffic(stations, trips) {
  // Compute departures
  const departures = d3.rollup(
    trips,
    (v) => v.length,
    (d) => d.start_station_id,
  );

  // Computed arrivals as you did in step 4.2

  // Update each station..
  return stations.map((station) => {
    let id = station.short_name;
    station.arrivals = arrivals.get(id) ?? 0;
    // what you updated in step 4.2
    return station;
  });
}

