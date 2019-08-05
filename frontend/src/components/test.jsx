import React, { useState, useCallback } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Switch from "@material-ui/core/Switch";
import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";



import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';




import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import FolderIcon from "@material-ui/icons/Folder";
import SettingsIcon from "@material-ui/icons/Settings";
import DescriptionIcon from "@material-ui/icons/Description";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import ExpandIcon from "@material-ui/icons/ZoomIn";

import { makeStyles, ThemeProvider } from "@material-ui/styles";

import superagent from "superagent";
import Tree from "material-ui-tree";
import getNodeDataByPath from "material-ui-tree/lib/util";
import { Typography } from "@material-ui/core";


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
  }
});

const useStyles = makeStyles({
  container: {
    margin: 20
  },
  icon: {
    fontSize: 20
  },
  node: {
    display: "flex",
    alignContent: "center"
  }
});

// Little hack, dont show fold/unfold icon
function EmptyComponent() {
  return (
    <span></span>
  )
}


export default function TestComponent() {
  const classes = useStyles();
  const [state, setState] = useState({
    alignRight: true,
    data: {
      path: "material-ui-tree",
      type: "tree",
      sha: "b3d36479a033ed6296c34fdf689d5cdbcf7a0136",
      url:
        "https://api.github.com/repos/shallinta/material-ui-tree/git/trees/next"
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
      const { path, type } = data;
      //console.log(data);
      let variant = "body1";
      let iconComp = null;
      if (type === "tree") {
        iconComp = unfoldStatus ? <FolderOpenIcon /> : <FolderIcon />;
      }
      if (type === "blob") {
        variant = "body2";
        if (path.startsWith(".") || path.includes("config")) {
          iconComp = <SettingsIcon />;
        } else if (path.endsWith(".js")) {
          iconComp = <DescriptionIcon />;
        } else {
          iconComp = <InsertDriveFileIcon />;
        }
      }
      return (
        iconComp && (
          <Typography variant={variant} className={classes.node}>
            {React.cloneElement(iconComp, { className: classes.icon })}
            {path}
          </Typography>
        )
      );
    },
    [classes]
  );

  const getActionsData = useCallback(
    (data) => {
      const { type } = data;
      if (type === "tree") {
        return null;
      }
      else {
        return [
          {
            icon: <ExpandIcon color="secondary" className={classes.icon} />,
            hint: "View organism detail",
            onClick: () => {
              console.log(data.path);
              setModal(data.path)
            }
          }
        ];
      }
    },
    [classes]
  );

  const requestChildrenData = useCallback(
    (data, path, toggleFoldStatus) => {
      const { url, type } = data;
      console.log("Children");
      console.log(url);
      if (type === "tree") {
        superagent.get(url).then(({ body: res }) => {
          if (res && res.tree) {
            const treeData = Object.assign({}, state.data);
            getNodeDataByPath(treeData, path, "tree").tree = res.tree;
            console.log(res.tree);
            setState({
              ...state,
              data: treeData
            });
            toggleFoldStatus();
          } else {
            toggleFoldStatus();
          }
        });
      } else {
        toggleFoldStatus();
      }
    },
    [state, setState]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Switch
        checked={state.alignRight}
        onChange={() => setState({ ...state, alignRight: !state.alignRight })}
      />
      Tree Action Buttons Align Right
      <Tree
        className={classes.container}
        title="Material UI Tree"
        data={state.data}
        labelKey="path"
        valueKey="sha"
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
        actionsAlignRight={state.alignRight}
        getActionsData={getActionsData}
        requestChildrenData={requestChildrenData}
      />

      <SimpleDialog value={modalState.value} open={modalState.open} onClose={handleClose} />
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