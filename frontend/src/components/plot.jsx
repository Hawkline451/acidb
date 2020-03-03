import React, { useEffect, useState } from 'react';

import {
  Grid, Button, Typography
} from '@material-ui/core';

// NPM
import {
  DiscreteColorLegend,
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  Highlight,
  Hint
} from 'react-vis-hl';
import 'react-vis-hl/dist/style.css';

import axios from 'axios';
import { CSVLink } from 'react-csv';

// Internationalization
import { useTranslation } from 'react-i18next';

// Import components
import { Loader } from './loader'
import { SelectForm, RadioForm, OrganismView } from './plot_components'
import { colors } from './utils/const_color'

// Styles
import { ThemeProvider } from '@material-ui/styles';
import { stylesTable } from './css/themes'
import { theme } from './css/themes'

// import config
import { config } from '../config';

const useStylesTable = stylesTable

const headersCSV = [
  'id_organism',
  'name',
  'strains_str',
  'seq_date',

  'domain',

  'ph_associated',
  'ph_min',
  'ph_max',
  'temp_associated',
  'temp_min',
  'temp_max',

  'isolated',
  'gen_size',
  'gc_percentage',
  'state',

  'n_orfs',
];

const genQualityDict = { '80-5': { completeness: 80, contamination: 5 }, '90-10': { completeness: 90, contamination: 10 } }

const legend = [
  { title: 'Archaea', color: colors['Archaea'], strokeWidth: 20 },
  { title: 'Bacteria', color: colors['Bacteria'], strokeWidth: 20 },
  { title: 'Eukarya', color: colors['Eukarya'], strokeWidth: 20 },
]

export default function PlotComponent() {
  const classes = useStylesTable();
  const { t } = useTranslation();

  // Data state
  const [state, setState] = useState({
    data: null,
    filteredData: [],
    value: false,

    filterArea: null,
    highlightedPoints: [],

    hovered: null,
    highlighting: false
  });

  // Plot state
  const [plotState, setPlotState] = useState({
    width: 1000,
    height: 500,
    xAccessor: 'ph_associated',
    yAccessor: 'temp_associated',
    genQuality: 'none'
  });

  // Radio buttons state
  const [formState, setFormState] = React.useState({
    Archaea: true,
    Bacteria: true,
    Eukarya: true,

    isolated: true,
    non_isolated: true,
    complete: true,
    draft: true
  });

  useEffect(() => {
    let filteredData
    const fetchData = async () => {
      // if load for 1st time
      if (state.data === null) {
        const result = await axios(
          config.API_SIMPLE_PLOT,
        );
        setStateValue('data', result.data)
        filteredData = result.data.filter(item => (item[plotState.yAccessor] !== null && item[plotState.xAccessor] !== null))

        setStateValue('filteredData', filteredData)
      }
      else {
        // First check completeness/contamination
        if (plotState.genQuality !== 'none') {
          filteredData = state.data.filter(item => 
            (item.gen_completeness >= genQualityDict[plotState.genQuality].completeness && item.gen_contamination <= genQualityDict[plotState.genQuality].contamination))
        }
        else {
          filteredData = state.data
        }

        // Update axis
        filteredData = filteredData.filter(item => (item[plotState.yAccessor] !== null && item[plotState.xAccessor] !== null))

        // Update categorical values 
        let currentFormState = Object.keys(formState).filter(item => formState[item] === true)
        // currentFormState contains an array with the names of the true properties eg [Archaea,Bacteria, isolated,draft,complete]

        // if item.domain in filtered domain
        filteredData = filteredData.filter(item => (currentFormState.indexOf(item.domain) !== -1))

        // filter state (isolated, gen_state)

        // isolated = 'yes' non_isolated='no'
        let isolatedValues = []
        if (currentFormState.indexOf('isolated') !== -1) {
          isolatedValues.push('yes')
        }
        if (currentFormState.indexOf('non_isolated') !== -1) {
          isolatedValues.push('no')
        }

        filteredData = filteredData.filter(item => (isolatedValues.indexOf(item.isolated) !== -1))
        filteredData = filteredData.filter(item => (currentFormState.indexOf(item.state) !== -1))

        setStateValue('filteredData', filteredData)
      }
    };

    fetchData();
    // Empty array as second argument means avoid fetching on component updates, only when mounting the component
  }, [state.data, plotState.xAccessor, plotState.yAccessor, plotState.genQuality, formState]);

  function setStateValue(keyName, newValue) {
    setState(oldValues => ({
      ...oldValues,
      [keyName]: newValue,
    }));
  }

  const highlightPointInArea = datapoint => {
    if (!state.filterArea) {
      return false;
    }
    const leftRight = datapoint[plotState.xAccessor] <= state.filterArea.right && datapoint[plotState.xAccessor] >= state.filterArea.left;
    const upDown = datapoint[plotState.yAccessor] <= state.filterArea.top && datapoint[plotState.yAccessor] >= state.filterArea.bottom;

    return leftRight && upDown;
  };

  const selectedPointsInArea = state.filteredData.filter(highlightPointInArea);
  const selectedPointsIn = datapoint => {
    let points = state.filteredData.filter(point => {
      return (point[plotState.xAccessor] === datapoint[plotState.xAccessor]) && (point[plotState.yAccessor] === datapoint[plotState.yAccessor])
    });
    return points
  }

  const checkInHighlightedPoints = (point) => {
    var found = state.highlightedPoints.some(value => value['id_organism'] === point['id_organism']);
    return found
  };

  const getHint = () => {
    let hint
    let nearPoints = selectedPointsIn(state.hovered)
    if (nearPoints.length === 1) {
      hint = [
        {
          title: 'Name',
          value: state.hovered.name
        },
        {
          title: 'Strain',
          value: state.hovered.strains.map(a => a.strain_name).join(' = ')
        },
        {
          title: t('table.' + plotState.xAccessor),
          value: state.hovered[plotState.xAccessor]
        },
        {
          title: t('table.' + plotState.yAccessor),
          value: state.hovered[plotState.yAccessor]
        },
      ]
    }
    else {
      hint = [
        {
          title: t('plot.hint'),
          value: t('plot.hint_detail', { nearPoints: nearPoints.length })
        },
      ]
    }
    return hint
  }

  const getColor = (datapoint) => {
    // if highlighted points, check if current point in highligted point then return color
    return (state.highlightedPoints.some(point => point.id_organism === datapoint.id_organism) ? colors['highlighted'] : colors[datapoint.domain])
  }

  const getSize = (datapoint) => {
    let nearPoints = selectedPointsIn(datapoint)
    return 4 + nearPoints.length * 0.3
  }

  function getProcesedData() {
    let duplicated = state.highlightedPoints.slice(0)

    for (var i = 0; i < duplicated.length; i++) {
      duplicated[i].strains_str = duplicated[i].strains.map(a => a.strain_name).join(' = ')
    }
    return duplicated
  }


  return (
    <ThemeProvider theme={theme}>
      {state.data === null ?
        (<Loader />) :
        (
          <Grid container
            spacing={5}
            direction='row'
            alignItems='center'
            justify='center'
          >
            <Grid item
            >
              <Typography align='center' variant={'h5'}>{`${t('table.' + plotState.xAccessor)} vs ${t('table.' + plotState.yAccessor)}`}</Typography>
              <XYPlot
                id='svg-plot'
                onMouseLeave={() => setStateValue('value', false)}
                width={plotState.width}
                height={plotState.height}
                margin={{ left: 70, bottom: 50 }}
                getX={d => d[plotState.xAccessor]}
                getY={d => d[plotState.yAccessor]}
              >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis
                  title={t('table.' + plotState.xAccessor)}
                  style={{
                    text: { fontSize: 14 }
                  }} />
                <YAxis
                  title={t('table.' + plotState.yAccessor)}
                  style={{
                    text: { fontSize: 14 }
                  }} />

                <Highlight
                  drag
                  onBrushStart={() => setStateValue('highlighting', true)}
                  onBrush={area => {setStateValue('filterArea', area);}}
                  onBrushEnd={area => {
                    setStateValue('highlighting', false);
                    setStateValue('filterArea', area);
                    setStateValue('highlightedPoints', selectedPointsInArea)
                  }}

                  onDragStart={area => setStateValue('highlighting', true)}
                  onDrag={area => {setStateValue('filterArea', area);}}
                  onDragEnd={area => {
                    setStateValue('highlighting', false);
                    setStateValue('filterArea', area);
                    setStateValue('highlightedPoints', selectedPointsInArea)
                  }}

                />
                <MarkSeries
                  className='mark-series-example'
                  strokeWidth={2}
                  opacity='0.7'
                  style={{ pointerEvents: state.highlighting ? 'none' : '' }}
                  colorType='literal'
                  getColor={datapoint => getColor(datapoint)}
                  sizeType='literal'
                  getSize={datapoint => getSize(datapoint)}

                  onValueMouseOver={datapoint => setStateValue('hovered', datapoint)}
                  onValueMouseOut={() => setStateValue('hovered', false)}
                  onValueClick={(datapoint, event) => {
                    let nearPoints = selectedPointsIn(datapoint)
                    //let nearPoints = [datapoint]                  
                    // for each point in the same coordinates
                    if (event.event.ctrlKey || event.event.metaKey) {
                      // Call setState to re render the component after updating some values
                      for (var i = 0; i < nearPoints.length; i++) {
                        let tmpDatapoint = nearPoints[i]
                        // check if point (and points with the same coordinates)already highlighted
                        if (!checkInHighlightedPoints(tmpDatapoint)) {
                          state.highlightedPoints.push(tmpDatapoint);
                        }
                        // if highlighted the remove
                        else {
                          var index = state.highlightedPoints.findIndex(item => item.id_organism === tmpDatapoint.id_organism);
                          state.highlightedPoints.splice(index, 1);;
                        }
                      }
                      setStateValue('highlightedPoints', state.highlightedPoints)
                    }
                    else {
                      setStateValue('highlightedPoints', nearPoints)
                    }
                  }
                  }
                  data={state.filteredData}
                />
                {state.hovered && <Hint value={state.hovered} format={() => getHint()} />}
              </XYPlot>
            </Grid>

            <Grid item >
              <DiscreteColorLegend items={legend} />
            </Grid>

            <Grid item style={{ marginTop: 20, maxWidth: 400 }}>
              <SelectForm setState={setPlotState} state={plotState} />
              <RadioForm setState={setFormState} state={formState} />
            </Grid>
          </Grid>
        )
      }
      <Grid container
        direction='column'
        alignItems='center'
      >
        <Grid container
          direction='row'
          alignItems='center'
          justify='center'
        >
          <Grid item align='center'>
            {state.highlightedPoints.length === 1 
            ? <p>{`There is ${state.highlightedPoints.length} selected point`}</p> 
            : <p>{`There are ${state.highlightedPoints.length} selected points`}</p> }            
          </Grid>
          <Grid item align='center'>
            <CSVLink
              className={classes.noDecoratorLink}
              headers={headersCSV}
              data={getProcesedData()}
              separator={'\t'}
              filename={'filtered_points.csv'}
            >
              <Button className={classes.formControl} variant='outlined' color='primary'>{t('download_file')}</Button>
            </CSVLink>
          </Grid>
        </Grid>

        <Grid >
          <OrganismView highlightedPoints={state.highlightedPoints} plotState={plotState} />
        </Grid>
      </Grid>
    </ThemeProvider >
  );
}