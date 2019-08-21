import React, { useState, useEffect } from "react";

import {
  InputBase, Paper, Input,
  IconButton, Divider, MenuItem, Select,
} from '@material-ui/core';
import {
  Search as SearchIcon
} from '@material-ui/icons';

import axios from 'axios';

// import config
import { config } from "../config";

// Styles
import { stylesInput } from './css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';

// Import utils functions
import { getSuggestionValue, renderSugggestion } from "./utils/search";


const useStylesInput = stylesInput

//Search Component
export default function CustomSearchInput() {
  const classes = useStylesInput();
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState({
    searchType: 'default',
    searchQuery: null,
    searchData:[],
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
  function handleChange(event) {
    const tmpValue = event.target.value
    const tmpName = event.target.name
    setSearchValue(oldValues => ({
      ...oldValues,
      [tmpName]: tmpValue,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault()
    console.log(searchValue)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Paper className={classes.root}>
        <Select
          className={classes.select}
          value={searchValue.searchType}
          onChange={handleChange}
          input={<Input name='searchType' />}
          displayEmpty
          MenuProps={{
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            }
          }}
        >
          <MenuItem value={'default'}>Default</MenuItem>
          <MenuItem value={'asd1'}>ASD1</MenuItem>
          <MenuItem value={'asd2'}>ASD2</MenuItem>
        </Select>

        <Divider className={classes.divider} />
        <InputBase
          className={classes.input}
          placeholder={t('navbar.search')}
          name='searchQuery'
          onChange={handleChange}
        />
        <IconButton className={classes.iconButton} aria-label='Search' label='Submit' type='submit'>
          <SearchIcon />
        </IconButton>
      </Paper>
    </form>
  );
}


