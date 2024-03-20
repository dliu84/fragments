// src/routes/api/getById.js
//const express = require('express');
//const { createSuccessResponse } = require('../../response');
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');

/**
 * Gets an authenticated user's fragment data with the given ID
 */
module.exports = async (req, res) => {
  // a2:
  let url = req.originalUrl;

  const name2 = path.basename(url);
  const ext2 = path.extname(url);
  const nameWithoutExt2 = path.basename(name2, ext2);
  req.params.id = nameWithoutExt2;

  let fragment;
  let data;

  try {
    fragment = new Fragment(await Fragment.byId(req.user, req.params.id));
    data = await fragment.getData();

    data = await fragment.convertData(data, ext2, fragment);

    console.log('the converted fragment is: ' + data);
  } catch (err) {
    logger.debug({ err }, 'Error on requesting Fragment');
    return res.status(404).json(createErrorResponse(404, ': Error requesting fragment: ' + err));
  }
  //a2:
  res.setHeader('Content-Type', fragment.type);
  res.setHeader('Content-Length', fragment.size);

  // use .send to send the result instead of json, because the buffer will be automatically converted
  return res.status(200).send(data);
};
