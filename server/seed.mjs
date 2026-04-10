import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool(process.env.DATABASE_URL);
const db = drizzle(pool);

// We'll use raw SQL via pool directly since drizzle's insert doesn't support ON DUPLICATE KEY easily in mjs
const conn = await pool.getConnection();

async function run(sql, params = []) {
  await conn.execute(sql, params);
}

// ─── Trails ───────────────────────────────────────────────────────────────────
const trailsData = [
  { slug: "tbi-gente-cultura", title: "TBI Gente e Cultura", description: "Trilha de integração sobre a cultura, valores e jeito de trabalhar da Stellar Space.", icon: "Star", color: "#00C853", orderIndex: 0 },
  { slug: "tbi-dp", title: "TBI de DP", description: "Trilha de integração sobre Departamento Pessoal, benefícios e políticas de RH.", icon: "FileText", color: "#2979FF", orderIndex: 1 },
  { slug: "tbi-seguranca", title: "TBI de Segurança do Trabalho", description: "Trilha de integração sobre saúde, segurança e bem-estar no trabalho.", icon: "Shield", color: "#FF6D00", orderIndex: 2 },
];

for (const t of trailsData) {
  await run(
    "INSERT INTO trails (slug, title, description, icon, color, orderIndex, isActive) VALUES (?, ?, ?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description)",
    [t.slug, t.title, t.description, t.icon, t.color, t.orderIndex]
  );
}
console.log("✅ Trails inserted");

const [trailRows] = await conn.execute("SELECT id, slug FROM trails");
const trailMap = {};
for (const row of trailRows) trailMap[row.slug] = row.id;

// ─── Modules ──────────────────────────────────────────────────────────────────
const tbiGCModules = [
  { slug: "institucional", title: "Institucional", subtitle: "Quem Somos", description: "Conheça a Stellar Space, nossa missão, visão e o ecossistema que estamos construindo.", orderIndex: 0, pointsReward: 150, bonusPoints: 75, deadlineDays: 1, isComingSoon: 0 },
  { slug: "nossa-historia", title: "Nossa História", subtitle: "O que nos trouxe até aqui", description: "Uma jornada desde 2019 até hoje, com conquistas, prêmios e marcos que definiram quem somos.", orderIndex: 1, pointsReward: 150, bonusPoints: 75, deadlineDays: 1, isComingSoon: 0 },
  { slug: "nossos-valores", title: "Nossos Valores", subtitle: "O que acreditamos", description: "Os quatro pilares que guiam cada decisão, comportamento e conquista da nossa equipe.", orderIndex: 2, pointsReward: 150, bonusPoints: 75, deadlineDays: 1, isComingSoon: 0 },
  { slug: "cultura-ai-first", title: "Cultura AI First", subtitle: "Nosso Jeito de Trabalhar", description: "Como a inteligência artificial faz parte do nosso dia a dia e potencializa nossa atuação.", orderIndex: 3, pointsReward: 150, bonusPoints: 75, deadlineDays: 1, isComingSoon: 0 },
  { slug: "falando-de-negocio", title: "Falando de Negócio", subtitle: "Mercado iGaming", description: "Entenda o mercado de iGaming, Sportsbook e Cassino onde a Stellar Space atua.", orderIndex: 4, pointsReward: 150, bonusPoints: 75, deadlineDays: 1, isComingSoon: 0 },
  { slug: "organograma", title: "Organograma", subtitle: "Nossa Estrutura", description: "Conheça a estrutura organizacional da Stellar Space e a área de Gente e Cultura.", orderIndex: 5, pointsReward: 100, bonusPoints: 50, deadlineDays: 2, isComingSoon: 0 },
  { slug: "planejamento-estrategico", title: "Planejamento Estratégico", subtitle: "Para onde iremos", description: "Nossa visão de futuro, os pilares estratégicos e onde queremos chegar até 2030.", orderIndex: 6, pointsReward: 100, bonusPoints: 50, deadlineDays: 2, isComingSoon: 0 },
  { slug: "nossos-patrocinios", title: "Nossos Patrocínios", subtitle: "O que apoiamos no mercado", description: "As parcerias e patrocínios que reforçam nossa presença e propósito no mercado.", orderIndex: 7, pointsReward: 100, bonusPoints: 50, deadlineDays: 2, isComingSoon: 0 },
  { slug: "nossos-rituais", title: "Nossos Rituais", subtitle: "Nosso Jeito de Trabalhar", description: "Os rituais corporativos que nos mantêm alinhados, celebrando e evoluindo juntos.", orderIndex: 8, pointsReward: 100, bonusPoints: 50, deadlineDays: 2, isComingSoon: 0 },
  { slug: "nossos-canais", title: "Nossos Canais", subtitle: "Nosso Jeito de Trabalhar", description: "As ferramentas e canais de comunicação que usamos no dia a dia: Roam, Intranet e mais.", orderIndex: 9, pointsReward: 100, bonusPoints: 50, deadlineDays: 2, isComingSoon: 0 },
  { slug: "orientacoes-gerais", title: "Orientações Gerais", subtitle: "Nosso Jeito de Trabalhar", description: "Dress code, combinados, escritórios, canal de denúncia e tudo que você precisa saber.", orderIndex: 10, pointsReward: 100, bonusPoints: 50, deadlineDays: 3, isComingSoon: 0 },
];

const tbiDPModules = [
  { slug: "jornada-trabalho", title: "Jornada de Trabalho", subtitle: "Horários e Controle de Ponto", description: "Entenda sua jornada, tolerâncias, horas extras e como registrar corretamente seu ponto.", orderIndex: 0, pointsReward: 150, bonusPoints: 75, deadlineDays: 3, isComingSoon: 1 },
  { slug: "salario-beneficios", title: "Salário e Benefícios", subtitle: "O que você tem direito", description: "Tudo sobre pagamento, adiantamento, vale alimentação, transporte e outros benefícios.", orderIndex: 1, pointsReward: 150, bonusPoints: 75, deadlineDays: 3, isComingSoon: 1 },
  { slug: "saude-bem-estar", title: "Saúde e Bem-Estar", subtitle: "Cuidando de você", description: "Plano de saúde, odontológico, telemedicina, terapia e outros benefícios de bem-estar.", orderIndex: 2, pointsReward: 100, bonusPoints: 50, deadlineDays: 3, isComingSoon: 1 },
  { slug: "ausencias-atestados", title: "Ausências e Atestados", subtitle: "Regras e Procedimentos", description: "Como proceder com atestados médicos, ausências permitidas e afastamentos.", orderIndex: 3, pointsReward: 100, bonusPoints: 50, deadlineDays: 3, isComingSoon: 1 },
];

const tbiSegModules = [
  { slug: "saude-seguranca-trabalho", title: "Saúde e Segurança", subtitle: "Nossa Missão", description: "Entenda como a empresa garante um ambiente seguro e saudável para todos.", orderIndex: 0, pointsReward: 150, bonusPoints: 75, deadlineDays: 3, isComingSoon: 1 },
  { slug: "ergonomia", title: "Ergonomia", subtitle: "Seu Bem-Estar no Trabalho", description: "Dicas e orientações para manter uma postura correta e evitar lesões.", orderIndex: 1, pointsReward: 100, bonusPoints: 50, deadlineDays: 3, isComingSoon: 1 },
  { slug: "emergencias-acidentes", title: "Emergências e Acidentes", subtitle: "Como Agir", description: "Procedimentos em caso de acidente de trabalho e situações de emergência.", orderIndex: 2, pointsReward: 100, bonusPoints: 50, deadlineDays: 3, isComingSoon: 1 },
];

const allModules = [
  ...tbiGCModules.map(m => ({ ...m, trailSlug: "tbi-gente-cultura" })),
  ...tbiDPModules.map(m => ({ ...m, trailSlug: "tbi-dp" })),
  ...tbiSegModules.map(m => ({ ...m, trailSlug: "tbi-seguranca" })),
];

for (const m of allModules) {
  await run(
    "INSERT INTO modules (trailId, slug, title, subtitle, description, orderIndex, pointsReward, bonusPoints, deadlineDays, isComingSoon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=VALUES(title)",
    [trailMap[m.trailSlug], m.slug, m.title, m.subtitle, m.description, m.orderIndex, m.pointsReward, m.bonusPoints, m.deadlineDays, m.isComingSoon]
  );
}
console.log("✅ Modules inserted");

const [moduleRows] = await conn.execute("SELECT id, slug FROM modules");
const moduleMap = {};
for (const row of moduleRows) moduleMap[row.slug] = row.id;

// ─── Helper to insert slides ───────────────────────────────────────────────────
async function insertSlides(moduleSlug, slidesArr) {
  const moduleId = moduleMap[moduleSlug];
  if (!moduleId) { console.warn("Module not found:", moduleSlug); return; }
  for (const s of slidesArr) {
    await run(
      "INSERT INTO slides (moduleId, orderIndex, title, content, betinhaSpeech, layout) VALUES (?, ?, ?, ?, ?, ?)",
      [moduleId, s.orderIndex, s.title || null, s.content, s.betinhaSpeech || null, s.layout || "default"]
    );
  }
}

// ─── Slides: Institucional ─────────────────────────────────────────────────────
await insertSlides("institucional", [
  { orderIndex: 0, title: "Bem-vindo à Stellar Space!", content: "Que incrível ter você aqui! Hoje começa uma nova jornada — e eu, Betinha, vou ser sua guia nessa aventura. Prepare-se para conhecer tudo sobre a Stellar Space, nossa cultura e nosso jeito único de trabalhar.", betinhaSpeech: "Oi! Eu sou a Betinha, e estou super animada para te receber na Stellar Space! Você faz parte agora de um time incrível. Vamos juntos nessa jornada?", layout: "highlight" },
  { orderIndex: 1, title: "Quem é a Stellar Space?", content: "A Stellar Space é uma holding do setor de GamingTech que desenvolve e integra tecnologia para operações de iGaming. Operamos as marcas EstrelaBet e Vupi. Somos muito mais do que uma casa de apostas — somos um ecossistema completo.", betinhaSpeech: "A Stellar Space é uma holding que une tecnologia de ponta, dados inteligentes e entretenimento responsável. Somos um ecossistema, não apenas uma empresa!", layout: "default" },
  { orderIndex: 2, title: "Nosso Ecossistema", content: "Combinamos quatro pilares fundamentais:\n\n• **Tecnologia de ponta**: IA, streaming integrado (Betvision), arquitetura escalável\n• **Dados e inteligência**: KYC biométrico, prevenção à lavagem de dinheiro\n• **Entretenimento responsável**: jogo responsável é parte do produto\n• **Performance com propósito**: crescimento sustentável e conformidade total", betinhaSpeech: "Olha que combinação poderosa! Tecnologia, dados, responsabilidade e performance. Esses são os pilares que nos fazem únicos no mercado.", layout: "list" },
  { orderIndex: 3, title: "Somos Um Só", content: "A Stellar Space é um ecossistema que nasce para redefinir o entretenimento digital. É o que nos conecta como um só time, um só propósito, um único norte, uma só cultura — tornando-nos ainda mais fortes.", betinhaSpeech: "Sabe o que mais me emociona? Somos um só! Um time, um propósito, uma cultura. E agora você faz parte disso também!", layout: "quote" },
  { orderIndex: 4, title: "Nem o céu é o limite!", content: "A Stellar Space acredita que o futuro é construído com ambição, inovação e trabalho em equipe. Nossa missão é transformar o mercado de entretenimento digital no Brasil e além.", betinhaSpeech: "Nem o céu é o limite para o que vem por aí! Estamos apenas começando, e você chegou na hora certa para fazer parte dessa história.", layout: "highlight" },
]);
console.log("✅ Slides: Institucional");

// ─── Slides: Nossa História ────────────────────────────────────────────────────
await insertSlides("nossa-historia", [
  { orderIndex: 0, title: "Uma história que começou com uma brincadeira", content: "A ideia da empresa nasceu de uma brincadeira após um almoço. O primeiro lucro semanal foi de R$ 100,00. O nome já foi MetroBet, depois CanUBet, e só em 2020 virou EstrelaBet.", betinhaSpeech: "Você sabia que a Stellar Space nasceu de uma brincadeira depois de um almoço? Às vezes as melhores ideias surgem nos momentos mais inesperados!", layout: "highlight" },
  { orderIndex: 1, title: "2019 — O Começo", content: "Nasce a EstrelaBet, fundada pelo antigo grupo Metropolitan, conquistando seu lugar no mercado de apostas. A expansão inicial foi patrocinando bares e pequenos butecos em Belo Horizonte.", betinhaSpeech: "Em 2019, tudo começou. Patrocinando barzinhos em BH, a EstrelaBet dava seus primeiros passos. Quem diria que dali nasceria um gigante!", layout: "default" },
  { orderIndex: 2, title: "2021 — Crescimento", content: "Ganhamos mais força no mercado brasileiro com vários patrocínios. Nosso primeiro 'milhão' em turnover aconteceu em março de 2021, dois anos após o lançamento.", betinhaSpeech: "Em 2021, o primeiro milhão! Que conquista incrível. E foi também quando começamos a ganhar força com patrocínios importantes.", layout: "default" },
  { orderIndex: 3, title: "2022 — Prêmios e Reconhecimento", content: "A EstrelaBet evolui a plataforma, alcança milhões de usuários e inicia parceria com o maior Streamer do Brasil, Casimiro Miguel. Ganha o SBC Awards 2022 e o Brazilian iGaming Awards 2022.", betinhaSpeech: "2022 foi épico! Casimiro Miguel como parceiro, prêmios internacionais e milhões de usuários. A EstrelaBet estava voando alto!", layout: "default" },
  { orderIndex: 4, title: "2023 — Pioneirismo", content: "Nos tornamos a única marca do segmento a apoiar a Copa do Mundo de Futebol Feminina. Criamos o primeiro jogo autoral de cassino. Nosso jogo Stellar foi o primeiro de cassino online a aparecer em uma camisa de futebol.", betinhaSpeech: "Em 2023, fomos pioneiros de várias formas! Apoiamos o futebol feminino, criamos nosso próprio jogo e marcamos presença nas camisas de futebol. Que orgulho!", layout: "list" },
  { orderIndex: 5, title: "2024 — Regulamentação e Excelência", content: "Somos habilitadas pelo Governo Federal para operar no Brasil. Conquistamos o Selo RA1000 e somos indicados ao prêmio do Reclame Aqui. SBC Summit — Melhor operadora de apostas esportivas 2024.", betinhaSpeech: "Em 2024, a regulamentação chegou e a gente estava pronta! Habilitadas pelo governo e com o Selo RA1000, mostramos que somos referência em qualidade.", layout: "default" },
  { orderIndex: 6, title: "2025 — Stellar Space", content: "Recebemos a licença definitiva para operar no Brasil. Integramos a marca VUPI ao nosso portfólio. Nos apresentamos ao mercado como Stellar Space — uma holding que une forças para transformar o entretenimento digital.", betinhaSpeech: "E chegamos a 2025 como Stellar Space! Com licença definitiva, a VUPI no time e um futuro brilhante pela frente. E você faz parte dessa nova fase!", layout: "highlight" },
  { orderIndex: 7, title: "Nossos Prêmios", content: "Uma trajetória de reconhecimento:\n\n• 2022: Estrela em Ascensão, Brazilian iGaming Awards — Operadora do Ano\n• 2023: Sigma — Operadora brasileira do ano, Prêmio Prata Work Of Purpose (NY)\n• 2024: SBC Summit — Melhor operadora, Primeiro Selo RA1000 do setor\n• 2025: BIS Awards — Melhor Atendimento, Melhor Ação de Combate à Ludopatia", betinhaSpeech: "Olha essa lista de prêmios! Cada um deles representa o trabalho duro de todo o time. E quem sabe o próximo prêmio não vem com a sua contribuição?", layout: "list" },
]);
console.log("✅ Slides: Nossa História");

// ─── Slides: Nossos Valores ────────────────────────────────────────────────────
await insertSlides("nossos-valores", [
  { orderIndex: 0, title: "O que acreditamos", content: "Os valores nascem da essência. O que sentimos como verdade ganha forma e direção. Nossa identidade se traduz em quatro princípios claros e acionáveis que guiam cada decisão.", betinhaSpeech: "Valores não são palavras em uma parede. São o que guia cada decisão, cada atitude, cada conquista. Vamos conhecer os nossos?", layout: "highlight" },
  { orderIndex: 1, title: "Ambição", content: "Acreditamos na força da ambição como motor da grandeza. Não buscamos ser os maiores por vaidade, mas os melhores por propósito.\n\nFazemos isso com honestidade, transparência e respeito. Não se trata de ganância, mas de fome por evolução — curiosidade e inquietude que fazem crescer.", betinhaSpeech: "Ambição aqui não é sobre ego. É sobre querer mais impacto, mais aprendizado, mais conquistas — sempre com valores. É essa fome saudável de evoluir que nos move!", layout: "default" },
  { orderIndex: 2, title: "Sonhar Grande", content: "Sonhamos grande e acreditamos no impossível, mas sempre com os pés no chão. Sabemos onde queremos chegar e trabalhamos com foco, disciplina e realismo.\n\nSonhar pequeno dá o mesmo trabalho que sonhar grande, por isso escolhemos o impossível — sem perder a consciência do que precisa ser feito para chegar lá.", betinhaSpeech: "Sonhar pequeno dá o mesmo trabalho que sonhar grande! Então por que não ir pelo impossível? A EstrelaBet nasceu de um sonho ousado — e continua crescendo por isso.", layout: "quote" },
  { orderIndex: 3, title: "Accountability", content: "Nada vence a persistência e o trabalho duro. Acreditamos que o verdadeiro sucesso nasce quando cada pessoa assume suas responsabilidades e entrega mais do que promete.\n\nAqui, você é o que você faz e o resultado que você gera. Somos incansáveis, focados e comprometidos com o resultado.", betinhaSpeech: "Accountability é sobre ser dono do seu trabalho. Não tem desculpa, não tem jogo de empurra. Você assume, entrega e vai além do esperado. Simples assim!", layout: "default" },
  { orderIndex: 4, title: "Juntos Somos Mais Fortes", content: "Juntos, somos mais fortes. Um time de pessoas ambiciosas só funciona com lealdade e confiança. Somos uma tropa que joga pelo mesmo objetivo: o cliente.\n\nCelebramos as vitórias juntos, enfrentamos os desafios lado a lado e sabemos que as maiores conquistas acontecem quando cada um faz a sua parte para o time vencer.", betinhaSpeech: "Esse é o meu valor favorito! Porque de nada adianta ser incrível sozinho. A magia acontece quando o time inteiro joga junto. E agora você é parte desse time!", layout: "highlight" },
]);
console.log("✅ Slides: Nossos Valores");

// ─── Slides: Cultura AI First ──────────────────────────────────────────────────
await insertSlides("cultura-ai-first", [
  { orderIndex: 0, title: "Cultura AI First", content: "Na Stellar Space, a inteligência artificial não é uma ferramenta opcional — é parte do nosso DNA. Adotamos uma cultura AI First para transformar a forma como trabalhamos.", betinhaSpeech: "Aqui a gente não só fala de IA — a gente vive a IA! É parte do nosso jeito de trabalhar, e você vai adorar como isso torna tudo mais ágil e inteligente.", layout: "highlight" },
  { orderIndex: 1, title: "Nossos Objetivos com IA", content: "• **Tornar a IA parte do dia a dia**, de forma segura e governada\n• **Automatizar o que é repetitivo** com TESS AI e Make.com\n• **Aumentar produtividade** e liberar tempo para o que é estratégico\n• **Fortalecer nossas entregas** com equipes mais ágeis e inteligentes\n\n**Human in Control** — a IA potencializa, mas a decisão é sempre humana.", betinhaSpeech: "O objetivo não é substituir pessoas — é liberá-las para fazer o que realmente importa! A IA cuida do repetitivo, e você foca no estratégico. Que combinação!", layout: "list" },
  { orderIndex: 2, title: "TESS AI — Nossa Aliada", content: "A TESS AI é nossa principal ferramenta de inteligência artificial. Com ela:\n\n• Criamos fluxos automáticos para eliminar tarefas repetitivas e manuais\n• Desenvolvemos copilotos internos (assistentes de IA personalizados) para diferentes áreas\n• Integramos com Make.com para conectar plataformas do dia a dia", betinhaSpeech: "A TESS AI é como ter uma assistente superpoderosa! Ela automatiza o que é chato e repetitivo, para que você possa focar no que realmente faz diferença.", layout: "default" },
  { orderIndex: 3, title: "Workspaces por Área", content: "A TESS AI tem workspaces específicos para cada área:\n\n• Administrativo • Diretoria • Financeiro\n• Gente e Cultura • Jurídico e Compliance\n• Marketing • Operações • Tecnologia e Produtos\n\nCada área tem seus próprios copilotos e automações personalizadas.", betinhaSpeech: "Cada área tem seu próprio espaço na TESS AI, com ferramentas pensadas para as necessidades específicas do time. Acesse o workspace da sua área e explore!", layout: "list" },
  { orderIndex: 4, title: "Make.com — Conectando Tudo", content: "O Make.com é nosso automatizador que trabalha junto com a TESS AI e outros sistemas. Disponível para todos, ele conecta e integra plataformas do dia a dia como Microsoft, Power BI, HubSpot e Salesforce.", betinhaSpeech: "O Make.com é o maestro das integrações! Ele conecta todos os sistemas que usamos e faz tudo funcionar junto de forma automática. Poderoso, né?", layout: "default" },
]);
console.log("✅ Slides: Cultura AI First");

// ─── Slides: Falando de Negócio ────────────────────────────────────────────────
await insertSlides("falando-de-negocio", [
  { orderIndex: 0, title: "O Mercado iGaming", content: "O iGaming é a indústria de jogos de apostas online. Ela reúne diversas modalidades de entretenimento digital, como cassinos virtuais, poker, bingo, roleta, blackjack e muito mais. É o mercado no qual a Stellar Space atua.", betinhaSpeech: "Bem-vindo ao mundo do iGaming! É um mercado gigante, cheio de inovação e tecnologia. E a Stellar Space está na vanguarda de tudo isso.", layout: "highlight" },
  { orderIndex: 1, title: "Sportsbook — Apostas Esportivas", content: "O Sportsbook é o ambiente de apostas esportivas dentro da plataforma. Os usuários podem apostar em resultados de jogos e competições esportivas como futebol, basquete, vôlei, tênis e muito mais.\n\nExistem opções de apostas **pré-jogo** (antes do evento) e **ao vivo** (com o jogo em andamento), além de apostas combinadas e especiais.", betinhaSpeech: "O Sportsbook é onde a emoção do esporte encontra a tecnologia! Você pode apostar em quase tudo — de quem vence ao número de gols. É muito mais do que uma simples aposta.", layout: "default" },
  { orderIndex: 2, title: "Cassino Online", content: "O Cassino online traz para o ambiente digital os jogos clássicos dos cassinos físicos: roleta, blackjack, caça-níqueis (slots) e outros jogos de cartas ou mesa.\n\nÉ um espaço voltado para entretenimento, com jogos rápidos, fáceis de aprender e que oferecem diferentes níveis de desafio e emoção — sempre com foco em uma experiência divertida e segura.", betinhaSpeech: "O Cassino online é pura diversão digital! Roleta, blackjack, slots — tudo com a segurança e tecnologia da Stellar Space. Uma experiência completa para o usuário.", layout: "default" },
  { orderIndex: 3, title: "Entretenimento Responsável", content: "Na Stellar Space, o jogo responsável é parte do produto, não apenas um requisito legal. Trabalhamos com:\n\n• KYC biométrico para verificação de identidade\n• Ferramentas de autoexclusão e limites de depósito\n• Prevenção à lavagem de dinheiro\n• Suporte a jogadores com comportamento de risco", betinhaSpeech: "Jogo responsável não é só obrigação — é parte do nosso produto. Cuidamos dos nossos usuários porque acreditamos que entretenimento saudável é o único caminho.", layout: "list" },
]);
console.log("✅ Slides: Falando de Negócio");

// ─── Slides: Organograma ───────────────────────────────────────────────────────
await insertSlides("organograma", [
  { orderIndex: 0, title: "Nossa Estrutura Organizacional", content: "A Stellar Space é liderada pelo CEO João Gerçossimo e organizada em grandes diretorias: RH, Tecnologia, Jurídico, Financeiro, Operações & Vupi, Comercial, Expansão e CX, e Branding.", betinhaSpeech: "Vamos conhecer como a Stellar Space está organizada! Cada área tem um papel fundamental, e todas trabalham juntas em direção ao mesmo objetivo.", layout: "default" },
  { orderIndex: 1, title: "Área de Gente e Cultura", content: "A área de Gente e Cultura é dividida em três pilares:\n\n• **Gente**: Comunicação, DP, Talent Acquisition, RH\n• **People Analytics**: Análise de dados de pessoas\n• **Gestão e Resultados**: Gestão de performance e resultados\n\nLiderada pelo Head Leandro Magalhães.", betinhaSpeech: "A área de Gente e Cultura é quem cuida de você! Desde sua chegada até seu desenvolvimento, estamos aqui para apoiar sua jornada na Stellar Space.", layout: "list" },
  { orderIndex: 2, title: "Nosso Jeito de Cuidar", content: "O ciclo completo de cuidado com as pessoas:\n\n• **Conectar**: Atração, Seleção, Onboarding, Marca Empregadora\n• **Desenvolver**: Feedback, PDI, Treinamentos, Clima e Engajamento\n• **Realizar**: Gestão de Metas, Governança, People Analytics\n• **Reconhecer**: Gestão de Performance, Remuneração, Reconhecimentos", betinhaSpeech: "Olha que ciclo completo! Desde quando você entra até quando você cresce e é reconhecido — a Gente e Cultura está em cada etapa da sua jornada.", layout: "list" },
]);
console.log("✅ Slides: Organograma");

// ─── Slides: Planejamento Estratégico ─────────────────────────────────────────
await insertSlides("planejamento-estrategico", [
  { orderIndex: 0, title: "Planejamento feito. Direção traçada.", content: "O plano dos próximos 5 anos está em curso e você faz parte dele. A Stellar Space tem uma visão clara de onde quer chegar e como vai chegar lá.", betinhaSpeech: "O plano está feito, a direção está traçada. E o mais importante: você faz parte desse plano! Vamos ver onde estamos indo juntos?", layout: "highlight" },
  { orderIndex: 1, title: "Nossa Meta para 2030", content: "Atingiremos **USD 1 bilhão de NGR no ano de 2030**, mantendo rentabilidade, focando em segmentos com alto potencial, experiência e presença em canais diversificados.", betinhaSpeech: "Um bilhão de dólares até 2030! Esse é o nosso norte. Ambicioso? Sim. Possível? Absolutamente. E cada pessoa do time contribui para chegar lá.", layout: "quote" },
  { orderIndex: 2, title: "Pilares Estratégicos", content: "Nossa estratégia se apoia em pilares sólidos:\n\n• Expansão de mercado e novos segmentos\n• Tecnologia e inovação contínua\n• Experiência do cliente como diferencial\n• Presença em múltiplos canais\n• Rentabilidade sustentável", betinhaSpeech: "Esses pilares são como as fundações de um prédio. Cada um é essencial para que a estrutura toda se sustente e cresça de forma sólida.", layout: "list" },
  { orderIndex: 3, title: "Você Faz Parte do Plano", content: "Cada colaborador da Stellar Space contribui diretamente para o atingimento dos objetivos estratégicos. Seu trabalho, suas metas e seu desenvolvimento estão alinhados com o crescimento da empresa.", betinhaSpeech: "Não é só discurso! Você, com seu trabalho diário, está contribuindo para que a Stellar Space chegue ao bilhão em 2030. Que responsabilidade incrível, né?", layout: "highlight" },
]);
console.log("✅ Slides: Planejamento Estratégico");

// ─── Slides: Nossos Patrocínios ────────────────────────────────────────────────
await insertSlides("nossos-patrocinios", [
  { orderIndex: 0, title: "O que apoiamos no mercado", content: "A Stellar Space acredita no poder do patrocínio como forma de conectar a marca com o que as pessoas amam. Apoiamos esporte, cultura e entretenimento com propósito.", betinhaSpeech: "Patrocínio para a gente não é só logo em camisa. É sobre apoiar o que as pessoas amam e estar presente nos momentos que importam para elas.", layout: "highlight" },
  { orderIndex: 1, title: "Zé Roberto — Embaixador EstrelaBet", content: "Zé Roberto é uma lenda do futebol brasileiro, ídolo da Seleção e de grandes clubes na Europa e no Brasil. Ele representa a EstrelaBet com propriedade: história vencedora, disciplina e respeito dentro e fora de campo.", betinhaSpeech: "Zé Roberto como embaixador não é por acaso! Ele representa exatamente o que acreditamos: história vencedora, disciplina e respeito. Valores que vivemos todos os dias.", layout: "default" },
  { orderIndex: 2, title: "Casimiro Miguel — Parceria Histórica", content: "Em 2022, a EstrelaBet iniciou parceria com Casimiro Miguel, o maior Streamer do Brasil. Uma parceria que conectou a marca com milhões de jovens e consolidou nossa presença no entretenimento digital.", betinhaSpeech: "Casimiro e a EstrelaBet foi uma das parcerias mais marcantes do mercado! Conectamos a marca com uma geração inteira de fãs de esporte e entretenimento.", layout: "default" },
  { orderIndex: 3, title: "Copa do Mundo Feminina 2023", content: "Nos tornamos a única marca do segmento a apoiar a Copa do Mundo de Futebol Feminina em 2023. Uma decisão que reflete nosso compromisso com a diversidade, inclusão e o esporte feminino.", betinhaSpeech: "Apoiar a Copa do Mundo Feminina foi um orgulho! Fomos os únicos do setor a fazer isso. Porque acreditamos que o esporte feminino merece o mesmo palco que o masculino.", layout: "highlight" },
]);
console.log("✅ Slides: Nossos Patrocínios");

// ─── Slides: Nossos Rituais ────────────────────────────────────────────────────
await insertSlides("nossos-rituais", [
  { orderIndex: 0, title: "Reconhecer e celebrar faz parte do nosso jogo!", content: "Na Stellar Space, temos rituais corporativos que nos mantêm alinhados, conectados e celebrando as conquistas juntos. Esses momentos são fundamentais para nossa cultura.", betinhaSpeech: "Rituais não são burocracia — são os momentos que nos conectam como time! Vamos conhecer os rituais que fazem a Stellar Space ser especial.", layout: "highlight" },
  { orderIndex: 1, title: "All Hands", content: "Alinhamento mensal estratégico de metas, projetos, resultados e reconhecimento com a empresa inteira. É o momento em que todos estão na mesma página sobre onde estamos e para onde vamos.", betinhaSpeech: "O All Hands é o momento em que toda a empresa se reúne! Metas, resultados, reconhecimentos — tudo compartilhado com transparência para todos.", layout: "default" },
  { orderIndex: 2, title: "Stellar Summit", content: "Encontro anual presencial em Belo Horizonte para fortalecer a cultura, alinhar estratégia e direcionar os próximos passos da empresa. Um momento único de conexão e celebração.", betinhaSpeech: "O Stellar Summit é o evento do ano! Todo mundo em BH, fortalecendo laços, alinhando estratégia e celebrando conquistas. É inesquecível!", layout: "default" },
  { orderIndex: 3, title: "Shaking Hands", content: "O Shaking Hands é um ritual semestral em que a liderança se alinha sobre onde já chegamos, onde estamos agora e, principalmente, para onde vamos. Aqui consolidamos decisões, priorizamos alavancas estratégicas e garantimos que toda a companhia avance na mesma direção.", betinhaSpeech: "O Shaking Hands é onde a liderança olha para o passado, o presente e o futuro. É a bússola semestral que garante que todos estamos caminhando na mesma direção.", layout: "default" },
  { orderIndex: 4, title: "Ciclo de Performance", content: "Nosso ciclo de performance acontece duas vezes por ano:\n\n• **1º Ciclo**: Janeiro de cada ano\n• **2º Ciclo**: Julho de cada ano\n\nInclui: Planejamento de metas, acompanhamento periódico, avaliação, comitê de performance, feedback e PDI.", betinhaSpeech: "O ciclo de performance é a sua bússola de crescimento! Duas vezes por ano, você define metas, acompanha seu progresso e recebe feedback para evoluir.", layout: "list" },
]);
console.log("✅ Slides: Nossos Rituais");

// ─── Slides: Nossos Canais ─────────────────────────────────────────────────────
await insertSlides("nossos-canais", [
  { orderIndex: 0, title: "Nossos Canais de Comunicação", content: "Na Stellar Space, usamos canais específicos para cada tipo de comunicação. Conhecê-los é essencial para se manter conectado e informado no dia a dia.", betinhaSpeech: "Comunicação é a base de tudo! Vamos conhecer os canais que usamos para nos manter conectados, alinhados e informados no dia a dia.", layout: "highlight" },
  { orderIndex: 1, title: "Ro.am — Nosso Escritório Virtual", content: "O Ro.am é nosso escritório de trabalho virtual e a ferramenta corporativa de comunicação interna. Mantenha-se sempre disponível na plataforma ao longo do dia.\n\n**Combinados importantes:**\n• Mantenha seu perfil atualizado com foto, nome completo, cargo e área\n• Se sair para reunião ou almoço, clique em 'Exit' e registre seu horário de retorno", betinhaSpeech: "O Ro.am é onde a gente se encontra virtualmente! É nosso escritório digital, onde você pode ver quem está disponível e se comunicar com o time em tempo real.", layout: "default" },
  { orderIndex: 2, title: "Canais Essenciais no Roam", content: "• **Stellar News**: Comunicação do dia a dia, trocas rápidas e avisos operacionais\n• **All Hands**: Canal oficial de comunicados institucionais (leitura obrigatória)\n• **Comunicados - Lideranças**: Exclusivo para líderes — decisões e alinhamentos estratégicos\n• **PJ**: Canal exclusivo para Prestadores de Serviço", betinhaSpeech: "Cada canal tem seu propósito! O All Hands é leitura obrigatória para todos. O Stellar News é para o dia a dia. E cada área tem seus canais específicos.", layout: "list" },
  { orderIndex: 3, title: "Intranet — Sua Base de Conhecimento", content: "A Intranet é o repositório central de informações da Stellar Space. Lá você encontra políticas, procedimentos, cartilhas de boas práticas, treinamentos gravados e muito mais. Acesse regularmente para se manter atualizado.", betinhaSpeech: "A Intranet é como a nossa enciclopédia interna! Tudo que você precisa saber sobre políticas, benefícios e procedimentos está lá. Salva nos favoritos!", layout: "default" },
  { orderIndex: 4, title: "@teamestrelado — Instagram Interno", content: "O @teamestrelado é nosso Instagram interno, onde você encontra:\n\n• Bastidores do dia a dia e da rotina dos times\n• Divulgação de eventos internos e rituais\n• Registros de conquistas e celebrações\n• Interações espontâneas e enquetes\n• Reposts de conteúdos dos próprios colaboradores", betinhaSpeech: "O @teamestrelado é onde a gente mostra quem somos de verdade! Bastidores, conquistas, momentos especiais — siga e faça parte dessa comunidade!", layout: "list" },
  { orderIndex: 5, title: "Betinha — Sua Assistente Virtual", content: "E claro, você também pode contar comigo, a Betinha! Sou a assistente virtual da Stellar Space, sempre pronta para te ajudar com dúvidas, informações e guiar seu aprendizado na plataforma de treinamentos.", betinhaSpeech: "Oi! Sou eu de novo, a Betinha! Estou sempre aqui para te ajudar. Qualquer dúvida sobre os treinamentos, sobre a empresa ou sobre como navegar na plataforma — pode contar comigo!", layout: "highlight" },
]);
console.log("✅ Slides: Nossos Canais");

// ─── Slides: Orientações Gerais ────────────────────────────────────────────────
await insertSlides("orientacoes-gerais", [
  { orderIndex: 0, title: "Orientações Gerais", content: "Aqui você encontra tudo que precisa saber para o seu dia a dia na Stellar Space: dress code, combinados importantes, escritórios e canais de suporte.", betinhaSpeech: "Chegamos ao último módulo do TBI Gente e Cultura! Aqui vou te passar as orientações práticas do dia a dia. Fique atento, são informações importantes!", layout: "highlight" },
  { orderIndex: 1, title: "Dress Code", content: "Por aqui, você pode se vestir da maneira que se sentir mais confortável! Temos uma camisa corporativa que é brinde — mas não é de uso obrigatório.\n\n**Única regra**: Não vale usar roupas com logo da concorrência.", betinhaSpeech: "Boa notícia: dress code livre! Vista-se como se sentir bem. A única regra é não usar logo da concorrência. Simples assim!", layout: "default" },
  { orderIndex: 2, title: "Combinados Importantes", content: "Alguns combinados essenciais:\n\n• **Confidencialidade**: Não exponha dados de clientes, fornecedores, senhas ou planejamento estratégico\n• **Representação**: Não fale em nome da empresa para terceiros ou imprensa sem autorização\n• **Plataforma**: Não realize apostas na plataforma www.estrelabet.bet.br", betinhaSpeech: "Esses combinados são super importantes! Confidencialidade e ética são inegociáveis aqui. Cuide das informações da empresa como se fossem suas.", layout: "list" },
  { orderIndex: 3, title: "Nossos Escritórios", content: "**Belo Horizonte**: Acesso por crachá (pessoal e intransferível) e reconhecimento facial. Em caso de perda: taxa de R$ 40,00. Em caso de furto/roubo: apresente o BO para emissão gratuita.\n\n**São Paulo**: Acesso por reconhecimento facial. Em caso de dúvidas, contate o Time de Facilities.", betinhaSpeech: "Temos escritórios em BH e São Paulo! O acesso é por crachá e reconhecimento facial. Cuide bem do seu crachá — a reposição tem custo!", layout: "default" },
  { orderIndex: 4, title: "Canal de Denúncia", content: "Tratamos todas as denúncias com imparcialidade e sigilo.\n\n**E-mail**: denuncia@intlmkt.com.br\n\nSe precisar, você pode também conversar com sua liderança ou com o time de Gente e Cultura. Ninguém precisa enfrentar situações difíceis sozinho.", betinhaSpeech: "O canal de denúncia existe para proteger você e todos do time. Qualquer situação de assédio, irregularidade ou problema ético — denuncie. Sua segurança é prioridade.", layout: "default" },
  { orderIndex: 5, title: "Parabéns! Você concluiu o TBI Gente e Cultura!", content: "Você agora conhece a Stellar Space de dentro para fora! Valores, história, cultura, estratégia, canais e orientações — você está pronto para começar essa jornada incrível.\n\nBem-vindo ao time!", betinhaSpeech: "PARABÉNS! Você concluiu o TBI Gente e Cultura! Agora você conhece nossa história, nossos valores e nosso jeito de trabalhar. Estou muito orgulhosa de você! Bem-vindo à família Stellar Space!", layout: "highlight" },
]);
console.log("✅ Slides: Orientações Gerais");

// ─── Badges ────────────────────────────────────────────────────────────────────
const badgesData = [
  { slug: "primeiro-passo", name: "Primeiro Passo", description: "Completou seu primeiro módulo", icon: "Footprints", color: "#4CAF50", condition: "complete_first_module" },
  { slug: "estrela-em-ascensao", name: "Estrela em Ascensão", description: "Completou 3 módulos", icon: "Star", color: "#FFC107", condition: "complete_3_modules" },
  { slug: "velocidade-da-luz", name: "Velocidade da Luz", description: "Completou um módulo dentro do prazo", icon: "Zap", color: "#2196F3", condition: "complete_on_time" },
  { slug: "mestre-do-quiz", name: "Mestre do Quiz", description: "Acertou 100% em um quiz", icon: "Trophy", color: "#9C27B0", condition: "perfect_quiz" },
  { slug: "trilha-completa", name: "Trilha Completa", description: "Completou toda a trilha TBI Gente e Cultura", icon: "Award", color: "#FF5722", condition: "complete_trail_tbi-gente-cultura" },
  { slug: "conhecedor-da-cultura", name: "Conhecedor da Cultura", description: "Completou os módulos de Valores e Cultura AI First", icon: "Heart", color: "#E91E63", condition: "complete_culture_modules" },
  { slug: "bem-vindo-ao-time", name: "Bem-vindo ao Time!", description: "Concluiu o onboarding completo", icon: "Users", color: "#00BCD4", condition: "complete_onboarding" },
  { slug: "pontuacao-500", name: "Acumulador", description: "Atingiu 500 pontos", icon: "Coins", color: "#FF9800", condition: "reach_500_points" },
];

for (const b of badgesData) {
  await run(
    "INSERT INTO badges (slug, name, description, icon, color, `condition`) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)",
    [b.slug, b.name, b.description, b.icon, b.color, b.condition]
  );
}
console.log("✅ Badges inserted");

console.log("\n🎉 Seed completo! Todos os dados foram inseridos com sucesso.");
conn.release();
await pool.end();
