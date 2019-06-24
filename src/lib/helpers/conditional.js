// Fix ME!

// https://gist.github.com/servel333/21e1eedbd70db5a7cfff327526c72bc5
// https://stackoverflow.com/questions/8853396/
const handlebars = require('handlebars')

const reduce_op = (args, reducer) => {
  args = Array.from(args)
  args.pop() // => options
  let first = args.shift()
  return args.reduce(reducer, first)
};

hb.registerHelper({
  eq  : () => { return reduce_op(arguments, (a,b) => a === b) },
  ne  : () => { return reduce_op(arguments, (a,b) => a !== b) },
  lt  : () => { return reduce_op(arguments, (a,b) => a  <  b) },
  gt  : () => { return reduce_op(arguments, (a,b) => a  >  b) },
  lte : () => { return reduce_op(arguments, (a,b) => a  <= b) },
  gte : () => { return reduce_op(arguments, (a,b) => a  >= b) },
  and : () => { return reduce_op(arguments, (a,b) => a  && b) },
  or  : () => { return reduce_op(arguments, (a,b) => a  || b) },
})

module.exports = handlebars