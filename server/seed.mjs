/**
 * Seed completo da plataforma de Onboarding Stellar Gaming
 * Estrutura: Trilhas > Módulos > Capítulos > Slides
 * Perfis: todos | clt | pj | lideranca
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = await mysql.createConnection(process.env.DATABASE_URL);

async function clearAll() {
  await db.execute("SET FOREIGN_KEY_CHECKS = 0");
  await db.execute("TRUNCATE TABLE slides");
  await db.execute("TRUNCATE TABLE quiz_questions");
  await db.execute("TRUNCATE TABLE chapters");
  await db.execute("TRUNCATE TABLE modules");
  await db.execute("TRUNCATE TABLE trails");
  await db.execute("TRUNCATE TABLE badges");
  await db.execute("SET FOREIGN_KEY_CHECKS = 1");
  console.log("✅ Tabelas limpas");
}

async function insertTrail({ slug, title, description, icon, color, orderIndex }) {
  await db.execute(
    "INSERT INTO trails (slug, title, description, icon, color, isActive, orderIndex) VALUES (?,?,?,?,?,1,?) ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), color=VALUES(color), orderIndex=VALUES(orderIndex)",
    [slug, title, description, icon, color, orderIndex]
  );
  const [rows] = await db.execute("SELECT id FROM trails WHERE slug=?", [slug]);
  return rows[0].id;
}

async function insertModule({ trailId, slug, title, subtitle, description, orderIndex, pointsReward = 150, bonusPoints = 75, deadlineDays = 5, isComingSoon = false }) {
  await db.execute(
    "INSERT INTO modules (trailId, slug, title, subtitle, description, orderIndex, pointsReward, bonusPoints, deadlineDays, isActive, isComingSoon) VALUES (?,?,?,?,?,?,?,?,?,1,?) ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), description=VALUES(description), orderIndex=VALUES(orderIndex), isComingSoon=VALUES(isComingSoon)",
    [trailId, slug, title, subtitle, description, orderIndex, pointsReward, bonusPoints, deadlineDays, isComingSoon ? 1 : 0]
  );
  const [rows] = await db.execute("SELECT id FROM modules WHERE slug=?", [slug]);
  return rows[0].id;
}

async function insertChapter({ moduleId, slug, title, description, profileType = "todos", orderIndex }) {
  await db.execute(
    "INSERT INTO chapters (moduleId, slug, title, description, profileType, orderIndex, isActive) VALUES (?,?,?,?,?,?,1) ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), profileType=VALUES(profileType), orderIndex=VALUES(orderIndex)",
    [moduleId, slug, title, description, profileType, orderIndex]
  );
  const [rows] = await db.execute("SELECT id FROM chapters WHERE slug=?", [slug]);
  return rows[0].id;
}

async function insertSlides(moduleId, slides) {
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    await db.execute(
      "INSERT INTO slides (moduleId, orderIndex, title, content, betinhaSpeech, layout) VALUES (?,?,?,?,?,?)",
      [moduleId, i, s.title || null, s.content, s.betinhaSpeech || null, s.layout || "default"]
    );
  }
}

async function insertBadges() {
  const badges = [
    { slug: "primeiro-passo", name: "Primeiro Passo", description: "Completou o primeiro módulo da jornada", icon: "🚀", color: "#d9f22a" },
    { slug: "estrela-ascendente", name: "Estrela em Ascensão", description: "Completou 3 módulos com sucesso", icon: "⭐", color: "#FFD700" },
    { slug: "conhecimento-e-poder", name: "Conhecimento é Poder", description: "Acertou 100% em um quiz", icon: "🧠", color: "#00C853" },
    { slug: "velocidade-estelar", name: "Velocidade Estelar", description: "Completou um módulo antes do prazo", icon: "⚡", color: "#FF6B35" },
    { slug: "trilha-completa", name: "Trilha Completa", description: "Completou uma trilha inteira de Onboarding", icon: "🏆", color: "#d9f22a" },
    { slug: "cultura-stellar", name: "Cultura Stellar", description: "Completou a trilha de Gente e Cultura", icon: "🌟", color: "#9C27B0" },
    { slug: "born-to-lead", name: "Born to Lead", description: "Completou todos os módulos de Liderança", icon: "👑", color: "#FF4081" },
    { slug: "stellar-champion", name: "Stellar Champion", description: "Completou todas as trilhas de Onboarding", icon: "🏅", color: "#d9f22a" },
  ];
  for (const b of badges) {
    await db.execute(
      "INSERT INTO badges (slug, name, description, icon, color) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)",
      [b.slug, b.name, b.description, b.icon, b.color]
    );
  }
  console.log("✅ Conquistas (badges) inseridas");
}

// ─────────────────────────────────────────────────────────────────────────────
// TRILHA 1: GENTE E CULTURA
// ─────────────────────────────────────────────────────────────────────────────
async function seedGenteCultura() {
  const trailId = await insertTrail({
    slug: "gente-cultura",
    title: "Trilha de Onboarding: Gente e Cultura",
    description: "Conheça a Stellar Gaming, nossa história, valores, cultura e jeito de trabalhar.",
    icon: "Users",
    color: "#d9f22a",
    orderIndex: 1,
  });

  // ── MÓDULO 1: INSTITUCIONAL ──────────────────────────────────────────────
  const mod1 = await insertModule({
    trailId,
    slug: "institucional",
    title: "Módulo 1: Institucional",
    subtitle: "Boas-vindas e quem somos",
    description: "Conheça a Stellar Gaming, nossa história, prêmios e valores.",
    orderIndex: 1,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 3,
  });

  // Capítulo 1 — Boas-vindas Betinha e Vídeo do CEO (Todos)
  await insertChapter({
    moduleId: mod1,
    slug: "institucional-boas-vindas",
    title: "Capítulo 1: Boas-vindas Betinha e Vídeo do CEO",
    description: "Betinha apresenta a trilha e o que vem pela frente. CEO grava vídeo com a mensagem de boas-vindas e o espírito da Stellar.",
    profileType: "todos",
    orderIndex: 1,
  });

  // Capítulo 2 — Quem somos, Nossa história & Prêmios (Todos)
  await insertChapter({
    moduleId: mod1,
    slug: "institucional-historia-premios",
    title: "Capítulo 2: Quem Somos, Nossa História & Prêmios",
    description: "Origem em 23/04/2019 no Baião de Dois, BH. Linha do tempo 2019–2025. Marcas EstrelaBet e Vupi. Prêmios SIGMA, BiS, SBC.",
    profileType: "todos",
    orderIndex: 2,
  });

  // Capítulo 3 — Nossos Valores (Todos)
  await insertChapter({
    moduleId: mod1,
    slug: "institucional-valores",
    title: "Capítulo 3: Nossos Valores",
    description: "4 valores com frases-âncora, exemplos práticos, Faça/Evite. Manifesto 'Born to Lead. Built to Shine.'",
    profileType: "todos",
    orderIndex: 3,
  });

  // Capítulo 3 — Liderança (exclusivo)
  await insertChapter({
    moduleId: mod1,
    slug: "institucional-valores-lideranca",
    title: "Capítulo 3 (Liderança): Modelando e Cobrando os Valores",
    description: "Como modelar e cobrar os valores no time. Responsabilidade da liderança como guardiã da cultura.",
    profileType: "lideranca",
    orderIndex: 4,
  });

  // Capítulo 4 — Organograma & Patrocínios (Todos)
  await insertChapter({
    moduleId: mod1,
    slug: "institucional-organograma-patrocinios",
    title: "Capítulo 4: Organograma & Patrocínios",
    description: "Estrutura da Stellar Gaming (CEO + 8 diretorias). Patrocínios: clubes, e-sports, Copa do Mundo Feminina.",
    profileType: "todos",
    orderIndex: 5,
  });

  // Slides do Módulo 1
  await insertSlides(mod1, [
    {
      title: "Bem-vindo à Stellar Gaming! 🚀",
      content: "Seja muito bem-vindo(a) à **Stellar Gaming**!\n\nEsta é a sua Trilha de Onboarding — um caminho criado especialmente para você se sentir em casa desde o primeiro dia.\n\nAqui você vai conhecer nossa história, nossos valores, nossa cultura e o nosso jeito único de trabalhar.",
      betinhaSpeech: "Oi! Eu sou a Betinha, sua agente de Gente & Cultura! Que alegria ter você aqui! Vou te guiar por toda essa jornada. Vamos começar?",
      layout: "highlight",
    },
    {
      title: "Nascemos no Baião de Dois 🍛",
      content: "**23 de abril de 2019.** Um restaurante em Belo Horizonte, Minas Gerais.\n\nFoi ali, no Baião de Dois, que a Stellar Gaming nasceu — com uma ideia, muita coragem e o primeiro lucro de **R$ 149,42**.\n\nDe lá pra cá, construímos uma das maiores empresas de iGaming do Brasil.",
      betinhaSpeech: "Você sabia que a Stellar nasceu num restaurante? Isso mesmo! Em 2019, no Baião de Dois, em BH. E o primeiro lucro foi de R$149,42. Que começo incrível!",
      layout: "highlight",
    },
    {
      title: "Nossa Linha do Tempo 2019–2025",
      content: "**2019** — Fundação no Baião de Dois, BH. Lançamento da CanUBet.\n\n**2020** — Crescimento acelerado. Expansão da equipe.\n\n**2021** — Lançamento da **EstrelaBet**. Boom de usuários.\n\n**2022** — Patrocínios esportivos. Reconhecimento nacional.\n\n**2023** — Lançamento da **Vupi**. Expansão de portfólio.\n\n**2024** — Prêmios internacionais. Consolidação como líder.\n\n**2025** — **Stellar Gaming**: a marca que une tudo.",
      betinhaSpeech: "Olha que trajetória! De CanUBet para EstrelaBet, depois Vupi e agora Stellar Gaming. Em 6 anos, construímos algo gigante!",
      layout: "list",
    },
    {
      title: "Nossas Marcas",
      content: "A Stellar Gaming é a holding que une nossas marcas:\n\n🌟 **EstrelaBet** — A maior marca de apostas esportivas do Brasil\n\n🎮 **Vupi** — Plataforma de entretenimento e jogos\n\nJuntas, essas marcas alcançam milhões de brasileiros todos os dias.",
      betinhaSpeech: "EstrelaBet e Vupi — você provavelmente já ouviu falar delas! São as nossas marcas mais conhecidas, e agora você faz parte desse time!",
      layout: "default",
    },
    {
      title: "Nossos Prêmios 🏆",
      content: "A Stellar Gaming é reconhecida internacionalmente pela excelência:\n\n🥇 **SIGMA Awards** — Melhor operadora da América Latina\n\n🥇 **BiS Awards** — Inovação em iGaming\n\n🥇 **SBC Awards** — Destaque em apostas esportivas\n\nEsses prêmios refletem o trabalho de cada pessoa do nosso time — incluindo você!",
      betinhaSpeech: "SIGMA, BiS, SBC... Prêmios internacionais que mostram que a Stellar está no topo! E agora você faz parte dessa história premiada!",
      layout: "highlight",
    },
    {
      title: "Born to Lead. Built to Shine. ⭐",
      content: "Esse é o nosso manifesto. Não é só um slogan — é a forma como tomamos decisões, tratamos as pessoas e construímos o futuro.\n\nNa Stellar, acreditamos que **liderança não é cargo, é atitude**.",
      betinhaSpeech: "Born to Lead. Built to Shine. Arrepiou? Porque deveria! Esse manifesto define quem somos e como agimos aqui na Stellar.",
      layout: "quote",
    },
    {
      title: "Nosso Valor 1: Protagonismo",
      content: "**\"Eu sou o dono do problema e da solução.\"**\n\n✅ **Faça:** Tome iniciativa. Não espere ser chamado. Resolva.\n\n❌ **Evite:** Transferir responsabilidade. Dizer \"não é meu problema\".\n\n**Exemplo prático:** Identificou um erro num processo? Não apenas reporte — proponha a solução.",
      betinhaSpeech: "Protagonismo é o nosso primeiro valor! Aqui na Stellar, todo mundo é dono do problema E da solução. Nada de esperar alguém resolver por você!",
      layout: "default",
    },
    {
      title: "Nosso Valor 2: Excelência",
      content: "**\"Bom não é suficiente. Queremos extraordinário.\"**\n\n✅ **Faça:** Entregue com qualidade. Revise antes de enviar. Supere expectativas.\n\n❌ **Evite:** Entregar pela metade. Conformar-se com o mediano.\n\n**Exemplo prático:** Antes de enviar um relatório, pergunte: \"Isso é o melhor que posso fazer?\"",
      betinhaSpeech: "Excelência! Na Stellar, a gente não aceita o suficiente. A gente vai além. Sempre. É assim que construímos algo extraordinário.",
      layout: "default",
    },
    {
      title: "Nosso Valor 3: Colaboração",
      content: "**\"Juntos chegamos mais longe.\"**\n\n✅ **Faça:** Compartilhe conhecimento. Apoie o colega. Celebre as vitórias do time.\n\n❌ **Evite:** Trabalhar em silos. Guardar informação. Competir internamente.\n\n**Exemplo prático:** Quando terminar uma tarefa, pergunte ao time se alguém precisa de ajuda.",
      betinhaSpeech: "Colaboração! Aqui ninguém cresce sozinho. A gente sobe junto, compartilha conhecimento e celebra as vitórias do time!",
      layout: "default",
    },
    {
      title: "Nosso Valor 4: Inovação",
      content: "**\"Questione o status quo. Sempre.\"**\n\n✅ **Faça:** Proponha novas ideias. Experimente. Aprenda com os erros.\n\n❌ **Evite:** Dizer \"sempre foi assim\". Ter medo de errar.\n\n**Exemplo prático:** Toda semana, pergunte: \"Existe uma forma melhor de fazer isso?\"",
      betinhaSpeech: "Inovação é o nosso DNA! Na Stellar, questionar o status quo não é problema — é esperado! Traga suas ideias, experimente e aprenda!",
      layout: "default",
    },
    {
      title: "Nossa Estrutura Organizacional",
      content: "A Stellar Gaming é liderada pelo **CEO** e conta com **8 diretorias** estratégicas:\n\n1. Diretoria de Tecnologia\n2. Diretoria de Produto\n3. Diretoria de Marketing\n4. Diretoria de Negócios\n5. Diretoria de Operações\n6. Diretoria de Gente e Cultura\n7. Diretoria Jurídica\n8. Diretoria Financeira",
      betinhaSpeech: "Aqui está a nossa estrutura! CEO no topo e 8 diretorias que fazem a Stellar funcionar. Você já sabe em qual área você está?",
      layout: "list",
    },
    {
      title: "Nossos Patrocínios Esportivos ⚽",
      content: "A Stellar Gaming acredita no poder do esporte e apoia:\n\n⚽ **Clubes de futebol** — Presença nas maiores competições do Brasil\n\n🎮 **E-sports** — Patrocínio de times e campeonatos\n\n🌍 **Copa do Mundo Feminina** — Apoio ao futebol feminino\n\n🌟 **Zé Roberto** — Embaixador da marca",
      betinhaSpeech: "A Stellar está em todo lugar! Futebol, e-sports, Copa do Mundo Feminina e Zé Roberto! Somos uma marca que conecta pessoas!",
      layout: "list",
    },
  ]);

  // ── MÓDULO 2: NEGÓCIO E ESTRATÉGIA ──────────────────────────────────────
  const mod2 = await insertModule({
    trailId,
    slug: "negocio-estrategia",
    title: "Módulo 2: Negócio e Estratégia",
    subtitle: "Mercado iGaming e Visão 2030",
    description: "Entenda o mercado de iGaming, o glossário essencial e o planejamento estratégico da Stellar até 2030.",
    orderIndex: 2,
    pointsReward: 200,
    bonusPoints: 100,
    deadlineDays: 5,
  });

  // Capítulo 1 — Mercado iGaming (Todos)
  await insertChapter({
    moduleId: mod2,
    slug: "negocio-mercado-igaming",
    title: "Capítulo 1: Mercado iGaming",
    description: "O que é iGaming, Sportsbook e Cassino. Glossário: GGR, NGR, FTD, LTV, CAC, CSAT, NetCash, Bet Count.",
    profileType: "todos",
    orderIndex: 1,
  });

  // Capítulo 1 — Liderança (adicional)
  await insertChapter({
    moduleId: mod2,
    slug: "negocio-mercado-igaming-lideranca",
    title: "Capítulo 1 (Liderança): Pilares Estratégicos e OKRs",
    description: "Pilares estratégicos e alavancas capacitadoras do plano 2030. Conexão entre OKRs de área e a meta corporativa de 960MM NGR em 2026.",
    profileType: "lideranca",
    orderIndex: 2,
  });

  // Capítulo 2 — Planejamento Estratégico (Todos)
  await insertChapter({
    moduleId: mod2,
    slug: "negocio-planejamento-estrategico",
    title: "Capítulo 2: Planejamento Estratégico — Visão 2030",
    description: "Visão 2030: USD 1 bilhão de NGR. Pilares estratégicos e alavancas capacitadoras em nível introdutório.",
    profileType: "todos",
    orderIndex: 3,
  });

  // Capítulo 2 — Liderança (aprofundamento)
  await insertChapter({
    moduleId: mod2,
    slug: "negocio-planejamento-estrategico-lideranca",
    title: "Capítulo 2 (Liderança): Detalhamento dos Pilares por Área",
    description: "Detalhamento dos pilares por área e responsabilidade de comunicar a estratégia para os times.",
    profileType: "lideranca",
    orderIndex: 4,
  });

  // Slides do Módulo 2
  await insertSlides(mod2, [
    {
      title: "O que é iGaming? 🎮",
      content: "**iGaming** é o termo global para jogos e apostas online.\n\nNo Brasil, o mercado foi regulamentado em 2024 e a Stellar Gaming é uma das líderes do setor.\n\nOs dois grandes pilares do iGaming são:\n\n🏆 **Sportsbook** — Apostas esportivas (futebol, basquete, tênis, e-sports)\n\n🎰 **Cassino** — Jogos de cassino online (slots, roleta, blackjack, ao vivo)",
      betinhaSpeech: "Bem-vindo ao mundo do iGaming! É um mercado gigante e a Stellar está no centro dele. Vamos entender como tudo funciona?",
      layout: "default",
    },
    {
      title: "Glossário Essencial do iGaming",
      content: "Termos que você vai ouvir todo dia na Stellar:\n\n**GGR** — Gross Gaming Revenue (receita bruta dos jogos)\n**NGR** — Net Gaming Revenue (receita líquida após bônus)\n**FTD** — First Time Deposit (primeiro depósito do cliente)\n**LTV** — Lifetime Value (valor total do cliente)\n**CAC** — Custo de Aquisição de Cliente\n**CSAT** — Customer Satisfaction Score\n**NetCash** — Caixa líquido da operação\n**Bet Count** — Número total de apostas realizadas",
      betinhaSpeech: "Esses são os termos que você vai ouvir nas reuniões! GGR, NGR, FTD... Parece difícil agora, mas em uma semana você vai falar fluente iGaming!",
      layout: "list",
    },
    {
      title: "Visão 2030: USD 1 Bilhão de NGR 🎯",
      content: "A Stellar Gaming tem uma visão clara e ambiciosa:\n\n**Ser a maior operadora de iGaming da América Latina até 2030, com USD 1 bilhão de NGR.**\n\nEssa visão guia todas as nossas decisões estratégicas e é o norte que orienta o trabalho de cada pessoa do time.",
      betinhaSpeech: "USD 1 bilhão de NGR até 2030! Isso não é só um número — é a nossa missão coletiva. E você chegou na hora certa para fazer parte dessa história!",
      layout: "highlight",
    },
    {
      title: "Nossos Pilares Estratégicos",
      content: "Para chegar lá, trabalhamos em **5 pilares estratégicos**:\n\n1. **Crescimento de Base** — Mais clientes, mais engajamento\n2. **Excelência de Produto** — A melhor experiência do mercado\n3. **Eficiência Operacional** — Fazer mais com menos\n4. **Marca e Confiança** — Ser a marca mais amada do Brasil\n5. **Inovação e Tecnologia** — IA e dados como vantagem competitiva",
      betinhaSpeech: "Cinco pilares que sustentam nossa visão de 2030. Cada área da Stellar contribui para pelo menos um deles. Onde o seu trabalho se encaixa?",
      layout: "list",
    },
  ]);

  // ── MÓDULO 3: CULTURA & JEITO DE TRABALHAR ───────────────────────────────
  const mod3 = await insertModule({
    trailId,
    slug: "cultura-jeito-trabalhar",
    title: "Módulo 3: Cultura & Jeito de Trabalhar",
    subtitle: "AI First, Performance e Rituais",
    description: "Conheça nossa cultura AI First, o ciclo de performance, os rituais e os canais de comunicação da Stellar.",
    orderIndex: 3,
    pointsReward: 200,
    bonusPoints: 100,
    deadlineDays: 7,
  });

  // Capítulo 1 — Cultura AI First (Todos)
  await insertChapter({
    moduleId: mod3,
    slug: "cultura-ai-first",
    title: "Capítulo 1: Cultura AI First",
    description: "Human in Control. TESS AI, Make.com, Workspaces por área. Uso de IA como expectativa de performance.",
    profileType: "todos",
    orderIndex: 1,
  });

  // Capítulo 1 — Liderança (exclusivo)
  await insertChapter({
    moduleId: mod3,
    slug: "cultura-ai-first-lideranca",
    title: "Capítulo 1 (Liderança): Gestão de Workspaces e Governança de IA",
    description: "Como criar e gerir Workspaces do time. Responsabilidade de adoção e governança. Como avaliar uso de IA nas entregas.",
    profileType: "lideranca",
    orderIndex: 2,
  });

  // Capítulo 2 — Ciclo de Performance (Todos)
  await insertChapter({
    moduleId: mod3,
    slug: "cultura-ciclo-performance",
    title: "Capítulo 2: Ciclo de Performance, Carreira em Y e Promoção vs. Mérito",
    description: "Novo ciclo de performance com 8 etapas. Promoção vs. Mérito. PDI. Carreira em Y.",
    profileType: "todos",
    orderIndex: 3,
  });

  // Capítulo 2 — Liderança (exclusivo)
  await insertChapter({
    moduleId: mod3,
    slug: "cultura-ciclo-performance-lideranca",
    title: "Capítulo 2 (Liderança): Calibração e Feedback Estruturado",
    description: "Como conduzir calibração. Papel no Comitê de Performance. Como dar feedback estruturado e tratar baixa performance.",
    profileType: "lideranca",
    orderIndex: 4,
  });

  // Capítulo 3 — Rituais, Combinados & Orientações (Todos)
  await insertChapter({
    moduleId: mod3,
    slug: "cultura-rituais-orientacoes",
    title: "Capítulo 3: Rituais, Combinados & Orientações Gerais",
    description: "Rituais: Papo de Estrela, All Stars, Shaking Hands, GiroBet, Comando Estelar. Canais: Ro.am, Intranet, e-mail.",
    profileType: "todos",
    orderIndex: 5,
  });

  // Capítulo 3 — Liderança (adição)
  await insertChapter({
    moduleId: mod3,
    slug: "cultura-rituais-orientacoes-lideranca",
    title: "Capítulo 3 (Liderança): Canal de Lideranças e Comunicação Cascata",
    description: "Canal exclusivo Lideranças-Stellar no Ro.am. Responsabilidade de comunicação cascata. Como aprovar ponto, férias e ausências.",
    profileType: "lideranca",
    orderIndex: 6,
  });

  // Slides do Módulo 3
  await insertSlides(mod3, [
    {
      title: "AI First: Nosso Jeito de Trabalhar 🤖",
      content: "Na Stellar Gaming, **Inteligência Artificial não é diferencial — é expectativa de performance**.\n\nTodo colaborador usa IA no dia a dia. Não como ferramenta opcional, mas como parte essencial do trabalho.\n\n**Nosso princípio:** *Human in Control* — a IA amplifica a inteligência humana, mas a decisão final é sempre sua.",
      betinhaSpeech: "AI First! Na Stellar, usar inteligência artificial não é um plus — é o mínimo esperado! E não se preocupe, você não vai ser substituído pela IA. Você vai trabalhar COM ela!",
      layout: "highlight",
    },
    {
      title: "Nossas Ferramentas de IA",
      content: "**TESS AI** — Nossa plataforma de copilotos e automações internas\n- Copilotos por área (Marketing, Produto, Atendimento)\n- Automações de tarefas repetitivas\n\n**Make.com** — Integrações e fluxos automatizados entre sistemas\n\n**Workspaces por área** — Cada time tem seu workspace de IA configurado com contexto específico",
      betinhaSpeech: "TESS AI, Make.com e Workspaces! Essas são as nossas principais ferramentas de IA. No seu primeiro mês, você vai aprender a usar todas elas!",
      layout: "list",
    },
    {
      title: "Nosso Ciclo de Performance 🎯",
      content: "O ciclo de performance da Stellar tem **8 etapas**:\n\n1. **Definição de OKRs** — Alinhamento de objetivos\n2. **Check-in mensal** — Acompanhamento contínuo\n3. **Feedback 360°** — Avaliação por pares e líderes\n4. **Autoavaliação** — Sua perspectiva sobre o próprio desempenho\n5. **Calibração** — Comitê de performance\n6. **Resultado** — Comunicação individual\n7. **PDI** — Plano de Desenvolvimento Individual\n8. **Reconhecimento** — Promoção ou mérito",
      betinhaSpeech: "Nosso ciclo de performance tem 8 etapas bem definidas! Não tem surpresa aqui — você sempre vai saber onde está e para onde está indo na Stellar.",
      layout: "list",
    },
    {
      title: "Carreira em Y",
      content: "Na Stellar, você pode crescer em **dois caminhos**:\n\n👔 **Trilha de Gestão** — Liderança de pessoas e times\n\n🔬 **Trilha Técnica/Especialista** — Profundidade e expertise na sua área\n\nAmbas as trilhas têm o mesmo reconhecimento e remuneração. Você escolhe o caminho que faz mais sentido para você.",
      betinhaSpeech: "Carreira em Y! Você não precisa virar gestor para crescer na Stellar. Se você prefere ser especialista técnico, tem espaço pra isso também. A escolha é sua!",
      layout: "default",
    },
    {
      title: "Nossos Rituais ⭐",
      content: "Os rituais são momentos que fortalecem nossa cultura:\n\n🌟 **Papo de Estrela** — Conversa 1:1 com seu líder (quinzenal)\n🏆 **All Stars** — Reconhecimento mensal de destaques\n🤝 **Shaking Hands** — Integração de novos colaboradores\n🎯 **GiroBet** — Rodada de apresentações entre áreas\n⚡ **Comando Estelar** — Reunião estratégica de lideranças",
      betinhaSpeech: "Nossos rituais são sagrados! Cada um deles existe por um motivo: fortalecer conexões, reconhecer pessoas e alinhar a empresa. Participe de todos!",
      layout: "list",
    },
    {
      title: "Nossos Canais de Comunicação",
      content: "**Ro.am** — Nossa plataforma principal de comunicação interna\n- Canais por área e projeto\n- @teamestrelado para comunicados gerais\n\n**Intranet** — Documentos, políticas e informações oficiais\n\n**E-mail** — Comunicações formais e externas",
      betinhaSpeech: "Ro.am é o nosso WhatsApp corporativo! É por lá que a maioria das conversas acontece. Já pediu acesso? Se não pediu, faz isso hoje!",
      layout: "list",
    },
    {
      title: "Orientações Gerais",
      content: "📍 **Escritórios:** Belo Horizonte (sede) e São Paulo\n\n👔 **Dress code:** Smart casual — confortável e apresentável\n\n📢 **Canal de denúncia:** Disponível na intranet para reportar situações que violem nossos valores\n\n🤝 **Combinados:** Respeito, pontualidade e colaboração são inegociáveis",
      betinhaSpeech: "BH e SP! Se você for presencial, já sabe onde ficam os escritórios. E lembre: dress code smart casual — confortável e apresentável. Nada de pijama no escritório!",
      layout: "default",
    },
  ]);

  console.log("✅ Trilha Gente e Cultura: 3 módulos e capítulos por perfil");
}

// ─────────────────────────────────────────────────────────────────────────────
// TRILHA 2: DEPARTAMENTO PESSOAL
// ─────────────────────────────────────────────────────────────────────────────
async function seedDepartamentoPessoal() {
  const trailId = await insertTrail({
    slug: "departamento-pessoal",
    title: "Trilha de Onboarding: Departamento Pessoal",
    description: "Tudo sobre admissão, documentos, ponto eletrônico, benefícios e orientações do DP.",
    icon: "FileText",
    color: "#4FC3F7",
    orderIndex: 2,
  });

  // ── MÓDULO 1: ADMISSÃO, DOCUMENTOS & PONTO ──────────────────────────────
  const mod1 = await insertModule({
    trailId,
    slug: "dp-admissao-documentos",
    title: "Módulo 1: Admissão, Documentos & Ponto Eletrônico",
    subtitle: "Tudo que você precisa saber para começar",
    description: "Janelas de admissão, documentos necessários, exame admissional e controle de ponto.",
    orderIndex: 1,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 3,
  });

  // CLT
  await insertChapter({
    moduleId: mod1,
    slug: "dp-admissao-clt",
    title: "Admissão CLT",
    description: "Janelas de admissão (1ª e 3ª semana). Documentos, exame admissional (BH: Cesmor / SP: Italab). Ahgora Multi (código a288431), fechamento de ponto (21 ao 20), horas extras, banco de horas, ausências e atestados.",
    profileType: "clt",
    orderIndex: 1,
  });

  // PJ
  await insertChapter({
    moduleId: mod1,
    slug: "dp-admissao-pj",
    title: "Admissão PJ",
    description: "Documentos de início PJ. Primeiro acesso ao Oracle. Emissão e envio de NF até o dia 25. Atualização de dados cadastrais. Distrato: comunicação 30 dias antes.",
    profileType: "pj",
    orderIndex: 2,
  });

  // Liderança
  await insertChapter({
    moduleId: mod1,
    slug: "dp-admissao-lideranca",
    title: "Admissão — Responsabilidades da Liderança",
    description: "Validação diária de ponto. Aprovação de ajustes no My Ahgora. Comunicação ao DP de recorrências e licenças prolongadas. Fluxo de abertura de vagas no InHire.",
    profileType: "lideranca",
    orderIndex: 3,
  });

  // Slides do Módulo 1 DP
  await insertSlides(mod1, [
    {
      title: "Admissão CLT — Primeiros Passos",
      content: "**Janelas de admissão:** 1ª e 3ª semana do mês.\n\n**Documentos necessários:**\n- RG e CPF\n- Carteira de Trabalho (CTPS)\n- PIS/PASEP\n- Comprovante de residência\n- Certidão de nascimento/casamento\n- Foto 3x4\n\n**Exame admissional:**\n- BH: Cesmor\n- SP: Italab",
      betinhaSpeech: "Se você é CLT, presta atenção! As admissões acontecem na 1ª e 3ª semana do mês. Separa todos os documentos com antecedência para não ter surpresa!",
      layout: "list",
    },
    {
      title: "Ponto Eletrônico — Ahgora Multi",
      content: "**Sistema:** Ahgora Multi\n**Código da empresa:** a288431\n\n**Fechamento do ponto:** Todo dia **21 ao 20** do mês seguinte\n\n**Regras importantes:**\n- Registre o ponto em todos os dias trabalhados\n- Horas extras precisam de aprovação prévia\n- Banco de horas: compensação em até 6 meses\n- Ausências e atestados: lançar em até 48h no sistema",
      betinhaSpeech: "Ahgora Multi, código a288431! Guarda esse código. O fechamento do ponto é do dia 21 ao 20. E atestado médico? Lança em até 48 horas no sistema!",
      layout: "list",
    },
    {
      title: "Admissão PJ — Documentos e Início",
      content: "**Documentos necessários:**\n- CNPJ ativo e regular\n- Contrato Social\n- Comprovante de endereço da empresa\n- Dados bancários da PJ\n\n**Primeiro acesso:** Oracle (sistema de gestão)\n\n**Nota Fiscal:**\n- Emita e envie até o dia **25 de cada mês**",
      betinhaSpeech: "PJ aqui! Atenção para a nota fiscal — ela precisa ser emitida e enviada até o dia 25 de cada mês. Não esquece, porque atraso atrasa o pagamento!",
      layout: "list",
    },
    {
      title: "Informações Importantes para PJ",
      content: "**Atualização cadastral:** Sempre que houver mudança de endereço, banco ou dados da empresa, informe ao DP imediatamente.\n\n**Distrato:** Em caso de encerramento do contrato, comunicar ao DP com **30 dias de antecedência**.\n\n**Grupo de comunicados:** Participe do grupo **Comunicados-PJs** no Ro.am.",
      betinhaSpeech: "Mudou algum dado da sua empresa? Avisa o DP imediatamente! E se precisar encerrar o contrato, dá 30 dias de aviso. Ah, e entra no grupo Comunicados-PJs no Ro.am!",
      layout: "default",
    },
  ]);

  // ── MÓDULO 2: BENEFÍCIOS ─────────────────────────────────────────────────
  const mod2 = await insertModule({
    trailId,
    slug: "dp-beneficios",
    title: "Módulo 2: Benefícios — Saúde, VA/VT, Bem-estar & Incentivos",
    subtitle: "Tudo que a Stellar oferece para você",
    description: "Conheça todos os benefícios disponíveis para CLT, PJ e benefícios comuns a todos.",
    orderIndex: 2,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 5,
  });

  // CLT
  await insertChapter({
    moduleId: mod2,
    slug: "dp-beneficios-clt",
    title: "Benefícios CLT",
    description: "VT, VA/VR Caju, SulAmérica enfermaria, plano odontológico, auxílio home office, adiantamento salarial, parcerias.",
    profileType: "clt",
    orderIndex: 1,
  });

  // PJ
  await insertChapter({
    moduleId: mod2,
    slug: "dp-beneficios-pj",
    title: "Benefícios PJ",
    description: "VA/VR Caju, auxílio mobilidade, SulAmérica Especial 100, bonificação contratual, período de pausa.",
    profileType: "pj",
    orderIndex: 2,
  });

  // Todos — benefícios comuns
  await insertChapter({
    moduleId: mod2,
    slug: "dp-beneficios-todos",
    title: "Benefícios para Todos",
    description: "Conexa Saúde, Wellhub, seguro de vida, day off aniversário, kit maternidade, licença paternidade, Quick Massage, OnHappy, Hacker Rangers.",
    profileType: "todos",
    orderIndex: 3,
  });

  // Slides do Módulo 2 DP
  await insertSlides(mod2, [
    {
      title: "Seus Benefícios CLT 💚",
      content: "**Vale Transporte (VT):**\n- Regime híbrido: 16 dias/mês\n- Regime presencial: 22 dias/mês\n\n**Vale Alimentação/Refeição (VA/VR):**\n- Cartão Caju\n- BH: R$ 880/mês | SP: R$ 1.100/mês\n\n**Plano de Saúde:** SulAmérica Enfermaria (coparticipação 30%)\n\n**Plano Odontológico:** Incluso\n\n**Auxílio Home Office:** R$ 120/mês",
      betinhaSpeech: "Olha que pacote de benefícios! VT, VA/VR no Caju, SulAmérica, odonto e ainda auxílio home office! A Stellar cuida bem de você!",
      layout: "list",
    },
    {
      title: "Benefícios Financeiros CLT",
      content: "**Adiantamento Salarial:**\n- MG: 20% do salário\n- Demais estados: 40% do salário\n\n**Parcerias Educacionais:**\n- 🌍 Cultura Inglesa — Desconto em cursos de inglês\n- 🎓 FUMEC — Desconto em graduação e pós-graduação\n- 🏋️ SESC — Acesso a atividades culturais e esportivas",
      betinhaSpeech: "Adiantamento salarial e parcerias educacionais! A Stellar investe no seu desenvolvimento. Aproveita os descontos na Cultura Inglesa e na FUMEC!",
      layout: "list",
    },
    {
      title: "Seus Benefícios PJ 💙",
      content: "**Vale Alimentação/Refeição:** Cartão Caju\n\n**Auxílio Mobilidade:**\n- BH: R$ 250/mês | SP: R$ 350/mês\n\n**Plano de Saúde:** SulAmérica Especial 100 (reembolso por faixa etária)\n\n**Bonificação Contratual:** Pagamento em dezembro\n\n**Período de Pausa:** 30 dias após 12 meses de contrato (1/3 do valor mensal)",
      betinhaSpeech: "PJ também tem benefícios incríveis! VA/VR no Caju, auxílio mobilidade, SulAmérica e ainda bonificação em dezembro. E depois de 1 ano, você tem direito a 30 dias de pausa!",
      layout: "list",
    },
    {
      title: "Benefícios para Todos 🌟",
      content: "Independente do seu regime de contratação:\n\n🧠 **Conexa Saúde** — 2 sessões de psicólogo + 2 de nutricionista por mês\n💪 **Wellhub** — Acesso a academias e apps de bem-estar\n🛡️ **Seguro de Vida** — Prudential\n🎂 **Day off Aniversário** — Seu dia + aniversário dos filhos\n👶 **Kit Maternidade** — Para mamães Stellar\n👨‍👧 **Licença Paternidade** — 30 dias\n💆 **Quick Massage** — Massagem no escritório\n😊 **OnHappy** — Plataforma de bem-estar\n🔐 **Hacker Rangers** — Treinamento de segurança digital",
      betinhaSpeech: "Esses benefícios são para todo mundo! Psicólogo, nutricionista, academia, seguro de vida, day off no aniversário... A Stellar realmente cuida das pessoas!",
      layout: "list",
    },
  ]);

  console.log("✅ Trilha Departamento Pessoal: 2 módulos e capítulos por perfil");
}

// ─────────────────────────────────────────────────────────────────────────────
// TRILHA 3: SAÚDE E SEGURANÇA DO TRABALHO
// ─────────────────────────────────────────────────────────────────────────────
async function seedSegurancaTrabalho() {
  const trailId = await insertTrail({
    slug: "seguranca-trabalho",
    title: "Trilha de Onboarding: Saúde e Segurança do Trabalho",
    description: "Conheça as normas de segurança, ergonomia, CIPA e como agir em emergências.",
    icon: "Shield",
    color: "#EF5350",
    orderIndex: 3,
  });

  // ── MÓDULO 1: SEGURANÇA DO TRABALHO ─────────────────────────────────────
  const mod1 = await insertModule({
    trailId,
    slug: "sst-seguranca-trabalho",
    title: "Módulo 1: Segurança do Trabalho — CIPA, Ergonomia e Emergências",
    subtitle: "Sua segurança é nossa prioridade",
    description: "Missão de segurança, riscos ocupacionais, CIPA, ergonomia e procedimentos de emergência.",
    orderIndex: 1,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 5,
  });

  // Todos
  await insertChapter({
    moduleId: mod1,
    slug: "sst-seguranca-todos",
    title: "Segurança do Trabalho",
    description: "Missão de segurança. Riscos ocupacionais. CIPA. Ergonomia. Tipos de acidente. Emergências: SAMU 192, Bombeiros 193. Atestado médico.",
    profileType: "todos",
    orderIndex: 1,
  });

  // Liderança
  await insertChapter({
    moduleId: mod1,
    slug: "sst-seguranca-lideranca",
    title: "Segurança do Trabalho — Responsabilidades da Liderança",
    description: "Papel do gestor no acionamento da CAT. Obrigação de comunicar ao DP recorrências e licenças prolongadas. Acompanhamento do time quanto a condições ergonômicas.",
    profileType: "lideranca",
    orderIndex: 2,
  });

  // Slides do Módulo 1 SST
  await insertSlides(mod1, [
    {
      title: "Nossa Missão de Segurança 🛡️",
      content: "**\"Segurança não é regra — é valor.\"**\n\nNa Stellar Gaming, a segurança de cada colaborador é responsabilidade de todos.\n\n**Riscos Ocupacionais que monitoramos:**\n- ⚡ Físicos (ruído, temperatura, iluminação)\n- 🪑 Ergonômicos (postura, repetitividade)\n- 😰 Psicossociais (estresse, assédio, sobrecarga)",
      betinhaSpeech: "Segurança em primeiro lugar! Na Stellar, cuidar da sua saúde e segurança é responsabilidade de todos — não só do RH. Vamos aprender juntos!",
      layout: "highlight",
    },
    {
      title: "CIPA — Comissão Interna de Prevenção de Acidentes",
      content: "A **CIPA** é responsável por:\n\n🔍 **Identificação de riscos** no ambiente de trabalho\n🚫 **Prevenção de assédio** moral e sexual\n📢 **Campanhas** de saúde e segurança\n\n**Como reportar um risco:**\nFale com um membro da CIPA ou acesse o canal de denúncia na intranet. Toda comunicação é sigilosa.",
      betinhaSpeech: "A CIPA é nossa aliada! Se você identificar qualquer risco no ambiente de trabalho — físico, ergonômico ou de assédio — reporte imediatamente. Seu relato é sigiloso!",
      layout: "default",
    },
    {
      title: "Ergonomia no Trabalho 🪑",
      content: "**Postura correta:**\n- Costas apoiadas no encosto\n- Pés apoiados no chão ou apoio de pés\n- Tela do monitor na altura dos olhos\n- Cotovelos em 90°\n\n**Pausas recomendadas:**\n- A cada 50 minutos, faça 10 minutos de pausa\n- Levante, alongue e descanse os olhos",
      betinhaSpeech: "Ergonomia é saúde! Ajusta sua cadeira, posiciona o monitor na altura dos olhos e lembra de fazer pausas a cada 50 minutos. Seu corpo agradece!",
      layout: "list",
    },
    {
      title: "Emergências — Números Importantes 🚨",
      content: "**Em caso de emergência:**\n\n🚑 **SAMU:** 192\n🚒 **Bombeiros:** 193\n👮 **Polícia:** 190\n\n**Tipos de acidente:**\n- Acidente típico: ocorre no trabalho\n- Acidente de trajeto: no caminho para o trabalho\n- Doença ocupacional: causada pelo trabalho\n\n**Atestado médico:**\n- Lance no sistema em até **48 horas**\n- Entregue o original ao DP em até **5 dias úteis**",
      betinhaSpeech: "SAMU 192, Bombeiros 193! Memoriza esses números. E se precisar de atestado médico, lança no sistema em até 48 horas. Não deixa para depois!",
      layout: "list",
    },
  ]);

  console.log("✅ Trilha Saúde e Segurança do Trabalho: 1 módulo e capítulos por perfil");
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUÇÃO PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
try {
  await clearAll();
  await seedGenteCultura();
  await seedDepartamentoPessoal();
  await seedSegurancaTrabalho();
  await insertBadges();
  console.log("\n🎉 Seed completo! Plataforma de Onboarding Stellar Gaming populada com sucesso.");
  console.log("   Trilhas: 3 | Módulos: 6 | Capítulos: 20+ | Slides: 30+");
} catch (err) {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
} finally {
  await db.end();
}
