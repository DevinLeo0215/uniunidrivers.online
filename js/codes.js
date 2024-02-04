// fetch and store codes

async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const initCenter = { lat: 34.2317337, lng: -118.4711903 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: initCenter,
        mapId: '658585d5ff90d9e1'
    });


    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    })
    fetch("./burbank/codes.json")
        .then((response) => response.json())
        .then((codes) => {
            // Add some markers to the map.'
            const markers = codes.map((code, i) => {
                let ele = document.createElement("h2");
                ele.innerText = code.code_help ? code.code_help : "...";
                const pinGlyph = new google.maps.marker.PinElement({
                    glyph: ele,
                    glyphColor: "black",
                    scale: 3,
                    background: "#FBBC04",
                });
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position: code.location,
                    content: pinGlyph.element,
                    title: code.code_help,
                    map: map
                });

                // markers can only be keyboard focusable when they have click listeners
                // open info window when marker is clicked
                marker.addListener("click", () => {
                    console.log(code);
                    infoWindow.setContent(`<h3>${code.code_help}</h3><h4>${code.address}</h4>`);
                    infoWindow.open(map, marker);
                });
                return marker;
            });
            // Add a marker clusterer to manage the markers.
            console.log("markerClusterer");
            console.log(markerClusterer.MarkerClusterer);
            const markerCluster = new markerClusterer.MarkerClusterer({ markers, map });
        })
        .catch((error) => {
            console.error("Error fetching codes: ", error);
        });
    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            var realtimePosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Center the map on the user's current position
            map.setCenter(realtimePosition);

            // Create a marker for the user's position with a car icon
            var marker = new google.maps.Marker({
                position: realtimePosition,
                map: map,
                title: 'Your Position',
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 6,
                    rotation: position.coords.heading || 0,
                    fillColor: 'green',
                    fillOpacity: 0.8,
                    strokeWeight: 2,
                    strokeColor: 'green'
                }
            });
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }



}
initMap();