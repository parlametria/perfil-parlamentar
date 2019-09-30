const { check } = require('express-validator');

module.exports = {
  validate: [
      check('casa').custom(casa => {        
        if (casa !== undefined && casa !== "" && casa !== "camara" && casa !== "senado") {
          throw new Error("Parâmetro casa precisa ser 'camara' ou 'senado'.");
        }
        return true;
      })
    ]  
};