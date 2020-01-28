module.exports = {
 /**
   * Default find action
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [get] /gallery-content
   * description: "Find/query gallery-content list"
   * responses:
   *   "200":
   *     description: "Find/query gallery-content success"
   *     schema:
   *       type: object
   *       properties:
   *         gallery-content:
   *           $ref: "#/definitions/gallery-content"
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
    })
    .catch(res.queryError);
  },

  /**
   * Default findOne action
   *
   * Record is preloaded in context loader by default and is avaible as res.locals.data
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [get] /gallery-content/{gallery-contentId}
   * description: "Find one gallery-content by id"
   * responses:
   *   "200":
   *     description: "Find gallery-content by id success"
   *     schema:
   *       type: object
   *       properties:
   *         gallery-content:
   *           $ref: "#/definitions/gallery-content"
   */
  findOne(req, res) {
    if (!res.locals.data) return res.notFound();

    if (req.accepts('html')) {
      res.goTo('/gallery-content?galleryId='+res.locals.data.id);
    } else {
      res.ok();
    }
  }
};