import React, { useState } from 'react';
import {
  Paper, IconButton, TextField,
} from '@material-ui/core';
import {
  Search as SearchIcon
} from '@material-ui/icons';


// Styles
import { stylesInput } from './css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';

const useStylesInput = stylesInput

export default function CustomSearchInput(navProps) {
  const { t } = useTranslation();
  const classes = useStylesInput();

  console.log(navProps)

  const [searchState, setSearchState] = useState({
    organism_or_strain: '',
  })

  function handleChange(target) {
    setSearchState(oldValues => ({
      ...oldValues,
      [target.name]: target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault()
    let searchUrl = '/app/advance_search/organism_or_strain=' + searchState.organism_or_strain
    navProps.history.push(searchUrl)
    navProps.cleanTabs()
  }

  return (
    <form>
      <Paper className={classes.root}>
        <TextField
          className={classes.input}
          name='organism_or_strain'
          value={searchState.organism_or_strain}
          onChange={event => handleChange(event.target)}
          InputProps={{
            classes: {
              input: classes.innerInput
            },
            placeholder: t('placeholder.organism_strain')
          }}
        />
        <IconButton aria-label='Search' label='Submit' type='submit' onClick={handleSubmit}>
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