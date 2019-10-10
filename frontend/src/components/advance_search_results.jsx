import React, { Fragment } from 'react';

import {
  Table, TableCell, TableRow, TableHead, Tooltip, TableBody
} from '@material-ui/core';

// NPM
import {
  Link
} from 'react-router-dom';

// Internationalization
import { useTranslation } from 'react-i18next';

// Styles
import { stylesTable } from './css/themes'

const useStylesTable = stylesTable

// Sub components
export function ResultTable(props) {
  const { t } = useTranslation();
  const classes = useStylesTable()
  let resultState = props.state
  return (
    <Table>

      {resultState.length ?
        <Fragment>
          <TableHead>
            <TableRow>
              <TableCell className={classes.bigFontTable} >{t('table.name')}</TableCell>
              <TableCell className={classes.bigFontTable} >{t('table.strain')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
              </TableRow>
            )}
          </TableBody>
        </Fragment>
        :
        <TableBody>
          <TableRow key={'no_results'}>
            <TableCell align='left'>{t('no_results')}</TableCell>
          </TableRow>
        </TableBody>
      }
    </Table>
  )
}