module.exports = {
 /**
   * Find / query gallery contents
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [get] /gallery-content
   * description: "Find/query gallery-content list. req.query.galleryId is required for html requests"
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
    if (!req.query.galleryId) {

      if (!req.accepts('html')) {
        return res.badRequest();
      } else {
        return res.locals.Model
        .findAndCountAll(res.locals.query)
        .then(function afterFindAndCount (record) {
          res.locals.metadata.count = record.count;
          res.locals.data = record.rows;
          res.ok();
        })
        .catch(res.queryError);
      }
    }

    if (!res.locals.gallery && req.accepts('html')) {
      return res.notFound();
    }

    res.locals.query.order = [
      ['weight', 'DESC'],
      ['id', 'DESC']
    ];

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
   * gallery-content count action
   * Built for only send count as JSON
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [get] /gallery-content/count
   * description: "Count gallery-content, set req.query.galleryId for get content count of one gallery"
   * responses:
   *   "200":
   *     description: "Count gallery-content success"
   *     schema:
   *       type: object
   *       properties:
   *         count:
   *           type: number
   *           example: 10
   */
  count(req, res) {
    return res.locals.Model
    .count(res.locals.query)
    .then( (count)=> {
      res.status(200).send({ count: count });
    })
    .catch(res.queryError);
  },

  /**
   * FindOne gallery content action
   *
   * Record is preloaded in context loader by default and is avaible as res.locals.data
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [get] /gallery-content/{gallery-contentId}
   * description: "FindOne gallery-content by id"
   * responses:
   *   "200":
   *     description: "Find gallery-content by id success"
   *     schema:
   *       type: object
   *       properties:
   *         gallery-content:
   *           $ref: "#/definitions/gallery-content"
   */
  findOne(req, res, next) {
    if (!res.locals.data) {
      return next();
    }
    // by default record is preloaded in context load
    res.ok();
  },
  /**
   * Create and create page actions for gallery content resource
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [post] /gallery-content
   * description: "Create one gallery-content. req.body.galleryId is required"
   * responses:
   *   "201":
   *     description: "Create one gallery-content"
   *     schema:
   *       type: object
   *       properties:
   *         gallery-content:
   *           $ref: "#/definitions/gallery-content"
   */
  create(req, res) {
    if (!res.locals.template) {
      res.locals.template = res.locals.model + '/' + 'create';
    }

    if (!res.locals.data) {
      res.locals.data = {};
    }

    if (req.method === 'POST') {
      if (req.isAuthenticated && req.isAuthenticated()) {
        req.body.creatorId = req.user.id;
      }

      req.we.utils._.merge(res.locals.data, req.body);

      return res.locals.Model
      .create(req.body)
      .then(function afterCreate (record) {
        res.locals.data = record;
        res.created();
      })
      .catch(res.queryError);
    } else {
      res.ok();
    }
  },
  /**
   * Edit, edit page and update action
   *
   * Record is preloaded in context loader by default and is avaible as res.locals.data
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [put] /gallery-content/{gallery-contentId}
   * description: "Update one gallery-content. By default accepts post, put and update methods"
   * responses:
   *   "200":
   *     description: "Update one by id gallery-content success"
   *     schema:
   *       type: object
   *       properties:
   *         gallery-content:
   *           $ref: "#/definitions/gallery-content"
   */
  edit(req, res) {
    if (!res.locals.template) {
      res.locals.template = res.local.model + '/' + 'edit';
    }

    let record = res.locals.data;

    if (req.we.config.updateMethods.indexOf(req.method) >-1) {
      if (!record) {
        return res.notFound();
      }

      record.updateAttributes(req.body)
      .then(function reloadAssocs(n) {
        return n.reload()
        .then(function() {
          return n;
        });
      })
      .then(function afterUpdate (newRecord) {
        res.locals.data = newRecord;
        res.updated();
      })
      .catch(res.queryError);
    } else {
      res.ok();
    }
  },
  /**
   * Delete and delete action
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [delete] /gallery-content/{gallery-contentId}
   * description: "Delete one gallery-content by id"
   * responses:
   *   "204":
   *     description: "Delete one gallery-content record by id success"
   */
  delete(req, res) {
    if (!res.locals.template) {
      res.locals.template = res.local.model + '/' + 'delete';
    }

    let record = res.locals.data;

    if (!record) {
      return res.notFound();
    }

    res.locals.deleteMsg = res.locals.model + '.delete.confirm.msg';

    if (req.method === 'POST' || req.method === 'DELETE') {
      record
      .destroy()
      .then(function afterDestroy () {
        res.locals.deleted = true;
        res.deleted();
      })
      .catch(res.queryError);
    } else {
      res.ok();
    }
  }
};
