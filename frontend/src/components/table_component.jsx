import React, { useState } from "react";
import { makeData, Tips, miniEval, customFilter } from "./utils";
import matchSorter from 'match-sorter'

import {
  Chip, Select, FormControl, Input, InputLabel, MenuItem, TextField
} from '@material-ui/core';
import {
  Close as CloseIcon,
} from '@material-ui/icons';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";


import { theme, stylesTable } from './themes'


const colNames = [
  'Col 1',
  'Col 2',
  'Col 3',
  'Col 4',
];
const useStylesTable = stylesTable


// Filter box component
function FilterInput(props){

  const classes = useStylesTable();
  const [state, setState] = useState({
    valid: false
  });
  function handlerWarapper(val){
    var match = String(val).match(/((>=|<=|>|<)\d+|\d+(>=|<=|>|<))(;(>=|<=|>|<)\d+|\d+(>=|<=|>|<))?/)
    if (match == null || match[0] != String(val) ){
      console.log("bad")
      console.log(match)
      setState({valid: true})
    }
    else{
      console.log("good")
      console.log(match)
      props.handler(val)
      setState({valid: false})
    }
  }
  var label = state.valid ? 'error' : 'wrong filter'
  return (
    <TextField label={label} onChange={event => handlerWarapper(event.target.value)} style={{ width: "100%" }} error={state.valid}></TextField>
  )
}

function TableComponent() {

  const classes = useStylesTable();

  const [state, setState] = useState({
    data: makeData(),
    filter: true
  });

  const [chipState, setChipState] = useState({
    name: [colNames[0], colNames[1], colNames[2]]
  });

  function handleChange(event) {
    setChipState({ name: event.target.value })
  }

  function verboseFilter(filter, rows) {
    var result = []
    // If is number
    if (!isNaN(filter.value)) {
      result = rows.filter((row) => {
        //console.log(row[filter.id] == filter.value)
        return row[filter.id] == filter.value;
      });
    }
    // Expression
    else {
      result = []
      var exps = miniEval(filter.value)
      //console.log("exps")
      //console.log(exps)

      // TODO Remove and refactor, this block does nothing
      if (exps === undefined || exps.length === 0) {
        console.log("bad input")
        return [-1]
      }
     
      for (var i = 0; i < exps.length; i++) {
        var expression = exps[i]
        result  = customFilter(rows, filter, expression)
      }
    }
    return result
  }

  return (
    <div>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel label='Select Columns' htmlFor="select-multiple-chip">Select Columns</InputLabel>
          <Select
            multiple
            value={chipState.name}
            onChange={handleChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div >
                {selected.map(value => <Chip key={value} label={value} />)}
              </div>
            )}
            MenuProps={{
              getContentAnchorEl: null,
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              }
            }}
          >
            {colNames.map(name => (
              <MenuItem
                key={name}
                value={name}
                style={{
                  fontWeight:
                    chipState.name.indexOf(name) === -1
                }}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div>
        <ReactTable
          data={state.data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          columns={[
            {
              Header: "Name",
              columns: [
                {
                  show: true ? chipState.name.includes(colNames[0]) : false,
                  Header: colNames[0],
                  accessor: "firstName",
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
                {
                  show: true ? chipState.name.includes(colNames[1]) : false,
                  Header: colNames[1],
                  id: "lastName",
                  accessor: d => d.lastName,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["lastName"] }),
                  filterAll: true
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  show: true ? chipState.name.includes(colNames[2]) : false,
                  Header: colNames[2],
                  accessor: "age",
                  filterMethod: (filter, rows) =>
                    verboseFilter(filter, rows),
                  filterAll: true,
                  Filter: ({ onChange }) =>                  
                  <FilterInput handler={onChange}/>
                },
                {
                  show: true ? chipState.name.includes(colNames[3]) : false,
                  Header: colNames[3],
                  accessor: "age",
                  id: "over",
                  Cell: ({ value }) => (value >= 21 ? "Yes" : "No"),
                  filterMethod: (filter, row) => {
                    if (filter.value === "all") {
                      return true;
                    }
                    if (filter.value === "true") {
                      return row[filter.id] >= 21;
                    }
                    return row[filter.id] < 21;
                  },
                  Filter: ({ filter, onChange }) =>
                    <select
                      onChange={event => onChange(event.target.value)}
                      style={{ width: "100%" }}
                      value={filter ? filter.value : "all"}
                    >
                      <option value="all">Show All</option>
                      <option value="true">Can Drink</option>
                      <option value="false">Can't Drink</option>
                    </select>
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
        <Tips />
      </div>
    </div>
  );
}


export default TableComponent;