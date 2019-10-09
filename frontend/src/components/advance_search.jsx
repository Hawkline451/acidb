import React, { Fragment, useState, useEffect, useRef } from 'react';

import {
  Button, MenuItem, Typography, Grid, Paper, 
  Table, TableBody, TableCell, TableRow, TextField, Divider
} from '@material-ui/core';

import {
  ExpandMore, ExpandLess
} from '@material-ui/icons';

// NPM
import {
  Link
} from 'react-router-dom';
import axios from 'axios';

// Import components
import { Loader } from './loader'
import { ResultTable } from './advance_search_results'

// Styles
import { stylesTable } from './css/themes'

// import config
import { config } from "../config";

import {
  makeStyles
} from '@material-ui/core/styles';

const useStylesTable = stylesTable

const styles = makeStyles({
  paper: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const isolatedDict = { '': 'None', true: 'Isolated', false: 'Non Isolated' }
const assemblyList = { '': 'None', complete: 'Complete', draft: 'Draft' }
const accessSrcList = { '': 'None', genbank: 'GenBank', jgi: 'JGI', insdc: 'INSDC' }

const scrollToRef = (ref) => window.scrollTo({top:ref.current.offsetTop, behavior:'smooth'}) 

// Sub components





export default function AdvanceSearchComponent(props) {

  const resultRef = useRef(null);
  const [gridState, setGridState] = useState({ identifiers: false, tax_info: false, growth_range: false, gen_metadata: false, proteome_metadata: false, })

  // query structure: organism_or_strain=something
  const param = (props.match.params.query).split('=')[1]
  const [resultState, setResultState] = useState([])
  const [formState, setFormState] = useState(
    {
      organism_or_strain: param,

      domain: '',
      tax_class: '',
      order: '',
      family: '',
      genus: '',
      species: '',

      temp_associated_gte: '',
      temp_associated_lte: '',
      temp_in_range: '',
      ph_associated_gte: '',
      ph_associated_lte: '',
      ph_in_range: '',

      gen_size_gte: '',
      gen_size_lte: '',
      gc_percentage_gte: '',
      gc_percentage_lte: '',
      gen_contamination_lte: '',
      gen_completeness_gte: '',
      state__iexact: '',
      isolated: '',
      access_src__iexact: '',
      access_id__iexact: '',
      bioproject__iexact: '',
      biosample__iexact: '',

      n_orfs_gte: '',
      n_orfs_lte: '',
      annotation: '',
    })

    useEffect(() => {
      if (param !== ''){
        let url = config.API_ADVANCE_SEARCH + props.match.params.query
        let fetchData = (async () => {
          let res = await axiosFetch(url);
          setResultState(res.data)
          executeScroll()
        })
        fetchData()
      }
      // Empty array as second argument avoid fetching on component updates, only when mounting the component
    }, [ props, param ]);

    // This is a hack, wait 1 secont to render the text field avoiding the outlined label bug
    useEffect(() => {
      const timer = setTimeout(() => {
        setGridState({ identifiers: true, tax_info: true, growth_range: true, gen_metadata: false, proteome_metadata: false, })
      }, 1000);
      return () => clearTimeout(timer);
      
      // Empty array as second argument avoid fetching on component updates, only when mounting the component
    }, []);
    

  function handleHideGrid(name) {
    setGridState(oldValues => ({
      ...oldValues,
      [name]: !gridState[name],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault()
    getResults()
  }

  const executeScroll = () => scrollToRef(resultRef)

  function handleChange(target) {
    setFormState(oldValues => ({
      ...oldValues,
      [target.name]: target.value,
    }));
  }

  function axiosFetch(url) {
    return axios.get(url).then(response => {
      // returning the data here allows the caller to get it through another .then(...)
      return response
    })
  }

  function getResults() {
    let url = Object.keys(formState).map(key => key + '=' + formState[key]).join('&')
    url = config.API_ADVANCE_SEARCH + url
    let fetchData = (async () => {
      let res = await axiosFetch(url);
      setResultState(res.data)
      executeScroll()
    })
    fetchData()
  }

  return (
    <Fragment>
      <form>
        <Paper style={{ padding: 20 }}>
          <Grid container direction='row'>
            <Grid item xs={6}>
              <Button color='primary' style={{ width: '100%', marginTop: 10, }} onClick={() => handleHideGrid('identifiers')}>
                Identifiers
                {gridState.identifiers ? <ExpandLess /> : <ExpandMore />}
              </Button>
              {gridState.identifiers &&
                <Table >
                  <TableBody>
                    <TableRow >
                      <TableCell style={{ borderStyle: 'none' }} align='left'>
                        <TextField variant='outlined'
                          key='organism_or_strain'
                          name='organism_or_strain'
                          type='text'
                          label={'Organism / Strain'}
                          value={formState.organism_or_strain}
                          onChange={event => handleChange(event.target)}
                          style={{ width: '100%' }}
                        />
                      </TableCell>
                    </TableRow >
                  </TableBody>
                </Table >
              }

              <Button color='primary' style={{ width: '100%', marginTop: 10 }} onClick={() => handleHideGrid('tax_info')}>
                Taxonomy info
                {gridState.tax_info ? <ExpandLess /> : <ExpandMore />}
              </Button>
              {gridState.tax_info &&
                <Table >
                  <TableBody>
                    <TableRow >
                      <TableCell style={{ borderStyle: 'none' }} align='left'>
                        <TextField variant='outlined'
                          name='domain'
                          type='text'
                          label={'Domain'}
                          value={formState.domain}
                          onChange={event => handleChange(event.target)}
                          style={{ width: '100%' }}
                        />
                      </TableCell>
                      <TableCell style={{ borderStyle: 'none' }} align='left'>
                        <TextField variant='outlined'
                          name='tax_class'
                          type='text'
                          label={'Class'}
                          value={formState.tax_class}
                          onChange={event => handleChange(event.target)}
                          style={{ width: '100%' }}
                        />
                      </TableCell>
                      <TableCell style={{ borderStyle: 'none' }} align='left'>
                        <TextField variant='outlined'
                          name='order'
                          type='text'
                          label={'Order'}
                          value={formState.order}
                          onChange={event => handleChange(event.target)}
                          style={{ width: '100%' }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ borderStyle: 'none' }} align='left'>
                        <TextField variant='outlined'
                          name='family'
                          type='text'
                          label={'Family'}
                          value={formState.family}
                          onChange={event => handleChange(event.target)}
                          style={{ width: '100%' }}
                        />
                      </TableCell>
                      <TableCell style={{ borderStyle: 'none' }} align='left'>
                        <TextField variant='outlined'
                          name='genus'
                          type='text'
                          label={'Genus'}
                          value={formState.genus}
                          onChange={event => handleChange(event.target)}
                          style={{ width: '100%' }}
                        />
                      </TableCell>
                      <TableCell style={{ borderStyle: 'none' }} align='left'>
                        <TextField variant='outlined'
                          name='species'
                          type='text'
                          label={'Species'}
                          value={formState.species}
                          onChange={event => handleChange(event.target)}
                          style={{ width: '100%' }}
                        />
                      </TableCell>

                    </TableRow>
                  </TableBody>
                </Table>
              }
            </Grid>

            <Grid item xs={6}>
              <Grid container alignItems='center' alignContent='center'>
                <Button color='primary' style={{ width: '100%', marginTop: 10 }} onClick={() => handleHideGrid('growth_range')}>
                  Growth range
                  {gridState.growth_range ? <ExpandLess /> : <ExpandMore />}
                </Button>
                {gridState.growth_range &&
                  <Fragment>

                    <Grid item xs={6}>
                      <Table >
                        <TableBody>
                          <TableRow >
                            <TableCell style={{ borderStyle: 'none' }} align='left'>
                              <div style={{ fontSize: 16 }}>Optimal temperature range</div>
                            </TableCell>
                            <TableCell style={{ borderStyle: 'none' }} align='left'>
                              <TextField variant='outlined'
                                name='temp_associated_gte'
                                type='text'
                                label={'min value [C°]'}
                                value={formState.temp_associated_gte}
                                onChange={event => handleChange(event.target)}
                              />
                              <TextField variant='outlined'
                                name='temp_associated_lte'
                                type='text'
                                label={'max value [C°]'}
                                value={formState.temp_associated_lte}
                                onChange={event => handleChange(event.target)}
                                style={{ marginTop: 5 }}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell style={{ borderStyle: 'none' }} align='left'>
                              <div style={{ fontSize: 16 }}>Can grow at temperature:</div>
                            </TableCell>
                            <TableCell style={{ borderStyle: 'none' }} align='left'>
                              <TextField variant='outlined'
                                name='temp_in_range'
                                type='text'
                                label={'Temperature [C°]'}
                                value={formState.temp_in_range}
                                onChange={event => handleChange(event.target)}
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
                            <TableCell style={{ borderStyle: 'none' }} align='left'>
                              <div style={{ fontSize: 16 }}>Optimal pH range</div>
                            </TableCell>
                            <TableCell style={{ borderStyle: 'none' }} align='left'>
                              <TextField variant='outlined'
                                name='ph_associated_gte'
                                type='text'
                                label={'min value'}
                                value={formState.ph_associated_gte}
                                onChange={event => handleChange(event.target)}
                              />
                              <TextField variant='outlined'
                                name='ph_associated_lte'
                                type='text'
                                label={'max value'}
                                value={formState.ph_associated_lte}
                                onChange={event => handleChange(event.target)}
                                style={{ marginTop: 5 }}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow >
                            <TableCell style={{ borderStyle: 'none' }} align='left'>
                              <div style={{ fontSize: 16 }}>Can grow at pH:</div>
                            </TableCell>
                            <TableCell style={{ borderStyle: 'none' }} align='left'>
                              <TextField variant='outlined'
                                name='ph_in_range'
                                type='text'
                                label={'pH'}
                                value={formState.ph_in_rage}
                                onChange={event => handleChange(event.target)}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>
                  </Fragment>
                }
              </Grid>

            </Grid>
          </Grid>
          <Divider style={{ marginTop: 20 }} orientation='horizontal' />


          <Grid container direction='row'>

            <Button color='primary' style={{ width: '100%', marginTop: 10 }} onClick={() => handleHideGrid('gen_metadata')}>
              Genome metadata
              {gridState.gen_metadata ? <ExpandLess /> : <ExpandMore />}
            </Button>
            {gridState.gen_metadata &&
              <Fragment>

                <Grid item xs={3}>
                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>Gene size range</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='gen_size_gte'
                            type='text'
                            label={'min value'}
                            value={formState.gen_size_gte}
                            onChange={event => handleChange(event.target)}
                          />
                          <TextField variant='outlined'
                            name='gen_size_lte'
                            type='text'
                            label={'max value'}
                            value={formState.gen_size_lte}
                            onChange={event => handleChange(event.target)}
                            style={{ marginTop: 5 }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>GC range</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='gc_percentage_gte'
                            type='text'
                            label={'min value'}
                            value={formState.gc_percentage_gte}
                            onChange={event => handleChange(event.target)}
                          />
                          <TextField variant='outlined'
                            name='gc_percentage_lte'
                            type='text'
                            label={'max value'}
                            value={formState.gc_percentage_lte}
                            onChange={event => handleChange(event.target)}
                            style={{ marginTop: 5 }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={3} >
                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>Contamination</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='gen_contamination_lte'
                            type='text'
                            label={'lower than'}
                            value={formState.gen_contamination_lte}
                            onChange={event => handleChange(event.target)}
                            style={{ marginTop: 5 }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>Completeness</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='gen_completeness_gte'
                            type='text'
                            label={'greater than'}
                            value={formState.gen_completeness_gte}
                            onChange={event => handleChange(event.target)}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={3} >
                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            select
                            name='state___iexact'
                            type='text'
                            label={'Assembly level'}
                            value={formState.state__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          >
                            {
                              Object.keys(assemblyList).map(key =>
                                <MenuItem key={'assembly'+key} value={key}>
                                  {assemblyList[key]}
                                </MenuItem>
                              )
                            }
                          </TextField>
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            select
                            name='access_src__iexact'
                            type='text'
                            label={'Access src'}
                            value={formState.access_src__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          >
                            {
                              Object.keys(accessSrcList).map(key =>
                                <MenuItem key={'access'+key} value={key}>
                                  {accessSrcList[key]}
                                </MenuItem>
                              )
                            }
                          </TextField>
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='access_id__iexact'
                            type='text'
                            label={'Access id'}
                            value={formState.access_id__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={3} >

                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            select
                            name='isolated'
                            label={'Isolated'}
                            value={formState.isolated}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          >
                            {
                              Object.keys(isolatedDict).map(key =>
                                <MenuItem key={'isolated'+key} value={key}>
                                  {isolatedDict[key]}
                                </MenuItem>
                              )
                            }
                          </TextField>
                        </TableCell>
                      </TableRow>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='bioproject__iexact'
                            type='text'
                            label={'Bioproject'}
                            value={formState.bioproject__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='biosample__iexact'
                            type='text'
                            label={'Biosample'}
                            value={formState.biosample__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
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
            <Button color='primary' style={{ width: '100%', marginTop: 10 }} onClick={() => handleHideGrid('proteome_metadata')}>
              Proteome metadata
              {gridState.proteome_metadata ? <ExpandLess /> : <ExpandMore />}
            </Button>
            {gridState.proteome_metadata &&
              <Fragment>
                <Grid item xs={6} >

                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>N orfs range</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} >
                          <TextField variant='outlined'
                            name='n_orfs_gte'
                            type='text'
                            label={'min value'}
                            value={formState.n_orfs_gte}
                            onChange={event => handleChange(event.target)}
                          />
                          <TextField variant='outlined'
                            name='n_orfs_lte'
                            type='text'
                            label={'max value'}
                            value={formState.n_orfs_lte}
                            onChange={event => handleChange(event.target)}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                <Grid item xs={6} >
                  <TextField variant='outlined'
                    name='annotation'
                    type='text'
                    label={'Annotation'}
                    value={formState.annotation}
                    onChange={event => handleChange(event.target)}
                    style={{ width: '100%' }}
                  />
                </Grid>
              </Fragment>
            }

            <Button color='primary' style={{ padding: 10, fontSize: 18 }} variant='outlined' type='submit' onClick={handleSubmit}>
              Search
            </Button>
          </Grid>
        </Paper>

      </form >
      <span ref={resultRef}></span>
      <Paper style={{ padding: 30 }}>
        <Typography variant='h4'> Search results </Typography>
        <Typography variant='h5'>{`Total: ${resultState.length}`}</Typography>
        {resultState.length ?
          <ResultTable state={resultState} />
          :
          <div/>
        }

      </Paper>
    </Fragment >
  );
}