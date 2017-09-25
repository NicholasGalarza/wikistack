const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false
});

const urlTitleGenerator = title => (
  title
    ? title.replace(/\s+/g, '_').replace(/\W/g, '')
    : Math.random().toString(36).substring(2, 7)
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
  date: {
    type: Sequelize.DATE,
    isDate: true,
    defaultValue: Sequelize.NOW
  }
}, {
    // This is a virtual, they are never called, only accessed.
    getterMethods: {
      route: (title) => `/wiki/${this.getDataValue(title)}`
    },
    hooks: {
      beforeValidate: (page, options) => {
        page.urlTitle = urlTitleGenerator(page.title);
      }
  }
});

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

module.exports = {
  db,
  Page,
  User
};
