install.packages("rcongresso")
install.packages('devtools')
devtools::install_github('analytics-ufcg/rcongresso')

votacoes_PL4715 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PL",4715,1994)) #21076


votacoes_PL491816 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PL",4918,2016)) #2081439

votacoes_52866 <- rcongresso::fetch_votacao(52866)

votacoes_PL629902 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PL",6299,2002)) #46249

MP7562016_id <- rcongresso::fetch_id_proposicao("MP",756,2016)
MP7582016_id <- rcongresso::fetch_id_proposicao("MP",758,2016)
MP7592016_id <- rcongresso::fetch_id_proposicao("MP",759,2016)
#ao que parece nao tem mp

votacoes_MPV8092017 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("MPv",809,2017)) #2164234
votos_MPV8092017 <- rcongresso::fetch_votos(8305)

votacoes_PL18761999 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PL",1876,1999)) #17338 
votos_PL18761999 <- rcongresso::fetch_votos(4648)

votacoes_PEC1711993 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PEC",171,1993)) #14493
votos_PEC1711993 <- rcongresso::fetch_votos(6516)

votacoes_PEC2412016 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PEC",241,2016)) #2088351
votos_PEC2412016 <- rcongresso::fetch_votos(7214)

votacoes_PDC8862018 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PDC",886,2018)) #2168064
votos_PDC8862018 <- rcongresso::fetch_votos(8175)

votacoes_PL25162015 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PL",2516,2015)) #1594910
votos_PL25162015 <- rcongresso::fetch_votos(7317)

votacoes_PL10572017 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PL",1057,2017)) #NULL

votacoes_PL88432017 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PL",8843,2017)) #2156331
votos_PL88432017 <- rcongresso::fetch_votos(7927)

votacoes_PL48502016 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PL",4850,2016)) #2080604
votos_PL48502016 <- rcongresso::fetch_votos(7304)

votacoes_PL41482008 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PL",4148,2008)) #412728
votos_PL41482008 <- rcongresso::fetch_votos(6259)

votacoes_PL44742004 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PL",4474,2004)) #270277
votos_PL44742004 <- rcongresso::fetch_votos(6608)

votacoes_PLP1772012 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("PLP",177,2012)) #544724
votos_PLP1772012 <- rcongresso::fetch_votos(6095)

votacoes_MPV8092017 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("MPV",809,2017)) #2461234
votos_MPV8092017 <- rcongresso::fetch_votos(8295)

votacoes_MPV8102017 <- rcongresso::fetch_votacoes(rcongresso::fetch_id_proposicao("MPV",810,2017)) #2165578
votos_MPV8102017 <- rcongresso::fetch_votos(8334)

