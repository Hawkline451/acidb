import React, { useEffect, useState } from 'react';

import {
  Grid, Button
} from '@material-ui/core';

// NPM
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalRectSeries,
  VerticalRectSeriesCanvas
} from 'react-vis';
import 'react-vis/dist/style.css';

import axios from 'axios';
import { CSVLink } from "react-csv";


// Internationalization
import { useTranslation } from 'react-i18next';

// Import components
import { Loader } from './loader'
import { SelectForm, RadioForm, OrganismView } from './plot_components'

// Styles
import { ThemeProvider } from '@material-ui/styles';
import { stylesTable } from './css/themes'
import { theme } from './css/themes'

// import config
import { config } from '../config';


const DATA = [
  { x0: 0, x: 1, y: 1 },
  { x0: 1, x: 2, y: 2 },
  { x0: 2, x: 3, y: 10 },
  { x0: 3, x: 4, y: 6 },
  { x0: 4, x: 5, y: 5 },
  { x0: 5, x: 6, y: 3 },
  { x0: 6, x: 7, y: 1 }
];

const binSize = {
  ph: 1,
  temp: 10,
  gc: 10,
  genSize: 100,
}

function DragableChartExample() {
  const [state, setState] = useState({
    data: null,
    filteredData: null
  });


  useEffect(() => {
    let filteredData
    const fetchData = async () => {
      // if load for 1st time
      if (state.data === null) {
        //setIsLoading(true);
        const result = await axios(
          config.API_SIMPLE_PLOT,
        );
        setStateValue('data', result.data)
        var res = result.data.reduce((obj, v) => {
          obj[v.domain] = (obj[v.domain] || 0) + 1;
          return obj;
        }, {})
        let count = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        let binSize = 1
        let nameMetric = 'ph_max'

        var res = result.data.reduce((obj, v) => {
          var i = 0;
          while (v[nameMetric]>i){
            i = i + binSize
          }
          count[i-1] = v[nameMetric] !== null ? (count[i-1] || 0) + 1 : count[i];
          return count;
        }, {})
        console.log("yay")
        console.log(res)

      };
    }

    fetchData();
    // Empty array as second argument means avoid fetching on component updates, only when mounting the component
  }, []);

  function setStateValue(keyName, newValue) {
    setState(oldValues => ({
      ...oldValues,
      [keyName]: newValue,
    }));
  }



  return (
    <div>
      <XYPlot width={500} height={300}>
        <XAxis />
        <YAxis />
        <VerticalRectSeries
          data={DATA}
          stroke="white"
          colorType="literal"
        />
      </XYPlot>
    </div>
  );
}


export default DragableChartExample;