import React, { useState } from "react";
import { makeData, Tips, verboseFilter } from "./utils";
import matchSorter from 'match-sorter'
import {
  Link
} from 'react-router-dom';
import {
  Chip, Select, FormControl, Input, InputLabel, MenuItem, TextField, Tooltip, Button, Grid
} from '@material-ui/core';
import {
  HelpOutline as HelpIcon, ZoomIn as ZoomIcon
} from '@material-ui/icons';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
// Override some classes exported from npm modules
//import "./css/override.css"

// Styles
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesTable } from './themes'


const colNames = [
  'Col 1',
  'Col 2',
  'Col 3',
  'Col 4',
];
const useStylesTable = stylesTable


/*
 * Sub components
 */

// Filter box component
function CustomFilterInput(props) {

  const classes = useStylesTable();
  const [state, setState] = useState({
    valid: false
  });
  function handlerWarapper(val) {
    // Replace space and brackets
    val = val.replace(/\s/g, '')
    val = val.replace(/[\])}[{(]/g, '')
    // Match operator + number or number + operator or expression semi colon expression 
    var match = String(val).match(/(((>=|<=|>|<|=)\d+\.?\d*|\d+\.?\d*(>=|<=|>|<|=))(;(>=|<=|>|<|=)\d+\.?\d*|;\d+\.?\d*(>=|<=|>|<|=))?)|\d+\.?\d*/)
    // If val dont match expression and is not empty
    if ((match == null || match[0] !== String(val)) && String(val) !== '') {
      console.log("bad")
      console.log(match)
      setState({ valid: true })
    }
    else {
      console.log("good")
      console.log(match)
      props.handler(val)
      setState({ valid: false })
    }
  }
  const longText = `
                    You can filter using expresssions eg: filter every value greater than 10 and lower or equal than 15, [ >10;<=15 ] 
                    `;
  var label = state.valid ? 'Wrong filter' : 'Filter'
  return (
    <Grid container spacing={0} alignItems="flex-end" item>
      <Grid item xs={11}>
        <TextField
          label={label}
          onChange={event => handlerWarapper(event.target.value)}
          error={state.valid}
          className={classes.specialTextInput}
        />
      </Grid>
      <Grid item xs={1}>
        <Tooltip className={classes.customTooltip} disableFocusListener title={longText}>
          <HelpIcon />
        </Tooltip>
      </Grid>
    </Grid>
  )
}

// Basic input component
function FilterInput(props) {
  var label = 'Filter'
  return (
    <Grid container>
      <TextField label={label} onChange={event => props.handler(event.target.value)} style={{ width: "100%" }} error={false}></TextField>
    </Grid>

  )
}

/**
 * Main Component
 */

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


  return (
    <ThemeProvider theme={theme}>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel label='Select Columns' htmlFor="select-multiple-chip" focused={true}>Select Columns</InputLabel>
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
                  Cell: ({ value }) =>
                    <div className={classes.verticalAlign}>
                      <Tooltip title="View organism detail" >
                        <Button
                          component={Link} to={'/app/organism/'+value}
                          onClick={()=>console.log(value)}
                          style={{ marginRight: '5%' }}>
                          <ZoomIcon />
                        </Button>
                      </Tooltip>
                      {value}
                    </div>,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["firstName"] }),
                  filterAll: true,
                  Filter: ({ onChange }) =>
                    <FilterInput handler={onChange} />
                },
                {
                  show: true ? chipState.name.includes(colNames[1]) : false,
                  Header: colNames[1],
                  id: "lastName",
                  accessor: d => d.lastName,
                  Cell: ({ value }) =>
                    <div className={classes.verticalAlign}>
                      {value}
                    </div>,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["lastName"] }),
                  filterAll: true,
                  Filter: ({ onChange }) =>
                    <FilterInput handler={onChange} />
                }
              ],
            },
            {
              Header: "Info",
              columns: [
                {
                  show: true ? chipState.name.includes(colNames[2]) : false,
                  Header: colNames[2],
                  accessor: "age",
                  Cell: ({ value }) =>
                    <div className={classes.verticalAlign}>
                      {value}
                    </div>,
                  filterMethod: (filter, rows) =>
                    verboseFilter(filter, rows),
                  filterAll: true,
                  Filter: ({ onChange }) =>
                    <CustomFilterInput handler={onChange} />
                },
                {
                  show: true ? chipState.name.includes(colNames[3]) : false,
                  Header: colNames[3],
                  accessor: "age",
                  id: "over",
                  Cell: ({ value }) =>
                    <div className={classes.verticalAlign}>
                      {(value >= 21 ? "Yes" : "No")}
                    </div>,
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
    </ThemeProvider>
  );
}

export default TableComponent;