import React, { Fragment, useState, useEffect, useRef } from 'react';

import {
  Button, MenuItem, Typography, Grid, Paper,
  Table, TableBody, TableCell, TableRow, TextField, Divider
} from '@material-ui/core';

import {
  ExpandMore, ExpandLess
} from '@material-ui/icons';

// NPM

import axios from 'axios';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';

// Internationalization
import { useTranslation } from 'react-i18next';

// Import components
import { Loader } from './loader'
import { MemoizedResults } from './search_organism_results'

// Styles
import { stylesTable } from './css/themes'

// import config
import { config } from '../config';

const useStylesTable = stylesTable

const isolatedDict = { '': 'None', true: 'Isolated', false: 'Non Isolated' }
const assemblyList = { '': 'None', complete: 'Complete', draft: 'Draft' }
const accessSrcList = { '': 'None', genbank: 'GenBank', jgi: 'JGI', insdc: 'INSDC' }
const headersCSV = [
  'id_organism',
  'name',
  'strains_str',
  'seq_date',

  'domain',
  'phylum',
  'tax_class',
  'order',
  'family',
  'genus',
  'species',

  'ph_associated',
  'ph_min',
  'ph_max',
  'temp_associated',
  'temp_min',
  'temp_max',

  'isolated',
  'gen_size',
  'gc_percentage',
  'state',
  'biosample',
  'bioproject',

  'n_orfs',
];
const att = {
  organism_or_strain: '',

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
}

const scrollToRef = (ref) => {
  if (ref.current) {
    window.scrollTo({ top: ref.current.offsetTop, behavior: 'smooth' })
  }
}

// Sub components

export default function AdvanceSearchComponent(props) {

  const classes = useStylesTable();
  const { t } = useTranslation();


  const resultRef = useRef(null);
  const [gridState, setGridState] = useState({ identifiers: true, tax_info: true, growth_range: true, gen_metadata: false, proteome_metadata: false, })
  const [isLoading, setIsLoading] = useState(false);
  const [resultState, setResultState] = useState([])
  const [formState, setFormState] = useState(att)

  // This is a hack, wait .5 secont to render the text field avoiding the outlined label bug
  useEffect(() => {
    setFormState(att)
    /** 
    const timer = setTimeout(() => {
      setGridState({ identifiers: true, tax_info: true, growth_range: true, gen_metadata: false, proteome_metadata: false, })
    }, 300);
    return () => clearTimeout(timer);
    */

    // Empty array as second argument avoid fetching on component updates, only when mounting the component
  }, []);

  useEffect(() => {
    if (props.match.params.query) {

      // Check if url contains params then update form state
      let params = props.match.params.query ? (props.match.params.query).split('&') : '';
      let pair = null
      let tmpDict = att
      params.forEach(function (d) {
        pair = d.split('=');
        tmpDict[pair[0]] = pair[1]
      });
      setFormState(tmpDict)

      let url = config.API_ADVANCE_SEARCH + props.match.params.query
      let fetchData = (async () => {
        setIsLoading(true)
        let res = await axiosFetch(url);
        setResultState(res.data)
        setIsLoading(false)
        executeScroll()
      })
      fetchData()
    }
    else {
      setFormState(att)
    }

  }, [props,]);

  function handleHideGrid(name) {
    setGridState(oldValues => ({
      ...oldValues,
      [name]: !gridState[name],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault()
    getResults()
    let searchUrl = Object.keys(formState).map(key => key + '=' + formState[key]).join('&')
    props.history.push(searchUrl)
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
      setIsLoading(true)
      let res = await axiosFetch(url);
      setResultState(res.data)
      setIsLoading(false)
    })
    fetchData()
  }

  function getProcesedData() {
    let duplicated = resultState.slice(0)

    for (var i = 0; i < duplicated.length; i++) {
      duplicated[i].strains_str = duplicated[i].strains.map(a => a.strain_name).join(' = ')
      duplicated[i].domain = duplicated[i].taxonomy[0].domain
      duplicated[i].phylum = duplicated[i].taxonomy[0].phylum
      duplicated[i].tax_class = duplicated[i].taxonomy[0].tax_class
      duplicated[i].order = duplicated[i].taxonomy[0].order
      duplicated[i].family = duplicated[i].taxonomy[0].family
      duplicated[i].genus = duplicated[i].taxonomy[0].genus
      duplicated[i].species = duplicated[i].taxonomy[0].species
    }
    return duplicated
  }

  return (
    <Fragment>
      <form>
        <Paper style={{ padding: 20 }}>
          <Grid container direction='row'>
            <Grid item xs={6}>
              <Button color='primary' style={{ width: '100%', marginTop: 10, }} onClick={() => handleHideGrid('identifiers')}>
                {t('organism_search.identifiers')}
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
                          label={t('placeholder.organism_strain')}
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
                {t('organism_search.taxonomy_info')}
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
                              <div style={{ fontSize: 16 }}>{t('organism_search.optimal_temp_range')}</div>
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
                              <div style={{ fontSize: 16 }}>{t('organism_search.can_grow_temp')}</div>
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
                              <div style={{ fontSize: 16 }}>{t('organism_search.optimal_ph_range')}</div>
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
                              <div style={{ fontSize: 16 }}>{t('organism_search.can_grow_ph')}:</div>
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
              {t('organism_search.genome_metadata')}
              {gridState.gen_metadata ? <ExpandLess /> : <ExpandMore />}
            </Button>
            {gridState.gen_metadata &&
              <Fragment>

                <Grid item xs={3}>
                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>{t('organism_search.gen_size_range')}</div>
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
                          <div style={{ fontSize: 16 }}>{t('organism_search.gc_range')}</div>
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
                          <div style={{ fontSize: 16 }}>{t('table.gen_contamination')}</div>
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
                          <div style={{ fontSize: 16 }}>{t('table.gen_completeness')}</div>
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
                                <MenuItem key={'assembly' + key} value={key}>
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
                                <MenuItem key={'access' + key} value={key}>
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
                                <MenuItem key={'isolated' + key} value={key}>
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

          <div style={{ padding: 10, margin: 10, fontSize: 18 }} >
            <em>{t('organism_search.tip')}<Link  to={'/app/#organism_search_docs'}>{' Here'}</Link></em>
          </div>

          <Grid container alignItems='center' alignContent='center'>
            {/* 
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
            */}

            <Button color='primary' style={{ padding: 10, margin: 10, fontSize: 18 }} variant='outlined' type='submit' onClick={handleSubmit}>
              {t('search')}
            </Button>
          </Grid>
        </Paper>

      </form >
      <span ref={resultRef}></span>
      <Paper style={{ padding: 30 }}>
        <Typography variant='h4'> {t('search_results')} </Typography>
        <Grid container alignItems='center' alignContent='center'>
          <Grid item xs={6}>
            <Typography variant='h5'>{`Total: ${resultState.length}`}</Typography>
          </Grid>
          <Grid item xs={6}>
            <CSVLink
              className={classes.noDecoratorLink}
              headers={headersCSV}
              data={getProcesedData()}
              separator={'\t'}
              filename={'filtered_data.csv'}
            >
              <Button variant='outlined' color='primary'>{t('download_file')}</Button>
            </CSVLink>
          </Grid>
          {isLoading ?
            <Loader />
            :
            <MemoizedResults state={resultState} />
          }
        </Grid>
      </Paper>
    </Fragment >
  );
}