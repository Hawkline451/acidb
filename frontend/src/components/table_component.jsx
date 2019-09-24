import React, { useState, useEffect, useRef } from "react";
import { verboseFilter } from "./utils/table";
import matchSorter from 'match-sorter'
import {
  Link
} from 'react-router-dom';
import {
  Chip, Select, FormControl, Input, InputLabel, MenuItem, TextField, Tooltip, Button, Grid,
} from '@material-ui/core';
import {
  HelpOutline as HelpIcon, ZoomIn as ZoomIcon,
} from '@material-ui/icons';

// npm
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./css/override.css"
import axios from 'axios';
import { CSVLink } from "react-csv";

// Internationalization
import { useTranslation } from 'react-i18next';

// Import components
import { Loader } from './loader'

// Styles
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesTable } from './css/themes'

// import config
import { config } from "../config";

const useStylesTable = stylesTable

const colNames = [
  'name',
  'strains',

  'domain',
  'phylum',

  'ph_associated',
  'ph_min',
  'ph_max',
  'temp_associated',
  'temp_min',
  'temp_max',

  'access_src',
  'access_id',
  'isolated',
  'gen_size',
  'gc_percentage',
  'state',
  'seq_date',
  'gen_completeness',
  'gen_contamination',

  'annotation',
  'n_orfs',
];

const headersCSV = [
  'name',
  'strains_str',

  'domain',
  'phylum',

  'ph_associated',
  'ph_min',
  'ph_max',
  'temp_associated',
  'temp_min',
  'temp_max',

  'access_src',
  'access_id',
  'ftp_url',
  'isolated',
  'gen_size',
  'gc_percentage',
  'state',
  'seq_date',
  'gen_completeness',
  'gen_contamination',

  'annotation',
  'n_orfs',
];

const headerIndex = {
  0: 'identifiers',
  2: 'tax_info',  
  4: 'growth_range',
  10: 'gen_metadata',
  19: 'proteome_metadata'
}


/*
 * Sub components
 */

// Filter box component
function CustomFilterInput(props) {
  const classes = useStylesTable();
  const { t } = useTranslation();

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
        //console.log("bad")
        setState({ error: true })
      }
      else {
        //console.log("good")
        props.handler(val)
        setState({ error: false })
      }
    }
    // If empty string dont show error
    else {
      props.handler(val)
      setState({ error: false })
    }
  }
  const tooltip = t('table.filter_tooltip');
  var label = state.error ? t('table.wrong_filter') : t('table.filter')
  return (
    <Grid container spacing={0} alignItems="flex-end" item>
      <Grid item xs={11}>
        <TextField
          label={label}
          onChange={event => handlerWarapper(event.target.value)}
          error={state.error}
          className={classes.specialTextInput}
          InputLabelProps={{
            style: {
              color: '#808080'
            }
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <Tooltip className={classes.customTooltip} disableFocusListener title={tooltip}>
          <HelpIcon className={classes.customIcon} />
        </Tooltip>
      </Grid>
    </Grid>
  )
}

// Basic filter component
function FilterInput(props) {
  const { t } = useTranslation();
  var label = t('table.filter')
  return (
    <Grid container>
      <TextField label={label} onChange={event => props.handler(event.target.value)} style={{ width: "100%" }} error={false}
        InputLabelProps={{
          style: {
            color: '#808080'
          }
        }}></TextField>
    </Grid>
  )
}

// Select columns component
function SelectColumns(props) {
  const classes = useStylesTable();
  const { t } = useTranslation();

  const maxColumns = 8
  var chipState = props.chipState
  var setChipState = props.setChipState

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

  var label = chipState.name.length === maxColumns ? t('table.max_cols') : t('table.select_col')
  var error = chipState.name.length === maxColumns ? true : false
  return (
    <FormControl className={classes.formControl}>
      <InputLabel label={'select_cols'} htmlFor="select-multiple-chip" focused={true} error={error}>{label}</InputLabel>
      <Select
        multiple
        value={chipState.name}
        onChange={handleChangeChip}
        input={<Input id="select-multiple-chip" />}
        error={error}
        renderValue={selected => (
          <div >
            {selected.map(value => <Chip key={value} label={t('table.' + value)} onDelete={() => handleDeleteChip(value)} />)}
          </div>
        )}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        }}
      >
        {
          colNames.map((name, index) => (
            <MenuItem
              key={name}
              value={name}
            >
              <Grid
                container
                direction="column"
              >
                <Grid align="right" item style={{ fontSize: 14, color: '#808080' }}>
                  {headerIndex[index] ? t('table.' + headerIndex[index]) : null}
                </Grid>
                <Grid item >{t('table.' + name)}</Grid>
              </Grid>

            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}

/**
 * Main Component
 */
function TableComponent() {

  const classes = useStylesTable();
  const { t } = useTranslation();

  const [state, setState] = useState({
    data: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setfilteredData] = useState({
    data: [],
  });

  let reactTable = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios(
        config.API_ORGANISMS,
      );

      setState({ data: result.data });
      setfilteredData({ data: result.data })
      setIsLoading(false);
    };

    fetchData();
    // Empty array as second argument avoid fetching on component updates, only when mounting the component
  }, []);

  const [chipState, setChipState] = useState({
    name: ['name', 'strains', 'ph_associated', 'temp_associated']
  });

  function concatStrains(arrayDicts) {
    var strains = []
    var index
    for (index = 0; index < arrayDicts.length; ++index) {
      strains.push(arrayDicts[index]['strain_name'])
    }
    return strains.join(' = ')
  }

  function getFilteredData() {
    var data = reactTable.getResolvedState().sortedData
    setfilteredData({ data: data })
  }

  function procesedData(data) {
    for (var index = 0; index < data.length; ++index) {
      data[index].strains_str = concatStrains(data[index].strains)
    }
    return data
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container
        spacing={0}
        direction="row"
        alignItems="center"
        justify="center"
      >
        <Grid item xs={10}>
          <SelectColumns chipState={chipState} setChipState={setChipState} />
        </Grid>
        <Grid item xs={2} align='right'>

          <CSVLink
            className={classes.noDecoratorLink}
            headers={headersCSV}
            data={procesedData(filteredData.data)}
            separator={'\t'}
            filename={'filtered_data.csv'}
            onClick={() => {
              getFilteredData();
            }}
          >
            <Button className={classes.formControl} variant="outlined" color="primary">{t('download_file')}</Button>
          </CSVLink>
        </Grid>
      </Grid>

      <div>
        {isLoading ?
          (<Loader />) :
          (
            <ReactTable
              ref={(r) => (reactTable = r)}
              data={state.data}
              filterable
              defaultFilterMethod={(filter, row) =>
                String(row[filter.id]) === filter.value}
              columns={[
                {
                  Header: t('table.identifiers'),
                  columns: [
                    {
                      show: false,
                      Header: 'id',
                      accessor: 'id_organism',
                    },
                    {
                      show: true ? chipState.name.includes("name") : false,
                      Header: t('table.name'),
                      accessor: 'name',
                      minWidth: 120,
                      sortMethod: (a, b, ascending) => {
                        if (!ascending) { return (b != null) - (a != null) || (a > b ? 1 : -1); }
                        else { return (a != null) - (b != null) || (a > b ? 1 : -1); }
                      },
                      Cell: ({ row, value }) =>
                        <div className={classes.verticalAlign}>
                          <Tooltip title="View organism detail" >
                            <Button
                              component={Link} to={'/app/organism/' + row.id_organism}
                              //onClick={() => openModal(row)}
                              style={{ marginRight: '5%', textTransform: 'none' }}>
                              <ZoomIcon />
                            </Button>
                          </Tooltip>
                          <Link to={'/app/organism/' + row.id_organism} className={classes.noDecoratorLink}>
                            {value}
                          </Link>
                        </div>,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ['name'] }),
                      filterAll: true,
                      Filter: ({ onChange }) =>
                        <FilterInput handler={onChange} />
                    },
                    {
                      show: true ? chipState.name.includes('strains') : false,
                      Header: t('table.strain'),
                      accessor: 'strains',
                      sortMethod: (a, b, ascending) => {
                        let strainA = a[0].strain_name;
                        let strainB = b[0].strain_name;
                        if (!ascending) { return (strainB != null) - (strainA != null) || (strainA > strainB ? 1 : -1); }
                        else { return (strainA != null) - (strainB != null) || (strainA > strainB ? 1 : -1); }
                      },
                      Cell: ({ value }) =>
                        <div className={classes.verticalAlign}>
                          {concatStrains(value)}
                        </div>,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ['strains.0.strain_name'] }).concat(matchSorter(rows, filter.value, { keys: ['strains.1.strain_name'] })),
                      filterAll: true,
                      Filter: ({ onChange }) =>
                        <FilterInput handler={onChange} />
                    },
                  ],
                },
                {
                  Header: t('table.tax_info'),
                  columns: [
                    {
                      show: true ? chipState.name.includes('domain') : false,
                      Header: t('table.domain'),
                      id: 'domain',
                      accessor: d => d.taxonomy[0].domain,
                      sortMethod: (a, b, ascending) => {
                        if (!ascending) { return (b != null) - (a != null) || (a > b ? 1 : -1); }
                        else { return (a != null) - (b != null) || (a > b ? 1 : -1); }
                      },
                      Cell: ({ value }) =>
                        <div className={classes.verticalAlign}>
                          {value}
                        </div>,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ['domain'] }),
                      filterAll: true,
                      Filter: ({ onChange }) =>
                        <FilterInput handler={onChange} />
                    },
                    {
                      show: true ? chipState.name.includes('phylum') : false,
                      Header: t('table.phylum'),
                      id: 'phylum',
                      accessor: d => d.taxonomy[0].phylum,
                      sortMethod: (a, b, ascending) => {
                        if (!ascending) { return (b != null) - (a != null) || (a > b ? 1 : -1); }
                        else { return (a != null) - (b != null) || (a > b ? 1 : -1); }
                      },
                      Cell: ({ value }) =>
                        <div className={classes.verticalAlign}>
                          {value}
                        </div>,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ['phylum'] }),
                      filterAll: true,
                      Filter: ({ onChange }) =>
                        <FilterInput handler={onChange} />
                    },
                  ],
                },
                {
                  Header: t('table.gen_metadata'),
                  columns: [
                    {
                      show: true ? chipState.name.includes('access_src') : false,
                      Header: t('table.access_src'),
                      accessor: 'access_src',
                      sortMethod: (a, b, ascending) => {
                        if (!ascending) { return (b != null) - (a != null) || (a > b ? 1 : -1); }
                        else { return (a != null) - (b != null) || (a > b ? 1 : -1); }
                      },
                      Cell: ({ value }) =>
                        <div className={classes.verticalAlign}>
                          {value}
                        </div>,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ['access_src'] }),
                      filterAll: true,
                      Filter: ({ onChange }) =>
                        <FilterInput handler={onChange} />
                    },
                    {
                      show: false,
                      Header: 'access_id',
                      accessor: 'access_id',
                    },
                    {
                      show: true ? chipState.name.includes('access_id') : false,
                      Header: t('table.access_id'),
                      accessor: 'ftp_url',
                      sortMethod: (a, b, ascending) => {
                        if (!ascending) { return (b != null) - (a != null) || (a > b ? 1 : -1); }
                        else { return (a != null) - (b != null) || (a > b ? 1 : -1); }
                      },
                      Cell: ({ value, row }) =>
                        <div className={classes.verticalAlign}>
                          <a target="_blank" rel="noopener noreferrer" href={value}>{row.access_id}</a>
                        </div>,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ['access_id'] }),
                      filterAll: true,
                      Filter: ({ onChange }) =>
                        <FilterInput handler={onChange} />
                    },
                    {
                      show: true ? chipState.name.includes('isolated') : false,
                      Header: t('table.isolated'),
                      accessor: 'isolated',
                      sortMethod: (a, b, ascending) => {
                        if (!ascending) { return (b != null) - (a != null) || (a > b ? 1 : -1); }
                        else { return (a != null) - (b != null) || (a > b ? 1 : -1); }
                      },
                      Cell: ({ value }) =>
                        <div className={classes.verticalAlign}>
                          {value.toString()}
                        </div>,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ['isolated'] }),
                      filterAll: true,
                      Filter: ({ onChange }) =>
                        <FilterInput handler={onChange} />
                    },
                    {
                      show: true ? chipState.name.includes('gen_size') : false,
                      Header: t('table.gen_size'),
                      accessor: 'gen_size',
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
                      show: true ? chipState.name.includes('gc_percentage') : false,
                      Header: t('table.gc_percentage'),
                      accessor: 'gc_percentage',
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
                      show: true ? chipState.name.includes('state') : false,
                      Header: t('table.state'),
                      accessor: 'state',
                      sortMethod: (a, b, ascending) => {
                        if (!ascending) { return (b != null) - (a != null) || (a > b ? 1 : -1); }
                        else { return (a != null) - (b != null) || (a > b ? 1 : -1); }
                      },
                      Cell: ({ value }) =>
                        <div className={classes.verticalAlign}>
                          {value.toString()}
                        </div>,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ['state'] }),
                      filterAll: true,
                      Filter: ({ onChange }) =>
                        <FilterInput handler={onChange} />
                    },
                    {
                      show: true ? chipState.name.includes('seq_date') : false,
                      Header: t('table.seq_date'),
                      accessor: 'seq_date',
                      sortMethod: (a, b, ascending) => {
                        if (!ascending) { return (b != null) - (a != null) || (a > b ? 1 : -1); }
                        else { return (a != null) - (b != null) || (a > b ? 1 : -1); }
                      },
                      Cell: ({ value }) =>
                        <div className={classes.verticalAlign}>
                          {value.toString()}
                        </div>,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ['seq_date'] }),
                      filterAll: true,
                      Filter: ({ onChange }) =>
                        <FilterInput handler={onChange} />
                    },
                    {
                      show: true ? chipState.name.includes('gen_completeness') : false,
                      Header: t('table.gen_completeness'),
                      accessor: 'gen_completeness',
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
                      show: true ? chipState.name.includes('gen_contamination') : false,
                      Header: t('table.gen_contamination'),
                      accessor: 'gen_contamination',
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
                  ],
                },
                {
                  Header: t('table.growth_range'),
                  columns: [
                    {
                      show: true ? chipState.name.includes('temp_associated') : false,
                      Header: t('table.temp_associated'),
                      accessor: 'temp_associated',
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
                      show: true ? chipState.name.includes('temp_min') : false,
                      Header: t('table.temp_min'),
                      accessor: 'temp_min',
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
                      show: true ? chipState.name.includes('temp_max') : false,
                      Header: t('table.temp_max'),
                      accessor: 'temp_max',
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
                      show: true ? chipState.name.includes('ph_associated') : false,
                      Header: t('table.ph_associated'),
                      accessor: 'ph_associated',
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
                      show: true ? chipState.name.includes('ph_min') : false,
                      Header: t('table.ph_min'),
                      accessor: 'ph_min',
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
                      show: true ? chipState.name.includes('ph_max') : false,
                      Header: t('table.ph_max'),
                      accessor: 'ph_max',
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
                  ],
                },
                {
                  Header: t('table.proteome_metadata'),
                  columns: [
                    {
                      show: true ? chipState.name.includes('n_orfs') : false,
                      Header: t('table.n_orfs'),
                      accessor: 'n_orfs',
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
                      show: true ? chipState.name.includes('annotation') : false,
                      Header: t('table.annotation'),
                      accessor: 'annotation',
                      sortMethod: (a, b, ascending) => {
                        if (!ascending) { return (b != null) - (a != null) || (a > b ? 1 : -1); }
                        else { return (a != null) - (b != null) || (a > b ? 1 : -1); }
                      },
                      Cell: ({ value }) =>
                        <div className={classes.verticalAlign}>
                          {value}
                        </div>,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ['annotation'] }),
                      filterAll: true,
                      Filter: ({ onChange }) =>
                        <FilterInput handler={onChange} />
                    },
                  ]
                }
              ]
              }
              defaultPageSize={10}
              className="-striped -highlight"
            />
          )}
        <br />
        <div style={{ textAlign: "center" }}>
          <em> Tip: Hold shift when sorting to multi - sort! </em> </div>;
      </div>
    </ThemeProvider>
  );
}

export default TableComponent;