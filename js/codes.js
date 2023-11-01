// fetch and store codes
fetch("./burbank/codes.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("codes", JSON.stringify(data));
  })
  .catch((error) => {
    console.error("Error fetching codes: ", error);
  });
