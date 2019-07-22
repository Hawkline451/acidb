import React, {useState, useEffect}  from 'react';

import InfinityMenu from "react-infinity-menu";
import "react-infinity-menu/src/infinity-menu.css";


const treeArray = [
  {
    name: "Menu1",
    id: 0,
    isOpen: false,
    children: [
      {
        name: "SubMenu1-1",
        id: 0,
        isOpen: false,
        children: [
          {
            name: "Sub-SubMenu1-1",
            id: 0
          },
          {
            name: "Sub-SubMenu1-2",
            id: 1
          },
          {
            name: "Sub-SubMenu1-3",
            id: 2
          },
          {
            name: "Sub-SubMenu1-4",
            id: 3
          },
          {
            name: "Sub-SubMenu1-5",
            id: 4
          },
          {
            name: "Sub-SubMenu1-6",
            id: 5
          },
          {
            name: "Sub-SubMenu1-7",
            id: 6
          },
          {
            name: "Sub-SubMenu1-8",
            id: 7
          },
          {
            name: "Sub-SubMenu1-9",
            id: 8
          },
          {
            name: "Sub-SubMenu1-99",
            id: 9
          },
          {
            name: "Sub-SubMenu1-999",
            id: 10
          }
        ]
      },
      {
        name: "SubMenu2-1",
        id: 1,
        children: [
          {
            name: "Sub-SubMenu2-1",
            id: 0
          }
        ]
      }
    ]
  },
  {
    name: "Menu2",
    id: 1,
    isOpen: false,
    children: [
      {
        name: "SubMenu2-1",
        id: 0
      },
      {
        name: "SubMenu2-2",
        id: 1
      },
      {
        name: "SubMenu2-3",
        id: 2
      }
    ]
  },
  {
    name: "Menu3",
    id: 2,
    isOpen: false,
    children: [
      {
        name: "SubMenu3-1",
        id: 0
      },
      {
        name: "SubMenu3-2",
        id: 1
      }
    ]
  }
];

function Tree() {
  const [tree2, setState] = React.useState(treeArray)
  const [fkinstate, setFkingState] = React.useState(true)

  console.log(tree2)
  /** 
  useEffect(() => {
    setState()[tree2]
  })
  */
 //const forceUpdate = React.useCallback(() => updateState({}), []);
  

  function onNodeMouseClick(event, newTree) {
    console.log(tree2)
    setFkingState(!fkinstate)
    console.log("Child tree")
    console.log(newTree)
  }


 
  return (
    <InfinityMenu
    tree={tree2}
    onNodeMouseClick={onNodeMouseClick}
    maxLeaves={2}
  />

  );
}

class Tree2 extends React.Component {
  constructor(props){
    super(props);
    this.onNodeMouseClick = this.onNodeMouseClick.bind(this)
    this.state={
			tree: treeArray
		}

  }


	onNodeMouseClick(event, tree2) {
    console.log("handler")
    console.log(tree2)
		this.setState({
			tree: tree2
		});
	}

	render() {
    console.log("Render tree")
    console.log(this.state.tree)
		return (

			<InfinityMenu
				tree={this.state.tree}
				onNodeMouseClick={this.onNodeMouseClick}
				maxLeaves={2}
			/>
		);
	}
}
export default Tree