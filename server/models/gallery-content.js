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