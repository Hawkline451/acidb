import React, { useState, useEffect } from "react";
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

import axios from 'axios';


// Styles
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesTable } from './themes'



const useStylesTable = stylesTable

const colNames = [
  'name',
  'isolated',
  'state',
  'seq_date',
  'gen_size',
  'gen_completeness',
  'gen_contamination',
  'gc_percentage',
  'n_orfs',
  'temp_associated',
  'temp_min',
  'temp_max',
  'ph_associated',
  'ph_min',
  'ph_max',
  'access_src',
  'annotation'
];

/*
 * Sub components
 */

// Filter box component
function CustomFilterInput(props) {

  const classes = useStylesTable();
  const [state, setState] = useState({
    error: false
  });
  function handlerWarapper(val) {
    // Replace space and brackets
    val = val.replace(/\s/g, '')
    val = val.replace(/[\])}[{(]/g, '')

    if (String(val) !== '') {
      // Match operator + number or number + operator or expression semi colon expression 
      var match = String(val).match(/(((>=|<=|>|<|=)\d+\.?\d*|\d+\.?\d*(>=|<=|>|<|=))(;(>=|<=|>|<|=)\d+\.?\d*|;\d+\.?\d*(>=|<=|>|<|=))?)|\d+\.?\d*/)
      var matchRange = String(val).match(/(\d+\.?\d*-\d+\.?\d*)|(\*-\d+\.?\d*)|(\d+\.?\d*-\*)/)
      // If val dont match expression and is not empty
      if ((match == null || match[0] !== String(val)) && (matchRange == null || matchRange[0] !== String(val))) {
        console.log("bad")
        console.log(match)
        setState({ error: true })
      }

      else {
        console.log("good")
        console.log(match)
        props.handler(val)
        setState({ error: false })
      }
    }
    else{
      setState({ error: false })
    }
  }
  const longText = `
                    You can filter using expresssions eg: filter every value greater than 10 and lower or equal than 15, [ >10;<=15 ] 
                    `;
  var label = state.error ? 'Wrong filter' : 'Filter'
  return (
    <Grid container spacing={0} alignItems="flex-end" item>
      <Grid item xs={11}>
        <TextField
          label={label}
          onChange={event => handlerWarapper(event.target.value)}
          error={state.error}
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
  const maxColumns = 8

  const [state, setState] = useState({
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'http://192.168.0.181:8000/api/organism/',
      );

      setState({ data: result.data });
    };

    fetchData();
  }, []);

  const [chipState, setChipState] = useState({
    name: [colNames[0], colNames[2], colNames[3], colNames[4]]
  });

  function handleChangeChip(event) {
    if (event.target.value.length <= maxColumns) {
      setChipState({ name: event.target.value })
    }
  }

  function handleDeleteChip(value) {
    var tmp_state = chipState.name
    var index = tmp_state.indexOf(value);
    if (index !== -1) tmp_state.splice(index, 1);
    setChipState({ name: tmp_state })
  }



  return (
    <ThemeProvider theme={theme}>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel label='Select Columns' htmlFor="select-multiple-chip" focused={true}>Select Columns</InputLabel>
          <Select
            multiple
            value={chipState.name}
            onChange={handleChangeChip}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div >
                {selected.map(value => <Chip key={value} label={value} onDelete={() => handleDeleteChip(value)} />)}
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
              Header: "Info",
              columns: [
                {
                  show: true ? chipState.name.includes(colNames[0]) : false,
                  Header: colNames[0],
                  accessor: colNames[0],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
                  Cell: ({ value }) =>
                    <div className={classes.verticalAlign}>
                      <Tooltip title="View organism detail" >
                        <Button
                          component={Link} to={'/app/organism/' + value}
                          onClick={() => console.log(value)}
                          style={{ marginRight: '5%' }}>
                          <ZoomIcon />
                        </Button>
                      </Tooltip>
                      {value}
                    </div>,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: [colNames[0]] }),
                  filterAll: true,
                  Filter: ({ onChange }) =>
                    <FilterInput handler={onChange} />
                },
                {
                  show: true ? chipState.name.includes(colNames[1]) : false,
                  Header: colNames[1],
                  accessor: colNames[1],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
                  Cell: ({ value }) =>
                    <div className={classes.verticalAlign}>
                      {value.toString()}
                    </div>,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: [colNames[1]] }),
                  filterAll: true,
                  Filter: ({ onChange }) =>
                    <FilterInput handler={onChange} />
                },
                {
                  show: true ? chipState.name.includes(colNames[2]) : false,
                  Header: colNames[2],
                  accessor: colNames[2],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
                  Cell: ({ value }) =>
                    <div className={classes.verticalAlign}>
                      {value}
                    </div>,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: [colNames[2]] }),
                  filterAll: true,
                  Filter: ({ onChange }) =>
                    <FilterInput handler={onChange} />
                },
                {
                  show: true ? chipState.name.includes(colNames[3]) : false,
                  Header: colNames[3],
                  accessor: colNames[3],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
                  Cell: ({ value }) =>
                    <div className={classes.verticalAlign}>
                      {value}
                    </div>,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: [colNames[3]] }),
                  filterAll: true,
                  Filter: ({ onChange }) =>
                    <FilterInput handler={onChange} />
                },
                {
                  show: true ? chipState.name.includes(colNames[4]) : false,
                  Header: colNames[4],
                  accessor: colNames[4],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[5]) : false,
                  Header: colNames[5],
                  accessor: colNames[5],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[6]) : false,
                  Header: colNames[6],
                  accessor: colNames[6],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[7]) : false,
                  Header: colNames[7],
                  accessor: colNames[7],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[8]) : false,
                  Header: colNames[8],
                  accessor: colNames[8],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[9]) : false,
                  Header: colNames[9],
                  accessor: colNames[9],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[10]) : false,
                  Header: colNames[10],
                  accessor: colNames[10],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[11]) : false,
                  Header: colNames[11],
                  accessor: colNames[11],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[12]) : false,
                  Header: colNames[12],
                  accessor: colNames[12],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[13]) : false,
                  Header: colNames[13],
                  accessor: colNames[13],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[14]) : false,
                  Header: colNames[14],
                  accessor: colNames[14],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[15]) : false,
                  Header: colNames[15],
                  accessor: colNames[15],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
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
                  show: true ? chipState.name.includes(colNames[16]) : false,
                  Header: colNames[16],
                  accessor: colNames[16],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
                  Cell: ({ value }) =>
                    <div className={classes.verticalAlign}>
                      {value}
                    </div>,
                  filterMethod: (filter, rows) =>
                    verboseFilter(filter, rows),
                  filterAll: true,
                  Filter: ({ onChange }) =>
                    <FilterInput handler={onChange} />
                },
                {
                  show: true ? chipState.name.includes(colNames[17]) : false,
                  Header: colNames[17],
                  accessor: colNames[17],
                  sortMethod: (a, b, ascending) => {
                    if (!ascending) { return (b != null) - (a != null) || b - a; }
                    else { return (a != null) - (b != null) || b - a; }
                  },
                  Cell: ({ value }) =>
                    <div className={classes.verticalAlign}>
                      {value}
                    </div>,
                  filterMethod: (filter, rows) =>
                    verboseFilter(filter, rows),
                  filterAll: true,
                  Filter: ({ onChange }) =>
                    <FilterInput handler={onChange} />
                },
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