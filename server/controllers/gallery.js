module.exports = {
  /**
   * Default find action
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   */
  find(req, res) {
    const models = req.we.db.models;

    res.locals.query.include = [{
      as: 'contents',
      model: models['gallery-content'],
      limit: 1,
      order: [['weight', 'DESC'], ['id', 'DESC']],
      required: true
    }];

    return res.locals.Model
    .findAndCountAll(res.locals.query)
    .then(function afterFindAndCount (record) {
      res.locals.metadata.count = record.count;
      res.locals.data = record.rows;
      res.ok();
      return null;
    })
    .catch(res.queryError);
  },

  findOne(req, res) {
    if (!res.locals.data) return res.notFound();

    if (req.accepts('html')) {
      res.goTo('/gallery-content?galleryId='+res.locals.data.id);
    } else {
      res.ok();
    }
  }
};