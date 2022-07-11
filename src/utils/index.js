import { useCookies } from "react-cookie";
import { useContext } from "react";
import { Context } from "../context/AppContext";

export const func = (value) => {
    var newValue = value;
    if (value >= 1000) {
      var suffixes = ["", "k", "m", "b","t"];
      var suffixNum = Math.floor( (""+value).length/3 );
      var shortValue = '';
      for (var precision = 2; precision >= 1; precision--) {
          shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
          var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
          if (dotLessShortValue.length <= 2) { break; }
      }
      if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
      newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}

export const handleHatchery = (i) => {

  const [ cookies, setCookie ] = useCookies([ "hatcheryTime" ]);

  const { 
    meatCount, setMeatCount,
    hatcheryClick, setHatcheryClick,
    hatcheryCount, setHatcheryCount,
  } = useContext(Context);

  if(hatcheryClick === 0 ) {
    const time = new Date();
    setCookie("hatcheryTime", time, {path: "/"});
  }
  setHatcheryCount( hatcheryCount + 1);
  setMeatCount(meatCount - 300*Math.pow(10, i));
  setHatcheryClick(hatcheryClick + 1);
}