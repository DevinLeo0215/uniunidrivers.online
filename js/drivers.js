// fetch and store codes
fetch("./burbank/drivers.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("drivers", JSON.stringify(data));
    renderDrivers();
  })
  .catch((error) => {
    renderDrivers();
  });

// Call the txtToJson function to fetch and store the data
function renderDrivers() {
  const drivers = JSON.parse(localStorage.getItem("drivers"));
  if (!drivers) {
    console.error("bad net and none local save drivers");
    return false;
  }
  const accordionBox = document.querySelector("#accordionBox");
  const eleClone = accordionBox
    .querySelector(".accordion-item")
    .cloneNode(true);
  accordionBox.innerHTML = "";
  drivers.forEach((element, i) => {
    let accordionItem = eleClone.cloneNode(true);
    let heading = accordionItem.querySelector("#heading");
    let accordionButton = heading.querySelector(".accordion-button");
    let collapseWrap = accordionItem.querySelector("#collapseWrap");
    let headingId = heading.getAttribute("id") + i;
    let collapseWrapId = collapseWrap.getAttribute("id") + i;
    heading.setAttribute("id", headingId);
    collapseWrap.setAttribute("id", collapseWrapId);
    collapseWrap.setAttribute("aria-labelledby", headingId);
    accordionButton.setAttribute("data-bs-target", "#" + collapseWrapId);
    accordionButton.setAttribute("aria-controls", collapseWrapId);
    for (let key in element) {
      let eleKey = accordionItem.querySelector("." + key);
      if (eleKey) {
        eleKey.innerHTML = element[key];
      }
    }
    accordionBox.append(accordionItem);
  });
}
