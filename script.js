
// Get HTML elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const apiKey = "1db07bb15f04560c2e568fcd629ba8dc";
// Fetch weather data from the API

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    // Show loading message
    description.textContent = "Loading weather...";

    searchBtn.disabled = true;

    try {
        // Send API request
        const response = await fetch(url);

        // Check if request was successful
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please try again.");
            }

            if (response.status === 401) {
                throw new Error("Invalid API key or key not activated yet.");
            }

            throw new Error("Unable to fetch weather. Please try again.");
        }

        // Convert response into JavaScript object
        const data = await response.json();

        // Update city name
        cityName.textContent = data.name;

        // Update temperature
        temperature.textContent = `${Math.round(data.main.temp)} °C`;

        // Update weather description
        description.textContent = data.weather[0].description;

        // Update feels-like temperature
        feelsLike.textContent =
            `Feels like: ${Math.round(data.main.feels_like)} °C`;

        // Update humidity
        humidity.textContent = `Humidity: ${data.main.humidity}%`;

        // Update wind speed
        wind.textContent = `Wind: ${data.wind.speed} m/s`;

        // Update weather icon
        const iconCode = data.weather[0].icon;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherIcon.alt = data.weather[0].description;

    } catch (error) {
        // Display errors
        description.textContent = error.message;

        console.error("Weather API error:", error);

        // Clear stale weather information
        cityName.textContent = "";
        temperature.textContent = "";
        feelsLike.textContent = "";
        humidity.textContent = "";
        wind.textContent = "";
        weatherIcon.removeAttribute("src");

    } finally {
        // Enable search button again
        searchBtn.disabled = false;
    }
}

// Handle Search button click
searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();

    if (city === "") {
        description.textContent = "Please enter a city name.";
        cityInput.focus();
        return;
    }

    getWeather(city);
});


// Allow searching by pressing Enter
cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});
function resetWeather() {
    cityName.textContent = "";
    temperature.textContent = "";
    description.textContent = "";
    feelsLike.textContent = "";
    humidity.textContent = "";
    wind.textContent = "";

    weatherIcon.removeAttribute("src");
}
cityInput.addEventListener("input", function () {
    if (cityInput.value.trim() === "") {
        resetWeather();
    }
});
