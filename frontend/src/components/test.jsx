import React from 'react';

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
const colorRanges = {
  typeA: ['#59E4EC', '#0D676C'],
};

const randomData = getRandomData();

export default class TestComponent extends React.Component {
  state = {
    drawMode: 0,
    data: randomData,
    value: false,

    filterArea: null,
    highlightedPoints: [],
  
    hovered: null,
    highlighting: false
  };

  render() {
    const { data, filterArea, hovered, highlighting } = this.state;

    const highlightPoint = dataPoint => {
      if (!filterArea) {
        return false;
      }
      const leftRight = dataPoint.x <= filterArea.right && dataPoint.x >= filterArea.left;
      const upDown = dataPoint.y <= filterArea.top+0.8 && dataPoint.y >= filterArea.bottom+0.8;
      return leftRight && upDown;
    };

    const selectedPoints = data.filter(highlightPoint);

    const checkInArray = (point) => {
      console.log(this.state.highlightedPoints)
      var found = this.state.highlightedPoints.some(value => value.x === point.x);
      return found
    };

    return (
      <div className="canvas-wrapper">

        <XYPlot
          onMouseLeave={() => this.setState({ value: false })}
          width={1000}
          height={500}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />

          <Highlight
            drag
            onBrushStart={() => this.setState({ highlighting: true })}
            onBrush={area => {this.setState({ filterArea: area });this.setState({ highlightedPoints: selectedPoints })} }
            onBrushEnd={area =>
              this.setState({ highlighting: false, filterArea: area })
            }
            onDragStart={area => this.setState({ highlighting: true })}
            onDrag={area => {this.setState({ filterArea: area });this.setState({ highlightedPoints: selectedPoints })} }
            onDragEnd={area =>
              this.setState({ highlighting: false, filterArea: area })
            } 

            onValueClick={(info)=>{console.log("highlight out");console.log(info)}}
          />
          <MarkSeries
            className="mark-series-example"
            strokeWidth={2}
            opacity="0.8"
            style={{ pointerEvents: highlighting ? 'none' : '' }}
            colorType="literal"
            getColor={dataPoint => (this.state.highlightedPoints.length ? (this.state.highlightedPoints.some(point => point.x === dataPoint.x)? '#EF5D28' : '#12939A'):'#12939A')}
            onValueMouseOver={dataPoint => this.setState({ hovered: dataPoint })}
            onValueMouseOut={dataPoint => this.setState({ hovered: false })}
            onValueClick={(datapoint, event)=>{
              
              if(event.event.ctrlKey){
                if (!checkInArray(datapoint)) this.state.highlightedPoints.push(datapoint);this.setState({ highlightedPoints: this.state.highlightedPoints}) 
              }
              else{
                this.setState({ highlightedPoints: [datapoint]}) 

              }
              // does something on click

            }}
            data={data}
          />
          {this.state.value ? <Hint value={this.state.value} /> : null}

          {hovered && <Hint value={hovered} />}
        </XYPlot>
        <p>{`There are ${this.state.highlightedPoints.length} selected points`}</p>
        {this.state.highlightedPoints.map(value => <div key={value.x}>{`X:${value.x} Y:${value.y}`}</div>)}
      </div>
    );
  }
}
