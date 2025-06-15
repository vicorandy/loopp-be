const Sequelize = require('sequelize');
const { db } = require('../../db/Sequelize');

const Service = db.define(
  'services',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true, // or false if image is required
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    pro: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // track createdAt & updatedAt
  }
);

// db.sync().then(()=>{console.log('Service table created successfully')})

module.exports = Service;
