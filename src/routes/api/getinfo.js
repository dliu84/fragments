// src/routes/api/getinfo.js
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */

const { createSuccessResponse } = require('../../response');
module.exports = async (req, res) => {
  let fragment;

  try {
    fragment = await Fragment.byId(req.user, req.params.id);
  } catch (err) {
    res.status(400).json('Error requesting fragment');
  }
  res.set('Content-Type', fragment.type);

  res.status(200).json(createSuccessResponse({ fragment }));
};
