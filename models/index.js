const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false
});

const urlTitleGenerator = title => (
  title ?
  title.replace(/\s+/g, '_').replace(/\W/g, '') :
  Math.random().toString(36).substring(2, 7)
);

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    isUrl: true,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  tags: {
    /* Call this every time we attempt to set the tags
     * property.
     */
    type: Sequelize.ARRAY(Sequelize.TEXT),
    set: function(value) {
      let arrayOfTags;

      if (typeof value === 'string') {
        arrayOfTags = value.split('.').map(s => s.trim());
        this.setDataValue('tags', arrayOfTags);
      } else {
        this.setDataValue('tags', value);
      }
    }
  },
  date: {
    type: Sequelize.DATE,
    isDate: true,
    defaultValue: Sequelize.NOW
  }
}, {
  hooks: {
    beforeValidate: (page, options) => {
      page.urlTitle = urlTitleGenerator(page.title);
    }
  }, // This is a virtual, never called, only accessed.
  getterMethods: {
    route: function() {
      return `/wiki/${this.urlTitle}`;
    }
  }
});

// Class Methods
Page.findByTag = tag => {
  return Page.findAll({
    where: {
      tags: {
        $overlap: [tag]
      }
    }
  });
}

// Instance Methods
// Find all pages with same id except itself.
Page.prototype.findSimilar = function() {
  return Page.findAll({
    where: {
      tags: {
        $overlap: this.tags
      },
      id: {
        $ne: this.id
      }
    }
  });
}

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    isEmail: true,
    allowNull: false
  }
});

Page.belongsTo(User, {
  as: 'author'
});

module.exports = {
  Page,
  User
};
