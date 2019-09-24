import React, { Fragment, useEffect, useState } from 'react';

import {
  Grid, Select, Paper, Typography, Table, TableBody, TableCell, TableRow, MenuItem
} from '@material-ui/core';

// NPM
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalRectSeries,
  VerticalBarSeries,
  Hint,
  ChartLabel
} from 'react-vis';
import 'react-vis/dist/style.css';

import axios from 'axios';

// Internationalization
import { useTranslation } from 'react-i18next';

// Import components
import { Loader } from './loader'

import { colors } from "./utils/const_color";

// Styles
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './css/themes'

// import config
import { config } from '../config';


const binSize = {
  ph_associated: 1,
  temp_associated: 10,
  gc_percentage: 5,
  gen_size: 1000,
}

export default function SimpleBarComponent() {
  const { t } = useTranslation();

  const [state, setState] = useState({
    data: null,
    barChartDomainData: null,
    barChartIsolatedData: null,
    barChartAssemblyData: null,
    histogramData: null,

    hoveredBarDomain: null,
    hoveredBarIsolated: null,
    hoveredBarAssemblyLevel: null,

    hoveredHist: null,
  });

  const [formState, setFormState] = useState({
    histogram: 'ph_associated',
  });


  useEffect(() => {
    const fetchData = async () => {
      let nameMetric
      let bars
      let barChartData
      let bins
      let histogramData

      // if load for 1st time
      if (state.data === null) {
        //setIsLoading(true);
        const result = await axios(
          config.API_SIMPLE_PLOT,
        );
        setStateValue('data', result.data)

        // bar chart
        nameMetric = 'domain'
        bars = getBarChart(result.data, nameMetric)
        barChartData = makeBarChart(bars)
        setStateValue('barChartDomainData', barChartData)
        nameMetric = 'isolated'
        bars = getBarChart(result.data, nameMetric)
        barChartData = makeBarChart(bars)
        setStateValue('barChartIsolatedData', barChartData)
        nameMetric = 'state'
        bars = getBarChart(result.data, nameMetric)
        barChartData = makeBarChart(bars)
        setStateValue('barChartAssemblyData', barChartData)

        nameMetric = formState.histogram
        bins = getHistogram(result.data, binSize[nameMetric], nameMetric)
        histogramData = makeHistogram(bins, binSize[nameMetric])
        setStateValue('histogramData', histogramData)
      }
      else {
        nameMetric = formState.histogram
        let tmpData = nameMetric !== 'gen_size' ? state.data : filterQuality(state.data)
        bins = getHistogram(tmpData, binSize[nameMetric], nameMetric)
        histogramData = makeHistogram(bins, binSize[nameMetric])
        setStateValue('histogramData', histogramData)
      }
    }

    fetchData();
    // Empty array as second argument means avoid fetching on component updates, only when mounting the component
  }, [formState.histogram, state.data]);

  function filterQuality(data) {
    let res = data.filter(item => item.gen_completeness >= 80 && item.gen_contamination <= 5)
    return res
  }

  function setStateValue(keyName, newValue) {
    setState(oldValues => ({
      ...oldValues,
      [keyName]: newValue,
    }));
  }

  // return dict like { att1: 3, att2: 4, att3: 2}
  function getBarChart(data, attribute) {
    let res = data.reduce((acc, val) => {
      acc[val[attribute]] = (acc[val[attribute]] || 0) + 1;
      return acc;
    }, {})
    return res
  }

  // return array like [3,4,2]
  function getHistogram(data, binSize, nameMetric) {
    let count = []
    let res = data.reduce((acc, val) => {
      let i = 0;
      let idx = 0;
      while (val[nameMetric] > i) {
        i = i + binSize
        idx++
      }
      count[idx - 1] = val[nameMetric] !== null ? (count[idx - 1] || 0) + 1 : count[idx];
      return count;
    }, {})
    return res
  }

  // return array for react-vis chart series  [{ x: A, y: 1},{ x: b, y: 5},...]
  function makeBarChart(data) {
    let res = []
    let keys = Object.keys(data).sort()
    let len = keys.length
    for (let i = 0; i < len; i++) {
      let key = keys[i]
      let tmp = { x: key, y: data[key] }
      res.push(tmp)
    }
    return res
  }

  // return array for react-vis histogram [{ x0: 0, x: 1, val: 1 },{ x0: 1, x: 2, val: 5 }....]
  function makeHistogram(bins, binSize) {
    let res = []
    let len = bins.length
    for (let i = 0; i < len; i++) {
      let tmp = { x0: i * binSize, x: (i + 1) * binSize, y: bins[i] || 0 }
      if (tmp.y !== 0) {
        res.push(tmp)
      }
    }
    return res
  }

  const getHint = () => {
    let hint
    hint = [
      {
        title: 'Range',
        value: '[' + state.hoveredHist.x0 + '-' + state.hoveredHist.x + ')'
      },
      {
        title: 'Count',
        value: state.hoveredHist.y
      },
    ]

    return hint
  }

  return (
    <ThemeProvider theme={theme}>
      {state.data === null ?
        (<Loader />) :
        (
          <Grid container
            spacing={5}
            direction='column'
            alignItems='center'
            justify='center'
            style={{ marginTop: 20 }}
          >
            <Grid item >
              <Grid container
                spacing={5}
                direction='row'
                alignItems='center'
                justify='center'
              >
                <Grid item >
                  <Typography align='center' variant={'h5'}>{t('plot.histogram')}</Typography>
                  <XYPlot width={600} height={400} margin={{ bottom: 60 }}>
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <ChartLabel
                      text={t('table.'+formState.histogram)}
                      includeMargin={true}
                      xPercent={0.8}
                      yPercent={0.85}
                    />
                    <VerticalRectSeries
                      data={state.histogramData}
                      stroke="white"
                      colorType="literal"
                      onValueMouseOver={datapoint => setStateValue('hoveredHist', datapoint)}
                      onValueMouseOut={() => setStateValue('hoveredHist', false)}
                    />
                    {state.hoveredHist && <Hint value={state.hoveredHist} format={() => getHint()} />}
                  </XYPlot>
                </Grid>
                <Grid item>
                  <SelectHist setState={setFormState} state={formState} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid container
                spacing={5}
                direction='row'
                alignItems='center'
                justify='center'
              >
                <Grid item >
                  <Typography align='center' variant={'h5'}>{t('table.domain')}</Typography>
                  <XYPlot xType="ordinal" width={300} height={300} xDistance={100}>
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <VerticalBarSeries
                      data={state.barChartDomainData}
                      onValueMouseOver={datapoint => setStateValue('hoveredBarDomain', datapoint)}
                      onValueMouseOut={() => setStateValue('hoveredBarDomain', false)}
                      colorType='literal'
                      getColor={datapoint => colors[datapoint.x]}
                    />
                    {state.hoveredBarDomain && <Hint value={state.hoveredBarDomain} />}
                  </XYPlot>
                </Grid>
                <Grid item >
                  <Typography align='center' variant={'h5'}>{t('table.isolated')}</Typography>
                  <XYPlot xType="ordinal" width={300} height={300} xDistance={100}>
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <VerticalBarSeries
                      data={state.barChartIsolatedData}
                      onValueMouseOver={datapoint => setStateValue('hoveredBarIsolated', datapoint)}
                      onValueMouseOut={() => setStateValue('hoveredBarIsolated', false)}
                      colorType='literal'
                      getColor={datapoint => colors[datapoint.x]}
                    />
                    {state.hoveredBarIsolated && <Hint value={state.hoveredBarIsolated} />}
                  </XYPlot>
                </Grid>
                <Grid item >
                  <Typography align='center' variant={'h5'}>{t('table.state')}</Typography>
                  <XYPlot xType="ordinal" width={300} height={300} xDistance={100}>
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <VerticalBarSeries
                      data={state.barChartAssemblyData}
                      onValueMouseOver={datapoint => setStateValue('hoveredBarAssembly', datapoint)}
                      onValueMouseOut={() => setStateValue('hoveredBarAssembly', false)}
                      colorType='literal'
                      getColor={datapoint => colors[datapoint.x]}
                    />
                    {state.hoveredBarAssembly && <Hint value={state.hoveredBarAssembly} />}
                  </XYPlot>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )
      }
    </ThemeProvider >
  );
}






const axis = [
  'gen_size',
  'gc_percentage',
  'temp_associated',
  'ph_associated',
]


function SelectHist(props) {
  const { t } = useTranslation();

  function handleChange(target) {
    props.setState(oldValues => ({
      ...oldValues,
      [target.name]: target.value,
    }));
  }

  return (
    <Fragment>
      <Paper square style={{ maxWidth: 300, padding: 20 }}>
        <Typography align='center' variant={'h5'}>{t('plot.select_histogram')}</Typography>

        <Table >
          <TableBody>
            <TableRow key={'x-axis'}>
              <TableCell style={{ borderStyle: 'none', paddingRight: 10 }}>
              {t('plot.attribute')}
              </TableCell>
              <TableCell style={{ borderStyle: 'none', paddingRight: 10 }}>
                <Select
                  MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    }
                  }}
                  style={{ minWidth: '100%' }}
                  name='histogram'
                  value={props.state.histogram}
                  onChange={event => handleChange(event.target)}
                >
                  {axis.map(key => <MenuItem key={key} value={key}>{t('table.'+key)}</MenuItem>)}
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {props.state.histogram === 'gen_size' ? <div style={{ fontSize: 12 }} align='center'>
          * Genome size filter values over 80% of completeness and less than 5% of contamination
                </div> : <div></div>}
      </Paper>
    </Fragment>
  );
}
