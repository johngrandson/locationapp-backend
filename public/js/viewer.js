let map
let markers = new Map();

document.addEventListener('DOMContentLoaded', () => {
  const socket = io('/')

  socket.on('locationsUpdate', locations => {
    markers.forEach((marker, id) => {
      marker.setMap(null)
      markers.delete(id)
    })

    locations.forEach(([id, position]) => {
      if (position.lat && position.lng) {
        const marker = new google.maps.Marker({
          position: { lat: position.lat, lng: position.lng },
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP
        })
        markers.set(id, marker)
      }
    })
  })

  setInterval(() => {
    socket.emit('requestLocations')
  }, 4000)
})

console.log('BUSLOC', busLoc);

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.open(map);
      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
