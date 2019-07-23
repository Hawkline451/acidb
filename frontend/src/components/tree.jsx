import React, { useState, useCallback } from "react";
import {
  Typography,  CssBaseline,
} from '@material-ui/core';
import {
  MoreHoriz as MoreHorizIcon, FolderOpen as FolderOpenIcon, Folder as FolderIcon, Add as AddIcon, 
  Delete as DeleteIcon, Settings as SettingsIcon, Description as DescriptionIcon, 
  InsertDriveFile as InsertDriveFileIcon
} from '@material-ui/icons';
import {ThemeProvider } from "@material-ui/styles";

import superagent from "superagent";
import Tree from "material-ui-tree";
import getNodeDataByPath from "material-ui-tree/lib/util";

// Themes
import { theme, stylesTree } from './themes'

// Internationalization
import { useTranslation } from 'react-i18next';

const useStyles = stylesTree

// Little hack, dont show fold/unfold icon
function EmptyComponent() {
  return (
      <span></span>
  )
}

export default function TreeComponent() {
  const classes = useStyles();
  const { t } = useTranslation();

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
      if (type === "tree") {
        superagent.get(url).then(({ body: res }) => {
          if (res && res.tree) {
            const treeData = Object.assign({}, state.data);
            getNodeDataByPath(treeData, path, "tree").tree = res.tree;
            console.log(path);
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
      <Tree
        className={classes.container}
        title={t('tree.title')}
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



