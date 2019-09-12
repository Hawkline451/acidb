import React, { useEffect, useState } from 'react';

import {
  Button, Input, FormControl, MenuItem, TextField, Typography, Grid, FormControlLabel, Checkbox, FormGroup, Paper, Table, TableBody, TableCell, TableRow
} from '@material-ui/core';

// NPM
import {
  DiscreteColorLegend,
  XYPlot,
  ChartLabel,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  Highlight,
  Hint
} from 'react-vis';
import 'react-vis/dist/style.css';

import axios from 'axios';

// Internationalization
import { useTranslation } from 'react-i18next';

// Import components
import { Loader } from './loader'

// Styles
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './css/themes'

// import config
import { config } from '../config';

const domain = {
  'Archaea': 'Archaea',
  'Bacteria': 'Bacteria',
  'Eukarya': 'Eukarya'
}

const axis = {
  'Genome Size': 'gen_size',
  'GC Percentage': 'gc_percentage',
  'N Orfs': 'n_orfs',
  'Temp associated': 'temp_associated',
  'Temp min': 'temp_min',
  'Temp max': 'temp_max',
  'pH associated': 'ph_associated',
  'pH min': 'ph_min',
  'pH max': 'ph_max'

}

const legend = [
  { title: 'Archaea', color: '#893FE8', strokeWidth: 20 },
  { title: 'Bacteria', color: '#12939A', strokeWidth: 20 },
  { title: 'Eukarya', color: '#FFCA26', strokeWidth: 20 },
]

const colors = {
  'Archaea': '#893FE8',
  'Bacteria': '#12939A',
  'Eukarya': '#FFCA26',
  'highlighted': '#C21201'
}

export default function TestComponent() {

  // Data state
  const [state, setState] = useState({
    data: [],
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
    colors: ''
  });

  // Radial buttons state
  const [formState, setFormState] = React.useState({
    Archaea: true,
    Bacteria: true,
    Eukarya: true,
  });

  useEffect(() => {
    let filteredData
    const fetchData = async () => {
      // if load for 1st time
      if (state.data.length === 0) {
        //setIsLoading(true);
        const result = await axios(
          config.API_SIMPLE_PLOT,
        );
        setStateValue('data', result.data)
        filteredData = result.data.filter(item => (item[plotState.yAccessor] !== null && item[plotState.xAccessor] !== null))

        setStateValue('filteredData', filteredData)
        //setIsLoading(false);
      }
      else {
        // Update axis
        filteredData = state.data.filter(item => (item[plotState.yAccessor] !== null && item[plotState.xAccessor] !== null))

        // Update categorical values (Domain)
        let currentDomain = Object.keys(formState).filter(item => formState[item] === true)
        // if item.domain in filtered domain
        filteredData = filteredData.filter(item => (currentDomain.indexOf(item.domain) != -1))

        setStateValue('filteredData', filteredData)
      }
    };

    fetchData();
    // Empty array as second argument avoid fetching on component updates, only when mounting the component
  }, [state.data, plotState.xAccessor, plotState.yAccessor, formState]);

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
    const upDown = datapoint[plotState.yAccessor] <= state.filterArea.top + 2 && datapoint[plotState.yAccessor] >= state.filterArea.bottom + 2;

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
          title: plotState.xAccessor,
          value: state.hovered[plotState.xAccessor]
        },
        {
          title: plotState.yAccessor,
          value: state.hovered[plotState.yAccessor]
        },
      ]
    }

    else {
      hint = [
        {
          title: 'Hint',
          value: `There are ${nearPoints.length} organism in this coordinates`
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
    return 4 + nearPoints.length * 0.2
  }


  return (
    <ThemeProvider theme={theme}>
      {false ?
        (<Loader />) :
        (
          <Grid container
            spacing={0}
            direction='row'
            alignItems='center'
            justify='center'
          >
            <Grid item  xs={8}
            >
              <XYPlot
                onMouseLeave={() => setStateValue('value', false)}
                width={plotState.width}
                height={plotState.height}
                margin={{ left: 50, bottom: 50 }}
                getX={d => d[plotState.xAccessor]}
                getY={d => d[plotState.yAccessor]}
              >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis style={{
                  text: { fontSize: 14 }
                }} />
                <YAxis style={{
                  text: { fontSize: 14 }
                }} />

                <ChartLabel
                  text={plotState.xAccessor}
                  className="alt-x-label"
                  includeMargin={true}
                  xPercent={0.5}
                  yPercent={0.89}
                />
                <ChartLabel
                  text={plotState.yAccessor}
                  className="alt-y-label"
                  includeMargin={true}
                  xPercent={0.01}
                  yPercent={0.5}
                  style={{
                    transform: 'rotate(-90)',
                  }}
                />


                <Highlight
                  drag
                  onBrushStart={() => setStateValue('highlighting', true)}
                  onBrush={area => {
                    setStateValue('filterArea', area);
                    setStateValue('highlightedPoints', selectedPointsInArea)
                  }}
                  onBrushEnd={area => {
                    setStateValue('highlighting', false);
                    setStateValue('filterArea', area);
                  }}

                  onDragStart={area => setStateValue('highlighting', true)}
                  onDrag={area => {
                    setStateValue('filterArea', area);
                    setStateValue('highlightedPoints', selectedPointsInArea)
                  }}
                  onDragEnd={area => {
                    setStateValue('highlighting', false);
                    setStateValue('filterArea', area);
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

            <Grid item  xs={1}>
              <DiscreteColorLegend  items={legend} />
            </Grid>

            <Grid item  xs={3}>
              <SelectForm setState={setPlotState} state={plotState} />
              <RadialForm setState={setFormState} state={formState} />
            </Grid>
          </Grid>
        )
      }
      <p>{`There are ${state.highlightedPoints.length} selected points`}</p>
      {state.highlightedPoints.map(value => <div key={value.id_organism}>{`id:${value.name} ${plotState.xAccessor}:${value[plotState.xAccessor]} ${plotState.yAccessor}:${value[plotState.yAccessor]}`}</div>)}

    </ThemeProvider>
  );
}

function SelectForm(props) {

  function handleChange(target) {
    props.setState(oldValues => ({
      ...oldValues,
      [target.name]: target.value,
    }));
  }

  return (
    <form autoComplete='off'>
      <FormControl error={false}>
        <Paper style={{ padding: 20 }}>
          <Typography align='center' variant={'h5'}>Select Axis</Typography>

          <Table >
            <TableBody >
              <TableRow key={'x-axis'}>
                <TableCell style={{ borderStyle: 'none' }}>
                  {'X Axis'}
                </TableCell>
                <TableCell style={{ borderStyle: 'none' }}>
                  <TextField
                    style={{ minWidth: '100%' }}
                    name='xAccessor'
                    select
                    value={props.state.xAccessor}
                    onChange={event => handleChange(event.target)}
                    input={<Input id='xAccessor' />}
                  >
                    {Object.keys(axis).map(key => <MenuItem key={key} value={axis[key]}>{key}</MenuItem>)}
                  </TextField>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ borderStyle: 'none' }}>
                  {'Y Axis'}
                </TableCell>
                <TableCell style={{ borderStyle: 'none' }}>
                  <TextField
                    style={{ minWidth: '100%' }}
                    name='yAccessor'
                    select
                    value={props.state.yAccessor}
                    onChange={event => handleChange(event.target)}
                    input={<Input id='yAccessor' />}
                  >
                    {Object.keys(axis).map(key => <MenuItem key={key} value={axis[key]}>{key}</MenuItem>)}
                  </TextField>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Typography align='center' variant={'h5'}>Plot Size</Typography>
          <Table>
          <TableBody >
            <TableRow>
              <TableCell>
                <TextField
                  style={{ maxWidth: '20%' }}
                  label='Width'
                  name='width'
                  //select
                  value={props.state.width}
                  //onChange={event => handleChange(event.target)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                </TextField>
              </TableCell>
              <TableCell>
                <TextField
                  style={{ maxWidth: '20%' }}
                  label='Height'
                  name='height'
                  //select
                  value={props.state.height}
                  //onChange={event => handleChange(event.target)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                </TextField>
              </TableCell>
            </TableRow>
            </TableBody>
          </Table>

        </Paper>
      </FormControl>
    </form>
  );
}

function RadialForm(props) {

  function handleChange(name) {
    // Set radio button state (parent state)
    props.setState(oldValues => ({
      ...oldValues,
      [name]: !props.state[name],
    }));
  }

  return (
    <form autoComplete='off'>
      <FormControl style={{ minWidth: '100%' }} component='fieldset'>
        <Paper style={{ padding: 20 }}>
          <Typography align='center' variant={'h5'}>Organism Domain</Typography>
          <FormGroup >
            {Object.keys(domain).map(key =>
              <FormControlLabel
                style={{ alignSelf: 'center' }}
                key={key}
                control={<Checkbox checked={props.state[key]} onChange={() => handleChange(key)} value={key} />}
                label={key}>{key}
              </FormControlLabel>)}
          </FormGroup>
        </Paper>
      </FormControl>

    </form>
  );
}