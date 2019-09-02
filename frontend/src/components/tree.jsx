import React, { useState, useCallback, useEffect } from "react";

import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";



import {
  DialogTitle, Button, Grid, Dialog, Typography, Fab, DialogActions, DialogContent, DialogContentText
} from '@material-ui/core';

import {
  MoreHoriz as MoreHorizIcon, FolderOpen as FolderOpenIcon, Folder as FolderIcon,
  Description as DescriptionIcon
} from '@material-ui/icons';



import { makeStyles, ThemeProvider } from "@material-ui/styles";

// Internationalization
import { useTranslation } from 'react-i18next'; import axios from 'axios';

// import config
import { config } from "../config";

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

export default function TestComponent() {
  const { t } = useTranslation();

  const classes = useStyles();
  const [state, setState] = useState({
    data: {
      category: null,
      node: { id_organism: null, name: "Taxonomy" },
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
      let nodeName
      // if leaf, 
      if (data.type === 'tree') {
        nodeName = node.name != null ? String(node.name) : 'unclassified'
      }
      else {
        nodeName = 'Strain: ' + String(node.name)
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
    return axios.get("http://127.0.0.1:8000" + url).then(response => {
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

  const requestChildrenData = useCallback(
    (data, node, toggleFoldStatus) => {
      const { type } = data;

      if (type === "tree") {
        fetchData(node, data)
        toggleFoldStatus();
      }
      else {
        console.log("leaf")
        setModal(data.node)
      }
    },
    [fetchData]
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
          title="Navigation"
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

function SimpleDialog(props) {
  const { state, onClose } = props;

  const [detail, setDetail] = useState({
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        config.API_ORGANISM_DETAIL + state.value.id_organism,
      );
      setDetail({ data: result.data });
    };
    if (state.open) {
      fetchData();
    }
    // Empty array as second argument avoid fetching on component updates, only when mounting the component
  }, [state]);
  return (
    <Dialog onClose={onClose} open={state.open}>
      {state.open ?
        (<div>
          <DialogTitle>Taxonomy summary</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {detail.data.id_organism}
            </DialogContentText>
            <DialogContentText >
              {String(detail.data.taxonomy)}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </div>)
        :
        <div></div>
      }
    </Dialog>
  );
}