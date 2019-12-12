import React, { Fragment, useState, useEffect, useRef } from 'react';

import {
  Button, Typography, Grid, Paper, MenuItem,
  Table, TableBody, TableCell, TableRow, TextField,
} from '@material-ui/core';

import {
  ExpandMore, ExpandLess
} from '@material-ui/icons';

// NPM
import axios from 'axios';
import { Link } from 'react-router-dom';
//import { CSVLink } from 'react-csv';

// Internationalization
import { useTranslation } from 'react-i18next';

// Import components
import { Loader } from './loader'
import { MemoizedProteinResults } from './search_protein_results'

// Styles
import {stylesTable } from './css/themes'

// import config
import { config } from '../config';

const useStylesTable = stylesTable

const att = {
  tmhmm__iexact: '',
  hmmtop__iexact: '',
  psort__iexact: '',
  pfam__icontains: '',
  signal_p__iexact: '',
  cog__iexact: '',
  cog_category__icontains: '',
  kegg_ko: '',
  inter_fam: '',
  ec_number: '',
  signalp_null: '',
  prot_id: '',
}

const psortList = { '': 'Select an option...', c: 'Cytoplasmic', im: 'Inner membrane', p: 'Periplasmic', om: 'Outer membrane', e: 'Exported', w: 'Cell wall', u: 'Unknown' }
const signalpList = { '': 'Select an option...', tat: 'TAT', lipo: 'LIPO', sp: 'SEC', true: 'No signal p' }

const scrollToRef = (ref) => {
  if (ref.current) {
    window.scrollTo({ top: ref.current.offsetTop, behavior: 'smooth' })
  }
}

// Sub components
export default function AdvanceProteinSearchComponent(props) {

  const classes = useStylesTable();
  const { t } = useTranslation();

  const resultRef = useRef(null);
  const [gridState, setGridState] = useState({ prot_search: true, })
  const [isLoading, setIsLoading] = useState(false);
  const [resultState, setResultState] = useState([])
  const [formState, setFormState] = useState(att)
  const [urlState, setUrl] = useState('')

  useEffect(() => {
    setFormState(att)
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

      let url = config.API_PROTEIN_SEARCH + props.match.params.query
      setUrl(url)

      let fetchData = (async () => {
        setIsLoading(true)
        try {
          let res = await axiosFetch(url);
          setResultState(res.data)
          setIsLoading(false)
          executeScroll()          
        } catch (error) {
          setIsLoading(false)
        }
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

  function isObjEmpty(obj) {
    for (var key in obj) {
      if (obj[key] !== '')
        return false;
    }
    return true;
  }
  function handleSubmit(event) {
    event.preventDefault()
    // TODO check if this is OK, If the search state is empty dont search
    if (isObjEmpty(formState)) {
      return
    }
    getResults()
    let searchUrl = Object.keys(formState).map(key => key + '=' + formState[key]).join('&')
    props.history.push(searchUrl)
  }

  const executeScroll = () => scrollToRef(resultRef)

  function handleChange(target) {

    // signal p use 2 filter params signal_p__iexact and signalp_null
    if (target.name === 'signal_p__iexact') {
      if (target.value === 'true') {
        setFormState(oldValues => ({
          ...oldValues,
          signalp_null: target.value,
          signal_p__iexact: ''
        }));
      }
      else {
        setFormState(oldValues => ({
          ...oldValues,
          signalp_null: '',
          signal_p__iexact: target.value,
        }));
      }
    }
    else {
      setFormState(oldValues => ({
        ...oldValues,
        [target.name]: target.value,
      }));
    }
  }

  function axiosFetch(url) {
    return axios.get(url).then(response => {
      // returning the data here allows the caller to get it through another .then(...)
      return response
    })
  }

  function getResults() {
    let url = Object.keys(formState).map(key => key + '=' + formState[key]).join('&')
    url = config.API_PROTEIN_SEARCH + url

    let fetchData = (async () => {
      setIsLoading(true)
      let res = await axiosFetch(url);
      setResultState(res.data)
      setIsLoading(false)
    })
    console.log(url)
    fetchData()
  }

  return (
    <Fragment>
      <form>
        <Paper style={{ padding: 20 }}>


          <Button color='primary' className={classes.customButton} style={{marginBottom:20}} onClick={() => handleHideGrid('prot_search')}>
            {t('protein_search.protein_search')}
            {gridState.prot_search ? <ExpandLess /> : <ExpandMore />}
          </Button>
          {gridState.prot_search &&
            <Fragment>
              <Grid container
                direction='row'
                justify="center"
                alignItems="center">
                <Grid item xs={8}>
                  <TextField variant='outlined'
                    name='prot_id'
                    type='text'
                    label={'protein id'}
                    value={formState.prot_id}
                    onChange={event => handleChange(event.target)}
                    style={{ width: '100%' }}
                  />
                </Grid>
              </Grid>

              <Grid container direction='row'>
                <Grid item xs={3}>
                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>{t('protein_search.tmhmm')}</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='tmhmm__iexact'
                            type='text'
                            label={'i.e. i5, o25, etc.'}
                            value={formState.tmhmm__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>{t('protein_search.hmmtop')}</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='hmmtop__iexact'
                            type='text'
                            label={'i.e. i5, o25, etc.'}
                            value={formState.hmmtop__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>{t('protein_search.psort')}</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='psort__iexact'
                            select
                            type='text'
                            label={'Select an option...'}
                            value={formState.psort__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          >
                            {
                              Object.keys(psortList).map(key =>
                                <MenuItem key={key} value={key}>
                                  {psortList[key]}
                                </MenuItem>
                              )
                            }
                          </TextField>
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
                          <div style={{ fontSize: 16 }}>{t('protein_search.pfam')}</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='pfam__icontains'
                            type='text'
                            label={'i.e. PF00001.1'}
                            value={formState.pfam__icontains}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>{t('protein_search.signal_p')}</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='signal_p__iexact'
                            select
                            type='text'
                            label={'Select an option...'}
                            value={formState.signal_p__iexact !== '' ? formState.signal_p__iexact : formState.signalp_null}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          >
                            {
                              Object.keys(signalpList).map(key =>
                                <MenuItem key={key} value={key}>
                                  {signalpList[key]}
                                </MenuItem>
                              )
                            }
                          </TextField>
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
                          <div style={{ fontSize: 16 }}>{t('protein_search.cog')}</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='cog__iexact'
                            type='text'
                            label={'i.e. COG1234, arCOG12345'}
                            value={formState.cog__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>{t('protein_search.cog_category')}</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='cog_category__icontains'
                            type='text'
                            label={'i.e. [single letter]'}
                            value={formState.cog_category__icontains}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>{t('protein_search.kegg_ko')}</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='kegg_ko'
                            type='text'
                            label={'i.e. ko:K01234'}
                            value={formState.kegg_ko}
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
                          <div style={{ fontSize: 16 }}>{t('protein_search.inter_fam')}</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='inter_fam'
                            type='text'
                            label={'TODO'}
                            value={formState.inter_fam}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>{t('protein_search.ec_number')}</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='ec_number'
                            type='text'
                            label={'i.e 1.22.333.44'}
                            value={formState.ec_number}
                            onChange={event => handleChange(event.target)}
                            style={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </Grid>

              </Grid>
            </Fragment>
          }


          <div style={{ padding: 10, margin: 10, fontSize: 18 }} >
            <em>{t('protein_search.tip')}<Link to={'/app/#protein_search_docs'}>{' Here'}</Link></em>
          </div>

          <Grid container alignItems='center' alignContent='center'>
            <Button color='primary' style={{ padding: 10, margin: 10, fontSize: 18 }} variant='outlined' type='submit' onClick={handleSubmit}>
              {t('search')}
            </Button>
          </Grid>
        </Paper>

      </form >
      <span ref={resultRef}></span>
      <Paper style={{ padding: 30 }}>
        <Typography variant='h4'>{t('search_results')}</Typography>
        <Grid container alignItems='center' alignContent='center'>
          <Grid item xs={12}>
            <Typography variant='h5'>{`Total: ${resultState.count ? resultState.count : 0}`}</Typography>
          </Grid>
          {isLoading ?
            <Loader />
            :
            <MemoizedProteinResults state={resultState} url={urlState} />
          }

        </Grid>
      </Paper>
    </Fragment >
  );
}
