import React, { useState, useEffect, Fragment } from 'react';
import {
  Paper, IconButton, Grid, MenuItem, TextField, ButtonBase, Typography, Popper, Select
} from '@material-ui/core';
import {
  Search as SearchIcon
} from '@material-ui/icons';

// NPM
import {
  Link
} from 'react-router-dom';
import axios from 'axios';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';

// import config
import { config } from '../config';

// Styles
import { stylesInput } from './css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';


const useStylesInput = stylesInput


//Search Component
function renderSuggestion(suggestionProps) {
  const { searchState, suggestion, itemProps } = suggestionProps;
  return (
    searchState.searchType === 'name' ?

      <MenuItem {...itemProps} key={suggestion.id_organism + suggestion.strain_name} component='div' style={{ whiteSpace: 'normal' }}>
        <Grid
          container
          direction='column'
          justify='flex-start'
          alignItems='stretch'
        >
          <Fragment>
            <Grid item style={{ fontSize: 12, color: '#808080' }}>{suggestion.strain_name}</Grid>
            <Grid item >{suggestion.organism_name}</Grid>
          </Fragment>
        </Grid>
      </MenuItem>

      :
      <MenuItem {...itemProps} key={suggestion.strain_name} component='div' style={{ whiteSpace: 'normal' }}>
        <Grid
          container
          direction='column'
          justify='flex-start'
          alignItems='stretch'
        >
          <Fragment>
            <Grid item style={{ fontSize: 12, color: '#808080' }}>{suggestion.organism_name}</Grid>
            <Grid item >{suggestion.strain_name}</Grid>
          </Fragment>
        </Grid>
      </MenuItem>
  );
}

function renderLoadMore(suggestionProps) {
  const count = suggestionProps.suggestion.count;

  return (
    (count > suggestionProps.numSuggestions) ?
      (
        <MenuItem  {...suggestionProps.itemProps} key={'load_more'} component='div' style={{ whiteSpace: 'normal' }}>
          <ButtonBase component={Link} to={'/app/advance_search/organism_or_strain=' + suggestionProps.inputValue} style={{ width: '100%' }}>
            <div style={{ color: '#808080', }}>

              {i18next.t('navbar.search_load_more', { suggestions: suggestionProps.numSuggestions, total: count })}
            </div>
          </ButtonBase>
        </MenuItem >
      )
      :
      (<div key={'empty'}></div>)
  );
}

function getSuggestions(value, searchState, numSuggestions, setNumSuggestions, isOpen, { showEmpty = false } = {}) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  if (!isOpen) {
    setNumSuggestions(8)
  }

  if (inputLength === 0 && !showEmpty) {
    setNumSuggestions(8)
    return [];
  } else {
    let filteredData = searchState.searchData.filter(suggestion => {
      let keep = searchState.searchType === 'name' ?
        suggestion.organism_name.slice(0, inputLength).toLowerCase() === inputValue :
        suggestion.strain_name.slice(0, inputLength).toLowerCase() === inputValue;

      return keep;
    });

    let total = filteredData.length;
    let res = filteredData.slice(0, numSuggestions);
    res.push({ count: total });

    return res;
  }
}

let popperNode;
export default function CustomSearchInput(navProps) {
  const { t } = useTranslation();
  const classes = useStylesInput();

  const [numSuggestions, setNumSuggestions] = useState();
  const [searchState, setSearchState] = useState({
    searchType: 'name',
    searchQuery: null,
    searchData: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        config.API_SEARCH_VALUES,
      );

      setSearchState(oldValues => ({
        ...oldValues,
        searchData: result.data,
      }));
    };

    fetchData();
    // Empty array as second argument avoid fetching on component updates, only when mounting the component
  }, []);

  function handleInputChange(value) {
    setSearchState(oldValues => ({
      ...oldValues,
      searchQuery: value,
    }));
  }

  function handleTypeSearchChange(event) {
    setSearchState(oldValues => ({
      ...oldValues,
      searchType: event.target.value,
    }));
  }


  function handleSubmit(event) {
    //event.preventDefault()
    navProps.cleanTabs()
  }

  function handleSearch() {
    let url = '/app/organism/' + searchState.searchQuery
    return url
  }

  const searchTypes = [
    { value: 'name', label: 'Name' },
    { value: 'strain', label: 'Strain' },
  ]

  return (
    <form>
      <Paper className={classes.root}>
        <Select
          align='center'
          MenuProps={{
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          }}
          style={{ width: '30%', fontSize: 18 }}
          name='type'
          value={searchState.searchType}
          onChange={handleTypeSearchChange}
        >
          {searchTypes.map(val =>
            <MenuItem key={val.value} value={val.value}>{val.label}</MenuItem>
          )}
        </Select>

        <Downshift id='downshift-popper'
          onChange={(item) => handleInputChange(item.id_organism)}
          itemToString={item => item ? (searchState.searchType === 'name' ? item.organism_name : item.strain_name) : ''}>
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            inputValue,
            isOpen,
          }) => {
            const { ...inputProps } = getInputProps({
              placeholder: t('placeholder.search'),
              onChange: () => {
                console.log(inputValue);
  
              }
            });

            return (
              <div style={{ width: '70%' }}>
                <TextField
                  className={classes.input}
                  InputProps={{
                    classes: {
                      input: classes.innerInput
                    },
                    inputRef: node => {
                      popperNode = node;
                    },
                    ...inputProps,
                  }}
                />
                <Popper open={isOpen} anchorEl={popperNode} style={{ zIndex: 1200 }}>
                  <div
                    {...(isOpen
                      ? getMenuProps({}, { suppressRefError: true })
                      : {})}
                  >
                    <Paper
                      style={{
                        overflow: 'auto',
                        marginTop: 0,
                        width: popperNode ? popperNode.clientWidth : undefined,
                        maxHeight: 720
                      }}
                    >
                      {getSuggestions(inputValue, searchState, numSuggestions, setNumSuggestions, isOpen).map((suggestion, index) => {
                        if (isNaN(suggestion.count)) {
                          return renderSuggestion({
                            searchState,
                            suggestion,
                            index,
                            itemProps: getItemProps({ item: suggestion }),
                          });
                        } else {
                          return renderLoadMore({
                            inputValue,
                            searchState,
                            suggestion,
                            numSuggestions,
                            setNumSuggestions
                          });
                        }
                      })}
                    </Paper>
                  </div>
                </Popper>
              </div>
            );
          }}
        </Downshift>

        <IconButton aria-label='Search' label='Submit' type='submit' onClick={handleSubmit} component={Link} to={handleSearch()}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </form>
  );
}

//function areEqual(prevProps, nextProps) {
  // only update if a card was added or removed
  //return false
//}

//export default React.memo(CustomSearchInput, areEqual);