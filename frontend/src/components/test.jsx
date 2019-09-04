import React, { Fragment, useState, useEffect } from "react";
import deburr from "lodash/deburr";
import Downshift from "downshift";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import ButtonBase from "@material-ui/core/ButtonBase";
import MenuItem from "@material-ui/core/MenuItem";


import {
  Grid,
} from '@material-ui/core';

import axios from 'axios';

// import config
import { config } from "../config";




function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;
  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestionProps) {
  const { suggestion, itemProps } = suggestionProps;
  return (
    <MenuItem {...itemProps} key={suggestion.id_organism} component="div">


      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
      >
        <Fragment>
          <Grid item style={{ fontSize: 12, color: '#808080' }}>{suggestion.strain_name}</Grid>
          <Grid item >{suggestion.organism_name}</Grid>
        </Fragment>
      </Grid>
    </MenuItem>
  );
}

function renderLoadMore(suggestionProps) {
  const count = suggestionProps.suggestion.count;
  console.log(suggestionProps)

  return (
    (count > suggestionProps.numSuggestions) ?
      (
        <ButtonBase key={'load_more'} onClick={() => suggestionProps.setNumSuggestions(suggestionProps.numSuggestions + 5)} style={{ width: '100%' }}>
          <div style={{ padding: 15 }}>
            <Typography style={{ color: "#808080" }}>
              {"Loaded: " + suggestionProps.numSuggestions + " / Total: " + count + " ...Load more ..."}
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
    let res = searchState.searchData.filter(suggestion => {
      let keep =
        suggestion.organism_name.slice(0, inputLength).toLowerCase() === inputValue;
      return keep;
    });

    let total = res.length;
    let res_2 = res.slice(0, numSuggestions);
    res_2.push({ count: total });
    console.log(res_2)


    return res_2;
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  inputRoot: {
    flexWrap: "wrap"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1,
    marginLeft: 5
  },
}));

let popperNode;

export default function TestComponent() {
  const classes = useStyles();
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

  return (
    <div className={classes.root}>
      <Downshift id="downshift-popper" onChange={(item) => console.log(item.id_organism)}>
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          inputValue,
          isOpen,

        }) => {
          const { onBlur, onFocus, ...inputProps } = getInputProps({
            placeholder: "With Popper"
          });

          return (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                InputProps: { onBlur, onFocus },
                InputLabelProps: getLabelProps({ shrink: true }),
                inputProps,
                ref: node => {
                  popperNode = node;
                }
              })}

              <Popper open={isOpen} anchorEl={popperNode} style={{ height: '50%' }}>
                <div
                  {...(isOpen
                    ? getMenuProps({}, { suppressRefError: true })
                    : {})}
                >
                  <Paper
                    square
                    style={{
                      marginTop: 8,
                      width: popperNode ? popperNode.clientWidth : undefined,
                    }}
                  >
                    {getSuggestions(inputValue, searchState, numSuggestions, setNumSuggestions, isOpen).map((suggestion, index) => {
                      if (isNaN(suggestion.count)) {
                        return renderSuggestion({
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
    </div>
  );
}
