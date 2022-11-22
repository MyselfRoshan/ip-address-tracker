// Input action variables
const SearchBtn = document.querySelector('[type="submit"]');
const ipInput = document.getElementById('ip-address-input');

// Output Action variables
const RequestedIp = document.getElementById('req-ip');
const RequestedLocation = document.getElementById('req-location');
const RequestedTimezone = document.getElementById('req-timezone');
const RequestedISP = document.getElementById('req-isp');

// Function to call leaflet api to pinpoint ip address with longituse and latitude
function LeafletMap(longitude, latitude) {
  var map;
  const blackIcon = L.icon({
    iconUrl: '/assets/images/icon-location.svg',
    iconSize: [50, 65],
  });
  // If map is already initialized reset the map variable
  var container = L.DomUtil.get('map');
  if (container != null) {
    container._leaflet_id = null;
  }
  // Initialized the map with latituse and longitiude parameter of the function
  map = new L.map('map').setView([latitude, longitude], 15);
  // Add the customized blackIcon marker to the map with popup message giving user,s latitude and longitude info
  L.marker([latitude, longitude], { icon: blackIcon })
    .addTo(map)
    .bindPopup(
      `<b>longitutude:</b> ${longitude}<br><b>latitude:</b> ${latitude}`,
    )
    .openPopup();
  // Add a circle around the marker with custom color,radius and fill color
  L.circle([latitude, longitude], {
    color: '#5977df',
    fillColor: '#4c52b2',
    fillOpacity: 0.2,
    radius: 500,
  }).addTo(map);
  // Finally add map to the html doc
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

// Function to map the json data to the respective html elements
function resultInHTML(ip, location, isp) {
  RequestedIp.innerText = `${ip}`;
  RequestedLocation.innerText = `${location.region}, ${location.country}`;
  RequestedTimezone.innerText = `UTC ${location.timezone}`;
  RequestedISP.innerText = `${isp}`;

  const long = location.lng;
  const lat = location.lat;
  LeafletMap(long, lat);
}

// Function to call the api
function ipAddressGrabber(API_URL) {
  fetch(API_URL)
    .then((response) => {
      return response.ok ? response.json() : Promise.reject(response);
    })
    .then((data) => {
      // Passing ip,locationa and isp property of data obj
      console.log(data);
      resultInHTML(data['ip'], data['location'], data['isp']);
    })
    .catch((error) => alert('Something went wrong' + error));
}

// Function to search inputed data and display data on click
SearchBtn.addEventListener('click', () => {
  // IP Geolocation API (ipify) url brekdown variables for future use
  const apiBase_Url = 'https://geo.ipify.org/api';
  const apiVersion = 'v2';
  const apiType = 'country,city';
  const apiKey = 'at_Idc78NT5gMG1l8VUYQE52sAOuzNIV';
  let passedInIpAddress = '';
  // Assign entered domain or ip address to passedInIpAddress variable
  passedInIpAddress = ipInput.value;
  console.log(passedInIpAddress);
  // Create the full API_URL from above variables
  const API_URL = `${apiBase_Url}/${apiVersion}/${apiType}?apiKey=${apiKey}&ipAddress=${passedInIpAddress}`;
  // Call ipAddressGrabber() function
  ipAddressGrabber(API_URL);
});

// Generate random No between 1 and -1
const random_sign = Math.cos(Math.PI * Math.random());
// Assign randomly generated random_sign to map when window is loaded
window.onload = LeafletMap(random_sign * 90, random_sign * 180);
