import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../styles/HourlyForeCast.css";

export const WeatherIcons = {
  "01d": "/Icons/sunny.svg",
  "01n": "/Icons/night.svg",
  "02d": "/Icons/day.svg",
  "02n": "/Icons/cloudy-night.svg",
  "03d": "/Icons/cloudy.svg",
  "03n": "/Icons/cloudy.svg",
  "04d": "/Icons/perfect-day.svg",
  "04n": "/Icons/cloudy-night.svg",
  "09d": "/Icons/rain.svg",
  "09n": "/Icons/rain-night.svg",
  "10d": "/Icons/rain.svg",
  "10n": "/Icons/rain-night.svg",
  "11d": "/Icons/storm.svg",
  "11n": "/Icons/storm.svg",
  "50d": "/Icons/day.svg",
  "50n": "/Icons/cloudy-night.svg",
};





let Flag = true;

function HourlyForeCast({ dataInput, dataEnteredFlag, setDataEnteredFlag }) {
  const [eachHourContents, setEachHourContents] = useState([]);
  const [weather, updateWeather] = useState();

  useEffect(() => {
    // Here the will be executed only for initial render//

    if (Flag) {
      const successfulLookup = (position) => {
        const { latitude, longitude } = position.coords;

        const fetchCurrentWeather = async () => {
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,daily,alerts&appid=b9eea68f586e51572c56c0ddbc489ef4`
          );

          // Below Code converts date to india time
          let arr = res.data.hourly;

          arr.map((item) => {
            let unix_timestamp = item.dt;

            var date = new Date(unix_timestamp * 1000);

            var hours = date.getHours();

            var minutes = "0" + date.getMinutes();

            var seconds = "0" + date.getSeconds();

            var formattedTime =
              hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

            item.dt = formattedTime;
          });

          setEachHourContents(arr);
        };

        fetchCurrentWeather();
      };

      const failedLookUp = () => {
        console.log("failed to load");
      };

      // This is here for Checking if browser supports location feature

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          successfulLookup,
          failedLookUp
        );
      }
      Flag = false;
    }

    // Below Block Of Code is Re-Render code i.e., code that will be executed everytime a city name is entered

    if (dataEnteredFlag == true && dataInput != "") {
      var latitude;
      var longitude;
      const getLatitudeAndLongitude = async () => {
        const res = await axios
          .get(
            `https://api.opencagedata.com/geocode/v1/json?q=${dataInput}&key=e7fffabdb0d94fdc8a0a6f891214e6f8`
          )
          .catch((err) => console.log(err));

        if (res.data.results.length != 0) {
          latitude = res.data.results[0].geometry.lat;
          longitude = res.data.results[0].geometry.lng;

          const fetchForeCastWeather = async () => {
            const res = await axios
              .get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,daily,alerts&appid=b9eea68f586e51572c56c0ddbc489ef4`
              )
              .catch((err) => console.log(err));

            let arr = res.data.hourly;

            arr.map((item) => {
              let unix_timestamp = item.dt;

              var date = new Date(unix_timestamp * 1000);
              //For Hours 
              var hours = date.getHours();
              // For Minutes 
              var minutes = "0" + date.getMinutes();
              // For Seconds 
              var seconds = "0" + date.getSeconds();

              // This Will display the time
              var formattedTime =
                hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

              item.dt = formattedTime;
            });

            setEachHourContents(arr);
            // console.log(arr);
          };

          fetchForeCastWeather();
        }
      };

      getLatitudeAndLongitude();
    }
  }, [dataEnteredFlag]);



  return (
    <>
      <hr size="5" width="100%" color="mediumaquamarine" />
      <h3 id="title">Next 48 Hrs ForeCast</h3>
    <div className="hourly">
      
      
      
      <div className="container">
        
        
      

      {eachHourContents.map((hour) => (
        <div id="hoursinner"  >
          <div>
            <h2>{hour.dt}</h2>
          </div>


         <div className = "image">
          <img src={WeatherIcons[hour?.weather[0].icon]}>

            </img>
          </div>


          <div className="temp">
            <h2 style={{ fontSize: "40px" , marginTop: "0" }}>
              {Math.floor(hour.temp - 273.15)}
              <span>&#8451;</span>
            </h2>
          </div>

          
          <div className="nowtemp">
            <h2>{hour.weather[0].main}</h2>
            </div>
          </div>
        
      ))}
      </div>
      </div>
      </>
  );
}

export default HourlyForeCast;
