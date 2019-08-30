import React, { useState, useCallback } from "react";

import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";



import {
  DialogTitle, Button, Grid, Dialog, Typography, Fab
} from '@material-ui/core';

import {
  MoreHoriz as MoreHorizIcon, FolderOpen as FolderOpenIcon, Folder as FolderIcon,
  Description as DescriptionIcon, ZoomIn as ExpandIcon
} from '@material-ui/icons';



import { makeStyles, ThemeProvider } from "@material-ui/styles";

// Internationalization
import { useTranslation } from 'react-i18next';import axios from 'axios';

import Tree from "material-ui-tree";
import getNodeDataByPath from "material-ui-tree/lib/util";

//
//  Delete super
//
const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      light: "#ff79b0",
      main: pink.A200,
      dark: "#c60055",
      contrastText: "#fff"
    }
  },
  overrides: {
    MuiListItem: {
      button: {
        height: 'auto !important'
      },

    },
  }
});

const useStyles = makeStyles({
  container: {
    margin: 20,
    minWidth: '50%'
  },
  icon: {
    fontSize: 26,
    paddingRight: 10

  },
  node: {
    display: "flex",
    alignContent: "center",
    fontSize: 20
  },
});


const taxInfoColors = {
  'domain': '',
  'phylum': '#B8E8A0',
  'tax_class': '#FFEBBD',
  'order': '#EBB4B2',
  'family': '#EBB4B2',
  'genus': '#B0F6FF',
  'species': '#E1E2E8',
};

// Little hack, dont show fold/unfold icon
function EmptyComponent() {
  return (
    <span></span>
  )
}

export default function TestComponent() {

  
  const classes = useStyles();
  const [state, setState] = useState({
    data: {
      node: "Taxonomy",
      type: "tree",
      total: null,
      url:
        "/api/taxonomy/"
    }
  });

  const [modalState, setModalState] = useState({
    open: false,
    value: ''
  });

  function handleClose() {
    setModalState(oldValues => ({
      ...oldValues,
      open: false,
    }));
  };
  function setModal(organism) {
    setModalState({ open: true, value: organism });
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
        iconComp = <DescriptionIcon />;

      }
      let nodeName = node != null ? String(node) : 'unclassified'
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
                  style = {{textTransform: 'none', boxShadow:'none', backgroundColor:taxInfoColors[String(data.category)]}} aria-label="tax_category">
                  {data.category}
                </Fab>)
                :
                <div></div>
              }
            </Grid>

          </Grid>
        )
      );
    },
    [classes]
  );

  const getActionsData = useCallback(
    (data) => {
      const { type } = data;
      if (type === "tree") {
        return null
      }
      else {
        return [
          {
            icon: <ExpandIcon color="secondary" className={classes.icon} />,
            hint: "View organism detail",
            onClick: () => {
              setModal(data.node)
            }
          }
        ];
      }
    },
    [classes]
  );


  function axiosFetch(data) {
    return axios.get("http://127.0.0.1:8000" + data.url).then(response => {
      // returning the data here allows the caller to get it through another .then(...)
      return response
    })
  }


  // Recursive fetch unclassified nodes, we only want the leaves of this kind of nodes
  const fetchData = async (node, data) => {

    const res = await axiosFetch(data);

    if (res.data && res.data.tree) {
      const treeData = state.data
      let childTree = res.data.tree

      // Truncate nodes if taxnomy it s unclasified
      while (data.node == null) {
        let tmpChildTree = []
        for (var i = 0; i < childTree.length; i++) {
          if (childTree[i].node === null) {
            let child = await axiosFetch(childTree[i]);
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
      if (data.category == 'genus') {
        let tmpChildTree = []

        for (var i = 0; i < childTree.length; i++) {
          if (childTree[i].node === null) {
            let child = await axiosFetch(childTree[i]);
            tmpChildTree = tmpChildTree.concat(child.data.tree)
          }
          else {
            tmpChildTree = tmpChildTree.concat(childTree[i])
          }
        }
        childTree = tmpChildTree
      }

      getNodeDataByPath(treeData, node, "tree").tree = childTree;
      setState({
        ...state,
        data: treeData
      });
    }
  };




  const requestChildrenData = useCallback(
    (data, node, toggleFoldStatus) => {
      const { url, type } = data;
      //console.log("Children");
      //console.log(url);
      //console.log(data);

      if (type === "tree") {
        fetchData(node, data)
      }
      toggleFoldStatus();
    },
    [state, setState]
  );

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >

        <Tree
          className={classes.container}
          title="Material UI Tree"
          data={state.data}
          labelKey="node"
          valueKey="node"
          childrenKey="tree"
          foldIcon={<EmptyComponent />}
          unfoldIcon={<EmptyComponent />}
          loadMoreIcon={<MoreHorizIcon />}
          renderLabel={renderLabel}
          renderLoadMoreText={(page, pageSize, total) =>
            `Loaded: ${(page + 1) *
            pageSize} / Total: ${total}. Click here to load more...`
          }
          pageSize={10}
          actionsAlignRight={true}
          getActionsData={getActionsData}
          requestChildrenData={requestChildrenData}
        />
        <SimpleDialog value={modalState.value} open={modalState.open} onClose={handleClose} />
      </Grid>
    </ThemeProvider>
  );
};



function SimpleDialog(props) {
  const { value, open, onClose } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle >Detail Modal {value}</DialogTitle>
      <Typography gutterBottom>
        Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
        in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </Typography>
      <Typography gutterBottom>
        Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
        lacus vel augue laoreet rutrum faucibus dolor auctor.
          </Typography>
      <Typography gutterBottom>
        Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
        scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
        auctor fringilla.
          </Typography>

      <Button onClick={onClose} color="primary">
        Close
          </Button>
    </Dialog>
  );
}