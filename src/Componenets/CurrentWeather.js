import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../styles/CurrentWeather.css";

import { CityContext } from "../Helper/Context";

export const WeatherIcons = {
  "01d": "icons/sunny.svg",
  "01n": "icons/night.svg",
  "02d": "icons/day.svg",
  "02n": "icons/cloudy-night.svg",
  "03d": "icons/cloudy.svg",
  "03n": "icons/cloudy.svg",
  "50n": "icons/cloudy.svg",
  "04d": "icons/perfect-day.svg",
  "04n": "icons/cloudy-night.svg",
  "09d": "icons/rain.svg",
  "09n": "icons/rain-night.svg",
  "10d": "icons/rain.svg",
  "10n": "icons/rain-night.svg",
  "11d": "icons/storm.svg",
  "11n": "icons/storm.svg",
};

    

let oneFlag = true;

function CurrentWeather({ dataInput, dataEnteredFlag, setDataInput })
{
  const [currentTemperature, setCurrentTemperature] = useState("");
  const [currentWindSpeed, setCurrentWindSpeed] = useState("");
  const [currentHumidity, setCurrentHumidity] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [currentPressure, setCurrentPressure] = useState("");
  const [todaysunrise, Setsunrise] = useState("");
  const [icon, Seticon] = useState("");
  const [country, Setcountry] = useState("");
  const [city, Setcity] = useState("");
  


  const { CityContextFlag, setCityContextFlag } = useContext(CityContext);

  useEffect(() => {
    if (oneFlag) {
      const successfulLookup = (position) => {
        const { latitude, longitude } = position.coords;

        const fetchCurrentWeather = async () =>
        {
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=624bc7ea92b246f0df3f1b95d9df47f7`
          );

          setCurrentTemperature(Math.floor(res.data.main.temp - 273.15));
          console.log(res.data);
          setCurrentWindSpeed(res.data.wind.speed);
          setCurrentHumidity(res.data.main.humidity);
          setCurrentState(res.data.weather[0].main);
          setCurrentPressure(res.data.main.pressure);
          Setsunrise(res.data.sys.sunrise);
          Seticon(res.data.weather[0].icon);
          Setcountry(res.data.sys.country);
          Setcity(res.data.name);
        };

        fetchCurrentWeather();
      };

      const failedLookUp = () => {
        console.log("failed to load");
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          successfulLookup,
          failedLookUp
        );
      }
      oneFlag = false;
    }

    if (dataEnteredFlag && dataInput != "") {
      const fetchCityData = async () => {
        const res = await axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${dataInput}&appid=624bc7ea92b246f0df3f1b95d9df47f7`
          )
          .catch((err) => {
            console.log(err);
          });

        if (res != undefined) {
          setCurrentTemperature(Math.floor(res.data.main.temp - 273.15));
          setCurrentWindSpeed(res.data.wind.speed);
          setCurrentHumidity(res.data.main.humidity);
          setCurrentPressure(res.data.main.pressure);
          setCurrentState(res.data.weather[0].main);
          Seticon(res.data.weather[0].icon);
          Setsunrise(res.data.sys.sunrise);
          Setcountry(res.data.sys.country);
          Setcity(res.data.name);
          setCityContextFlag(false);
        }
        else if (res == undefined) {
          setCityContextFlag(true);

        }
      };
      fetchCityData();
    }
  }, [dataEnteredFlag]);




  

  return (
    <div>
      <hr size="5" width="100%" color="mediumaquamarine" /> 
      <div className="Container">
      <div style={{}}>
       
      <h3 id="cityname">
            Today's Forecast for {city}, {country}
            
      </h3>
        </div>

        


        <div className="upperitem">
          <div className="hours">
          <span id="size">{currentTemperature}
            <span>&#8451;</span> </span>    { /*It is here to show degree celcius*/}
            <span id ="now"> | {currentState} </span>
        </div>

        <div className="currenticon">
      <img src={WeatherIcons[icon]} />
          </div>
          </div>



         <div className = "extraitem">
        <div className="sunrisetime">
           <img src="Icons/temp.svg"/> 
            <span id="sunrisetext">{new Date(todaysunrise *1000).toLocaleTimeString('en-IN')} <br/> Sunrise</span>
        </div>

        <div className="wind">
            <img src="Icons/wind.svg"/>
            <span id="windtext">{currentWindSpeed}m/s <br/> Wind</span>
        </div>
        
        <div className = "humidity">
           <img src="Icons/humidity.svg"/>
           <span id="humiditytext">{currentHumidity}%  <br/> Humidity</span>
        </div>

        <div className="pressure">
            <img src="Icons/pressure.svg"/>
           <span id="pressuretext"> {currentPressure} <br/> Pressure</span>
          </div>
          </div>
        
      </div>
      </div>
      
  );
}


export default CurrentWeather; 
