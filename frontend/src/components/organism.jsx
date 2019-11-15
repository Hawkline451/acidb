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
        return (<Link href={state.data[key]} color="primary">{state.data[key]}</Link>)
      case ('isolated'):
        return (state.data[key])
      default:
      // do nothing
    }
    return state.data[key]

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
                  <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#identifiers'}>
                    <ListItemText primary={t('detail.info')} />
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

              <span id="identifiers"></span>
              <div className={classes.tableTitle}><h1>General info</h1></div>
              <Table className={classes.table}>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      {t('table.name')}
                    </TableCell>
                    <TableCell>
                      {state.data.name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      {t('table.strains')}
                    </TableCell>
                    <TableCell>
                      {concatStrains(state)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <span id="gen_metadata"></span>
              <div className={classes.tableTitle}><h1>Genome metadata</h1></div>
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
              <div className={classes.tableTitle}><h1>Proteome metadata</h1></div>
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
              <div className={classes.tableTitle}><h1>Growth range</h1></div>
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
              <div className={classes.tableTitle}><h1>Taxonomy</h1></div>
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
                </TableBody >
              </Table>


              <span id="references"></span>
              <div className={classes.tableTitle}><h1>References</h1></div>

              <Table className={classes.table}>
                <TableBody >
                  {
                    state.data.references.map(value => (
                      <TableRow key={'ref_' + value.ref_text.slice(0,5)}>
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


