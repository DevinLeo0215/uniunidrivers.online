function initMap() {
  const center = { lat: 34.1807323, lng: -118.3208831 };
  const locations = [];
  const labels = [];
  const codes = JSON.parse(localStorage.getItem("codes"));
  codes.forEach((element) => {
    locations.push(element.location);
    labels.push(element.address + "|" + element.code_help);
  });
  try {
    navigator.geolocation.getCurrentPosition(function (position) {
      center.lat = position.coords.latitude;
      center.lng = position.coords.longitude;
      synInitMap(center, locations, labels);
    });
  } catch (err) {
    synInitMap(center, locations, labels);
  }
  function synInitMap(center, locations, labels) {
    locations.push(center);
    labels.push("YOUR LOCATION");
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: center,
    });
    const infoWindow = new google.maps.InfoWindow({
      content: "",
      disableAutoPan: true,
    });
    // Add some markers to the map.
    const markers = locations.map((position, i) => {
      const label = labels[i];
      const marker = new google.maps.Marker({
        position,
        label,
      });

      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      marker.addListener("click", () => {
        infoWindow.setContent(label);
        infoWindow.open(map, marker);
      });
      return marker;
    });

    // Add a marker clusterer to manage the markers.
    const markerCluster = new markerClusterer.MarkerClusterer({
      map,
      markers,
    });
  }
}
window.initMap = initMap;
