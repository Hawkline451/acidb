import React from 'react';
import Select from 'react-select';
import {makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

const suggestions = [
  { label: 'Afghanistan' },
  { label: 'Aland Islands' },
  { label: 'Albania' },
  { label: 'Algeria' },
  { label: 'American Samoa' },
  { label: 'Andorra' },
  { label: 'Angola' },
  { label: 'Anguilla' },
  { label: 'Antarctica' },
  { label: 'Antigua and Barbuda' },
  { label: 'Argentina' },
  { label: 'Armenia' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bangladesh' },
  { label: 'Barbados' },
  { label: 'Belarus' },
  { label: 'Belgium' },
  { label: 'Belize' },
  { label: 'Benin' },
  { label: 'Bermuda' },
  { label: 'Bhutan' },
  { label: 'Bolivia, Plurinational State of' },
  { label: 'Bonaire, Sint Eustatius and Saba' },
  { label: 'Bosnia and Herzegovina' },
  { label: 'Botswana' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' },
].map(suggestion => ({
  value: suggestion.label + ' v',
  label: suggestion.label + ' l',
}));

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  input: {
    padding: 0,
    height: 'auto',
  },
}));


function inputComponent({ inputRef, ...props }) {
  return <div {...props} />;
}


function Option(props) {
  console.log(props)
  return (
    <MenuItem
      selected={props.isFocused}
    >

      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
      > 
       <Grid item  style={{fontSize:12, color:'#808080'}}>{props.data.value}</Grid>
      <Grid item >{props.data.label}</Grid>
      </Grid>

    </MenuItem>
  );
}



const components = {
  Option,
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null
};

export default function IntegrationReactSelect() {
  const classes = useStyles();
  const [single, setSingle] = React.useState(null);

  function handleChangeValue(value) {
    setSingle(value);
  }

  return (
    <div className={classes.root}>
      <Select
        classes={classes}
        placeholder="Search..."
        options={suggestions}
        components={components}
        value={single}
        onChange={handleChangeValue}
      />
    </div>
  );
}
