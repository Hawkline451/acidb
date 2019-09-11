import React, { useState, useCallback } from "react";
import {
  Link
} from 'react-router-dom';

import {
  DialogTitle, Button, Grid, Dialog, Typography, Fab, DialogActions, DialogContent, DialogContentText,
  Table, TableBody, TableCell, TableRow
} from '@material-ui/core';

import {
  MoreHoriz as MoreHorizIcon, FolderOpen as FolderOpenIcon, Folder as FolderIcon,
  //Description as DescriptionIcon
  BugReport as DescriptionIcon
} from '@material-ui/icons';

// Styles
import {ThemeProvider } from "@material-ui/styles";
import { theme, stylesTree } from './css/themes'

// import config
import { config } from "../config";

// NPM 

// Internationalization
import { useTranslation } from 'react-i18next'; 

// mui tree
import Tree from "material-ui-tree";
import getNodeDataByPath from "material-ui-tree/lib/util";

import axios from 'axios';

const useStylesTree = stylesTree

const taxInfoColors = {
  'domain': '',
  'phylum': '#FFDAA6',
  'tax_class': '#E8A5C8',
  'order': '#C1C9FF',
  'family': '#A5E8C5',
  'genus': '#FFFBB5',
  'species': '#BAE9FF',
};

// Little hack, dont show fold/unfold icon
function EmptyComponent() {
  return (
    <span></span>
  )
}

export default function TreeComponent() {
  const { t } = useTranslation();

  const classes = useStylesTree();
  const [state, setState] = useState({
    data: {
      category: null,
      node: { id_organism: null, name: "Taxonomy" },
      type: "tree",
      total: null,
      url:
        "/api/taxonomy/"
    },
  });

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

  const renderLabel = useCallback(
    (data, unfoldStatus) => {
      const { node, type, total } = data;
      let variant = "body1";
      let iconComp = null;
      if (type === "tree") {
        iconComp = unfoldStatus ? <FolderOpenIcon /> : <FolderIcon />;
      }
      else {
        variant = "body2";
        iconComp = <DescriptionIcon style={{color:'#F0008C'}} />;
      }
      let nodeName
      // if leaf, 
      if (data.type === 'tree') {
        nodeName = node.name != null ? String(node.name) : 'unclassified'
      }
      else {
        nodeName = 'Strain: ' + node.name.join(' = ')
      }

      //const tmpNode = await axiosFetch('api/organism_detail/1/')
      return (
        iconComp && (
          <Grid container
            spacing={0}
            direction="row"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={8}>
              <Typography variant={variant} className={classes.node}>
                {React.cloneElement(iconComp, { className: classes.icon })}
                {total != null ? nodeName.concat(" [", String(total), "]") : nodeName}
              </Typography>
            </Grid>

            <Grid item xs={4} align='right'>
              {data.category ?
                (<Fab variant="extended" size='small' disableFocusRipple={true} disableRipple={true}
                  style={{ textTransform: 'none', boxShadow: 'none', backgroundColor: taxInfoColors[String(data.category)] }} aria-label="tax_category">
                  {t('table.' + data.category)}
                </Fab>)
                :
                <div></div>
              }
            </Grid>

          </Grid>
        )
      );
    },
    [classes, t]
  );

  function axiosFetch(url) {
    return axios.get(config.BASE_URL + url).then(response => {
      // returning the data here allows the caller to get it through another .then(...)
      return response
    })
  }

  // Recursive fetch unclassified nodes, we only want the leaves of this kind of nodes
  const fetchData = useCallback(async (node, data) => {

    const res = await axiosFetch(data.url);

    if (res.data && res.data.tree) {
      const treeData = state.data
      let childTree = res.data.tree

      // Truncate nodes if taxnomy it s unclasified
      while (data.node.name == null) {
        let tmpChildTree = []
        for (var i = 0; i < childTree.length; i++) {
          if (childTree[i].node.name === null) {
            let child = await axiosFetch(childTree[i].url);
            tmpChildTree = tmpChildTree.concat(child.data.tree)
          }
          else {
            tmpChildTree = tmpChildTree.concat(childTree[i])
          }
        }
        childTree = tmpChildTree
        data = tmpChildTree[0]
      }

      // if category is genux check if species are unclassified
      /*
      if (data.category === 'genus') {
        let tmpChildTree = []

        for (var j = 0; j < childTree.length; j++) {
          if (childTree[j].node === null) {
            let child = await axiosFetch(childTree[j].url);
            tmpChildTree = tmpChildTree.concat(child.data.tree)
          }
          else {
            tmpChildTree = tmpChildTree.concat(childTree[j])
          }
        }
        childTree = tmpChildTree
      }
      */

      getNodeDataByPath(treeData, node, "tree").tree = childTree;
      setState({
        ...state,
        data: treeData
      });
    }
  },
    [state, setState]
  );

  const getModal = useCallback(async (node) => {
    const res = await axiosFetch(node.url);
    setModalState({ open: true, data: res.data })
  },
    []
  );

  const requestChildrenData = useCallback(
    (data, node, toggleFoldStatus) => {
      const { type } = data;

      if (type === "tree") {
        fetchData(node, data)
        toggleFoldStatus();
      }
      else {
        getModal(data)
      }
    },
    [fetchData, getModal]
  );

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <div style={{ marginTop: 20 }} >
          <Typography variant="h4">
            Navigation Tree
          </Typography>
        </div>
        <Tree
          className={classes.container}
          data={state.data}
          valueKey="url"
          childrenKey="tree"
          foldIcon={<EmptyComponent />}
          unfoldIcon={<EmptyComponent />}
          loadMoreIcon={<MoreHorizIcon />}
          renderLabel={renderLabel}
          renderLoadMoreText={(page, pageSize, total) =>
            (<div style={{ fontSize: 20 }}>
              Loaded: {(page + 1) *
                pageSize} / Total: {total}. Click here to load more ...
            </div>)
          }
          pageSize={10}
          actionsAlignRight={true}
          requestChildrenData={requestChildrenData}
        />
        <SimpleDialog state={modalState} onClose={handleClose} />
      </Grid>
    </ThemeProvider>
  );
};

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

function SimpleDialog(props) {
  const { t } = useTranslation();

  const { state, onClose } = props;
  return (
    <Dialog onClose={onClose} open={state.open}>
      {state.open ?
        (<div>
          <DialogTitle style={{paddingBottom:5}}>{state.data.name}</DialogTitle>
          <DialogContent>
            <DialogContentText style={{color:'#808080', paddingTop:0}}>
            {t('table.strain') + ': ' + state.data.strains.map(a => a.strain_name).join(' = ')}
            </DialogContentText>
            <Table>
              <TableBody >
                {
                  taxInfo.map(tmpKey => (
                    <TableRow key={tmpKey}>
                      <TableCell component="th" scope="row">
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
          </DialogContent>

          <DialogActions>
          <Button component={Link} to={'/app/organism/' + state.data.id_organism} color="primary">
              {t('button.open_detail')}
            </Button>
            <Button onClick={onClose} color="primary">
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