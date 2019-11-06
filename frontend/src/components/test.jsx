import React, { Fragment, useState, useEffect, useRef, Suspense } from 'react';

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

// Internationalization
import { useTranslation } from 'react-i18next';

// Import components
import { Loader } from './loader'
import { ResultTable } from './advance_search_results'

// Styles
import { stylesTable } from './css/themes'

// import config
import { config } from '../config';

const useStylesTable = stylesTable

const att = {
  tmhmm: '',
  hmmtop: '',
  psort: '',
  pfam: '',
  signal_p: '',
  cog: '',
  cog_category: '',
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


function Test(props) {

  const classes = useStylesTable();
  const { t } = useTranslation();


  const resultRef = useRef(null);
  const [gridState, setGridState] = useState({ gen_metadata: false, })
  const [isLoading, setIsLoading] = useState(false);
  const [resultState, setResultState] = useState([])
  const [formState, setFormState] = useState(att)

  useEffect(() => {
    if (props.match.params.query) {

      // Check if url contains params then update form state
      let params = props.match.params.query ? (props.match.params.query).split('&') : '';
      let pair = null
      let dataParams = {}
      params.forEach(function (d) {
        pair = d.split('=');
        dataParams[pair[0]] = pair[1]
      });
      setFormState(dataParams)

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

  }, [props,]);

  // This is a hack, wait .5 secont to render the text field avoiding the outlined label bug
  useEffect(() => {
    setFormState(att)
    const timer = setTimeout(() => {
      setGridState({ gen_metadata: true, })
    }, 300);
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
    //getResults()
    let searchUrl = Object.keys(formState).map(key => key + '=' + formState[key]).join('&')
    //props.history.push(searchUrl)
    console.log(searchUrl)
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
      executeScroll()
    })
    fetchData()
  }

  return (
    <Fragment>
      <form>
        <Paper style={{ padding: 20 }}>

          <Grid container direction='row'>

            <Button color='primary' style={{ width: '100%', marginTop: 10 }} onClick={() => handleHideGrid('gen_metadata')}>
              protein_search
              {gridState.gen_metadata ? <ExpandLess /> : <ExpandMore />}
            </Button>
            {gridState.gen_metadata &&
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
                            name='tmhmm'
                            type='text'
                            label={'exact value'}
                            value={formState.tmhmm}
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
                            name='hmmtop'
                            type='text'
                            label={'exact value'}
                            value={formState.hmmtop}
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
                            name='psort'
                            type='text'
                            label={'exact value'}
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
                          <div style={{ fontSize: 16 }}>pfam</div>
                        </TableCell>
                        <TableCell style={{ borderStyle: 'none' }} align='left'>
                          <TextField variant='outlined'
                            name='pfam'
                            type='text'
                            label={'exact value'}
                            value={formState.pfam}
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
                            name='signal_p'
                            type='text'
                            label={'exact value'}
                            value={formState.signal_p}
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
                            name='cog'
                            type='text'
                            label={'exact value'}
                            value={formState.cog}
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
                            name='cog_category'
                            type='text'
                            label={'contains'}
                            value={formState.gen_contamination_lte}
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
            <Typography variant='h5'>{`Total: ${resultState.length}`}</Typography>
          </Grid>
          <Grid item xs={6}>
            tmp button
          </Grid>
          {isLoading ?
            <Loader />
            :
            <ResultTable state={resultState} />
          }

        </Grid>

      </Paper>
    </Fragment >
  );
}

const TestComponent = (props) => {

  return (
    <Suspense fallback={<Loader />}>
      <Test {...props} />
    </Suspense>
  );
};
export default TestComponent