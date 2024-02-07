'use strict';

function setupPreserveLeadingComments(j, root) {
  const getFirstNode = () => {
    return root.find(j.Program).get('body', 0).node
  }
  // Save the comments attached to the first node
  const firstNode = getFirstNode()
  const {comments} = firstNode

  return () => {
    // If the first node has been modified or deleted, reattach the comments
    const firstNode2 = getFirstNode()
    if (firstNode2 !== firstNode) {
      firstNode2.comments = comments
    }
  }
}

module.exports = {
  setupPreserveLeadingComments,
};
