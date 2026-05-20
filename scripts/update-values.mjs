import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const values = [
  {
    name: "Ambição",
    tagline: "A inquietude que nos move.",
    icon: "🔥",
    color: "#d9f22a",
    description: "Acreditamos na força da ambição como motor da grandeza. Não buscamos ser os maiores por vaidade, mas os melhores por propósito. Fazemos isso com honestidade, transparência e respeito, porque crescer de forma verdadeira é o único caminho que vale a pena. Não se trata de ganância, mas de fome por evolução.",
    practice: [
      "Não esperamos ser cobrados para fazer melhor. Buscamos o próximo nível por instinto.",
      "Quando algo dá errado, não justificamos, aprendemos. Assumimos o erro e voltamos mais fortes.",
      "Falamos com transparência, mesmo quando é desconfortável.",
      "Encaramos desafios grandes com coragem. A incerteza não nos paralisa, ela nos provoca.",
      "Não nos acomodamos com o que já foi bom: questionamos processos, ideias e resultados.",
    ],
    dos: [
      "Apaixone-se pelo processo. O resultado será a consequência inevitável.",
      "Celebre a evolução, a sua e a dos outros. Ela é o nosso maior troféu.",
      "Encare o feedback como um presente: é o caminho mais curto para a sua próxima grande jogada.",
      "Invista tempo para se tornar referência no que você faz.",
      "Busque o conhecimento. Estude, se aprofunde, seja inconformado.",
    ],
    donts: [
      "Não se contente com o bom. Busque o que te surpreende.",
      "Não se acomode no 'tá bom'. É o inimigo do extraordinário.",
      "Não confunda esforço com evolução. Trabalhe de forma inteligente.",
      "Não espere a sede chegar para beber conhecimento.",
      "Não terceirize sua evolução. Você é o protagonista da sua carreira.",
      "Não confunda ambição com vaidade ou ganância.",
    ],
  },
  {
    name: "Sonhar Grande",
    tagline: "A nossa ousadia nos leva além.",
    icon: "🚀",
    color: "#4f9cf9",
    description: "Sonhamos grande e acreditamos no impossível, mas sempre com os pés no chão. Sabemos aonde queremos chegar e trabalhamos com foco, disciplina e realismo para transformar o sonho em resultado. A Stellar nasceu de um sonho ousado e continua crescendo porque nunca deixamos de acreditar no que somos capazes de fazer.",
    practice: [
      "Para nós, 'não' é apenas o começo da negociação. Encontramos um caminho, ou criamos um.",
      "Não temos medo de tomar decisões corajosas e calculadas. Erros são aprendizado rápido.",
      "Nosso padrão é o 'inacreditável'. Questionamos o status quo de forma implacável.",
      "Pensamos além do nosso produto, conectando a marca à cultura e ao entretenimento.",
    ],
    dos: [
      "Seja protagonista. Crie a história que todos vão querer viver.",
      "Traga para a mesa ideias que te deixam com medo e entusiasmo ao mesmo tempo.",
      "Conecte a marca à cultura. Pense em como seu trabalho pode construir um estilo de vida.",
      "Justifique suas ideias pelo impacto que elas podem gerar em 5 anos. Pense em legado.",
    ],
    donts: [
      "Não se limite pelo que o mercado já fez. Crie o que eles vão copiar amanhã.",
      "Não aceite um 'não' como resposta. Encare como um convite para ser mais criativo.",
      "Não deixe a operação do dia a dia matar a visão de futuro.",
      "Não proponha apenas melhorias. Provoque revoluções.",
    ],
  },
  {
    name: "Accountability",
    tagline: "Foco, responsabilidade e trabalho duro.",
    icon: "🎯",
    color: "#a78bfa",
    description: "Nada vence a persistência e o trabalho duro. Acreditamos que o verdadeiro sucesso nasce quando cada pessoa assume suas responsabilidades e entrega mais do que promete. Aqui, você é o que você faz e o resultado que você gera. Encaramos os desafios de frente e vamos até o fim, mesmo quando é difícil.",
    practice: [
      "Não escale um desafio sem antes ter investigado e preparado propostas de resolução.",
      "Sua palavra tem peso. Se um prazo foi acordado, ele é cumprido.",
      "É incansável, focado e comprometido com o resultado.",
    ],
    dos: [
      "Assine sua entrega com orgulho.",
      "Seja o porto seguro onde os problemas terminam e as soluções florescem.",
      "Antes de escalar um problema, traga pelo menos uma solução.",
      "Honre cada 'pode deixar comigo' com uma entrega que gera confiança.",
      "Comunique de forma proativa. Antecipe os riscos e dê visibilidade do andamento.",
    ],
    donts: [
      "Não traga o problema sem trazer a semente da solução.",
      "Não veja a responsabilidade como um peso, mas como o privilégio de fazer acontecer.",
      "Não diga 'não é comigo'. Se o problema chegou até você, ele é seu.",
      "Não aponte culpados. Aponte a saída.",
      "Não adie a decisão difícil. A inércia custa mais caro.",
      "Não espere te dizerem o que fazer. Tenha atitude de dono.",
    ],
  },
  {
    name: "Juntos Somos Mais Fortes",
    tagline: "Sozinhos somos bons, juntos somos imparáveis.",
    icon: "🤝",
    color: "#34d399",
    description: "Acreditamos na força do coletivo, na confiança entre as pessoas e no poder de uma equipe que joga pelo mesmo objetivo. Aqui, é todos por um e um só propósito: o cliente. Celebramos as vitórias juntos, enfrentamos os desafios lado a lado.",
    practice: [
      "Atuamos como um time único, independentemente de área, cargo ou senioridade.",
      "Construímos confiança no dia a dia, com atitudes consistentes e comunicação clara.",
      "Ajudamos antes de sermos solicitados. Se alguém está travado, o problema passa a ser coletivo.",
      "Celebramos conquistas juntos e assumimos responsabilidades juntos.",
    ],
    dos: [
      "Jogue para que o seu colega brilhe. A sua luz virá como reflexo.",
      "Construa pontes de confiança tão fortes que dispensem muros de proteção.",
      "Ajude antes de ser pedido, compartilhe o que sabe sem guardar segredos.",
      "Celebre a vitória do time com a mesma intensidade de uma conquista pessoal.",
    ],
    donts: [
      "Não compita com seu time. Compita com o impossível.",
      "Não alimente a política ou a fofoca. Aqui, a gente resolve com diálogo aberto e honesto.",
      "Não abandone um companheiro em campo.",
    ],
  },
];

const content = {
  intro: "Esses são os valores que guiam cada decisão, cada entrega e cada relação na Stellar Gaming. Eles não são regras, são o nosso jeito de ser.",
  values,
};

await conn.query('UPDATE slides SET content=? WHERE id=11', [JSON.stringify(content)]);
console.log('Values slide updated successfully');
await conn.end();
