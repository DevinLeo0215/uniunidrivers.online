// Function to fetch and store remote text file locally
function txtToJson(storeKey, txt_url) {
  fetch(txt_url)
    .then((response) => response.text())
    .then((data) => {
      // Split the text content into an array of lines
      const lines = data.split("\n");

      // Process and store the data
      const jsonData = processLines(lines);
      console.log("jsonData");
      console.log(jsonData);
    })
    .catch((error) => {
      console.error("Error fetching the file: ", error);
    });
  // Function to process the lines
  function processLines(lines) {
    const processedLines = [];
    let keys = lines[0].split("|");
    console.log(keys);
    for (let i = 1; i < lines.length; i++) {
      let values = lines[i].split("|");
      let objLine = {};
      for (let j = 0; j < keys.length; j++) {
        objLine[keys[j]] = values[j];
      }
      processedLines.push(objLine);
    }
    return processedLines;
  }
}

//txtToJson("drivers", "./burbank/drivers.txt");
