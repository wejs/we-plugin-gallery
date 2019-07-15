/**
 * Gallery model
 */

module.exports = function(we) {
  const model = {
    definition: {
      name: {
        type: we.db.Sequelize.STRING(1000),
        allowNull: false
      },
      date: {
        type: we.db.Sequelize.DATE,
        allowNull: true
      },
      description: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 200
      },
      allowVideo: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: true,
        formFieldType: 'boolean'
      },
      allowImage: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: true,
        formFieldType: 'boolean'
      }
    },
    associations: {
      contents: {
        type: 'hasMany',
        model: 'gallery-content',
        inverse: 'gallery',
        primaryKey: 'galleryId'
      }
    },
    options: {
      titleField: 'name',
      tableName: 'galleries',

      termFields: {
        tags: {
          vocabularyName: 'Tags',
          canCreate: true,
          formFieldMultiple: true,
          onlyLowercase: true
        },
      }
    }
  };

  return model;
};