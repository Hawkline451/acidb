import React, { useState, useCallback } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Switch from "@material-ui/core/Switch";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import FolderIcon from "@material-ui/icons/Folder";
import SettingsIcon from "@material-ui/icons/Settings";
import DescriptionIcon from "@material-ui/icons/Description";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";
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
    (data, path, unfoldStatus) => {
      const { type } = data;
      if (type === "tree") {
        if (!unfoldStatus) {
          return null;
        }
        return {
          icon: <AddIcon className={classes.icon} />,
          label: "new",
          hint: "Insert file",
          onClick: () => {
            const treeData = Object.assign({}, state.data);
            const nodeData = getNodeDataByPath(treeData, path, "tree");
            if (
              !Reflect.has(nodeData, "tree") ||
              !Reflect.has(nodeData.tree, "length")
            ) {
              nodeData.tree = [];
            }
            nodeData.tree.push({
              path: "new file",
              type: "blob",
              sha: Math.random()
            });
            setState({ ...state, data: treeData });
          }
        };
      }
      return [
        {
          icon: <DeleteIcon color="secondary" className={classes.icon} />,
          hint: "Delete file",
          onClick: () => {
            const treeData = Object.assign({}, state.data);
            const parentData = getNodeDataByPath(
              treeData,
              path.slice(0, path.length - 1),
              "tree"
            );
            const lastIndex = path[path.length - 1];
            parentData.tree.splice(lastIndex, 1);
            setState({ ...state, data: treeData });
          }
        }
      ];
    },
    [classes, state, setState]
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
    </ThemeProvider>
  );
};



