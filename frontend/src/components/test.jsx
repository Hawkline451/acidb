import React from 'react';

import {
  Grid, Table, TableBody, TableCell, TableFooter, TablePagination,TableRow, TableHead, Paper, IconButton
} from '@material-ui/core';

import {
  FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage
} from '@material-ui/icons';

import { makeStyles, useTheme } from '@material-ui/core/styles';

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
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
      </IconButton>
    </div>
  );
}

const rows1 = [
  {
    "nr_id": 5,
    "prot_len": 3,
    "mol_weight": 335.38,
    "tmhmm": null,
    "hmmtop": null,
    "psort": "u",
    "pfam": null,
    "signal_p": null,
    "cog": null,
    "cog_category": null,
    "ec_number": [],
    "kegg_ko": [],
    "inter_fam": [],
    "proteome_nr_id": [
      {
        "prot_id": "CEK13874.1",
        "organism_id": 924,
        "name": "Chthonomonas calidirosea"
      }
    ]
  },
  {
    "nr_id": 6,
    "prot_len": 4,
    "mol_weight": 531.71,
    "tmhmm": null,
    "hmmtop": null,
    "psort": null,
    "pfam": null,
    "signal_p": null,
    "cog": null,
    "cog_category": null,
    "ec_number": [],
    "kegg_ko": [],
    "inter_fam": [],
    "proteome_nr_id": [
      {
        "prot_id": "EME25939.1",
        "organism_id": 124,
        "name": "Galdieria sulphuraria"
      }
    ]
  },
  {
    "nr_id": 27,
    "prot_len": 7,
    "mol_weight": 912.12,
    "tmhmm": null,
    "hmmtop": null,
    "psort": "e",
    "pfam": null,
    "signal_p": null,
    "cog": null,
    "cog_category": null,
    "ec_number": [],
    "kegg_ko": [],
    "inter_fam": [],
    "proteome_nr_id": [
      {
        "prot_id": "2515031834",
        "organism_id": 131,
        "name": "Sulfolobales sp."
      }
    ]
  },
  {
    "nr_id": 48,
    "prot_len": 9,
    "mol_weight": 942.27,
    "tmhmm": null,
    "hmmtop": null,
    "psort": "u",
    "pfam": null,
    "signal_p": null,
    "cog": null,
    "cog_category": null,
    "ec_number": [],
    "kegg_ko": [],
    "inter_fam": [],
    "proteome_nr_id": [
      {
        "prot_id": "OZB68939.1",
        "organism_id": 993,
        "name": "Xanthomonadales bacterium"
      }
    ]
  },
]

const rows2 = [
  {
    "nr_id": 10000,
    "prot_len": 9,
    "mol_weight": 942.27,
    "tmhmm": null,
    "hmmtop": null,
    "psort": "u",
    "pfam": null,
    "signal_p": null,
    "cog": null,
    "cog_category": null,
    "ec_number": [],
    "kegg_ko": [],
    "inter_fam": [],
    "proteome_nr_id": [
      {
        "prot_id": "OZB68939.1",
        "organism_id": 993,
        "name": "Xanthomonadales bacterium"
      },
      {
        "prot_id": "OZB68939.1",
        "organism_id": 994,
        "name": "Xanthomonadales bacteriumzzzz"
      }
    ]
  },
];


const useStyles2 = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
}));

export default function CustomPaginationActionsTable() {
  const classes = useStyles2();
  const [page, setPage] = React.useState(rows1);
  const [pageNum, setPageNum] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    let le_dict = { 0: rows1, 1: rows2 }
    console.log("change page!!!!" + String(newPage))
    setPageNum(newPage);
    setPage(le_dict[newPage])
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[]}
                colSpan={3}
                count={9}
                rowsPerPage={rowsPerPage}
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
              <TableCell align="right">AciDB [nr id]</TableCell>
              <TableCell align="right">Protein Length</TableCell>
              <TableCell align="right">
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs>Organism</Grid>
                  <Grid item xs>Protein</Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {page.map(row => (
              <TableRow key={row.nr_id}>
                <TableCell align="right">{row.nr_id}</TableCell>
                <TableCell align="right">{row.prot_len}</TableCell>
                <TableCell align="right">
                  {row.proteome_nr_id.map(organism => (
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      key={organism.organism_id}
                    >
                      <Grid item xs>{organism.name}</Grid>
                      <Grid item xs>{organism.prot_id}</Grid>
                    </Grid>
                  ))}
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[]}
                colSpan={3}
                count={9}
                rowsPerPage={rowsPerPage}
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
        </Table>
      </div>
    </Paper>
  );
}

/*
const TestComponent = (props) => {

  return (
    <Suspense fallback={<Loader />}>
      <Test {...props} />
    </Suspense>
  );
};
export default TestComponent
*/