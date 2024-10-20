const value = '71CNOYD9DF3R6N48';

document.addEventListener('DOMContentLoaded', () => {
    console.log("loaded")
    return new Promise((resolve, reject) => {
        fetch("./data.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                loadDescription(data);
            })
            .catch(error => reject(error));
    });
});

async function loadDescription(jsonData) {
    let description = document.getElementById("header");
    let header = jsonData.stocksHeader

    description.innerHTML = `
        <img src="${header.image}" alt="Header Image">
        <div class="header-text" id="pageDescription">
            <h1>${header.title}</h1>
            <p>${header.description}</p>
        </div>
    `
    console.log(description);

}


document.getElementById('stockForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const stockInput = document.getElementById('stockInput').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; 

    let jsonData;
    try {
        jsonData = await fetch("./data.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            });
    } catch (error) {
        console.error("Error fetching JSON:", error);
        resultDiv.innerHTML = '<div class="alert alert-danger">Could not retrieve JSON data.</div>';
        return;
    }

    try {
        const stockData = await fetchStockData(stockInput);
        if (stockData) {
            const { Symbol, LatestPrice, ChangePercent, Volume } = stockData;
            let img;
            let description;
            if(ChangePercent < 0) {
                img = jsonData.stocks.down.image
                description = jsonData.stocks.down.description
            } else {
                img = jsonData.stocks.up.image
                description = jsonData.stocks.up.description
            }
            console.log(img)
            resultDiv.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Stock: ${Symbol}</h5>
                        <p class="card-text">Latest Price: $${LatestPrice}</p>
                        <p class="card-text">Change since close: ${ChangePercent}%</p>
                        <p class="card-text">Traded Today: ${Volume}</p>
                        <p>${description}</p>
                        <img src="${img}" alt="trend img" style="max-width: 100%; height: auto;">
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = '<div class="alert alert-danger">Could not retrieve stock data.</div>';
        }
    } catch (error) {
        console.error("Error fetching stock data:", error);
        resultDiv.innerHTML = '<div class="alert alert-danger">An error occurred while fetching data.</div>';
    }
});

async function fetchStockData(symbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${value}`);
    
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const timeSeries = data["Time Series (1min)"];
    if (!timeSeries) return null;

    const latestTime = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestTime];

    return {
        Symbol: symbol,
        LatestPrice: parseFloat(latestData["1. open"]).toFixed(2),
        ChangePercent: parseFloat(latestData["4. close"] - latestData["1. open"]).toFixed(2),
        Volume: latestData["5. volume"]
    };
}