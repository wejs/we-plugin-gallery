/**
 * Gallery content model
 */


// All plugins
const urlParser = require('js-video-url-parser');

module.exports = function(we) {
  const model = {
    definition: {
      name: {
        type: we.db.Sequelize.STRING(1000),
        allowNull: true
      },
      description: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 200,
        allowNull: true
      },
      type: {
        type: we.db.Sequelize.STRING(10),
        defaultValue: 'image',
        allowNull: false
      },
      videoUrl: {
        type: we.db.Sequelize.TEXT,
        allowNull: true
      },
      videoThumbnailUrl: {
        type: we.db.Sequelize.TEXT,
        allowNull: true
      },
      weight: {
        type: we.db.Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    },
    associations: {
      gallery: {
        type: 'belongsTo',
        model: 'gallery',
        inverse: 'contents',
        primaryKey: 'galleryId'
      }
    },
    options: {
      titleField: 'name',

      imageFields: {
        image: { formFieldMultiple: false }
      },

      classMethods: {
        /**
         * Context loader, preload current request record and related data
         *
         * @param  {Object}   req  express.js request
         * @param  {Object}   res  express.js response
         * @param  {Function} done callback
         */
        contextLoader(req, res, done) {
          this.preloadGalleryRecord(req, res, (err)=> {
            if (err) return done(err);

            if (!res.locals.id || !res.locals.loadCurrentRecord) {
              return done();
            }

            return this.findOne({
              where: { id: res.locals.id },
              include: [{ all: true }]
            })
            .then(function afterLoadContextRecord (record) {
              res.locals.data = record;

              if (record && record.dataValues.creatorId && req.isAuthenticated()) {
                // ser role owner
                if (record.isOwner(req.user.id)) {
                  if(req.userRoleNames.indexOf('owner') == -1 ) req.userRoleNames.push('owner');
                }
              }

              done();
              return null;
            })
            .catch(done);

          });
        },

        preloadGalleryRecord(req, res, done) {
          if (req.query.galleryId && req.accepts('html')) {
            // in gallery page:
            return we.db.models.gallery.findById(req.query.galleryId)
            .then( (gallery)=> {
              res.locals.gallery = gallery;
              done();
            })
            .catch(done);
          }

          done();
        }

      },

      instanceMethods: {
        parseVideoUrl() {
          const r = this;
          if (r.type == 'video' && r.videoUrl) {
            let video = urlParser.parse(r.videoUrl);

            r.videoUrl = urlParser.create({
              videoInfo: video,
              format: 'embed'
            });

            r.videoThumbnailUrl = urlParser.create({
              videoInfo: video,
              format: 'longImage'
            });
          }
        }
      },

      hooks: {
        beforeValidate(r) {
          if (!r.weight) r.weight = 0;

          r.parseVideoUrl();

          return r;
        }
      }
    }
  };

  return model;
};