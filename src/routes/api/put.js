// PUT /fragments:id can update an authenticated user's existing fragment

const { createSuccessResponse, createErrorResponse } = require('../../response');
const API_URL = process.env.API_URL;
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  let fragment;

  // If no such fragment exists with the given id, returns an HTTP 404 with an appropriate error message.
  try {
    fragment = new Fragment(await Fragment.byId(req.user, req.params.id));
  } catch (err) {
    return res
      .status(404)
      .json(createErrorResponse(404, 'The fragment with this id does not exist!'));
  }

  if (!Buffer.isBuffer(req.body)) {
    return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  }

  try {
    fragment.type = req.get('Content-Type');

    await fragment.setData(req.body);
    await fragment.save();

    logger.info('data has been saved');

    const requestedFragment = await Fragment.byId(req.user, fragment.id);

    logger.debug({ requestedFragment }, 'requested fragment from db');

    logger.debug({ fragment }, 'Created Fragment');

    res.setHeader('Location', API_URL + '/v1/fragments/' + fragment.id);
    res.setHeader('content-type', fragment.type);

    return res.status(201).json(
      createSuccessResponse({
        fragment: fragment,
        formats: fragment.formats,
      })
    );
  } catch (err) {
    logger.fatal({ err }, 'Error occurred in PUT route');

    //If the Content-Type of the request does not match the existing fragment's type,
    //returns an HTTP 400 with an appropriate error message.
    res
      .status(400)
      .json(createErrorResponse(400, `Something went wrong in PUT route: ${err.message} `));
  }
};
