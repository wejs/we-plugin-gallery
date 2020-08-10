module.exports = function (projectPath, Widget) {
  const widget = new Widget('gallery-list', __dirname);

  widget.viewMiddleware = function (w, req, res, next) {
    const models = req.we.db.models;
    const Sequelize = req.we.db.Sequelize;

    models.gallery.findAll({
      include: [{
        as: 'contents',
        model: models['gallery-content'],
        limit: 1,
        order: [['weight', 'DESC'], ['id', 'DESC']],
        required: true
      }],
      limit: 4,
      order: Sequelize.literal('rand()')
    })
    .then( (r)=> {
      if (!r || !r.length) {
        w.hide = true;
      }

      w.records = r;

      return next();
    });
  }

  return widget;
};