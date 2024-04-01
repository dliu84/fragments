const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.debug('accessing post route');
  if (Buffer.isBuffer(req.body) === true) {
    logger.debug('accessing post route');
    const user = req.user;
    const data = req.body;
    const type = req.headers['content-type'];

    logger.debug(`POST debugging: ${req.body}`);
    logger.info(`The apiURL is: http://${req.headers.host}`);

    const fragment = new Fragment({ ownerId: user, type });

    try {
      await fragment.setData(data);

      logger.debug(`New Fragment is created: ${fragment}`);

      const apiURL = process.env.API_URL || new URL(req.protocol + '://' + req.headers.host);

      res.setHeader('Location', `${apiURL}/v1/fragments/${fragment.id}`);

      return res.status(201).json(
        createSuccessResponse({
          fragment,
        })
      );
    } catch (error) {
      logger.error(`Error occurred while setting fragment data in POST route: ${error}`);
      res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
    }
  } else {
    logger.error(`${req.headers['content-type']} is not supported Content Type`);
    res
      .status(415)
      .json(
        createErrorResponse(415, `${req.headers['content-type']} is not supported Content Type`)
      );
  }
};
