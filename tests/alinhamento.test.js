const chai = require("chai");
const expect = chai.expect;

const { calcular } = require("../utils/alinhamento");
const { parlamentar_eduardo_bolsonaro, parlamentar_luiza_erundina, parlamentar_lincoln_portela } = require("./data/alinhamento.dummy");

describe("Alinhamento bem sucedido", () => {
  it("de usuário sem respostas", () => {
    let user = {
      "5632": 0,
      "6043": 0,
      "6082": 0,
      "5673": 0,
      "6074": 0,
      "16370": 0,
      "16208": 0,
      "16209": 0,
      "5513": 0,
      "16519": 0,
      "16532": 0,
      "5450": 0,
      "16155": 0,
      "5494": 0,
      "6148": 0,
      "16186": 0,
      "5520": 0,
      "55961": 0,
      "55962": 0,
      "55963": 0,
      "5624": 0
    };

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0);
    expect(alinhamento_erundina.alinhamento).to.equal(0);
    expect(alinhamento_portela.alinhamento).to.equal(0);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(0);
    expect(alinhamento_erundina.perguntasIguais).to.equal(0);
    expect(alinhamento_portela.perguntasIguais).to.equal(0);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(0);
    expect(alinhamento_erundina.respostasIguais).to.equal(0);
    expect(alinhamento_portela.respostasIguais).to.equal(0);
  });

  it("de usuário com poucas respostas (com menos de 3 perguntas iguais, o score é zerado).", () => {
    let user = {
      "5632": 0,
      "6043": 0,
      "6082": 0,
      "5673": 0,
      "6074": 0,
      "16370": 0,
      "16208": -1,
      "16209": -1,
      "5513": 0,
      "16519": 1,
      "16532": 0,
      "5450": 0,
      "16155": 0,
      "5494": 0,
      "6148": 0,
      "16186": 0,
      "5520": 0,
      "55961": 0,
      "55962": 0,
      "55963": 0,
      "5624": 0
    };

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0);
    expect(alinhamento_erundina.alinhamento).to.equal(0);
    expect(alinhamento_portela.alinhamento).to.equal(0);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(3);
    expect(alinhamento_erundina.perguntasIguais).to.equal(0);
    expect(alinhamento_portela.perguntasIguais).to.equal(1);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(1);
    expect(alinhamento_erundina.respostasIguais).to.equal(0);
    expect(alinhamento_portela.respostasIguais).to.equal(1);
  });

  it("de usuário com muitas respostas", () => {
    let user = {
      "5632": -1,
      "6043": 0,
      "6082": 1,
      "5673": 0,
      "6074": 0,
      "16370": 0,
      "16208": -1,
      "16209": -1,
      "5513": -1,
      "16519": 1,
      "16532": 0,
      "5450": 0,
      "16155": 0,
      "5494": 0,
      "6148": -1,
      "16186": 0,
      "5520": 0,
      "55961": 0,
      "55962": 0,
      "55963": 1,
      "5624": -1
    };

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.3333333333333333);
    expect(alinhamento_erundina.alinhamento).to.equal(0.75);
    expect(alinhamento_portela.alinhamento).to.equal(0.6666666666666666);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(9);
    expect(alinhamento_erundina.perguntasIguais).to.equal(4);
    expect(alinhamento_portela.perguntasIguais).to.equal(6);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(3);
    expect(alinhamento_erundina.respostasIguais).to.equal(3);
    expect(alinhamento_portela.respostasIguais).to.equal(4);
  });

  it("de usuário com todas as respostas", () => {
    let user = {
      "5632": -1,
      "6043": 1,
      "6082": 1,
      "5673": -1,
      "6074": -2,
      "16370": 1,
      "16208": -1,
      "16209": -1,
      "5513": -1,
      "16519": 1,
      "16532": -1,
      "5450": 1,
      "16155": -1,
      "5494": 1,
      "6148": -1,
      "16186": 1,
      "5520": -2,
      "55961": 1,
      "55962": -2,
      "55963": -1,
      "5624": -1
    };

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.5);
    expect(alinhamento_erundina.alinhamento).to.equal(0.6363636363636364);
    expect(alinhamento_portela.alinhamento).to.equal(0.4666666666666667);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(16);
    expect(alinhamento_erundina.perguntasIguais).to.equal(11);
    expect(alinhamento_portela.perguntasIguais).to.equal(15);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(8);
    expect(alinhamento_erundina.respostasIguais).to.equal(7);
    expect(alinhamento_portela.respostasIguais).to.equal(7);
  });
});

describe("Alinhamento com respostas inválidas", () => {
  it("de usuário com resposta null", () => {
    let user = {
      "5632": -1,
      "6043": 0,
      "6082": null,
      "5673": 0,
      "6074": 0,
      "16370": null,
      "16208": null,
      "16209": null,
      "5513": null,
      "16519": 0,
      "16532": 0,
      "5450": 1,
      "16155": 1,
      "5494": 0,
      "6148": 0,
      "16186": 0,
      "5520": 0,
      "55961": 0,
      "55962": -1,
      "55963": 0,
      "5624": 0
    };

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.25);
    expect(alinhamento_erundina.alinhamento).to.equal(0.75);
    expect(alinhamento_portela.alinhamento).to.equal(0.25);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(4);
    expect(alinhamento_erundina.perguntasIguais).to.equal(4);
    expect(alinhamento_portela.perguntasIguais).to.equal(4);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(1);
    expect(alinhamento_erundina.respostasIguais).to.equal(3);
    expect(alinhamento_portela.respostasIguais).to.equal(1);
  });

  it("de usuário com respostas aleatórias (ex: 5, 6, 7)", () => {
    let user = {
      "5632": -1,
      "6043": 0,
      "6082": 2,
      "5673": 0,
      "6074": 0,
      "16370": 3,
      "16208": 0,
      "16209": 0,
      "5513": 4,
      "16519": 0,
      "16532": 0,
      "5450": 1,
      "16155": 1,
      "5494": 0,
      "6148": 0,
      "16186": 5,
      "5520": 0,
      "55961": 0,
      "55962": -1,
      "55963": 0,
      "5624": 0
    };

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.25);
    expect(alinhamento_erundina.alinhamento).to.equal(0.75);
    expect(alinhamento_portela.alinhamento).to.equal(0.25);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(4);
    expect(alinhamento_erundina.perguntasIguais).to.equal(4);
    expect(alinhamento_portela.perguntasIguais).to.equal(4);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(1);
    expect(alinhamento_erundina.respostasIguais).to.equal(3);
    expect(alinhamento_portela.respostasIguais).to.equal(1);
  });

  it("de usuário com respostas undefined", () => {
    let user = {
      "5632": -1,
      "6043": 0,
      "6082": 0,
      "5673": 0,
      "6074": 0,
      "16370": 0,
      "16208": undefined,
      "16209": undefined,
      "5513": 0,
      "16519": 0,
      "16532": undefined,
      "5450": 1,
      "16155": 1,
      "5494": 0,
      "6148": 0,
      "16186": 0,
      "5520": 0,
      "55961": 0,
      "55962": -1,
      "55963": 0,
      "5624": undefined
    };

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.25);
    expect(alinhamento_erundina.alinhamento).to.equal(0.75);
    expect(alinhamento_portela.alinhamento).to.equal(0.25);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(4);
    expect(alinhamento_erundina.perguntasIguais).to.equal(4);
    expect(alinhamento_portela.perguntasIguais).to.equal(4);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(1);
    expect(alinhamento_erundina.respostasIguais).to.equal(3);
    expect(alinhamento_portela.respostasIguais).to.equal(1);
  });
});