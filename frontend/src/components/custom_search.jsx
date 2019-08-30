import React, { useState, useEffect, Fragment } from "react";
import {
  Paper, IconButton, Grid, MenuItem, TextField,
} from '@material-ui/core';
import {
  Search as SearchIcon
} from '@material-ui/icons';

// npm
import {
  Link
} from 'react-router-dom';
import Select from "react-select";
import axios from 'axios';

// import config
import { config } from "../config";

// Styles
import { stylesInput, customSelectStyles } from './css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';

const useStylesInput = stylesInput
const searchTypes = [
  { value: 'name', label: 'Name' },
  { value: 'strain', label: 'Strain' },
]

//Search Component
export default function CustomSearchInput(navProps) {
  const classes = useStylesInput();
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState({
    searchType: 'name',
    searchQuery: null,
    searchData: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        config.API_SEARCH_VALUES,
      );

      setSearchValue(oldValues => ({
        ...oldValues,
        searchData: result.data,
      }));
    };

    fetchData();
    // Empty array as second argument avoid fetching on component updates, only when mounting the component
  }, []);

  // Search input handler
  function handleChangeType(value) {
    setSearchValue(oldValues => ({
      ...oldValues,
      searchType: value.value,
    }));
  }

  function handleChangeQuery(value) {
    setSearchValue(oldValues => ({
      ...oldValues,
      searchQuery: value.id_organism,
    }));
  }

  function handleSubmit(event) {
    //event.preventDefault()
    navProps.cleanTabs()
  }

  function Option(props) {
    return (
      <MenuItem {...props.innerProps}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
        >
          {searchValue.searchType === 'name' ?
            (
              <Fragment>
                <Grid item style={{ fontSize: 12, color: '#808080' }}>{props.data.strain_name}</Grid>
                <Grid item >{props.data.organism_name}</Grid>
              </Fragment>
            )
            :
            (
              <Fragment>
                <Grid item style={{ fontSize: 12, color: '#808080' }}>{props.data.organism_name}</Grid>
                <Grid item >{props.data.strain_name}</Grid>
              </Fragment>
            )
          }
        </Grid>
      </MenuItem>
    );
  }

  const components = {
    Option,
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null
  };

  const resultLimit = 10
  let i = 0

  function customFilter(label, query){
    return (label.toLowerCase().indexOf(query.toLowerCase()) >= 0 && i++ < resultLimit)
  }

  return (
    <form>
      <Paper className={classes.root}>
        <Select
          className={classes.selectTypeSearch}
          styles={customSelectStyles}
          input={<TextField name='searchType' />}
          onChange={handleChangeType}
          value={searchTypes.filter(({ value }) => value === searchValue.searchType)}
          options={searchTypes}
        />
        <Select
          filterOption={({ label }, query) => customFilter(label, query)}
          
          onInputChange={() => { i = 0 }}
          ignoreAccents={false}
          ignoreCase={true}
          className={classes.selectOrganismSearch}
          styles={customSelectStyles}
          components={components}
          placeholder={t('placeholder.search')}
          input={<TextField name='searchQuery' />}
          onChange={handleChangeQuery}
          getOptionLabel={searchValue.searchType === 'name' ? (options => options.organism_name) : (options => options.strain_name)}
          getOptionValue={options => options.id_organism}
          options={searchValue.searchData}
        />

        <IconButton aria-label='Search' label='Submit' type='submit' onClick={handleSubmit} component={Link} to={'/app/organism/' + searchValue.searchQuery}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </form>
  );
}

