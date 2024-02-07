// src/routes/api/post.js
//const express = require('express');

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Post a fragment for the current user
 */
module.exports = async (req, res) => {
  logger.debug('accessing post route');
  if (Buffer.isBuffer(req.body) === true) {
    logger.debug('accessing post route');
    const user = req.user;
    const data = req.body;
    const type = req.headers['content-type'];
    //const apiURL = process.env.API_URL || `http://${req.headers.host}`;

    logger.debug(`POST debugging: ${req.body}`);
    logger.info(`The apiURL is: http://${req.headers.host}`);

    // Generate a new Fragment metadata record based on Request
    const fragment = new Fragment({ ownerId: user, type });

    // Store metadata and data
    await fragment.setData(data);

    logger.debug(`New Fragment is created: ${fragment}`);

    const apiURL = process.env.API_URL || new URL(req.protocol + '://' + req.headers.host);
    // Set headers
    //res.setHeader('Content-type', fragment.type);
    res.setHeader('Location', `${apiURL}/v1/fragments/${fragment.id}`);

    // Return successful response
    res.status(201).json(
      createSuccessResponse({
        fragment,
      })
    );
  } else {
    logger.error(`${req.headers['content-type']} is not supported Content Type`);
    res
      .status(415)
      .json(
        createErrorResponse(415, `${req.headers['content-type']} is not supported Content Type`)
      );
  }
};

// module.exports = async (req, res) => {
//   const user = req.user;
//   const data = req.body;
//   const type = req.headers['content-type'];
//   //const apiURL = process.env.API_URL || `http://${req.headers.host}`;
//   const apiURL = process.env.API_URL || new URL(req.protocol + '://' + req.headers.host);

//   logger.debug(`POST debugging: ${req.body}`);
//   logger.info(`The apiURL is: http://${req.headers.host}`);

//   if (Fragment.isSupportedType(type)) {
//     try {
//       // Generate a new Fragment metadata record based on Request
//       const fragment = new Fragment({ ownerId: user, type });

//       // Store metadata and data
//       await fragment.setData(data);

//       logger.debug(`New Fragment is created: ${fragment}`);

//       // Set headers
//       res.setHeader('Content-type', fragment.type);
//       res.setHeader('Location', `${apiURL}/v1/fragments/${fragment.id}`);

//       // Return successful response
//       res.status(201).json(
//         createSuccessResponse({
//           fragment,
//         })
//       );
//     } catch (err) {
//       logger.error(err.message, 'Something went wrong, need to fix...');
//       res.status(500).json(createErrorResponse(401, err.message));
//     }
//   } else {
//     logger.error(`${type} is not supported Content Type`);
//     res.status(415).json(createErrorResponse(415, `${type} is not supported Content Type`));
//   }
// };
