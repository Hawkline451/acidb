import React, { useState, useEffect } from "react";

import {
  Divider, List, ListItem, ListItemText, Table, TableBody, TableCell, Grid, TableRow, 
} from '@material-ui/core';

// Styles
import { ThemeProvider} from '@material-ui/styles';
import { theme, stylesDetail } from './themes'

// Internationalization
import { useTranslation } from 'react-i18next';

import axios from 'axios';

import { Loader } from './loader'

const useStylesDetail = stylesDetail
const identifiers = [
  'name',
  'strains',
];
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
  'ph_confidence',
  'temp_confidence',
  'ph_src',
  'temp_src'
];

//Organism component
export default function Organism(props) {
  const classes = useStylesDetail();
  const { t } = useTranslation();
  const [state, setState] = useState({
    data: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const url = 'http://192.168.0.181:8000/api/organism_detail/' + props.match.params.id

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios({ url });

      setState({ data: result.data });
      console.log("result")
      console.log(result)
      console.log(props)
      setIsLoading(false);
    };
    fetchData();
    // Empty array as second argument avoid fetching on component updates, only when mounting the component
  }, [url]);

  function concatStrains() {
    var strains = state.data.strains[0]['strain_name']
    for (var index = 1; index < state.data.strains.length; ++index) {
      strains = strains + ' = ' + state.data.strains[index]['strain_name']
    }
    return strains
  }

  return (
    <div>
      {isLoading ?
        (<Loader />) :
        (<ThemeProvider theme={theme}>
          <Grid container>
            <Grid item xs={2}>

              <div className={classes.fixedList}>
                <div className={classes.multilineDiv}><h1>{state.data.name}</h1></div>

                <List>
                  <Divider />
                  <ListItem button component="a" href={props.location.pathname + '#identifiers'}>
                    <ListItemText primary="General Info" />
                  </ListItem>
                  <Divider />
                  <ListItem button component="a" href={props.location.pathname + '#gen_metadata'}>
                    <ListItemText primary="Genome Metadata" />
                  </ListItem>
                  <Divider />
                  <ListItem button component="a" href={props.location.pathname + '#prot_metadata'}>
                    <ListItemText primary="Proteome Metadata" />
                  </ListItem>
                  <Divider light />
                  <ListItem button component="a" href={props.location.pathname + '#growth'}>
                    <ListItemText primary="Growth range" />
                  </ListItem>
                  <Divider />
                  <ListItem button component="a" href={props.location.pathname + '#taxonomy'}>
                    <ListItemText primary="Taxonomy" />
                  </ListItem>
                  <Divider />
                  <ListItem button component="a" href={props.location.pathname + '#references'}>
                    <ListItemText primary="References" />
                  </ListItem>
                  <Divider />
                </List>
              </div>
            </Grid>

            <Grid item xs={10}>

              <span id="identifiers"></span>
              <Table className={classes.table}>
                <div><h1>General info</h1></div>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {'name'}
                    </TableCell>
                    <TableCell>
                      {state.data.name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {'strains'}
                    </TableCell>
                    <TableCell>
                      {concatStrains()}
                    </TableCell>

                  </TableRow>
                </TableBody>
              </Table>

              <span id="gen_metadata"></span>
              <Table className={classes.table}>
                <div><h1>Genome metadata</h1></div>
                <TableBody >
                  {
                    genMetadata.map(tmpKey => (
                      <TableRow key={tmpKey}>
                        <TableCell component="th" scope="row">
                          {tmpKey}
                        </TableCell>
                        <TableCell>
                          {String(state.data[tmpKey])}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody >
              </Table>

              <span id="prot_metadata"></span>
              <Table className={classes.table}>
                <div><h1>Proteome metadata</h1></div>
                <TableBody >
                  {
                    protMetadata.map(tmpKey => (
                      <TableRow key={tmpKey}>
                        <TableCell component="th" scope="row">
                          {tmpKey}
                        </TableCell>
                        <TableCell>
                          {String(state.data[tmpKey])}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody >
              </Table>

              <span id="growth"></span>
              <Table className={classes.table}>
                <div><h1>Growth range</h1></div>
                <TableBody >
                  {
                    growth.map(tmpKey => (
                      <TableRow key={tmpKey}>
                        <TableCell component="th" scope="row">
                          {tmpKey}
                        </TableCell>
                        <TableCell>
                          {String(state.data[tmpKey])}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody >
                <TableBody >
                  {
                    growthDetail.map(tmpKey => (
                      <TableRow key={tmpKey}>
                        <TableCell component="th" scope="row">
                          {tmpKey}
                        </TableCell>
                        <TableCell>
                          {String(state.data.growth_detail[tmpKey])}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody >
              </Table>

              <span id="taxonomy"></span>
              <Table className={classes.table}>
                <div><h1>Taxonomy</h1></div>
                <TableBody >
                  {
                    taxInfo.map(tmpKey => (
                      <TableRow key={tmpKey}>
                        <TableCell component="th" scope="row">
                          {tmpKey}
                        </TableCell>
                        <TableCell>
                          {String(state.data.taxonomy[0][tmpKey])}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody >
              </Table>


              <span id="references"></span>
              <Table className={classes.table}>
                <div><h1>References</h1></div>
                <TableBody >
                  {
                    state.data.references.map(value => (
                      <TableRow key={'ref_' + value.index}>
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
        </ThemeProvider>)
      }
    </div>
  );
}


