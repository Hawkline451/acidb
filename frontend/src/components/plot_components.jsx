import React, { Fragment } from 'react';

import {
  FormControl, MenuItem, Typography, Grid, FormControlLabel, Checkbox, FormGroup, Paper,
  Table, TableBody, TableCell, TableRow, Select, InputLabel, TableHead, Tooltip
} from '@material-ui/core';

// NPM
import {
  Link
} from 'react-router-dom';

// Internationalization
import { useTranslation } from 'react-i18next';

// Styles
import { stylesTable } from './css/themes'

const useStylesTable = stylesTable

const domain = [
  'Archaea',
  'Bacteria',
  'Eukarya'
]

const genState = {
  isolated:
    ['isolated',
      'non_isolated',],
  state:
    ['completed',
      'draft',]
}
const plotSize = [250, 500, 750, 1000, 1250]

const axis = [
  'gen_size',
  'gc_percentage',
  'n_orfs',
  'temp_associated',
  'temp_min',
  'temp_max',
  'ph_associated',
  'ph_min',
  'ph_max'

]

const quality = ['none', '80-5','90-10']

function SelectForm(props) {
  const { t } = useTranslation();

  function handleChange(target) {
    props.setState(oldValues => ({
      ...oldValues,
      [target.name]: target.value,
    }));
  }

  return (
    <Fragment>
      <Paper square style={{ padding: 20 }}>
        <Typography align='center' variant={'h5'}>{t('plot.select_axis')}</Typography>

        <Table >
          <TableBody>
            <TableRow key={'x-axis'}>
              <TableCell style={{ borderStyle: 'none', paddingRight: 10 }}>
                {t('plot.x_axis')}
              </TableCell>
              <TableCell style={{ borderStyle: 'none', paddingRight: 10 }}>
                <Select
                  MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    }
                  }}
                  style={{ minWidth: '100%' }}
                  name='xAccessor'
                  value={props.state.xAccessor}
                  onChange={event => handleChange(event.target)}
                >
                  {axis.map(key => <MenuItem key={key} value={key}>{t('table.' + key)}</MenuItem>)}
                </Select>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ borderStyle: 'none', paddingRight: 10 }}>
                {t('plot.y_axis')}
              </TableCell>
              <TableCell style={{ borderStyle: 'none', paddingRight: 10 }}>
                <Select
                  MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    }
                  }}
                  style={{ minWidth: '100%' }}
                  name='yAccessor'
                  value={props.state.yAccessor}
                  onChange={event => handleChange(event.target)}
                >
                  {axis.map(key => <MenuItem key={key} value={key}>{t('table.' + key)}</MenuItem>)}
                </Select>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ borderStyle: 'none', paddingRight: 10 }}>
                {t('plot.gen_quality')}
              </TableCell>
              <TableCell style={{ borderStyle: 'none', paddingRight: 10 }}>
                <Select
                  MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    }
                  }}
                  style={{ minWidth: '100%' }}
                  name='genQuality'
                  value={props.state.genQuality}
                  onChange={event => handleChange(event.target)}
                >
                  {quality.map(val => <MenuItem key={val} value={val}>{val === 'none' ? t('plot.none') : val}</MenuItem>)}
                </Select>
              </TableCell>

            </TableRow>

          </TableBody>
        </Table>
      </Paper>
      <Paper square style={{ padding: 20 }}>
        <Typography align='center' variant={'h5'}>{t('plot.plot_size')}</Typography>
        <Table >
          <TableBody >
            <TableRow>
              <TableCell style={{ borderStyle: 'none', paddingRight: 10 }}>
                <InputLabel>{t('plot.height')}</InputLabel>
                <Select
                  MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    }
                  }}
                  style={{ minWidth: '100%' }}
                  name='height'
                  value={props.state.height}
                  onChange={event => handleChange(event.target)}
                >
                  {plotSize.map(val => <MenuItem key={val} value={val}>{`${val} px`}</MenuItem>)}
                </Select>
              </TableCell>

              <TableCell style={{ borderStyle: 'none', paddingRight: 10 }}>
                <InputLabel>{t('plot.width')}</InputLabel>
                <Select
                  MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    }
                  }}
                  style={{ minWidth: '100%' }}
                  name='width'
                  value={props.state.width}
                  onChange={event => handleChange(event.target)}
                >
                  {plotSize.map(val => <MenuItem key={val} value={val}>{`${val} px`}</MenuItem>)}
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

      </Paper>
    </Fragment>
  );
}

function RadioForm(props) {
  const { t } = useTranslation();

  function handleChange(name) {
    // Set radio button state (parent state)
    props.setState(oldValues => ({
      ...oldValues,
      [name]: !props.state[name],
    }));
  }

  return (
    <form autoComplete='off'>
      <FormControl style={{ minWidth: '100%' }} component='fieldset'>
        <Paper square style={{ padding: 20 }}>
          <Typography align='center' variant={'h5'}>{t('plot.organism_domain')}</Typography>
          <FormGroup >
            {domain.map(val =>
              <FormControlLabel
                style={{ alignSelf: 'center' }}
                key={val}
                control={<Checkbox checked={props.state[val]} onChange={() => handleChange(val)} value={val} />}
                label={val}>
              </FormControlLabel>)}
          </FormGroup>
        </Paper>
      </FormControl>

      <FormControl style={{ minWidth: '100%' }} component='fieldset'>
        <Paper square style={{ padding: 20 }}>

          <Grid container
            spacing={0}
            direction='row'
            alignItems='center'
            justify='center'>

            {Object.keys(genState).map(key =>
              <Grid key={key} item>
                <Typography align='left' variant={'h5'}>{t('table.' + key)}</Typography>

                <FormGroup >
                  {genState[key].map(val =>
                    <FormControlLabel
                      style={{ alignSelf: 'right' }}
                      key={val}
                      control={<Checkbox checked={props.state[val]} onChange={() => handleChange(val)} value={val} />}
                      label={t('plot.' + val)}>
                    </FormControlLabel>)}
                </FormGroup>
              </Grid>
            )
            }
          </Grid>
        </Paper>
      </FormControl>
    </form>
  );
}

function OrganismView(props) {
  const { t } = useTranslation();
  const classes = useStylesTable();

  let highlightedPoints = props.highlightedPoints
  let plotState = props.plotState
  return (
    <Table style={{ marginBottom: 30 }}>
      <TableHead>
        <TableRow>
          <TableCell className={classes.bigFontTable} >{t('table.name')}</TableCell>
          <TableCell className={classes.bigFontTable} >{t('table.strain')}</TableCell>
          <TableCell className={classes.bigFontTable} >{t('table.' + plotState.xAccessor)}</TableCell>
          <TableCell className={classes.bigFontTable} >{t('table.' + plotState.yAccessor)}</TableCell>
        </TableRow>
        {highlightedPoints.map(value =>
          <TableRow key={value.id_organism}>
            <TableCell align='left'>
              <Tooltip title='View organism detail' >
                <Link to={'/app/organism/' + value.id_organism} className={classes.bigFontLink}>
                  {value.name}
                </Link>
              </Tooltip>
            </TableCell>
            <TableCell className={classes.bigFontTable}>{value.strains.map(a => a.strain_name).join(' = ')}</TableCell>
            <TableCell className={classes.bigFontTable}>{value[plotState.xAccessor]}</TableCell>
            <TableCell className={classes.bigFontTable}>{value[plotState.yAccessor]}</TableCell>
          </TableRow>)}
      </TableHead>
    </Table>
  )
}

export { SelectForm, RadioForm, OrganismView }