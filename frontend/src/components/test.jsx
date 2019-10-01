import React, { Fragment, useState } from 'react';

import {
  Button, MenuItem, Typography, Grid, FormControlLabel, Checkbox, FormGroup, Paper, InputAdornment,
  Table, TableBody, TableCell, TableRow, Select, InputLabel, TableHead, Tooltip, TextField, Divider
} from '@material-ui/core';

// NPM
import {
  Link
} from 'react-router-dom';

// Styles
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesTable } from './css/themes'

import {
  makeStyles
} from '@material-ui/core/styles';


const styles = makeStyles({
  paper: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default function TestComponent() {
  const classes = styles();


  const [gridState, setGridState] = useState({ identifiers: true, tax_info: false, growth_range: false, gen_metadata: false, proteome_metadata: false, })

  const [resultState, setResultState] = useState(null)

  function handleHideGrid(name) {
    setGridState(oldValues => ({
      ...oldValues,
      [name]: !gridState[name],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault()
    setResultState('YAY RESULTS')
  }


  return (

    <ThemeProvider theme={theme}>
      <form>
        <Paper style={{ padding: 20 }}>

          <Grid container alignItems='center' alignContent='center'>
            <Button color="primary" style={{ width: '100%', marginTop: 10, }} onClick={() => handleHideGrid('identifiers')}>
              Identifiers
          </Button>
            {gridState.identifiers &&
              <Fragment>
                <Grid item xs={6} >
                  <TextField
                    type="text"
                    label="Organism name"
                    style={{ width: '90%' }}
                  />
                </Grid>
                <Grid item xs={6} >
                  <TextField
                    type="text"
                    label="Strain name"
                    style={{ width: '90%' }}
                  />
                </Grid>
              </Fragment>
            }
          </Grid>
          <Divider style={{ marginTop: 20 }} orientation='horizontal' />

          <Grid container alignItems='center' alignContent='center'>
            <Button color="primary" style={{ width: '100%', marginTop: 10 }} onClick={() => handleHideGrid('tax_info')}>
              Taxonomy info
          </Button>
            {gridState.tax_info &&
              <Fragment>
                <Grid item xs={4} >
                  <TextField
                    type="text"
                    label="Domain"
                    style={{ width: '90%' }}
                  />
                </Grid>
                <Grid item xs={4} >
                  <TextField
                    type="text"
                    label="Class"
                    style={{ width: '90%' }}
                  />
                </Grid>
                <Grid item xs={4} >
                  <TextField
                    type="text"
                    label="Order"
                    style={{ width: '90%' }}
                  />
                </Grid>
                <Grid item xs={4} >
                  <TextField
                    type="text"
                    label="Family"
                    style={{ width: '90%' }}
                  />
                </Grid>
                <Grid item xs={4} >
                  <TextField
                    type="text"
                    label="Genus"
                    style={{ width: '90%' }}
                  />
                </Grid>
                <Grid item xs={4} >
                  <TextField
                    type="text"
                    label="Species"
                    style={{ width: '90%' }}
                  />
                </Grid>
              </Fragment>
            }
          </Grid>
          <Divider style={{ marginTop: 20 }} orientation='horizontal' />

          <Grid container alignItems='center' alignContent='center'>
            <Button color="primary" style={{ width: '100%', marginTop: 10 }} onClick={() => handleHideGrid('growth_range')}>
              Growth range
          </Button>
            {gridState.growth_range &&
              <Fragment>

                <Grid item xs={6}>
                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <div style={{ fontSize: 16 }}>Optimal temperature range</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="Temperature [C°]"
                          />
                          <TextField
                            type="text"
                            label="Temperature [C°]"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            style={{ verticalAlign: 'bottom' }}
                            type="text"
                            defaultValue="Can grow at temperature:"
                            InputProps={{
                              disableUnderline: true,
                              readOnly: true,
                            }}
                          />
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="Temperature [C°]"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={6}>
                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <div style={{ fontSize: 16 }}>Optimal pH range</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="pH"
                          />
                          <TextField
                            type="text"
                            label="pH"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            style={{ verticalAlign: 'bottom' }}
                            type="text"
                            defaultValue="Can grow at pH:"
                            InputProps={{
                              disableUnderline: true,
                              readOnly: true,
                            }}
                          />
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="pH"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Fragment>
            }
          </Grid>
          <Divider style={{ marginTop: 20 }} orientation='horizontal' />

          <Grid container alignItems='center' alignContent='center'>
            <Button color="primary" style={{ width: '100%', marginTop: 10 }} onClick={() => handleHideGrid('gen_metadata')}>
              Genome metadata
          </Button>
            {gridState.gen_metadata &&
              <Fragment>
                <Grid item xs={6} >
                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <div style={{ fontSize: 16 }}>Gene size range</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="val 1"
                          />
                          <TextField
                            type="text"
                            label="val 2"
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <div style={{ fontSize: 16 }}>GC range</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="val 1"
                          />
                          <TextField
                            type="text"
                            label="val 2"
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <div style={{ fontSize: 16 }}>Contamination range</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="val 1"
                          />
                          <TextField
                            type="text"
                            label="val 2"
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <div style={{ fontSize: 16 }}>Completenes range</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="val 1"
                          />
                          <TextField
                            type="text"
                            label="val 2"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={6} >
                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="Assembly level"
                            style={{ width: '90%' }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="Access src"
                            style={{ width: '90%' }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="Access id"
                            style={{ width: '90%' }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="Bioproject"
                            style={{ width: '90%' }}
                          />                      </TableCell>
                      </TableRow>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <TextField
                            type="text"
                            label="Biosample"
                            style={{ width: '90%' }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

              </Fragment>
            }
          </Grid>
          <Divider style={{ marginTop: 20 }} orientation='horizontal' />

          <Grid container alignItems='center' alignContent='center'>
            <Button color="primary" style={{ width: '100%', marginTop: 10 }} onClick={() => handleHideGrid('proteome_metadata')}>
              Proteome metadata
          </Button>
            {gridState.proteome_metadata &&
              <Fragment>
                <Grid item xs={6} >

                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align="left">
                          <div style={{ fontSize: 16 }}>N orfs range</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} >
                          <TextField
                            type="text"
                            label="val 1"
                          />
                          <TextField
                            type="text"
                            label="val 2"
                          />
                        </TableCell>


                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={6} >

                  <TextField
                    type="text"
                    label="Annotation"
                    style={{ width: '90%' }}
                  />

                </Grid>
              </Fragment>
            }

            <Button color="primary" style={{ padding: 10, fontSize: 18 }} variant='outlined' type='submit' onClick={handleSubmit}>
              Search
            </Button>
          </Grid>
        </Paper>


      </form>
      <Paper style={{ padding: 20 }}>
      <div> Aca salen los resultados </div>
      <div> {resultState} </div>
      </Paper>
    </ThemeProvider>
  );
}