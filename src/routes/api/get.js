// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

const { createSuccessResponse } = require('../../response');

// use the createSuccessResponse() and createErrorResponse() functions in src/response.js
// to rewrite all of the HTTP responses
module.exports = (req, res) => {
  // TODO: this is just a placeholder. To get something working, return an empty array...
  res.status(200).json(
    createSuccessResponse({
      status: 'ok',
      fragments: [],
    })
  );
};
