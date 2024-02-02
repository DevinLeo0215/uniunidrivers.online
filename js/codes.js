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
    const pos = { lat: 34.2317337, lng: -118.4711903 };
    try {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                pos.lat = position.coords.latitude;
                pos.lng = position.coords.longitude;
                console.log(pos);
            },
            () => {},
        );
    } catch (err) {
        console.log(err);
    }
    console.log(pos);
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: pos,
        mapId: "mapForUniuni",
    });
    const refreshMap = setInterval(function() {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    pos.lat = position.coords.latitude;
                    pos.lng = position.coords.longitude;
                    map.setCenter(pos);
                    clearInterval(refreshMap);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                },
            );
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }, 1000)

    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    });

    // Add some markers to the map.'
    const markers = codes.map((code, i) => {
        let ele = document.createElement("h3");
        ele.innerText = code.code_help ? code.code_help : "...";
        const pinGlyph = new google.maps.marker.PinElement({
            glyph: ele,
            glyphColor: "black",
            scale: 4,
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
            infoWindow.setContent(code.code_help);
            infoWindow.open(map, marker);
        });
        return marker;
    });

}


initMap();