import { useState, useEffect, createContext } from 'react';
import { useCookies } from "react-cookie";

const Context = createContext();

const AppProvider = ({children}) => {
const [ cookies, setCookie, removeCookie ] = useCookies([
  "velocity", 
  "larvaeCount", 
  "meatCount", 
  "droneValue",
]);
const [ larvaeNum, setLarvaeNum ] = useState(Number(cookies.larvaeCount) || 10);
const [ meatNum, setMeatNum ] = useState(Number(cookies.meatCount) || 35);
const [ droneValue, setDroneValue ] = useState(Number(cookies.droneValue) || 0);
const [ selectedOption, setSelectedOption ] = useState("seconds");

/******** LarvaeCount **********/
  useEffect(() => {
    setCookie("larvaeCount", 10 , { path: '/' });
  }, [])
  const updateLarvaeCookie = () => {
    setCookie("larvaeCount", larvaeNum , { path: '/' });
  }
  const increaseLarvae = () => {
    setTimeout(() => {
      setLarvaeNum(larvaeNum + 1);
    }, 1000)
  }
  useEffect(() => {
    increaseLarvae();
    updateLarvaeCookie();
  }, [larvaeNum])

  /************meatCount *************/
  useEffect(() => {
    setCookie("meatCount", 10 , { path: '/' });
  }, [])
  const updateMeatCookie = () => {
    setCookie("meatCount", meatNum , { path: '/' });
  }
  const increasemeat = () => {
    if(droneValue > 0) {
      setTimeout(() => {
        setMeatNum(meatNum + droneValue);
      }, 1000)
    }
  }
  useEffect(() => {
    increasemeat();
    updateMeatCookie();
  }, [meatNum])
/********** DroneVale *********/


  return (
    <Context.Provider value={{
      selectedOption, setSelectedOption,
      larvaeNum, setLarvaeNum, 
      droneValue, setDroneValue,
      meatNum, setMeatNum}}
    >
      {children}
    </Context.Provider>
  );
};

export { AppProvider, Context };