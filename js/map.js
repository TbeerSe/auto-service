(function () {
  'use strict';

  var el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;

  var LAT = 55.7558;
  var LNG = 37.6173;
  var ADDRESS = 'Москва, ул. Автомобильная, 15';

  var map = L.map(el, {
    center: [LAT, LNG],
    zoom: 15,
    scrollWheelZoom: false,
    zoomControl: true
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 3,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var pin = L.divIcon({
    className: 'map-pin',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12]
  });

  L.marker([LAT, LNG], { icon: pin })
    .addTo(map)
    .bindPopup('<strong>АвтоПрофи</strong><br>' + ADDRESS)
    .openPopup();

  // Enable scroll zoom on click
  map.on('click', function () { map.scrollWheelZoom.enable(); });
  map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

  // Fix render after page load
  window.addEventListener('load', function () {
    setTimeout(function () { map.invalidateSize(); }, 200);
  });
})();
