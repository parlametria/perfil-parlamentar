const chai = require("chai");
const expect = chai.expect;

const { calcular } = require("../utils/alinhamento");
const { parlamentar, respostas } = require("./data/alinhamento.dummy");

describe("Alinhamento", () => {
  it("deve ser vazio", () => {
    expect(calcular(parlamentar, [])).to.have.property('alinhamento');
  });
});