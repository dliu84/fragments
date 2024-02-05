// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

// use the createSuccessResponse() and createErrorResponse() functions in src/response.js
// to rewrite all of the HTTP responses
// module.exports = (req, res) => {
//   // TODO: this is just a placeholder. To get something working, return an empty array...
//   res.status(200).json(
//     createSuccessResponse({
//       status: 'ok',
//       fragments: [],
//     })
//   );
// };
module.exports = async (req, res) => {
  try {
    logger.debug(`req.query: ${JSON.stringify(req.query)}`);
    const expand = !!(req.query.expand && req.query.expand === '1');
    const fragment = await Fragment.byUser(req.user, expand);
    res.status(200).json(createSuccessResponse({ fragments: fragment }));
  } catch (error) {
    res.status(401).json(createErrorResponse(401, error.message));
  }
};
