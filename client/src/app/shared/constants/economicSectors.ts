/*
  Os Agrupamentos dos setores econômicos foram definidos pela Open Knowledge Brasil
  para facilitar a análise de acordo com áreas de interesse.

  Na estrutura abaixo, "name" é o nome dado grupo do setor econômico, "codes" são os primeiros
  dígitos que um código CNAE deve ter para fazer parte do grupo e "abbrev" é uma abreviação usada
  pelo código com o único propósito de ser mais fácil de processar os dados (porque alguns
  nomes são muito longos).

  Observações:
  - "Não relacionado a empresas" é o nome dado ao grupo de quando o CNAE é inexistente (ou seja,
    no caso das doações significaria que a doação foi realizada por uma pessoa física que não
    possui socieade a nenhuma empresa).
  - "Não mapeado" é o nome dado ao grupo quando a empresa possui um CNAE mas o mesmo não consta
    nesse mapeamento abaixo (não deveria acontecer, buscamos deixar a lista abaixo o mais
    atualizada possível).
 */
export const economicSectorMapping = [
  {
    name: 'Agricultura, pecuária, produção florestal, pesca e aquicultura',
    abbrev: 'agr',
    codes: ['01', '02', '03']
  },
  {
    name: 'Petróleo, gás e carvão mineral',
    abbrev: 'petr',
    codes: ['05', '06']
  },
  {
    name: 'Mineração',
    abbrev: 'min',
    codes: ['07', '08', '09']
  },
  {
    name: 'Indústria alimentícia e de bebidas',
    abbrev: 'bebd',
    codes: ['10', '11']
  },
  {
    name: 'Indústria do fumo',
    abbrev: 'fumo',
    codes: ['12']
  },
  {
    name: 'Indústria têxtil e de vestuário',
    abbrev: 'vest',
    codes: ['13', '14']
  },
  {
    name: 'Indústria de couros e calçados',
    abbrev: 'cour',
    codes: ['15']
  },
  {
    name: 'Indústria de móveis e madeiras',
    abbrev: 'mov',
    codes: ['16', '31']
  },
  {
    name: 'Indústria de celulose e papel',
    abbrev: 'papl',
    codes: ['17']
  },
  {
    name: 'Outros produtos industriais',
    abbrev: 'oprod',
    codes: ['18', '32']
  },
  {
    name: 'Indústria petroquímica e biocombustíveis',
    abbrev: 'bioc',
    codes: ['19']
  },
  {
    name: 'Indústria química',
    abbrev: 'quim',
    codes: ['20']
  },
  {
    name: 'Indústria farmacêutica',
    abbrev: 'farm',
    codes: ['21', '22']
  },
  {
    name: 'Indústria metalúrgica',
    abbrev: 'metal',
    codes: ['23', '24', '25']
  },
  {
    name: 'Indústria eletro-eletrônica e de informática',
    abbrev: 'inf',
    codes: ['26', '27']
  },
  {
    name: 'Indústria de máquinas e equipamentos',
    abbrev: 'maquin',
    codes: ['28', '33']
  },
  {
    name: 'Indústria automobilística e de transporte',
    abbrev: 'transp',
    codes: ['29', '30']
  },
  {
    name: 'Eletricidade e gás',
    abbrev: 'eletr',
    codes: ['35']
  },
  {
    name: 'Água e esgoto',
    abbrev: 'agua',
    codes: ['36', '37']
  },
  {
    name: 'Coleta e gestão de resíduos',
    abbrev: 'resid',
    codes: ['38', '39']
  },
  {
    name: 'Construção',
    abbrev: 'constr',
    codes: ['41', '42', '43']
  },
  {
    name: 'Comércio e reparação de veículos automotores e motocicletas',
    abbrev: 'veic',
    codes: ['45']
  },
  {
    name: 'Comércio por atacado, exceto veículos automotores e motocicletas',
    abbrev: 'comerc',
    codes: ['46']
  },
  {
    name: 'Comércio varejista',
    abbrev: 'varej',
    codes: ['47']
  },
  {
    name: 'Transporte, armazenagem e correio',
    abbrev: 'correio',
    codes: ['49', '50', '51', '52', '53']
  },
  {
    name: 'Alojamento e alimentação',
    abbrev: 'alim',
    codes: ['55', '56']
  },
  {
    name: 'Informação e comunicação',
    abbrev: 'com',
    codes: ['58', '59', '60', '61', '62', '63']
  },
  {
    name: 'Atividades financeiras, de seguros e serviços relacionados',
    abbrev: 'fin',
    codes: ['64', '65', '66']
  },
  {
    name: 'Atividades imobiliárias',
    abbrev: 'imob',
    codes: ['68']
  },
  {
    name: 'Atividades jurídicas, de contabilidade e de auditoria',
    abbrev: 'jurid',
    codes: ['69']
  },
  {
    name: 'Outras atividades profissionais',
    abbrev: 'oprof',
    codes: ['70', '71', '72', '73', '74', '75']
  },
  {
    name: 'Outras atividades administrativas',
    abbrev: 'oadm',
    codes: ['77']
  },
  {
    name: 'Vigilância e locação de mão-de-obra terceirizada',
    abbrev: 'vig',
    codes: ['78', '80', '81', '82']
  },
  {
    name: 'Agências de viagem e turismo',
    abbrev: 'turism',
    codes: ['79']
  },
  {
    name: 'Administração pública, defesa e seguridade social',
    abbrev: 'admpub',
    codes: ['84']
  },
  {
    name: 'Educação',
    abbrev: 'educ',
    codes: ['85']
  },
  {
    name: 'Saúde humana e serviços sociais',
    abbrev: 'saud',
    codes: ['86', '87', '88']
  },
  {
    name: 'Artes, cultura, esporte e recreação',
    abbrev: 'art',
    codes: ['90', '91', '92', '93']
  },
  {
    name: 'Outras atividades de serviços',
    abbrev: 'oserv',
    codes: ['94', '95', '96']
  },
  {
    name: 'Serviços domésticos',
    abbrev: 'serd',
    codes: ['97']
  },
  {
    name: 'Organismos internacionais e outras instituições extraterritoriais',
    abbrev: 'intern',
    codes: ['99']
  },
];

export const WITHOUT_CNAE = {name: 'Não relacionado a empresas', abbrev: 'nrel'};
export const CNAE_MISSING_IN_MAPPING = {name: 'Não mapeado', abbrev: 'nmap'};
