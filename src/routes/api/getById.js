const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');

/**
 * Gets an authenticated user's fragment data with the given ID
 */
module.exports = async (req, res) => {
  let url = req.originalUrl;
  const name2 = path.basename(url);
  let ext2 = path.extname(url);
  const nameWithoutExt2 = path.basename(name2, ext2);
  req.params.id = nameWithoutExt2;

  let fragment;
  let data;
  try {
    fragment = new Fragment(await Fragment.byId(req.user, req.params.id));
    data = await fragment.getData();
    ext2 ? (ext2 = ext2.substring(1)) : '';
  } catch (err) {
    logger.debug({ err }, 'Error requesting fragment');
    return res.status(404).json(createErrorResponse(404, ': Error requesting fragment: ' + err));
  }

  if (ext2) {
    try {
      data = await fragment.convertData(data, ext2, fragment);
    } catch (err) {
      return res
        .status(415)
        .json(createErrorResponse(415, 'Unsupported media type for conversion: ' + err));
    }

    res.setHeader(
      'Content-Type',
      fragment.type.substring(0, fragment.type.indexOf('/')) + '/' + ext2
    );
  } else {
    res.setHeader('Content-Type', fragment.type);
  }

  res.setHeader('Content-Length', fragment.size);

  return res.status(200).send(data);
};
