// src/routes/api/getById.js
//const express = require('express');
//const { createSuccessResponse } = require('../../response');
//const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Gets an authenticated user's fragment data with the given ID
 */
module.exports = async (req, res) => {
  //try {
  logger.debug(`User and id are: ${req.user}, ${req.params.id}`);
  const fragment = await Fragment.byId(req.user, req.params.id);
  const fragmentData = await fragment.getData();
  logger.debug(`fragment Data is:${fragmentData}`);
  res.setHeader('Content-type', fragment.type);
  //res.send(fragmentData).toString('utf-8');
  res.send(fragmentData);
  //res.status(200).json(createSuccessResponse({ fragmentData: fragmentData }));
  //} catch (err) {
  //res.status(404).json(createErrorResponse(404, err.message));
  //}
};
