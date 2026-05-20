import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.query('SELECT content FROM slides WHERE id=7');
const content = JSON.parse(rows[0].content);

// Existing terms (to avoid duplicates)
const existing = new Set(content.entries.map(e => e.term.toLowerCase()));

// New terms from the Dicionário do Mercado de Apostas Esportivas document
// Classified into existing categories: basico, mercado, financeiro, estrategia, tecnico, cassino, indicadores
const newTerms = [
  // BÁSICO
  { term: "Casa de Apostas / Bookie", cat: "Básico", definition: "Empresa ou plataforma que aceita apostas, define as odds e paga os prêmios. Define sua margem de lucro embutindo-a nas odds oferecidas." },
  { term: "Jogo Responsável", cat: "Básico", definition: "Conjunto de práticas e ferramentas que orientam o apostador a manter uma relação saudável com as apostas. Inclui definição de limites de tempo e dinheiro e recursos de autoexclusão." },
  { term: "Odd Justa", cat: "Básico", definition: "Odd que refletiria com precisão a real probabilidade de um evento, sem margem de lucro da casa. Serve como referência para avaliar se uma aposta tem valor." },
  { term: "Odds", cat: "Básico", definition: "Indicadores numéricos que representam a probabilidade de um evento ocorrer e determinam o valor do prêmio. Quanto menor a probabilidade, maior a odd e maior o lucro potencial." },
  { term: "Tipster", cat: "Básico", definition: "Pessoa ou serviço especializado em fornecer palpites e análises de apostas, geralmente acompanhados de histórico de resultados para avaliar a credibilidade." },
  { term: "Wager", cat: "Básico", definition: "Termo em inglês para aposta ou valor apostado. Muito usado em plataformas internacionais como sinônimo de stake." },
  // MERCADOS
  { term: "Handicap", cat: "Mercados", definition: "Vantagem ou desvantagem fictícia atribuída a um time para equilibrar a disputa nas apostas. Por exemplo, um time pode começar com -1 gol de desvantagem para fins de aposta." },
  { term: "Live / In-Play", cat: "Mercados", definition: "Apostas realizadas com o evento em andamento. As odds mudam em tempo real conforme o desenvolvimento do jogo." },
  { term: "Mercado", cat: "Mercados", definition: "Tipo específico de aposta disponível num evento. Exemplos: resultado final, número de gols, primeiro a marcar, cartões, escanteios, entre outros." },
  { term: "Moneyline", cat: "Mercados", definition: "Aposta simples no vencedor de uma partida sem nenhum handicap. Comum nos Estados Unidos, as odds são expressas em formato americano (+150, -120, etc.)." },
  { term: "Over/Under", cat: "Mercados", definition: "Aposta no total de eventos numa partida (gols, pontos, etc.). 'Over' aposta que o total será acima do número estipulado pela casa, 'Under' que ficará abaixo." },
  { term: "Pré-jogo", cat: "Mercados", definition: "Apostas realizadas antes do início de um evento esportivo. As odds são estabelecidas com antecedência e não mudam após o fechamento das apostas." },
  { term: "Spread", cat: "Mercados", definition: "Diferença de pontos ou gols entre as equipes utilizada como critério de aposta, comum em esportes americanos como NFL e NBA." },
  // FINANCEIRO
  { term: "Bankroll", cat: "Financeiro", definition: "Total de dinheiro reservado exclusivamente para apostas. Recomenda-se apostar apenas uma pequena percentagem do bankroll por entrada para reduzir o risco de ruína." },
  { term: "Cashout", cat: "Financeiro", definition: "Recurso que permite ao apostador encerrar uma aposta antes do fim do evento, recebendo um valor parcial. Útil para garantir lucro ou minimizar prejuízo conforme o jogo evolui." },
  { term: "Freebet", cat: "Financeiro", definition: "Crédito de aposta gratuito oferecido pela casa como bônus. Geralmente o valor do bônus não é incluído no prêmio, apenas os lucros gerados por ele." },
  { term: "Margem da Casa (Vig / Juice)", cat: "Financeiro", definition: "Percentagem embutida nas odds que garante lucro à casa independentemente do resultado. É a razão pela qual as odds oferecidas são sempre ligeiramente inferiores à probabilidade real." },
  { term: "Programa VIP", cat: "Financeiro", definition: "Sistema de fidelidade que recompensa jogadores mais ativos com benefícios exclusivos, como bônus especiais, limites elevados, atendimento prioritário e convites a eventos." },
  { term: "ROI (Return on Investment)", cat: "Financeiro", definition: "Percentual de retorno sobre o total investido em apostas. É a principal métrica para avaliar o desempenho de um apostador a longo prazo." },
  { term: "Rollover / Requisito de Apostas", cat: "Financeiro", definition: "Número de vezes que um bônus deve ser apostado antes de poder ser sacado. Um bônus de R$100 com rollover de 5x exige R$500 em apostas antes do saque." },
  { term: "Stake", cat: "Financeiro", definition: "Valor apostado numa determinada jogada. Gerenciar bem o stake é essencial para uma estratégia sustentável a longo prazo." },
  // ESTRATÉGIA
  { term: "Acumulada / Múltipla", cat: "Estratégia", definition: "Aposta que combina dois ou mais resultados numa única jogada. Todas as seleções precisam ser vencedoras para o apostador receber. O lucro potencial é maior, mas o risco também cresce." },
  { term: "Dutching", cat: "Estratégia", definition: "Técnica de distribuir o valor apostado entre múltiplos resultados possíveis de modo que o lucro seja igual em qualquer um dos cenários vencedores." },
  { term: "Edge", cat: "Estratégia", definition: "Vantagem percentual do apostador sobre a casa em determinada aposta. Apostadores profissionais só entram em jogadas onde identificam um edge positivo." },
  { term: "Flat Betting", cat: "Estratégia", definition: "Estratégia em que o apostador aposta sempre o mesmo valor absoluto em todas as entradas, independentemente do nível de confiança. Ajuda a controlar o bankroll." },
  { term: "Gestão de Banca", cat: "Estratégia", definition: "Prática de planejar e controlar o saldo disponível para apostas, distribuindo-o de forma estratégica entre diferentes jogos ou mercados para reduzir o risco de perdas rápidas." },
  { term: "Kelly Criterion", cat: "Estratégia", definition: "Fórmula matemática que calcula o percentual ideal do bankroll a apostar com base no edge percebido e nas odds disponíveis. Maximiza o crescimento a longo prazo." },
  { term: "Surebet / Arbitragem", cat: "Estratégia", definition: "Aproveitar diferenças de odds entre casas de apostas para cobrir todos os resultados de um evento e garantir lucro independentemente do que ocorrer." },
  { term: "Valor (Value)", cat: "Estratégia", definition: "Situação em que a probabilidade real de um evento é maior do que a indicada pela odd. Encontrar valor é o principal objetivo de apostadores profissionais." },
  // TÉCNICO
  { term: "Criptografia SSL", cat: "Técnico", definition: "Tecnologia de segurança que protege os dados e transações dos usuários em plataformas de apostas, tornando as informações ilegíveis para terceiros mal-intencionados." },
  { term: "Formato de Odds Americano", cat: "Técnico", definition: "Sistema usado nos EUA onde odds positivas (+200) indicam o lucro para cada R$100 apostados e odds negativas (-150) indicam o valor necessário apostar para lucrar R$100." },
  { term: "Formato Decimal", cat: "Técnico", definition: "Sistema mais usado no Brasil e Europa onde a odd representa o retorno total (capital + lucro) por unidade apostada. Odd 2.50 em R$100 retorna R$250 totais." },
  { term: "Formato Fracionário", cat: "Técnico", definition: "Formato tradicional britânico que expressa o lucro em relação ao stake. A odd 3/1 significa que para cada R$1 apostado o lucro é R$3, totalizando R$4 de retorno." },
  { term: "Plataforma Responsiva", cat: "Técnico", definition: "Interface que se adapta automaticamente ao tamanho de qualquer dispositivo (computador, tablet ou smartphone) sem perda de funcionalidade ou qualidade visual." },
  { term: "Provedor de Jogos", cat: "Técnico", definition: "Empresa especializada no desenvolvimento de jogos para cassinos online. Responsável pela qualidade gráfica, mecânicas, segurança e certificação dos títulos oferecidos pelas plataformas." },
  { term: "RNG (Gerador de Números Aleatórios)", cat: "Técnico", definition: "Sistema tecnológico que garante que os resultados dos jogos de cassino online sejam completamente aleatórios e imprevisíveis, assegurando justiça e imparcialidade." },
  { term: "RTP (Return to Player)", cat: "Técnico", definition: "Taxa de Retorno ao Jogador, em percentual, que indica quanto um jogo devolve em prêmios ao longo do tempo. Um RTP de 96% significa que R$96 de cada R$100 apostados são devolvidos como prêmio." },
  { term: "Vapor", cat: "Técnico", definition: "Queda rápida nas odds provocada por grande volume de apostas de jogadores profissionais. Indica que o mercado está ajustando a linha para refletir nova informação." },
  // CASSINO
  { term: "Bacará", cat: "Cassino", definition: "Jogo de cartas em que o apostador escolhe entre apostar na mão do jogador, do banqueiro ou no empate. Simples de jogar, com regras fixas que eliminam decisões complexas." },
  { term: "Blackjack", cat: "Cassino", definition: "Jogo de cartas em que o objetivo é chegar o mais próximo possível de 21 pontos sem ultrapassar, batendo a mão do crupiê. É um dos jogos de mesa com maior componente estratégico." },
  { term: "Crash Game", cat: "Cassino", definition: "Formato moderno de jogo em que um multiplicador cresce continuamente até 'crashar'. O jogador precisa retirar seus ganhos antes que isso aconteça, exigindo timing e decisão rápida." },
  { term: "Crupiê", cat: "Cassino", definition: "Profissional responsável por conduzir os jogos de mesa no cassino, seja presencialmente ou em transmissões ao vivo. Gerencia as apostas, distribui cartas e anuncia resultados." },
  { term: "Jackpot Progressivo", cat: "Cassino", definition: "Prêmio acumulado que cresce conforme os jogadores fazem apostas. Uma parcela de cada rodada alimenta o jackpot, que pode atingir valores muito elevados antes de ser ganho." },
  { term: "Jogo ao Vivo (Live Casino)", cat: "Cassino", definition: "Modalidade em que partidas são conduzidas por crupiês reais em estúdios transmitidos em tempo real. Combina a autenticidade do cassino físico com a comodidade do ambiente digital." },
  { term: "Jogos de Mesa", cat: "Cassino", definition: "Categoria clássica do cassino que inclui roleta, blackjack, bacará e pôquer. Cada modalidade possui regras próprias, diferentes limites de aposta e, em muitos casos, exige estratégia do jogador." },
  { term: "Modo Demo", cat: "Cassino", definition: "Versão gratuita de um jogo que permite ao usuário conhecer a mecânica e as regras sem arriscar dinheiro real. Ideal para iniciantes ou para testar um título antes de apostar de verdade." },
  { term: "Multiplicador", cat: "Cassino", definition: "Recurso presente em slots e crash games que multiplica o valor ganho por um fator definido. Pode ser ativado por símbolos especiais, rodadas bônus ou pelo próprio mecanismo do jogo." },
  { term: "Rodadas Grátis (Free Spins)", cat: "Cassino", definition: "Giros gratuitos em slots concedidos como bônus pela plataforma ou ativados por combinações especiais dentro do próprio jogo. Permitem jogar sem consumir o saldo real do jogador." },
  { term: "Roleta", cat: "Cassino", definition: "Jogo de mesa em que uma bola é lançada numa roda numerada e os apostadores preveem em qual número ou grupo de números ela vai parar. Uma das atrações mais tradicionais do cassino." },
  { term: "Slots", cat: "Cassino", definition: "Jogos de cassino baseados em rolos giratórios com diferentes temas, layouts e linhas de pagamento. São os jogos mais populares do cassino online pela simplicidade: basta girar e torcer pelos ganhos." },
  // INDICADORES (additional ones from document not yet in DB)
  { term: "Depósito / Saque", cat: "Financeiro", definition: "Operações financeiras na plataforma. O depósito adiciona saldo para apostar; o saque retira os ganhos para a conta do jogador. Plataformas modernas oferecem métodos como Pix para transações rápidas e seguras." },
];

// Filter out terms already in the dictionary
const toAdd = newTerms.filter(t => !existing.has(t.term.toLowerCase()));
console.log(`Adding ${toAdd.length} new terms (${newTerms.length - toAdd.length} already exist)`);

// Add to entries
const updatedEntries = [
  ...content.entries,
  ...toAdd.map(t => ({
    term: t.term,
    symbol: null,
    definition: t.definition,
    category: t.cat,
  }))
];

content.entries = updatedEntries;
await conn.query('UPDATE slides SET content=? WHERE id=7', [JSON.stringify(content)]);
console.log(`Dictionary now has ${updatedEntries.length} terms`);
await conn.end();
