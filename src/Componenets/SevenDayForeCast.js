import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import "../styles/SevenDayForeCast.css";


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

function SevenDayForeCast({ dataEnteredFlag, dataInput })
{
  let setDayOfWeek = function (dayNum) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var s=(d.getDay()+1+dayNum)%7;
    return days[s];
  };


  const [sevenDaysContent, setSevenDaysContent] = useState([]);
  

  useEffect(() => {
    // Code that will be executed only for initial render//

    if (Flag) 
    {
      const successfulLookup = (position) => 
      {
        const { latitude, longitude } = position.coords;

        const fetchCurrentWeather = async () => {
          const res = await axios
            .get(
              `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&{path}&appid=b9eea68f586e51572c56c0ddbc489ef4`
            )
            .catch((err) => console.log(err));

          let arr = res.data.daily ;
          // Below Code will convert UTC dt to date

          arr.map((item) => {
            let unix_timestamp = item.dt ;
            var date = new Date(unix_timestamp * 1000 ) ;

            item.dt = date.getMonth() + 1 + "/" + date.getDate()  ;
          });

          setSevenDaysContent(arr)
        };

        fetchCurrentWeather();
      };

      const failedLookUp = () => {
        console.log("failed to load");
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successfulLookup,failedLookUp);
      }
    }

    // Below Block Of Code is Re-Render code i.e., code that will be executed everytime a city name is entered.

    if (dataEnteredFlag == true && dataInput != "") 
    {
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
                `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&{path}&appid=b9eea68f586e51572c56c0ddbc489ef4`
              )
              .catch((err) => console.log(err));

            let arr = res.data.daily;

            arr.map((item) => {
              let unix_timestamp = item.dt;
              var date = new Date(unix_timestamp * 1000);

              item.dt = date.getMonth() + 1 + "/" + date.getDate() ;
            });

            setSevenDaysContent(arr);
          };

          fetchForeCastWeather();
        }
      };

      getLatitudeAndLongitude();
    }
  }, [dataEnteredFlag]);

  return (
    <>
       <hr id="sevenline" size="5" width="100%" color="mediumaquamarine" />
      <h1 id="seventext">7-day weather report</h1>
    <div className="sevendayforecast">
     
      

    <div className="sevenday">
      

      {sevenDaysContent.slice(1).map((day,setday) => (
        <div className="sevendayformat">
          <div style={{ margin: "15px" }}>{day.dt}
          </div>

          <div className="daily_week_days">{setDayOfWeek(setday)}</div>
          
          <div style={{ margin: "15px" }}>
            {Math.floor(day.temp.max - 270)}
            <span>&#8451;</span>/{Math.floor(day.temp.min - 273.15)}
            <span>&#8451;</span>
          </div>

          <img src={WeatherIcons[day?.weather[0].icon]}>

          </img>
          <div style={{ margin: "15px" }}>{day.weather[0].main}</div>
        </div>
        
      ))}
      </div>
      
      </div>
      <hr id="sevenline" size="5" width="100%" color="mediumaquamarine" />
      </>
  );
}

export default SevenDayForeCast;
