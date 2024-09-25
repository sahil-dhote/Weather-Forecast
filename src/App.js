import "./App.css";
import CurrentWeather from "./Componenets/CurrentWeather";
import HourlyForeCast from "./Componenets/HourlyForeCast";
import SevenDayForeCast from "./Componenets/SevenDayForeCast";
import React, { useState, useEffect } from "react";
import axios from "axios";

import {CityContext} from './Helper/Context';



function App() {
  const [dataInput, setDataInput] = useState("");
  const [dataEnteredFlag, setDataEnteredFlag] = useState(false);
  
  const [CityContextFlag,setCityContextFlag]=useState(false);

  function inputSetter(e) {
    if (e.keyCode == 13) {
      setDataEnteredFlag(true);
      setDataInput(e.target.value.slice(0, e.target.value.length)); //slice is used so that input entered by user should be 0 to value.length
      
    } else {
      setDataEnteredFlag(false);
      
    }
  }
  

  useEffect(()=>{
    
      const successfulLookup = (position) => {
          const { latitude, longitude } = position.coords;

          const fetchCurrentLocation= async()=>{
              
              const result= await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=e7fffabdb0d94fdc8a0a6f891214e6f8`);

              
            setDataInput(result.data.results[0].components.city)

          }

          fetchCurrentLocation();

          
      };

      const failedLookUp = () => {
          console.log("failed to load");
      };

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(successfulLookup, failedLookUp);
      }
      
  


  },[])

  return (
      
      <CityContext.Provider value={{CityContextFlag,setCityContextFlag}}>

    <div className="App">
        <h1>Welcome to Weather Forecast App</h1>
      <input id="search"
        onKeyUp={inputSetter}
        type="text"
        placeholder="Enter your City Name"
      />

      {CityContextFlag?<h2 style={{color:"red", border:"1px solid white",backgroundColor:"#f8d7da",width:"180px",margin:"20px auto"}}>Invalid City <i class="fas fa-frown" style={{color:"red",backgroundColor:"white"}}></i></h2>:""}

      <div className="flexr">

       

 <CurrentWeather
              dataInput={dataInput}
              dataEnteredFlag={dataEnteredFlag}
             
          
        />
        
        <HourlyForeCast dataInput={dataInput} dataEnteredFlag={dataEnteredFlag} setDataEnteredFlag={setDataEnteredFlag} />


      </div>

      
      <SevenDayForeCast dataEnteredFlag={dataEnteredFlag} dataInput={dataInput}/>

    </div>
    </CityContext.Provider>


  );
}

export default App;
