
import './Main.css';

import React, { useRef, useEffect, useState } from "react";
import SnowDepth from '../SnowDepth/SnowDepth';
import Temperature from '../Temperature/Temperature';
import Wind from '../Wind/Wind';
import Cloud from '../Cloud/Cloud';
import Awdb from '../Services/awdb';
import DarkSky from '../Services/darksky';
import constants from '../constants';

function Main() {
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState({});
  const [snowDepth, setSnowDepth] = useState([]);
  const [tempMax, setTempMax] = useState([]);
  const [tempMin, setTempMin] = useState([]);
  const [message, setMessage] = useState('');
  const [past, setPast] = useState([]);

  useEffect(async () => {
    setMessage('fetching snow depth');
    let awdbDataDepth = await Awdb.getData('SNWD');
    setSnowDepth(awdbDataDepth[0].values);

    // Get Snotel Snow Depth Data
    setMessage('fetching temperature maximum');
    let awdbDataMax = await Awdb.getData('TMAX');
    setTempMax(awdbDataMax[0].values); // this is gross

    setMessage('fetching temperature minimum');
    let awdbDataMin = await Awdb.getData('TMIN');
    setTempMin(awdbDataMin[0].values); // this is gross

    setMessage('fetching forecast');
    let darkskyForecast = await DarkSky.getForecast();
    setForecast(darkskyForecast);

    setMessage('fetching past');

    const tempPast = [];
    const today = new Date();
    for(let i = 0; i < constants.daysToForecast - 1; i++) {
      const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (constants.daysToForecast - 1 - i));

      let darkskyForecast = await DarkSky.getPast(day);

      tempPast.push(darkskyForecast);
    }
    setPast(tempPast);


    setLoading(false);
  }, []);

  return (
    <>
      <main className='Main'>
        {loading &&
          <div className="loader">
            <img src="/load.gif" />
            <div className="message">
              {message}
            </div>
            
          </div>
        }
        {!loading &&
          <div className="charts">
            <SnowDepth forecast={forecast} depth={snowDepth}/>
            <Temperature forecast={forecast} tempMax={tempMax} tempMin={tempMin}/>
            <Wind forecast={forecast} past={past}/>
            <Cloud forecast={forecast} past={past}/>
          </div>
        }
      </main>
    </>
  );
}

export default Main;
