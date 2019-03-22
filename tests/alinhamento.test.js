const chai = require("chai");
const expect = chai.expect;

const { calcular } = require("../utils/alinhamento");
const { parlamentar_eduardo_bolsonaro, parlamentar_luiza_erundina, parlamentar_lincoln_portela } = require("./data/alinhamento.dummy");
const { proposicoes, temasAlinhamento } = require("./data/proposicoes.dummy");


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

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user, proposicoes, temasAlinhamento);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user, proposicoes, temasAlinhamento);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user, proposicoes, temasAlinhamento);

    // Alinhamento Geral
    expect(alinhamento_bolsonaro.alinhamento).to.equal(0);
    expect(alinhamento_erundina.alinhamento).to.equal(0);
    expect(alinhamento_portela.alinhamento).to.equal(0);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(0);
    expect(alinhamento_erundina.perguntasIguais).to.equal(0);
    expect(alinhamento_portela.perguntasIguais).to.equal(0);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(0);
    expect(alinhamento_erundina.respostasIguais).to.equal(0);
    expect(alinhamento_portela.respostasIguais).to.equal(0);

    let emptyTemas = [
      {
        "tema_id": 1,
        "respostasIguais": 0,
        "perguntasIguais": 0,
        "alinhamento": 0
      },
      {
        "tema_id": 3,
        "respostasIguais": 0,
        "perguntasIguais": 0,
        "alinhamento": 0
      },
      {
        "tema_id": 2,
        "respostasIguais": 0,
        "perguntasIguais": 0,
        "alinhamento": 0
      },
      {
        "tema_id": 0,
        "respostasIguais": 0,
        "perguntasIguais": 0,
        "alinhamento": 0
      },
      {
        "tema_id": 5,
        "respostasIguais": 0,
        "perguntasIguais": 0,
        "alinhamento": 0
      }
    ];

    // Alinhamento por temas
    expect(alinhamento_bolsonaro.temas).to.eql(emptyTemas);
    expect(alinhamento_erundina.temas).to.eql(emptyTemas);
    expect(alinhamento_portela.temas).to.eql(emptyTemas);

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

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user, proposicoes, temasAlinhamento);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user, proposicoes, temasAlinhamento);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user, proposicoes, temasAlinhamento);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.3333333333333333);
    expect(alinhamento_erundina.alinhamento).to.equal(0);
    expect(alinhamento_portela.alinhamento).to.equal(0);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(3);
    expect(alinhamento_erundina.perguntasIguais).to.equal(0);
    expect(alinhamento_portela.perguntasIguais).to.equal(1);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(1);
    expect(alinhamento_erundina.respostasIguais).to.equal(0);
    expect(alinhamento_portela.respostasIguais).to.equal(1);

    expect(alinhamento_bolsonaro.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 1,
          "perguntasIguais": 3,
          "alinhamento": 0.3333333333333333
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_erundina.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_portela.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 1,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        }
      ]
    );


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

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user, proposicoes, temasAlinhamento);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user, proposicoes, temasAlinhamento);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user, proposicoes, temasAlinhamento);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.3333333333333333);
    expect(alinhamento_erundina.alinhamento).to.equal(0.75);
    expect(alinhamento_portela.alinhamento).to.equal(0.6666666666666666);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(9);
    expect(alinhamento_erundina.perguntasIguais).to.equal(4);
    expect(alinhamento_portela.perguntasIguais).to.equal(6);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(3);
    expect(alinhamento_erundina.respostasIguais).to.equal(3);
    expect(alinhamento_portela.respostasIguais).to.equal(4);

    expect(alinhamento_bolsonaro.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 2,
          "perguntasIguais": 4,
          "alinhamento": 0.5
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 1,
          "perguntasIguais": 4,
          "alinhamento": 0.25
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_erundina.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 2,
          "perguntasIguais": 3,
          "alinhamento": 0.6666666666666666
        },
        {
          "tema_id": 3,
          "respostasIguais": 1,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_portela.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 1,
          "perguntasIguais": 3,
          "alinhamento": 0.3333333333333333
        },
        {
          "tema_id": 3,
          "respostasIguais": 1,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 2,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        }
      ]
    );

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

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user, proposicoes, temasAlinhamento);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user, proposicoes, temasAlinhamento);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user, proposicoes, temasAlinhamento);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.5);
    expect(alinhamento_erundina.alinhamento).to.equal(0.6363636363636364);
    expect(alinhamento_portela.alinhamento).to.equal(0.4666666666666667);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(16);
    expect(alinhamento_erundina.perguntasIguais).to.equal(11);
    expect(alinhamento_portela.perguntasIguais).to.equal(15);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(8);
    expect(alinhamento_erundina.respostasIguais).to.equal(7);
    expect(alinhamento_portela.respostasIguais).to.equal(7);

    expect(alinhamento_bolsonaro.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 1,
          "perguntasIguais": 4,
          "alinhamento": 0.25
        },
        {
          "tema_id": 3,
          "respostasIguais": 3,
          "perguntasIguais": 4,
          "alinhamento": 0.75
        },
        {
          "tema_id": 2,
          "respostasIguais": 2,
          "perguntasIguais": 3,
          "alinhamento": 0.6666666666666666
        },
        {
          "tema_id": 0,
          "respostasIguais": 1,
          "perguntasIguais": 4,
          "alinhamento": 0.25
        },
        {
          "tema_id": 5,
          "respostasIguais": 1,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_erundina.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 3,
          "perguntasIguais": 3,
          "alinhamento": 1
        },
        {
          "tema_id": 3,
          "respostasIguais": 1,
          "perguntasIguais": 4,
          "alinhamento": 0.25
        },
        {
          "tema_id": 2,
          "respostasIguais": 2,
          "perguntasIguais": 3,
          "alinhamento": 0.6666666666666666
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 1,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_portela.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 0,
          "perguntasIguais": 3,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 2,
          "perguntasIguais": 5,
          "alinhamento": 0.4
        },
        {
          "tema_id": 2,
          "respostasIguais": 2,
          "perguntasIguais": 4,
          "alinhamento": 0.5
        },
        {
          "tema_id": 0,
          "respostasIguais": 2,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 1,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );
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

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user, proposicoes, temasAlinhamento);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user, proposicoes, temasAlinhamento);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user, proposicoes, temasAlinhamento);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.25);
    expect(alinhamento_erundina.alinhamento).to.equal(0.75);
    expect(alinhamento_portela.alinhamento).to.equal(0.25);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(4);
    expect(alinhamento_erundina.perguntasIguais).to.equal(4);
    expect(alinhamento_portela.perguntasIguais).to.equal(4);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(1);
    expect(alinhamento_erundina.respostasIguais).to.equal(3);
    expect(alinhamento_portela.respostasIguais).to.equal(1);

    expect(alinhamento_bolsonaro.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 1,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_erundina.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 1,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 2,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_portela.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 1,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );
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

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user, proposicoes, temasAlinhamento);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user, proposicoes, temasAlinhamento);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user, proposicoes, temasAlinhamento);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.25);
    expect(alinhamento_erundina.alinhamento).to.equal(0.75);
    expect(alinhamento_portela.alinhamento).to.equal(0.25);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(4);
    expect(alinhamento_erundina.perguntasIguais).to.equal(4);
    expect(alinhamento_portela.perguntasIguais).to.equal(4);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(1);
    expect(alinhamento_erundina.respostasIguais).to.equal(3);
    expect(alinhamento_portela.respostasIguais).to.equal(1);

    expect(alinhamento_bolsonaro.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 1,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_erundina.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 1,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 2,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_portela.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 1,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );

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

    let alinhamento_bolsonaro = calcular(parlamentar_eduardo_bolsonaro, user, proposicoes, temasAlinhamento);
    let alinhamento_erundina = calcular(parlamentar_luiza_erundina, user, proposicoes, temasAlinhamento);
    let alinhamento_portela = calcular(parlamentar_lincoln_portela, user, proposicoes, temasAlinhamento);

    expect(alinhamento_bolsonaro.alinhamento).to.equal(0.25);
    expect(alinhamento_erundina.alinhamento).to.equal(0.75);
    expect(alinhamento_portela.alinhamento).to.equal(0.25);

    expect(alinhamento_bolsonaro.perguntasIguais).to.equal(4);
    expect(alinhamento_erundina.perguntasIguais).to.equal(4);
    expect(alinhamento_portela.perguntasIguais).to.equal(4);

    expect(alinhamento_bolsonaro.respostasIguais).to.equal(1);
    expect(alinhamento_erundina.respostasIguais).to.equal(3);
    expect(alinhamento_portela.respostasIguais).to.equal(1);

    expect(alinhamento_bolsonaro.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 1,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_erundina.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 1,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 2,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );

    expect(alinhamento_portela.temas).to.eql(
      [
        {
          "tema_id": 1,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        },
        {
          "tema_id": 3,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 2,
          "respostasIguais": 1,
          "perguntasIguais": 2,
          "alinhamento": 0
        },
        {
          "tema_id": 0,
          "respostasIguais": 0,
          "perguntasIguais": 0,
          "alinhamento": 0
        },
        {
          "tema_id": 5,
          "respostasIguais": 0,
          "perguntasIguais": 1,
          "alinhamento": 0
        }
      ]
    );
  });
});