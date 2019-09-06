import React, { useState } from 'react';

import {
  Button, Select, Input, InputLabel, FormHelperText, FormControl, MenuItem
} from '@material-ui/core';

import {
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

function getRandomData() {
  return new Array(100).fill(0).map(row => ({
    x: Math.random() * 10,
    y: Math.random() * 20,
    color: Math.random() * 10,
    opacity: Math.random() * 0.5 + 0.5
  }));
}

const randomData = getRandomData();

export default function TestComponent() {
  const [state, setState] = useState({
    data: randomData,
    value: false,

    filterArea: null,
    highlightedPoints: [],

    hovered: null,
    highlighting: false
  });

  const [stateStyle, setStateStyle] = useState({
    width: 1000,
    height: 500,
    xAccessor: 'x',
    yAccessor: 'y',
    colors: ''
  });

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
    const leftRight = datapoint[stateStyle.xAccessor] <= state.filterArea.right && datapoint[stateStyle.xAccessor] >= state.filterArea.left;
    const upDown = datapoint[stateStyle.yAccessor] <= state.filterArea.top + 0.5 && datapoint[stateStyle.yAccessor] >= state.filterArea.bottom + 0.5;
    return leftRight && upDown;
  };

  const selectedPoints = state.data.filter(highlightPoint);

  const checkInArray = (point) => {
    console.log(state.highlightedPoints)
    var found = state.highlightedPoints.some(value => value[stateStyle.xAccessor] === point[stateStyle.xAccessor]);
    return found
  };

  return (
    <div className="canvas-wrapper">

      <XYPlot
        onMouseLeave={() => setStateValue('value', false)}
        width={stateStyle.width}
        height={stateStyle.height}
        getX={d => d[stateStyle.xAccessor]}
        getY={d => d[stateStyle.yAccessor]}
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
          getColor={datapoint => (state.highlightedPoints.length ? (state.highlightedPoints.some(point => point[stateStyle.xAccessor] === datapoint[stateStyle.xAccessor]) ? '#EF5D28' : '#12939A') : '#12939A')}
          onValueMouseOver={datapoint => setStateValue('hovered', datapoint)}
          onValueMouseOut={datapoint => setStateValue('hovered', false)}
          onValueClick={(datapoint, event) => {

            if (event.event.ctrlKey) {
              if (!checkInArray(datapoint)) state.highlightedPoints.push(datapoint); setStateValue('highlightedPoints', state.highlightedPoints)
            }
            else {
              setStateValue('highlightedPoints', [datapoint])
            }
          }}
          data={state.data}
        />
        {state.hovered && <Hint value={state.hovered} />}
      </XYPlot>
      <p>{`There are ${state.highlightedPoints.length} selected points`}</p>
      {state.highlightedPoints.map(value => <div key={value[stateStyle.xAccessor]}>{`X:${value[stateStyle.xAccessor]} Y:${value[stateStyle.yAccessor]}`}</div>)}

      <Button>Update</Button>
      <SelectForm setState={setStateStyle}/>
    </div>
  );
}

function SelectForm(props) {

  const [selectState, setSelectState] = useState({xAxis:'x', yAxis:'y', hasError:false})

  function setStateValue(keyName, newValue) {
    setSelectState(oldValues => ({
      ...oldValues,
      [keyName]: newValue,
    }));
  }


  function  handleClick() {
    setStateValue('hasError', false);
    if (!selectState.xAxis || !selectState.yAxis) {
      setStateValue('hasError', true);
    }
    console.log(selectState)
    props.setState(oldValues => ({
      ...oldValues,
      'xAccessor': selectState.xAxis,
      'yAccessor': selectState.yAxis,
    }));
  }

  function handleChange(target) {
    setStateValue(target.name, target.value);
  }


  return (
    <form  autoComplete="off">
      <FormControl error={selectState.hasError}>

        <Select
          name="xAxis"
          value={selectState.xAxis}
          onChange={event => handleChange(event.target)}
          input={<Input id="xAxis" />}
        >
          <MenuItem value="x">x</MenuItem>
          <MenuItem value="y">y</MenuItem>
        </Select>

        <Select
          name="yAxis"
          value={selectState.yAxis}
          onChange={event => handleChange(event.target)}
          input={<Input id="yAxis" />}
        >
          <MenuItem value="x">x</MenuItem>
          <MenuItem value="y">y</MenuItem>
        </Select>
        {selectState.hasError && <FormHelperText>This is required!</FormHelperText>}
      </FormControl>
      <button type="button" onClick={() => handleClick()}>
        Submit
      </button>
    </form>
  );
}