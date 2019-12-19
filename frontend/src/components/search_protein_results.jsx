import React, { useState, Fragment } from 'react';

import {
  Grid, Table, TableBody, TableCell, TableFooter, TablePagination, TableRow, TableHead, IconButton, Tooltip,
  DialogActions, DialogContent, DialogContentText, Button, Dialog
} from '@material-ui/core';

import {
  FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage
} from '@material-ui/icons';

import { Loader } from './loader'

import { makeStyles, useTheme } from '@material-ui/core/styles';

// NPM
import {
  Link
} from 'react-router-dom';
import axios from 'axios';

// Internationalization
import { useTranslation } from 'react-i18next';

// Styles
import { stylesTable } from './css/themes'

const useStylesTable = stylesTable


const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label='previous page'>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(page.count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(page.count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
      </IconButton>
    </div>
  );
}



function ProteinResultsTable(props) {
  const { t } = useTranslation();
  const maxRows = 1000
  const classes = useStylesTable()

  const [page, setPage] = useState(props.state);
  const [pageNum, setPageNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch API data
  function getNewPage(url) {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await axios(
        url,
      );
      setPage(result.data)
      setIsLoading(false)

    };
    fetchData();
  }

  const handleChangePage = (event, newPageNumber) => {
    getNewPage(`${String(props.url)}&page=${String(newPageNumber + 1)}`)
    setPageNum(newPageNumber);
  };

  return (
    <Table className={classes.table} aria-label='custom pagination table' align='center' style={{width:'50%'}}>
      {page.results ?
        <Fragment>
          <TableHead>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[]}
                colSpan={3}
                count={page.count}
                rowsPerPage={maxRows}
                page={pageNum}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell align='right'>{t('protein_search.nr_id')}</TableCell>
              <TableCell align='right'>{t('protein_search.prot_len')}</TableCell>
              <TableCell align='right'>
                <Grid
                  container
                  direction='row'
                  justify='center'
                  alignItems='center'
                >
                  <Grid item xs>{t('protein_search.organism')}</Grid>
                  <Grid item xs>{t('protein_search.protein')}</Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
          {isLoading ?
            <TableBody>
              <TableRow>
                <TableCell align='center'>
                  <Loader />
                </TableCell>
              </TableRow>
            </TableBody>
            :

            <TableBody>
              {page.results.map(row => (
                <TableRow key={row.nr_id}>
                  <TableCell align='right' >
                    <Button onClick={() => props.handleOpen(row)} style={{ width: '100%', color:'#0645AD' }}>
                      {row.nr_id}
                    </Button></TableCell>
                  <TableCell align='right'>{row.prot_len}</TableCell>
                  <TableCell align='right'>
                    {row.proteome_nr_id.map(organism => (
                      <Grid
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                        key={String(organism.prot_id) + String(organism.organism_id)}
                      >
                        <Grid item xs>
                          <Tooltip title='View organism detail' >
                            <Link to={'/app/organism/' + organism.organism_id} className={classes.bigFontLink}>
                              {organism.name}
                            </Link>
                          </Tooltip>
                        </Grid>
                        <Grid item xs>{organism.prot_id}</Grid>
                      </Grid>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          }
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[]}
                colSpan={3}
                count={page.count}
                rowsPerPage={maxRows}
                page={pageNum}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Fragment>

        :
        <TableBody>
          <TableRow key={'no_results'}>
            <TableCell align='left'>{t('no_results')}</TableCell>
          </TableRow>
        </TableBody>
      }
    </Table>
  );
}

function GridObject(props) {
  const { t } = useTranslation();
  const obj = props.obj
  if (props.objKey === 'proteome_nr_id') {
    return (
      obj.map((val, idx) => (
        <Fragment key={String(val.organism_id) + String(idx)}>
          <Grid
            container
            style={{ marginBottom: 5 }}
            direction="column"
            justify="center"
            alignItems="flex-start"
          >
            <Grid item xs>{t('protein_search.prot_id')+':'} {val.prot_id}</Grid>
            <Grid item xs>{t('protein_search.organism_name')+':'} {val.name}</Grid>
          </Grid>
        </Fragment>
      )
      )
    )
  }
  else {
    return (
      obj.map(val => (
        Object.keys(val).map(key =>
          <Grid
            container
            direction='row'
            justify='center'
            alignItems='flex-start'
            key={key}
          >
            <Grid item xs>{val[key]}</Grid>
          </Grid>
        )
      ))
    )
  }
}

function SimpleDialog(props) {
  const { t } = useTranslation();
  const { state, onClose } = props;

  return (
    <Dialog onClose={onClose} open={state.open} keepMounted={true}>
      {state.open ?
        (<div>
          <DialogContent>
            <DialogContentText style={{ color: '#808080', paddingTop: 0 }}>
            </DialogContentText>
            <Table>
              <TableBody >
                {Object.keys(state.data).map(key =>
                  <TableRow key={key}>
                    <TableCell align='left'>
                      {t('protein_search.'+key)}
                    </TableCell>
                    <TableCell align='left'>
                      {Array.isArray(state.data[key]) ? <GridObject obj={state.data[key]} objKey={key} /> : state.data[key]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody >
            </Table>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} color='primary'>
              {t('button.close')}
            </Button>
          </DialogActions>
        </div>)
        :
        <div></div>
      }
    </Dialog>
  );
}

function ProteinResults(props) {

  const [modalState, setModalState] = useState({
    open: false,
    data: null
  });

  function handleClose() {
    setModalState(oldValues => ({
      ...oldValues,
      open: false,
    }));
  };

  function handleOpen(row) {
    setModalState(oldValues => ({
      ...oldValues,
      open: true,
      data: row,
    }));
  };
  return (
    <Fragment>
      <MemoizedProteinResultsTable {...props} handleOpen={handleOpen} />
      <MemoizedSimpleDialog state={modalState} onClose={handleClose} />
    </Fragment>)
}

function areEqual(prevProps, nextProps) {
  if (prevProps.url === nextProps.url) {
    return true
  }
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  return false
}

const MemoizedProteinResultsTable = React.memo(ProteinResultsTable, areEqual);
const MemoizedSimpleDialog = React.memo(SimpleDialog);

export const MemoizedProteinResults = React.memo(ProteinResults);