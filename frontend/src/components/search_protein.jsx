import React, { Fragment, useState, useEffect, useRef } from 'react';

import {
  Button, Typography, Grid, Paper,
  Table, TableBody, TableCell, TableRow, TextField,
} from '@material-ui/core';

import {
  ExpandMore, ExpandLess
} from '@material-ui/icons';

// NPM

import axios from 'axios';
//import { CSVLink } from 'react-csv';

// Internationalization
import { useTranslation } from 'react-i18next';

// Import components
import { Loader } from './loader'
import {MemoizedProteinResults} from './search_protein_results'

// Styles
import { stylesTable } from './css/themes'

// import config
import { config } from '../config';

const useStylesTable = stylesTable

const att = {
  tmhmm__iexact: '',
  hmmtop__iexact: '',
  psort__iexact: '',
  pfam__iexact: '',
  signal_p__iexact: '',
  cog__iexact: '',
  cog_category__icontains: '',
  kegg_ko: '',
  inter_fam: '',
  ec_number: '',

}

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

      let url = 'http://127.0.0.1:8000/api/protein_search/?' + props.match.params.query
      setUrl(url)

      let fetchData = (async () => {
        setIsLoading(true)
        let res = await axiosFetch(url);
        setResultState(res.data)
        setIsLoading(false)
        executeScroll()
      })
      fetchData()
    }
    else{
      setFormState(att)
    }

  }, [props,]);

  // This is a hack, wait .5 secont to render the text field avoiding the outlined label bug
  useEffect(() => {
    setFormState(att)
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
    let searchUrl = Object.keys(formState).map(key => key + '=' + formState[key]).join('&')
    props.history.push(searchUrl)
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
    url = 'http://127.0.0.1:8000/api/protein_search/?' + url

    let fetchData = (async () => {
      setIsLoading(true)
      let res = await axiosFetch(url);
      setResultState(res.data)
      setIsLoading(false)
    })
    fetchData()
  }

  return (
    <Fragment>
      <form>
        <Paper style={{ padding: 20 }}>

          <Grid container direction='row'>

            <Button color='primary' style={{ width: '100%', marginTop: 10 }} onClick={() => handleHideGrid('prot_search')}>
              protein_search
              {gridState.prot_search ? <ExpandLess /> : <ExpandMore />}
            </Button>
            {gridState.prot_search &&
              <Fragment>

                <Grid item xs={3}>
                  <Table >
                    <TableBody>
                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>tmhmm</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='tmhmm__iexact'
                            type='text'
                            label={'i.e.'}
                            value={formState.tmhmm__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ marginTop: 5 }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>hmmtop</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='hmmtop__iexact'
                            type='text'
                            label={'i.e.'}
                            value={formState.hmmtop__iexact}
                            onChange={event => handleChange(event.target)}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>psort</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='psort__iexact'
                            type='text'
                            label={'i.e.'}
                            value={formState.psort__iexact}
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
                          <div style={{ fontSize: 16 }}>pfam</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='pfam__iexact'
                            type='text'
                            label={'i.e.'}
                            value={formState.pfam__iexact}
                            onChange={event => handleChange(event.target)}
                            style={{ marginTop: 5 }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>signal_p</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='signal_p__iexact'
                            type='text'
                            label={'i.e.'}
                            value={formState.signal_p__iexact}
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
                          <div style={{ fontSize: 16 }}>cog</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='cog__iexact'
                            type='text'
                            label={'i.e.'}
                            value={formState.cog__iexact}
                            onChange={event => handleChange(event.target)}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>cog_category</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='cog_category__icontains'
                            type='text'
                            label={'i.e.'}
                            value={formState.cog_category__icontains}
                            onChange={event => handleChange(event.target)}
                            style={{ marginTop: 5 }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>kegg_ko</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='kegg_ko'
                            type='text'
                            label={'exact'}
                            value={formState.kegg_ko}
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
                          <div style={{ fontSize: 16 }}>inter_fam</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='inter_fam'
                            type='text'
                            label={'exact'}
                            value={formState.inter_fam}
                            onChange={event => handleChange(event.target)}
                            style={{ marginTop: 5 }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow >
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <div style={{ fontSize: 16 }}>ec_number</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='ec_number'
                            type='text'
                            label={'exact'}
                            value={formState.ec_number}
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

          <Grid container alignItems='center' alignContent='center'>
            <Button color='primary' style={{ padding: 10, fontSize: 18 }} variant='outlined' type='submit' onClick={handleSubmit}>
              Search
            </Button>
          </Grid>
        </Paper>

      </form >
      <span ref={resultRef}></span>
      <Paper style={{ padding: 30 }}>
        <Typography variant='h4'> Search results </Typography>
        <Grid container alignItems='center' alignContent='center'>
          <Grid item xs={6}>
            <Typography variant='h5'>{`Total: ${resultState.count ? resultState.count: 0}`}</Typography>
          </Grid>
          {isLoading ?
            <Loader />
            :
            <MemoizedProteinResults state={resultState} url={urlState}/>
          }

        </Grid>

      </Paper>
    </Fragment >
  );
}
