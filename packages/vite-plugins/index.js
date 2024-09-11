
module.exports.myDebugPlugin = function () {
  if (global.NX_GRAPH_CREATION) {
    // If we're constructing the graph, skip requiring from dist since it may not exist.
    return {};
  } else {
    // This will only exist once build runs.
    return require('./dist/src/index.js').myDebugPlugin();
  }
}
