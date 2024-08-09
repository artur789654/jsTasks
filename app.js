const WeatherStation = {
  temperature: null,
  humidity: null,
  pressure: null,
  history: [],

  init() {
    this.loadHistoryFromLocalStorage();
    this.displayWeatherHistory();
  },

  updateWeatherData(data) {
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.pressure = data.pressure;

    const date = new Date().toLocaleString();
    const forecastData = this.generateForecast();
    console.log("update", data, forecastData);
    this.history.push({ date, forecast: forecastData.forecast, ...data });

    this.saveHistoryToLocalStorage();
    this.displayWeatherForecast();
    this.displayWeatherHistory();
  },

  generateForecast() {
    let forecast = "";
    let icon = "";
    const conditions = {
      clearSky:
        this.temperature > 20 && this.humidity < 50 && this.pressure > 1013,
      rain: this.humidity > 75 && this.pressure < 1013 && this.temperature >= 0,
      thunderstorm:
        this.temperature > 15 && this.humidity > 70 && this.pressure < 1013,
      snowfall:
        this.humidity > 70 && this.pressure < 1013 && this.temperature < 0,
      fog: this.humidity > 90 && this.temperature < 0,
      mainlyClear: this.humidity <= 30 && this.pressure >= 1020,
    };

    const weatherCondition = Object.keys(conditions).find(
      (key) => conditions[key]
    );

    switch (weatherCondition) {
      case "clearSky":
        forecast = "Clear Sky";
        icon = "https://cdn.weatherbit.io/static/img/icons/c01d.png";
        break;
      case "rain":
        forecast = "Rain";
        icon = "https://cdn.weatherbit.io/static/img/icons/d02d.png";
        break;
      case "thunderstorm":
        forecast = "Thunderstorm";
        icon = "https://cdn.weatherbit.io/static/img/icons/t04d.png";
        break;
      case "snowfall":
        forecast = "Snowfall";
        icon = "https://cdn.weatherbit.io/static/img/icons/s02d.png";
        break;
      case "fog":
        forecast = "Fog";
        icon = "https://cdn.weatherbit.io/static/img/icons/f01d.png";
        break;
      case "mainlyClear":
        forecast = "Mainly clear";
        icon = "https://cdn.weatherbit.io/static/img/icons/c02d.png";
        break;
      default:
        forecast = "Partly cloudy, or overcast";
        icon = "https://cdn.weatherbit.io/static/img/icons/c03d.png";
    }
    return { forecast, icon };
  },

  displayWeatherForecast() {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    const { forecast, icon } = this.generateForecast();

    const card = document.createElement("div");
    card.classList.add("weather-card");

    card.innerHTML = `
    <div class ="wather-forecast">
      <span><img src =${icon} alt = "Weather icon"/></span>
      <h2>${forecast}</h2>
    </div>
    <div class="weather-details">
      <p>Temperature:${this.temperature}°C</p>
      <p>Humidity:${this.humidity}%</p>
      <p>Pressure: ${this.pressure}hPa</p>
    </div>`;

    forecastContainer.appendChild(card);
  },

  displayWeatherHistory() {
    const historyList = document.getElementById("historyList");

    historyList.innerHTML = "";
    this.history.forEach((el) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
      <p>Date: ${el.date}</p>
      <p>Forecast: ${el.forecast}</p>
      <p>Temperature: ${el.temperature}°C</p>
      <p>Humidity: ${el.humidity}%</p>
      <p>Pressure: ${el.pressure}hPa</p>
      `;
      historyList.appendChild(listItem);
    });
  },

  saveHistoryToLocalStorage() {
    localStorage.setItem("weatherHistory", JSON.stringify(this.history));
  },

  loadHistoryFromLocalStorage() {
    const historyData = localStorage.getItem("weatherHistory");
    if (historyData) {
      this.history = JSON.parse(historyData);
    }
  },

  async fetchWeatherFromApi(city) {
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`;
    try {
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        this.showError("Місто не знайдено або введене не вірно.", "cityError");
        return;
      }

      const { lat, lon } = geoData[0];
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,pressure_msl&forecast_days=1`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();
      console.log(weatherData);
      if (weatherData.current) {
        const temperature = weatherData.current.temperature_2m;
        const humidity = weatherData.current.relative_humidity_2m;
        const pressure = weatherData.current.pressure_msl;
        const data = { temperature, humidity, pressure };
        this.updateWeatherData(data);
      } else {
        this.showError("Не вдалося отримати дані про погоду.", "cityError");
      }
    } catch (e) {
      console.log(e.message);
      this.showError("Помилка при отриманні даних.", "cityError");
    }
  },
  showError(message, elementId) {
    const errorMessageElement = document.getElementById(elementId);
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = "block";

    setTimeout(() => {
      errorMessageElement.style.display = "none";
    }, 5000);
  },
};

document.getElementById("updateWeatherButton").addEventListener("click", () => {
  const temperature = document.getElementById("temperature").value;
  const humidity = document.getElementById("humidity").value;
  const pressure = document.getElementById("pressure").value;
  if (!isNaN(temperature) && !isNaN(humidity) && !isNaN(pressure)) {
    const data = {
      temperature,
      humidity,
      pressure,
    };
    WeatherStation.updateWeatherData(data);
  } else {
    WeatherStation.showError(
      "Будь ласка, введіть коректні значення.",
      "updateWeatherError"
    );
  }
});

document.getElementById("fetchWeatherButton").addEventListener("click", () => {
  const city = document.getElementById("city").value.trim();
  if (city) {
    WeatherStation.fetchWeatherFromApi(city);
  } else {
    WeatherStation.showError("Будь ласка, введіть назву міста.", "cityError");
  }
});
WeatherStation.init();
