import React, { useState, useEffect, Fragment } from "react";

import {
  Divider, List, ListItem, ListItemText, Table, TableBody, TableCell, Grid, TableRow, Link,
} from '@material-ui/core';

// Styles
import { stylesDetail } from './css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';

// npm
import axios from 'axios';
import { Loader } from './loader'

// import config
import { config } from "../config";

// components
import OrganismNotFound from './organism_not_found';

const useStylesDetail = stylesDetail

const taxInfo = [
  'tax_src',
  'tax_id',
  'domain',
  'phylum',
  'tax_class',
  'order',
  'family',
  'genus',
  'species',
];
const genMetadata = [
  'access_src',
  'access_id',
  'ftp_url',
  'isolated',
  'gen_size',
  'gc_percentage',
  'state',
  'seq_date',
  'gen_completeness',
  'gen_contamination',
];
const protMetadata = [
  'annotation',
  'n_orfs',
];
const growth = [
  'temp_associated',
  'temp_min',
  'temp_max',
  'ph_associated',
  'ph_min',
  'ph_max',
];
const growthDetail = [
  'temp_src',
  'temp_confidence',
  'ph_src',
  'ph_confidence',
];

//Organism component
export default function Organism(props) {
  const classes = useStylesDetail();
  const { t } = useTranslation();
  const [state, setState] = useState({
    data: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const url = config.API_ORGANISM_DETAIL + props.match.params.id

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await axios({ url });
        setState({ data: result.data });
        setIsLoading(false);
        setError(false)


      }
      catch (err) {
        setError(true)
        setIsLoading(false);
      }

    };
    fetchData();
    // Empty array as second argument avoid fetching on component updates, only when mounting the component
  }, [url]);

  function concatStrains(state) {
    var strains = state.data.strains.map(a => a.strain_name).join(' = ')
    return strains
  }

  function transformElement(key) {
    switch (key) {
      case ('ftp_url'):
        return (state.data[key] ? <Link href={state.data[key]} color="primary">{state.data[key]}</Link> : <div />)
      case ('isolated'):
        return (state.data[key])
      default:
      // do nothing
    }
    return state.data[key]
  }

  function phClassification() {
    let val = state.data.ph_associated
    if (!val) return ''

    if (val >= 3.6) return 'Moderate Acidophile'
    else return 'Extreme Acidophile'
  }

  function tempClassification() {    
    let val = state.data.temp_associated
    if (!val) return ''
    let min = state.data.temp_min
    let max = state.data.temp_max
    if (val >= 60) return 'Extreme Thermophile'
    if (val >= 38 && val < 60) return 'Moderate Thermophile'
    if (val < 38 && (val < 15 || min < 15 || max < 15)) return 'Psychrotolerant'
    else return 'Mesophile'
  }

  function phColors() {
    let val = state.data.ph_associated
    if (!val) return '#ffffff'

    if (val >= 3.6) return '#ecd2c7'
    else return '#de6b43'
  }

  function tempColors() {
    let val = state.data.temp_associated
    if (!val) return '#ffffff'
    let min = state.data.temp_min
    let max = state.data.temp_max
    if (val >= 60) return '#de6b43'
    if (val >= 38 && val < 60) return '#e58662'
    if (val < 38 && (val < 15 || min < 15 || max < 15)) return '#ecd2c7'
    else return '#ecb9a4'
  }

  return (
    <div>
      {isLoading && !error ? (<Loader />) :
        error ? (<OrganismNotFound />) :

          (<Fragment>
            <Grid container>
              <Grid item xs={3}>
                <div className={classes.fixedList}>
                  <div style={{ marginLeft: '5%' }}><h1>{state.data.name}</h1></div>
                  <List>
                    <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#summary'}>
                      <ListItemText primary={t('detail.summary')} />
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#gen_metadata'}>
                      <ListItemText primary={t('detail.gen_metadata')} />
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#prot_metadata'}>
                      <ListItemText primary={t('detail.prot_metadata')} />
                    </ListItem>
                    <Divider light />
                    <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#growth'}>
                      <ListItemText primary={t('detail.growth')} />
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#taxonomy'}>
                      <ListItemText primary={t('detail.taxonomy')} />
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#references'}>
                      <ListItemText primary={t('detail.references')} />
                    </ListItem>
                  </List>
                </div>
              </Grid>

              <Grid item xs={9} >
              <span id="summary"></span>
                <div className={classes.tableTitle}><h1>{t('detail.summary')}</h1></div>

                <div className={classes.tableSummaryTitle} style={{ textAlign: 'center', fontSize: 22 }}>
                  {`${state.data.name}  ${state.data.strains[0].strain_name}`}
                </div>
                <Table className={classes.table}>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ textAlign: 'center', fontSize: 20 }}>
                        {state.data.taxonomy[0].domain.toUpperCase()}
                      </TableCell>
                      <TableCell style={{ textAlign: 'center', fontSize: 20 }}>
                        {state.data.taxonomy[0].phylum}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell style={{ textAlign: 'center', fontSize: 16, backgroundColor: phColors() }}>
                        {phClassification()}
                      </TableCell>
                      <TableCell style={{ textAlign: 'center', fontSize: 16 }}>
                        {`pH Optimum: ${state.data.ph_associated ? state.data.ph_associated : 'unknown'}`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell style={{ textAlign: 'center', fontSize: 16, backgroundColor: tempColors() }}>
                        {tempClassification()}
                      </TableCell>
                      <TableCell style={{ textAlign: 'center', fontSize: 16 }}>
                        {`Temp. Optimum: ${state.data.temp_associated ? state.data.temp_associated + '°C' : 'unknown'}`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ textAlign: 'center', fontSize: 16 }}>
                        {`Genome size: ${state.data.gen_size} [Mb]`}
                      </TableCell>
                      <TableCell style={{ textAlign: 'center', fontSize: 16 }}>
                        {`GC content: ${state.data.gc_percentage}%`}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <span id="gen_metadata"></span>
                <div className={classes.tableTitle}><h1>{t('detail.gen_metadata')}</h1></div>
                <Table className={classes.table}>
                  <TableBody >
                    {
                      genMetadata.map(tmpKey => (
                        <TableRow key={tmpKey}>
                          <TableCell className={classes.tableCell} component="th" scope="row">
                            {t('table.' + tmpKey)}
                          </TableCell>
                          <TableCell>
                            {transformElement(tmpKey)}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody >
                </Table>

                <span id="prot_metadata"></span>
                <div className={classes.tableTitle}><h1>{t('detail.prot_metadata')}</h1></div>
                <Table className={classes.table}>
                  <TableBody >
                    {
                      protMetadata.map(tmpKey => (
                        <TableRow key={tmpKey}>
                          <TableCell className={classes.tableCell} component="th" scope="row">
                            {t('table.' + tmpKey)}
                          </TableCell>
                          <TableCell>
                            {state.data[tmpKey]}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody >
                </Table>

                <span id="growth"></span>
                <div className={classes.tableTitle}><h1>{t('detail.growth')}</h1></div>
                <Table className={classes.table}>
                  <TableBody >
                    {
                      growth.map(tmpKey => (
                        <TableRow key={tmpKey}>
                          <TableCell className={classes.tableCell} component="th" scope="row">
                            {t('table.' + tmpKey)}
                          </TableCell>
                          <TableCell>
                            {state.data[tmpKey]}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody >
                  <TableBody >
                    {
                      growthDetail.map(tmpKey => (
                        <TableRow key={tmpKey}>
                          <TableCell className={classes.tableCell} component="th" scope="row">
                            {t('table.' + tmpKey)}
                          </TableCell>
                          <TableCell>
                            {state.data.growth_detail[tmpKey]}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody >
                </Table>

                <span id="taxonomy"></span>
                <div className={classes.tableTitle}><h1>{t('detail.taxonomy')}</h1></div>
                <Table className={classes.table}>
                  <TableBody >
                    {
                      taxInfo.map(tmpKey => (
                        <TableRow key={tmpKey}>
                          <TableCell className={classes.tableCell} component="th" scope="row">
                            {t('table.' + tmpKey)}
                          </TableCell>
                          <TableCell>
                            {state.data.taxonomy[0][tmpKey]}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                    <TableCell className={classes.tableCell}>
                      {t('table.strains')}
                    </TableCell>
                    <TableCell>
                      {concatStrains(state)}
                    </TableCell>
                  </TableBody >
                </Table>


                <span id="references"></span>
                <div className={classes.tableTitle}><h1>{t('detail.references')}</h1></div>

                <Table className={classes.table}>
                  <TableBody >
                    {
                      state.data.references.map(value => (
                        <TableRow key={'ref_' + value.ref_text.slice(0, 20)}>
                          <TableCell component="th" scope="row">
                            {value.ref_text}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody >
                </Table>
              </Grid>
            </Grid>
          </Fragment>)
      }
    </div>
  );
}


