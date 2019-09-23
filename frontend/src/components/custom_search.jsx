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

const useStylesInput = stylesInput


//Search Component

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;
  return (
    <TextField

      className={classes.input}
      InputProps={{
        classes: {
          input: classes.innerInput
        },
        inputRef: ref,
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestionProps) {
  const { searchState, suggestion, itemProps } = suggestionProps;
  return (
    searchState.searchType === 'name' ?

      <MenuItem {...itemProps} key={suggestion.id_organism} component='div'>
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
      <MenuItem {...itemProps} key={suggestion.strain_name} component='div'>
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
        <ButtonBase key={'load_more'} onClick={() => suggestionProps.setNumSuggestions(suggestionProps.numSuggestions + 5)} style={{ width: '100%' }}>
          <div style={{ padding: 15 }}>
            <Typography style={{ color: '#808080' }}>
              {'Loaded: ' + suggestionProps.numSuggestions + ' / Total: ' + count + ' [Load more]'}
            </Typography>
          </div>
        </ButtonBase>
      )
      :
      (<div key={'empty'}></div>)
  );
}

function getSuggestions(value, searchState, numSuggestions, setNumSuggestions, isOpen, { showEmpty = false } = {}) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  if (!isOpen) {
    setNumSuggestions(5)
  }

  if (inputLength === 0 && !showEmpty) {
    setNumSuggestions(5)
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
      searchQuery: value.id_organism,
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
          onChange={(item) => handleInputChange(item)}
          itemToString={item => (item ? `${item.organism_name}  [ ${item.strain_name} ]` : '')}>
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            inputValue,
            isOpen,
          }) => {
            const { ...inputProps } = getInputProps({
              placeholder: t('placeholder.search')
            });

            return (
              <div style={{ width: '70%' }}>
                {renderInput({
                  fullWidth: true,
                  classes,
                  inputProps,
                  ref: node => {
                    popperNode = node;
                  },
                })}
                <Popper open={isOpen} anchorEl={popperNode} >
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

        <IconButton aria-label='Search' label='Submit' type='submit' onClick={handleSubmit} component={Link} to={'/app/organism/' + searchState.searchQuery}>
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