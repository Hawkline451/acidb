// Filter table using a expression eg: <9;>3
function tokenize(strExp) {
  var expression = strExp.split(/[,;]+/)
  var tokens = []

  // 4-7 it s a supported exp and represent 4<=x<=7
  if (strExp.includes("-")){
    var numbers = strExp.split("-")
    numbers[0] = numbers[0] === '*' ? -1 : numbers[0] 
    numbers[1] = numbers[1] === '*' ? Number.MAX_SAFE_INTEGER : numbers[1] 
    tokens.push([numbers[0],"<="])
    tokens.push(["<=",numbers[1]])
    return tokens
  }  
  else {
    expression.forEach((element) => {
      var exp = element.split(/(>=|<=|>|<|=)/).filter(Boolean)
      tokens.push(exp)
      // If there is not numbers is an invalid exp (>asd is invalid)
      // If length is greter than 2 is invalid (>1>2 is invalid)
      });
    return tokens
  }
}

function customEval(rows, filter, operation) {
  var op = isNaN(operation[1]) ? operation[1] : operation[0]
  op = (op==='=') ? '==' : op
  var tmp_result = []
  // eg x < y  
      tmp_result = rows.filter((row) => {
        var var_1 = isNaN(operation[0]) ? row[filter.id] : operation[0] 
        var var_2 = isNaN(operation[0]) ? operation[1] : row[filter.id]
        var expression = String(var_1)+String(op)+String(var_2)
        return (var_1 === null || var_2 === null) ? false : eval(expression)
      });  
  return tmp_result
}

export function verboseFilter(filter, rows) {
  var result = []
  // If is number
  if (!isNaN(filter.value)) {
    result = rows.filter((row) => {
      return String(row[filter.id]) === String(filter.value);
    });
  }
  // Expression
  else {
    result = rows
    var exps = tokenize(filter.value)

    // TODO Remove and refactor, this block does nothing
    if (exps === undefined || exps.length === 0) {
      return [-1]
    }
    for (var i = 0; i < exps.length; i++) {
      var expression = exps[i]
      result = customEval(result, filter, expression)
    }
  }
  return result
}

// Check async values This doesnt work
export function sortIgnoreNull(a,b,ascending){
  if (!ascending) { return (b != null) - (a != null) || b - a; }
  else { return (a != null) - (b != null) || b - a; }
}


// Export const
