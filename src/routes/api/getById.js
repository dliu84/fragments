// src/routes/api/getById.js
const express = require('express');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Gets an authenticated user's fragment data with the given ID
 */
module.exports = async (req, res) => {
  logger.debug(`User id and id are: ${req.user}, ${req.params.id}`);

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const fragmentData = await fragment.getData();
    res.status(200).json(createSuccessResponse({ fragmentData: fragmentData.toString() }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err.message));
  }
};
