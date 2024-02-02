let map;
const locations1 = [
    { lat: -31.56391, lng: 147.154312 },
    { lat: -33.718234, lng: 150.363181 },
    { lat: -33.727111, lng: 150.371124 },
    { lat: -33.848588, lng: 151.209834 },
    { lat: -33.851702, lng: 151.216968 },
    { lat: -34.671264, lng: 150.863657 },
    { lat: -35.304724, lng: 148.662905 },
    { lat: -36.817685, lng: 175.699196 },
    { lat: -36.828611, lng: 175.790222 },
    { lat: -37.75, lng: 145.116667 },
    { lat: -37.759859, lng: 145.128708 },
    { lat: -37.765015, lng: 145.133858 },
    { lat: -37.770104, lng: 145.143299 },
    { lat: -37.7737, lng: 145.145187 },
    { lat: -37.774785, lng: 145.137978 },
    { lat: -37.819616, lng: 144.968119 },
    { lat: -38.330766, lng: 144.695692 },
    { lat: -39.927193, lng: 175.053218 },
    { lat: -41.330162, lng: 174.865694 },
    { lat: -42.734358, lng: 147.439506 },
    { lat: -42.734358, lng: 147.501315 },
    { lat: -42.735258, lng: 147.438 },
    { lat: -43.999792, lng: 170.463352 },
];

// fetch and store codes

async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
        "marker",
    );
    const codes = await fetch("./burbank/codes.json")
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("codes", JSON.stringify(data));
            return data;
        })
        .catch((error) => {
            console.error("Error fetching codes: ", error);
            return [];
        });
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 34.180732, lng: -118.320883 },
        mapId: "mapForUniuni",
    });
    const pos = { lat: 34.180732, lng: -118.320883 };
    console.log(pos);
    const refreshMap = setInterval(function() {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (pos.lat != position.coords.latitude || pos.lat != position.coords.latitude) {
                        pos.lat = position.coords.latitude;
                        pos.lng = position.coords.longitude;
                        map.setCenter(pos);
                    }
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                },
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
            clearInterval(refreshMap);
        }
    }, 2000)

    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    });
    // Create an array of alphabetical characters used to label the markers.
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // Add some markers to the map.'
    console.log(typeof codes);
    const markers = codes.map((code, i) => {
        const label = labels[i % labels.length];
        const pinGlyph = new google.maps.marker.PinElement({
            glyph: label,
            glyphColor: "white",
        });
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: code.location,
            content: pinGlyph.element,
            map: map
        });

        // markers can only be keyboard focusable when they have click listeners
        // open info window when marker is clicked
        marker.addListener("click", () => {
            infoWindow.setContent(code.code_help);
            infoWindow.open(map, marker);
        });
        return marker;
    });

}


initMap();