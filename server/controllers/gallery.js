module.exports = {
  findOne(req, res) {
    if (!res.locals.data) return res.notFound();

    if (req.accepts('html')) {
      res.goTo('/gallery-content?galleryId='+res.locals.data.id);
    } else {
      res.ok();
    }
  }
};