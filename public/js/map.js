mapboxgl.accessToken = mapToken;
console.log(coordinates);
let defaultCoordinates = coordinates.length ? coordinates : [77.2088, 28.6139];
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: defaultCoordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(defaultCoordinates)
  .setPopup(new mapboxgl.Popup().setHTML("<p>Exact Location To Be Provided After Booking</p>"))
  .addTo(map);
