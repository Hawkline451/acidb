import React from 'react';

import {
  Table, TableCell, TableRow, TableHead, Tooltip
} from '@material-ui/core';

// NPM
import {
  Link
} from 'react-router-dom';

// Styles
import { stylesTable } from './css/themes'

const useStylesTable = stylesTable

// Sub components
export function ResultTable(props){ 
  const classes = useStylesTable()
  let resultState = props.state
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.bigFontTable} >{'table.name'}</TableCell>
          <TableCell className={classes.bigFontTable} >{'table.strain'}</TableCell>
        </TableRow>
        {resultState.map(value =>
          <TableRow key={value.id_organism}>
            <TableCell align='left'>
              <Tooltip title='View organism detail' >
                <Link to={'/app/organism/' + value.id_organism} className={classes.bigFontLink}>
                  {value.name}
                </Link>
              </Tooltip>
            </TableCell>
            <TableCell className={classes.bigFontTable}>{value.strains.map(a => a.strain_name).join(' = ')}</TableCell>
          </TableRow>)}
      </TableHead>
    </Table>
  )
}