// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // a1:
  // const expand = req.query.expand;
  // logger.debug({ expand }, 'Expand from Get route');
  // const fragments = (await Fragment.byUser(req.user, expand)) || [];
  // logger.debug({ fragments }, 'List of fragments from GET route');

  // res.status(200).json(
  //   createSuccessResponse({
  //     fragments,
  //   })
  // );

  // a2:
  let fragments;
  try {
    fragments = await Fragment.byUser(req.user, req.query.expand === '1');

    logger.debug({ fragments }, 'List of fragments from GET route');

    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Not able to fetch fragments'));
  }
};
