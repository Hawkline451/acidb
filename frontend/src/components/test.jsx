import React, { useEffect, useState } from 'react';

import {
  Button, Input, FormControl, MenuItem, TextField, Typography, Grid, FormControlLabel, Checkbox, FormGroup
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
} from 'react-vis';
import 'react-vis/dist/style.css';

import axios from 'axios';

// Internationalization
import { useTranslation } from 'react-i18next';

// Import components
import { Loader } from './loader'

// Styles
import { ThemeProvider } from "@material-ui/styles";
import { theme } from './css/themes'

// import config
import { config } from "../config";

function getRandomData() {
  return new Array(100).fill(0).map(row => ({
    id_organism: Math.random() * 10,
    ph_associated: Math.random() * 10,
    temp_associated: Math.random() * 20,
    temp_max: Math.random() * 10,
    ph_max: Math.random() * 0.5 + 0.5
  }));
}

const randomData = getRandomData();

const domain = {
  "Archaea": "Archaea",
  "Bacteria": 'Bacteria',
  'Eukarya': 'Eukarya'
}

const axis = {
  'Genome Size': 'gen_size',
  'GC Percentage': 'gc_percentage',
  'N Orfs': 'n_orfs',
  "Temp associated": 'temp_associated',
  "Temp min": 'temp_min',
  "Temp max": 'temp_max',
  "pH associated": 'ph_associated',
  "pH min": 'ph_min',
  "pH max": 'ph_max'

}


const legend = [
  { title: 'Archaea', color: '#C92FBE', strokeWidth: 20 },
  { title: 'Bacteria', color: '#12939A', strokeWidth: 20 },
  { title: 'Eukarya', color: '#2FC97C', strokeWidth: 20 },
]



const colors = {
  'Archaea': '#C92FBE',
  'Bacteria': '#12939A',
  'Eukarya': '#2FC97C',
  'highlighted': 'EF5D28'
}

export default function TestComponent() {

  const [state, setState] = useState({
    data: [],
    filteredData: [],
    value: false,

    filterArea: null,
    highlightedPoints: [],

    hovered: null,
    highlighting: false
  });

  const [plotState, setPlotState] = useState({
    width: 1000,
    height: 500,
    xAccessor: 'ph_associated',
    yAccessor: 'temp_associated',
    colors: ''
  });

  useEffect(() => {
    let filteredData
    const fetchData = async () => {
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
        filteredData = state.data.filter(item => (item[plotState.yAccessor] !== null && item[plotState.xAccessor] !== null))
        setStateValue('filteredData', filteredData)
      }
    };

    fetchData();
    // Empty array as second argument avoid fetching on component updates, only when mounting the component
  }, [state.data, plotState.xAccessor, plotState.yAccessor]);

  function setStateValue(keyName, newValue) {
    setState(oldValues => ({
      ...oldValues,
      [keyName]: newValue,
    }));
  }

  const highlightPoint = datapoint => {
    if (!state.filterArea) {
      return false;
    }
    const leftRight = datapoint[plotState.xAccessor] <= state.filterArea.right && datapoint[plotState.xAccessor] >= state.filterArea.left;
    const upDown = datapoint[plotState.yAccessor] <= state.filterArea.top && datapoint[plotState.yAccessor] >= state.filterArea.bottom;

    return leftRight && upDown;
  };

  const selectedPoints = state.filteredData.filter(highlightPoint);

  const checkInHighlightedPoints = (point) => {
    var found = state.highlightedPoints.some(value => value['id_organism'] === point['id_organism']);
    return found
  };


  const getColor = (datapoint) => {
    // if highlighted points, check if current point in highligted point then return color
    if (state.highlightedPoints.length) {
      return (checkInHighlightedPoints(datapoint) ? colors['highlighted'] : colors[datapoint.domain])
    }
    else {
      return colors[datapoint.domain]
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {false ?
        (<Loader />) :
        (
          <Grid container
            spacing={0}
            direction="row"
            alignItems="center"
            justify="center"
          >
              <XYPlot
                onMouseLeave={() => setStateValue('value', false)}
                width={plotState.width}
                height={plotState.height}
                getX={d => d[plotState.xAccessor]}
                getY={d => d[plotState.yAccessor]}
              >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />

                <Highlight
                  drag
                  onBrushStart={() => setStateValue('highlighting', true)}
                  onBrush={area => {
                    setStateValue('filterArea', area);
                    setStateValue('highlightedPoints', selectedPoints)
                  }}
                  onBrushEnd={area => {
                    setStateValue('highlighting', false);
                    setStateValue('filterArea', area);
                  }}

                  onDragStart={area => setStateValue('highlighting', true)}
                  onDrag={area => {
                    setStateValue('filterArea', area);
                    setStateValue('highlightedPoints', selectedPoints)
                  }}
                  onDragEnd={area => {
                    setStateValue('highlighting', false);
                    setStateValue('filterArea', area);
                  }}

                />
                <MarkSeries
                  className="mark-series-example"
                  strokeWidth={2}
                  opacity="0.8"
                  style={{ pointerEvents: state.highlighting ? 'none' : '' }}
                  colorType="literal"
                  getColor={datapoint => getColor(datapoint)}
                  onValueMouseOver={datapoint => setStateValue('hovered', datapoint)}
                  onValueMouseOut={() => setStateValue('hovered', false)}
                  onValueClick={(datapoint, event) => {
                    if (event.event.ctrlKey) {
                      // Call setState to re render the component after updating some values
                      if (!checkInHighlightedPoints(datapoint)) {
                        state.highlightedPoints.push(datapoint);
                        setStateValue('highlightedPoints', state.highlightedPoints)
                      }
                      else {
                        var index = state.highlightedPoints.findIndex(item => item.id_organism === datapoint.id_organism);
                        state.highlightedPoints.splice(index, 1);;
                        setStateValue('highlightedPoints', state.highlightedPoints)
                      }
                    }
                    else {
                      setStateValue('highlightedPoints', [datapoint])
                    }
                  }}
                  data={state.filteredData}
                />
                {state.hovered && <Hint value={state.hovered} />}
              </XYPlot>

              <DiscreteColorLegend height={200} width={300} items={legend} />
            </Grid>

        )
      }
      <p>{`There are ${state.highlightedPoints.length} selected points`}</p>
      {state.highlightedPoints.map(value => <div key={value.id_organism}>{`${plotState.xAccessor}:${value[plotState.xAccessor]} ${plotState.yAccessor}:${value[plotState.yAccessor]}`}</div>)}


      <SelectForm setState={setPlotState} state={plotState} />
      <RadialForm/>
    </ThemeProvider>
  );
}

function SelectForm(props) {

  function handleClick() {
    return
  }
  function handleChange(target) {
    props.setState(oldValues => ({
      ...oldValues,
      [target.name]: target.value,
    }));
  }

  return (
    <form autoComplete="off">
      <FormControl error={false}>
        <Typography variant={'h5'}>Select Axis</Typography>
        <TextField
          label='x Axis'
          name="xAccessor"
          select
          value={props.state.xAccessor}
          onChange={event => handleChange(event.target)}
          input={<Input id="xAccessor" />}
        >
          {Object.keys(axis).map(key => <MenuItem key={key} value={axis[key]}>{key}</MenuItem>)}
        </TextField>

        <TextField
          label='y Axis'
          name="yAccessor"
          select
          value={props.state.yAccessor}
          onChange={event => handleChange(event.target)}
          input={<Input id="yAccessor" />}
        >
          {Object.keys(axis).map(key => <MenuItem key={key} value={axis[key]}>{key}</MenuItem>)}
        </TextField>
      </FormControl>

      <Button variant="outlined" onClick={() => handleClick()}>Update</Button>
    </form>
  );
}

function RadialForm() {

  const [state, setState] = React.useState({
    Archaea: true,
    Bacteria: true,
    Eukarya: true,
  });
  function handleChange(name) {
    setState(oldValues => ({
      ...oldValues,
      [name]: !state[name],
    }));
    console.log("something change!!")
  }

  return (
    <form autoComplete="off">
      <FormControl component="fieldset">
      <Typography variant={'h5'}>Organism Domain</Typography>
      <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={state.Archaea} onChange={() => handleChange("Archaea")} value="Archaea" />}
            label="Archaea"
          />
          <FormControlLabel
            control={<Checkbox checked={state.Bacteria} onChange={() => handleChange("Bacteria")} value="Bacteria" />}
            label="Bacteria"
          />
          <FormControlLabel
            control={
              <Checkbox checked={state.Eukarya} onChange={() => handleChange("Eukarya")} value="Eukarya" />
            }
            label="Eukarya"
          />
        </FormGroup>
      </FormControl>

    </form>
  );
}