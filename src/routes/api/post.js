// src/routes/api/post.js
const express = require('express');

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Post a fragments for the current user
 */
module.exports = async (req, res) => {
  const user = req.user;
  const data = req.body;
  const type = req.headers['content-type'];
  const apiURL = process.env.API_URL || `http://${req.headers.host}`;

  logger.debug(`Post: ${req.body}`);

  // Check the Content-Type is supported or not
  if (Fragment.isSupportedType(type)) {
    try {
      // Generate a new Fragment metadata record based on Request
      const fragment = new Fragment({ ownerId: user, type });

      // Store metadata and data
      await fragment.setData(data);

      logger.debug(`New Fragment is created: ${fragment}`);

      // Set headers
      res.setHeader('Content-type', fragment.type);
      res.setHeader('Location', `${apiURL}/v1/fragments/${fragment.id}`);

      // Return successful response
      res.status(201).json(
        createSuccessResponse({
          fragment,
        })
      );
    } catch (err) {
      logger.error(err.message, 'Something went wrong...');
      res.status(500).json(createErrorResponse(401, err.message));
    }
  } else {
    logger.error(`${type} is not supported Content Type`);
    res.status(415).json(createErrorResponse(415, `${type} is not supported Content Type`));
  }
};
