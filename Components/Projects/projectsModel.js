const Sequelize = require('sequelize');
const { db } = require('../../db/Sequelize');

const Project = db.define(
  'projects',
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
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    budgetType: {
      type: Sequelize.ENUM('fixed', 'hourly'),
      allowNull: false,
      field: 'budget_type'
    },
    budget: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    timeline: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    timelineUnit: {
      type: Sequelize.ENUM('days', 'weeks', 'months'),
      allowNull: false,
      field: 'timeline_unit'
    },
    projectType: {
      type: Sequelize.ENUM('one-time', 'ongoing'),
      allowNull: false,
      field: 'project_type'
    },
    maxProposals: {
      type: Sequelize.INTEGER,
      field: 'max_proposals'
    },
    skillsRequired: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      field: 'skills_required'
    },
    experienceLevel: {
      type: Sequelize.ENUM('beginner', 'intermediate', 'expert'),
      field: 'experience_level'
    },
    communicationPreference: {
      type: Sequelize.ENUM('email', 'chat', 'video-calls'),
      field: 'communication_preference'
    },
    requirements: {
      type: Sequelize.TEXT,
    },
    deliverables: {
      type: Sequelize.TEXT,
    },
    attachments: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
    },
    status: {
      type: Sequelize.ENUM('draft', 'published', 'closed'),
      defaultValue: 'draft',
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    }
  },
  {
    timestamps: true,
  }
);

// Associations
Project.associate = (models) => {
  Project.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'owner'
  });
};

db.sync().then(() => console.log('Projects table created'));

module.exports = Project;