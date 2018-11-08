module.exports = (sequelize, type) => {
  return sequelize.define("Usuario", {
    first_name: type.STRING,
    full_name: type.STRING,
    email: type.STRING,
    photo: type.STRING,
    facebook: type.STRING,
    twitter: type.STRING,
    google: type.STRING,
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });
};
