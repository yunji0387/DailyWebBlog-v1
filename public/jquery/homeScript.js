// Function to show content and hide loading screen
function showContent(sectionId, loadingId) {
  $("#" + sectionId).show();
  $("#" + loadingId).hide();
}

function renderStockTable(currStockInfo) {
  if (currStockInfo) {
    var tableContent = "<h4>Last Update: " + currStockInfo[0].lastUpdate + "</h4>";
    tableContent += "<h4>Last Market Closed Date: " + currStockInfo[0].date + "</h4>";
    tableContent += "<h5>Note: The Stock information will only update after the market is closed</h5>";
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
  } else {
    console.log("Error showing stock information.");
  }

  // Hide the loading div after rendering the table content
  showContent("stock-section", "stock-loading");
}

$(document).ready(function () {
  // Fetch and process stock data
  $.ajax({
    url: "/stockData",
    method: "GET",
    success: function (currStockInfo) {
      renderStockTable(currStockInfo);
    },
    error: function () {
      console.log("An error occurred accessing stock info data");
      showContent("stock-section", "stock-loading");
    },
    complete: function () {
      // Hide the loading div even if there's an error
      showContent("stock-section", "stock-loading");
    }
  });
});
