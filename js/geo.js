var latitude, longitude;
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude, longitude);
    // 在这里继续下一步，将经纬度转化为邮编
  });
} else {
  console.log("浏览器不支持地理位置信息获取。");
}
var apiKey = "YOUR_API_KEY"; // 替换为你的逆地理编码 API 密钥
var apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log("data");
    console.log(data);
    if (data.results.length > 0) {
      var postalCode = data.results[0].components.postcode;
      console.log("用户的邮编是：" + postalCode);
    } else {
      console.log("未能获取用户的邮编。");
    }
  })
  .catch((error) => {
    console.error("获取用户邮编时出错：", error);
  });
