import React from "react";


// Table Component Utils
const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: 'asd',
    lastName: 'qwe',
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status: statusChance > 0.66 ?
      "relationship" :
      statusChance > 0.33 ? "complicated" : "single"
  };
};

export function makeData(len = 5553) {
  return range(len).map(d => {
    return {
      ...newPerson(),
      children: range(10).map(newPerson)
    };
  });
}

export const Tips = () =>
  <div style = {{textAlign: "center"}}>
  <em> Tip: Hold shift when sorting to multi - sort! </em> </div>;




// Filter table using a expression eg: <9;>3
export function miniEval(strExp) {
  // Replace space and brackets
  strExp = strExp.replace(/\s/g, '')
  strExp = strExp.replace(/[\])}[{(]/g, '')

  var expression = strExp.split(/[,;]+/)
  var ast = []
  var valid = true

  if (expression.length > 2) {
    return []
  } 
  else {
    try {
      expression.forEach((element) => {
        var exp = element.split(/(>=|<=|>|<)/).filter(Boolean)
        ast.push(exp)
        // If there is not numbers is an invalid exp (>asd is invalid)
        // If length is greter than 2 is invalid (>1>2 is invalid)
        valid = (isNaN(exp[0]) && isNaN(exp[1])) || exp.length > 2 ? false : valid
      });
    } catch (e) {
      return []
    }

    if (valid) {
      return ast
    } else {
      return []
    }
  }
}

export function customFilter(rows, filter, operation) {
  var op = isNaN(operation[1]) ? operation[1] : operation[0]
  var val =  isNaN(operation[1]) ? operation[0] : operation[1]
  var tmp_result = []
  // eg x < y
  switch (String(op)) {
    case '>':
      tmp_result = rows.filter((row) => {
        var var_1 = isNaN(operation[0]) ? row[filter.id] : operation[0] 
        var var_2 = isNaN(operation[0]) ? operation[1] : row[filter.id]
        var expression = String(var_1)+String(op)+String(var_2)
        //console.log(expression)

        return eval(expression)
      });
      break;
    case '>=':
      tmp_result = rows.filter((row) => {return row[filter.id] >= val});
      break;
    case '<':
      tmp_result = rows.filter((row) => {return row[filter.id] < val});
      break;
    case '<=':
      tmp_result = rows.filter((row) => {return row[filter.id] <= val});
      break;
  }
  return tmp_result
}
