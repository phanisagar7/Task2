/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const FetchData = () => {
  const [responseData, setResponseData] = React.useState([]);
  const [countries, setCountries] = React.useState([]);
  const [minTemperatures, setMinTemperatures] = React.useState();
  const [maxWindSpeed, setMaxWindSpeed] = React.useState();
  const [completeDataLabels, setCompleteDataLabels] = React.useState([]);
  const [completeCountryTemperatureData, setCompleteCountryTemperatureData] =
    React.useState([]);
  const [completeCountryWindSpeedData, setCompleteCountryWindSpeedData] =
    React.useState([]);
  const [showTemperatureCompleteTrend, setShowTemperatureCompleteTrend] =
    React.useState(false);
  const [showWindSpeedCompleteTrend, setShowWindSpeedCompleteTrend] =
    React.useState(false);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const minTemperatureData = {
    labels: countries,
    datasets: [
      {
        label: "Temperature",
        data: minTemperatures,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const maxWindSpeedData = {
    labels: countries,
    datasets: [
      {
        label: "Wind Speed",
        data: maxWindSpeed,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const temperatureMapData = {
    labels: completeDataLabels,
    datasets: completeCountryTemperatureData,
  };

  const windSpeedMapData = {
    labels: completeDataLabels,
    datasets: completeCountryWindSpeedData,
  };

  React.useEffect(() => {
    fetch("weatherforecast")
      .then((response) => response.json())
      .then((response) => {
        setResponseData(response);
      });
  }, []);

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getMinutesValue = (lastUpdateTime) => {
    let lastDate = new Date(lastUpdateTime);
    return `${lastDate.getHours()}-${
      lastDate.getMinutes() > 10
        ? lastDate.getMinutes()
        : `0${lastDate.getMinutes()}`
    }`;
  };

  const setMapLabels = () => {
    let timerecords = responseData.map((i) => {
      return getMinutesValue(i.lastUpdateTime);
    });
    setCompleteDataLabels([...new Set(timerecords)]);
  };

  const setTemperatureMap = (country) => {
    let records = responseData
      .filter((item) => item.country === country)
      .map((i) => {
        return i.temperature;
      });
    let graphLine = getRandomColor();
    return {
      label: country,
      data: records,
      borderColor: graphLine,
      backgroundColor: graphLine,
    };
  };

  const setWindSpeedMap = (country) => {
    let records = responseData
      .filter((item) => item.country === country)
      .map((i) => {
        return i.windSpeed;
      });
    let graphLine = getRandomColor();
    return {
      label: country,
      data: records,
      borderColor: graphLine,
      backgroundColor: graphLine,
    };
  };

  React.useEffect(() => {
    if (countries.length > 0) {
      let countryMinTemperatures = [];
      let countryMaxWindSpeed = [];
      let completePeriodicTemperatureData = [];
      let completePeriodicWindSpeedData = [];
      countries.forEach((country) => {
        completePeriodicTemperatureData.push(setTemperatureMap(country));
        completePeriodicWindSpeedData.push(setWindSpeedMap(country));

        let filteredRecords = responseData
          .filter((item) => item.country === country)
          .map((i) => {
            return i.temperature;
          });

        countryMinTemperatures.push(Math.min(...filteredRecords));
        filteredRecords = responseData
          .filter((item) => item.country === country)
          .map((i) => {
            return i.windSpeed;
          });
        countryMaxWindSpeed.push(Math.max(...filteredRecords));
      });
      setCompleteCountryTemperatureData(completePeriodicTemperatureData);
      setCompleteCountryWindSpeedData(completePeriodicWindSpeedData);
      setMinTemperatures([...countryMinTemperatures]);
      setMaxWindSpeed([...countryMaxWindSpeed]);
    }
  }, [responseData, countries]);

  React.useEffect(() => {
    if (responseData.length > 0) {
      setMapLabels();
      const countries = [];
      responseData.forEach((item) => {
        if (countries.indexOf(item.country) === -1) {
          countries.push(item.country);
        }
      });
      setCountries(countries);
    }
  }, [responseData]);

  const handleMinTemperatureClick = () => {
    setShowTemperatureCompleteTrend(true);
    setShowWindSpeedCompleteTrend(false);
  };

  const handleMaxWindSpeedClick = () => {
    setShowTemperatureCompleteTrend(false);
    setShowWindSpeedCompleteTrend(true);
  };

  return (
    <div class="container">
      <div class="row">
        <div class="col-6  p-3" onClick={handleMinTemperatureClick}>
          <h2 class="m-4">Min Temperature Trend</h2>
          <Line options={options} data={minTemperatureData} />
        </div>
        <div class="col-6 p-3" onClick={handleMaxWindSpeedClick}>
          <h2 class="m-4">Max Wind Speed Trend</h2>
          <Line options={options} data={maxWindSpeedData} />
        </div>
      </div>
      {showTemperatureCompleteTrend && (
        <div class="row p-3">
          <h2 class="m-4">Temperature Trend</h2>
          <Line options={options} data={temperatureMapData} />
        </div>
      )}
      {showWindSpeedCompleteTrend && (
        <div class="row p-3">
          <h2 class="m-4">Wind Speed Trend</h2>
          <Line options={options} data={windSpeedMapData} />
        </div>
      )}
    </div>
  );
};
