const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/puppybook');
const Op = Sequelize.Op;

/**
 * Define your models here, or organize them into separate modules.
 */
const Puppy = db.define('puppy', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue:
      'http://images.shape.mdpcdn.com/sites/shape.com/files/styles/slide/public/puppy-2_0.jpg',
  },
  likes: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
});

Puppy.prototype.findPackmates = function() {
  return Puppy.findAll({
    where: {
      ownerId: this.ownerId,
      id: {
        [OP.ne]: this.id,
      },
    },
  });
};

Puppy.prototype.findPopular = function() {
  return Puppy.findAll({
    where: {
      likes: {
        [Op.gt]: 4,
      },
    },
  });
};

Puppy.beforeCreate(puppy => {
  let nameArr = puppy.name.trim().split(/\s+/);
  nameArr.map(str => str[0].toUpperCase + str.substring(1).toUpperCase());
  // let firstName = puppy.name.slice(0, puppy.name.indexOf(' ')).toLowerCase();
  // let firstcap = firstName[0].toUpperCase();

  // let lastName = Puppy.name
  //   .slice(puppy.name.indexOf(' '), puppy.name.length)
  //   .toLowerCase();
  // let lastcap = lastName[0].toUpperCase();

  puppy.name = nameArr.join(' ');
  //`${firstcap}${firstName} ${lastcap}${lastName}`;
});

const Owner = db.define('owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Owner.beforeCreate(owner => {
  let firstName = owner.name.slice(0, owner.name.indexOf(' ')).toLowerCase();
  let firstcap = firstName[0].toUpperCase();

  let lastName = owner.name
    .slice(owner.name.indexOf(' '), owner.name.length)
    .toLowerCase();
  let lastcap = lastName[0].toUpperCase();

  owner.name = `${firstcap}${firstName} ${lastcap}${lastName}`;
});

Puppy.belongsTo(Owner);
Owner.hasMany(Puppy);

module.exports = db;
