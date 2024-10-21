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
    let header = jsonData.weatherHeader

    description.innerHTML = `
        <img src="${header.image}" alt="Header Image">
        <div class="header-text" id="pageDescription">
            <h1>${header.title}</h1>
            <p>${header.description}</p>
        </div>
    `
    console.log(description);

}


async function getWeather(lon, lat) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}


async function handleCityInput() {
    const cityInput = document.getElementById('cityInput').value;
    if (!cityInput) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please enter a city.</div>';
        return;
    }

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
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityInput)}&format=json`);
        const geoData = await geoResponse.json();

        if (geoData.length > 0) {
            const latitude = geoData[0].lat;
            const longitude = geoData[0].lon;

            const weatherData = await getWeather(longitude, latitude);
            if (weatherData) {
                const temperatureC = weatherData.current_weather.temperature;
                const temperatureF = celsiusToFahrenheit(temperatureC).toFixed(2);
                const weatherCode = weatherData.current_weather.weathercode;

                const weatherImageSrc = jsonData.weatherCodes[weatherCode].image || './images/no_weather';

                resultDiv.innerHTML = `
                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Weather in ${cityInput}</h5>
                            <p class="card-text">
                                Temperature: ${temperatureF}°F (${temperatureC}°C)<br>
                                Windspeed: ${weatherData.current_weather.windspeed} km/h<br>
                                Weather: ${jsonData.weatherCodes[weatherCode].name}
                            </p>
                            <img src="${weatherImageSrc}" alt="Weather Image" class="card-img-top" id="weatherImage">
                        </div>
                    </div>
                `;
                document.getElementById('weatherImage').style.display = 'block';
            } else {
                resultDiv.innerHTML = '<div class="alert alert-danger">Could not retrieve weather data.</div>';
            }
        } else {
            resultDiv.innerHTML = '<div class="alert alert-danger">No results found for that city.</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<div class="alert alert-danger">An error occurred while fetching data.</div>';
    }
}