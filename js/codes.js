let map, user;

// 更新用户位置和移动方向
function updateUserPosition(position) {
    let userPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    // 如果标记不存在，则创建标记
    if (!user) {
        user = new google.maps.Marker({
            position: userPos,
            map: map,
            title: 'YOU',
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 6,
                rotation: position.coords.heading || 0,
                fillColor: 'blue',
                fillOpacity: 0.8,
                strokeWeight: 2,
                strokeColor: 'black'
            }
        });
    } else {
        // 更新标记的位置和方向
        user.setPosition(userPos);
        user.setIcon({
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            rotation: position.coords.heading || 0,
            fillColor: 'blue',
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: 'black'
        });
    }

    // 将地图中心设置为用户位置
    map.setCenter(userPos);
}
// 处理地理定位错误
function handleLocationError(error) {
    console.error("location error:", error);
}
async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const initCenter = {
        "lat": 34.180732,
        "lng": -118.320883
    };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: initCenter,
        mapId: '658585d5ff90d9e1'
    });
    // 尝试使用 HTML5 地理定位
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(updateUserPosition, handleLocationError);
    } else {
        // 浏览器不支持地理定位
        handleLocationError(false, map.getCenter());
    }
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
                    infoWindow.setContent(`<h3>${code.address}</h3><h4>${code.code_help}</h4><div><img src="helpmages/sample.png"/></div>`);
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
}



initMap();