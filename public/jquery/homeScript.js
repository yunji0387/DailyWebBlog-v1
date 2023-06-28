// Function to show content and hide loading screen
function showContent(sectionId, loadingId) {
  $("#" + sectionId).show();
  $("#" + loadingId).hide();
}

function renderStockTable(currStockInfo) {
  if (currStockInfo) {
    // var tableContent = "<h4>Last Update: " + convertDate(currStockInfo[0].lastUpdate) + "</h4>";
    let tableContent = "<h4>Last Update: " + currStockInfo[0].lastUpdate + "</h4>";
    tableContent += "<h4>Last Market Closed Date: " + currStockInfo[0].date + "</h4>";
    //tableContent += "<h5>Note: The Stock information will only update after the market is closed</h5>";
    tableContent += "<table class='stockTable'>";
    tableContent += "<thead>";
    tableContent += "<tr>";
    tableContent += "<th>Name</th>";
    tableContent += "<th>Symbol</th>";
    tableContent += "<th>Open Price ($USD)</th>";
    tableContent += "<th>Close Price ($USD)</th>";
    tableContent += "<th>High Price ($USD)</th>";
    tableContent += "<th>Low Price ($USD)</th>";
    tableContent += "</tr>";
    tableContent += "</thead>";
    tableContent += "<tbody>";

    currStockInfo.forEach(function(currStock) {
      tableContent += "<tr>";
      tableContent += "<td>" + currStock.name + "</td>";
      tableContent += "<td>" + currStock.symbol + "</td>";
      tableContent += "<td>" + currStock.openPrice + "</td>";
      tableContent += "<td>" + currStock.closePrice + "</td>";
      tableContent += "<td>" + currStock.highPrice + "</td>";
      tableContent += "<td>" + currStock.lowPrice + "</td>";
      tableContent += "</tr>";
    });

    tableContent += "</tbody>";
    tableContent += "</table>";

    // Render the content in the div element
    $("#stock-section").html(tableContent);
    showContent("stock-section", "stock-loading");
  } else {
    console.log("Error showing stock information.");
    showContent("stock-error", "stock-loading");
  }
}

function renderCryptoTable(currCryptoInfo) {
  if (currCryptoInfo) {
    //var tableContent = "<h4>Last Update: " + convertDate(currCryptoInfo[0].lastUpdate) + "</h4>";
    let tableContent = "<h4>Last Update: " + currCryptoInfo[0].lastUpdate + "</h4>";
    tableContent += "<table class='cryptoTable'>";
    tableContent += "<thead>";
    tableContent += "<tr>";
    tableContent += "<th>Name</th>";
    tableContent += "<th>Symbol</th>";
    tableContent += "<th>Price ($USD)</th>";
    tableContent += "<th>Market Cap ($USD)</th>";
    tableContent += "</tr>";
    tableContent += "</thead>";
    tableContent += "<tbody>";

    currCryptoInfo.forEach(function (currCrypto) {
      tableContent += "<tr>";
      tableContent += "<td>" + currCrypto.name + "</td>";
      tableContent += "<td>" + currCrypto.symbol + "</td>";
      tableContent += "<td>" + currCrypto.price + "</td>";
      // tableContent += "<td>" + convertLargeNumber(currCrypto.marketCap) + "</td>";
      tableContent += "<td>" + currCrypto.marketCap + "</td>";
      tableContent += "</tr>";
    });

    tableContent += "</tbody>";
    tableContent += "</table>";

    // Render the content in the div element
    $("#crypto-section").html(tableContent);
    showContent("crypto-section", "crypto-loading");
  } else {
    console.log("Error showing crypto information.");
    showContent("crypto-error", "crypto-loading");
  }
}

function renderWeatherTable(currWeatherInfo) {
  if (currWeatherInfo) {
    //var tableContent = "<h5>Last Update: " + convertDate(currWeatherInfo.lastUpdate) + "</h5>";
    let tableContent = "<h5>Last Update: " + currWeatherInfo.lastUpdate + "</h5>";
    tableContent += "<div class='sideWeatherImg'>";
    tableContent += "<img src='" + currWeatherInfo.iconURL + "' alt='Weather Icon' class=''>";
    tableContent += "</div>";
    tableContent += "<div class='sideWeatherText'>";
    tableContent += "<p>" + currWeatherInfo.temp + " &deg;C</p>";
    tableContent += "<p>" + currWeatherInfo.description + "</p>";
    tableContent += "<p style='font-weight: bold;'>";
    tableContent += "<img src='/images/locationIcon.png' alt='Location Icon' class='location-icon'>";
    tableContent += currWeatherInfo.cityName;
    tableContent += "</p>";
    tableContent += "</div>";

    // Render the content in the div element
    $("#weather-section").html(tableContent);
    showContent("weather-section", "weather-loading");
  } else {
    console.log("Error showing weather information.");
    showContent("weather-error", "weather-loading");
  }
}

function renderAllInfo() {
  // Fetch and process stock data
  $.ajax({
    url: "/stockData",
    method: "GET",
    async:false,
    success: function (currStockInfo) {
      renderStockTable(currStockInfo);
    },
    error: function () {
      console.log("An error occurred accessing stock info data");
      showContent("stock-error", "stock-loading");
    },
    complete: function () {
      // Hide the loading div even if there's an error
      showContent("stock-section", "stock-loading");
    }
  });

  // Fetch and process crypto data
  $.ajax({
    url: "/cryptoData",
    method: "GET",
    async:false,
    success: function (currCryptoInfo) {
      renderCryptoTable(currCryptoInfo);
    },
    error: function () {
      console.log("An error occurred accessing crypto info data");
      showContent("crypto-error", "crypto-loading");
    },
    complete: function () {
      // Hide the loading div even if there's an error
      showContent("crypto-section", "crypto-loading");
    }
  });

  // Fetch and process weather data
  $.ajax({
    url: "/weatherData",
    method: "GET",
    async:false,
    success: function (currWeatherInfo) {
      renderWeatherTable(currWeatherInfo);
    },
    error: function () {
      console.log("An error occurred accessing weather info data");
      showContent("weather-error", "weather-loading");
    },
    complete: function () {
      // Hide the loading div even if there's an error
      showContent("weather-section", "weather-loading");
    }
  });
}

$(document).ready(function () {
  setTimeout(renderAllInfo, 1000);
});


// $(document).ready(function () {
  // // Fetch and process stock data
  // $.ajax({
  //   url: "/stockData",
  //   method: "GET",
  //   async:false,
  //   success: function (currStockInfo) {
  //     renderStockTable(currStockInfo);
  //   },
  //   error: function () {
  //     console.log("An error occurred accessing stock info data");
  //     showContent("stock-error", "stock-loading");
  //   },
  //   complete: function () {
  //     // Hide the loading div even if there's an error
  //     showContent("stock-section", "stock-loading");
  //   }
  // });

  // // Fetch and process crypto data
  // $.ajax({
  //   url: "/cryptoData",
  //   method: "GET",
  //   async:false,
  //   success: function (currCryptoInfo) {
  //     renderCryptoTable(currCryptoInfo);
  //   },
  //   error: function () {
  //     console.log("An error occurred accessing crypto info data");
  //     showContent("crypto-error", "crypto-loading");
  //   },
  //   complete: function () {
  //     // Hide the loading div even if there's an error
  //     showContent("crypto-section", "crypto-loading");
  //   }
  // });

  // // Fetch and process weather data
  // $.ajax({
  //   url: "/weatherData",
  //   method: "GET",
  //   async:false,
  //   success: function (currWeatherInfo) {
  //     renderWeatherTable(currWeatherInfo);
  //   },
  //   error: function () {
  //     console.log("An error occurred accessing weather info data");
  //     showContent("weather-error", "weather-loading");
  //   },
  //   complete: function () {
  //     // Hide the loading div even if there's an error
  //     showContent("weather-section", "weather-loading");
  //   }
  // });
// });