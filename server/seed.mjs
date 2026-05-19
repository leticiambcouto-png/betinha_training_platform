/**
 * Seed completo da plataforma de Onboarding Stellar Gaming
 * Conteúdo baseado no Roteiro de Trilha Gravada (versão oficial)
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

  // ── MÓDULO 1: BOAS-VINDAS ────────────────────────────────────────────────
  const mod1 = await insertModule({
    trailId,
    slug: "gc-boas-vindas",
    title: "Módulo 1: Boas-vindas à Stellar!",
    subtitle: "Mensagem de boas-vindas",
    description: "Betinha apresenta a trilha e o CEO dá as boas-vindas à nova estrela.",
    orderIndex: 1,
    pointsReward: 100,
    bonusPoints: 50,
    deadlineDays: 2,
  });
  await insertChapter({ moduleId: mod1, slug: "gc-bv-todos", title: "Boas-vindas Betinha e Vídeo do CEO", description: "Betinha apresenta a trilha. CEO grava mensagem de boas-vindas.", profileType: "todos", orderIndex: 1 });
  await insertSlides(mod1, [
    {
      title: "Bem-vindo(a) à Stellar Gaming! 🌟",
      content: "Que alegria ter você aqui!\n\nVocê acaba de entrar em uma das empresas mais inovadoras do mercado de entretenimento digital. A Stellar Gaming é a empresa por trás da EstrelaBet — uma das maiores plataformas de apostas esportivas e jogos do Brasil.\n\nEssa trilha vai te apresentar quem somos, como trabalhamos, o que valorizamos e tudo que você precisa saber para começar sua jornada com o pé direito.",
      betinhaSpeech: "Oi, eu sou a Betinha! Vou ser sua guia nessa jornada de onboarding. Prepare-se para conhecer tudo sobre a Stellar — nossa história, nossos valores e o nosso jeito único de trabalhar. Vamos juntos? 🚀",
      layout: "highlight",
    },
    {
      title: "Vídeo de Boas-vindas do CEO",
      content: JSON.stringify({
        videoTitle: "Mensagem de Boas-vindas do CEO",
        presenter: "CEO da Stellar Gaming",
        description: "O CEO da Stellar Gaming grava uma mensagem especial para cada nova estrela que entra na constelação. Assista e sinta o espírito da Stellar!",
        note: "Vídeo gravado especialmente para novos colaboradores",
      }),
      betinhaSpeech: "Esse vídeo é especial! O nosso CEO gravou uma mensagem só pra você. Não pula, tá? 😄",
      layout: "video-placeholder",
    },
  ]);

  // ── MÓDULO 2: QUEM SOMOS — NOSSA HISTÓRIA ───────────────────────────────
  const mod2 = await insertModule({
    trailId,
    slug: "gc-historia",
    title: "Módulo 2: Quem Somos — Nossa História",
    subtitle: "De 2019 até hoje",
    description: "Conheça a trajetória da Stellar Gaming, nossos marcos e os prêmios que conquistamos.",
    orderIndex: 2,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 3,
  });
  await insertChapter({ moduleId: mod2, slug: "gc-hist-todos", title: "Nossa História e Prêmios", description: "Linha do tempo da Stellar Gaming de 2019 até hoje.", profileType: "todos", orderIndex: 1 });
  await insertSlides(mod2, [
    {
      title: "Nossa História: De 2019 até Hoje",
      content: JSON.stringify({
        years: [
          {
            year: "2019",
            label: "O começo",
            events: [
              { date: "2019", title: "Fundação da Stellar Gaming", description: "A empresa nasce com a missão de transformar o mercado de entretenimento digital no Brasil.", emoji: "🌱" },
            ],
          },
          {
            year: "2020",
            label: "Crescimento acelerado",
            events: [
              { date: "2020", title: "Expansão da plataforma EstrelaBet", description: "Lançamento e crescimento acelerado da plataforma de apostas esportivas.", emoji: "📈" },
            ],
          },
          {
            year: "2021",
            label: "Consolidação",
            events: [
              { date: "2021", title: "Consolidação no mercado brasileiro", description: "A Stellar se torna referência no mercado de iGaming no Brasil.", emoji: "🏆" },
              { date: "2021", title: "Expansão do time", description: "Crescimento significativo da equipe em todas as áreas.", emoji: "👥" },
            ],
          },
          {
            year: "2022",
            label: "Reconhecimento",
            events: [
              { date: "2022", title: "Prêmios e reconhecimentos", description: "A empresa começa a receber reconhecimentos do mercado pela inovação e crescimento.", isPrize: true },
              { date: "2022", title: "Novos patrocínios esportivos", description: "Início de parcerias estratégicas com times e eventos esportivos.", emoji: "⚽" },
            ],
          },
          {
            year: "2023",
            label: "Expansão nacional",
            events: [
              { date: "2023", title: "Presença em múltiplas cidades", description: "Escritórios em Belo Horizonte e São Paulo com times robustos.", emoji: "🏙️" },
              { date: "2023", title: "Liderança no iGaming", description: "EstrelaBet se consolida entre as maiores plataformas do Brasil.", isPrize: true },
            ],
          },
          {
            year: "2024",
            label: "Novos horizontes",
            events: [
              { date: "2024", title: "Regulamentação do mercado", description: "A Stellar se posiciona estrategicamente com a regulamentação das apostas no Brasil.", emoji: "⚖️" },
              { date: "2024", title: "Inovação com IA", description: "Lançamento de iniciativas de Inteligência Artificial com o projeto Kant.", emoji: "🤖" },
            ],
          },
          {
            year: "2025",
            label: "Hoje",
            events: [
              { date: "2025", title: "Você faz parte da história!", description: "Bem-vindo(a) à Stellar Gaming. Agora você é parte da nossa constelação.", emoji: "⭐" },
            ],
          },
        ],
      }),
      betinhaSpeech: "Olha que jornada incrível! De 2019 até hoje, a Stellar não parou de crescer. E agora você faz parte dessa história! 🌟",
      layout: "timeline",
    },
    {
      title: "Prêmios e Reconhecimentos",
      content: JSON.stringify({
        cards: [
          { title: "Melhor Plataforma de iGaming", subtitle: "Premiação do setor", body: "A EstrelaBet é reconhecida como uma das melhores plataformas de apostas esportivas e jogos do Brasil, com destaque para experiência do usuário e inovação tecnológica.", icon: "🏆", color: "#FFD700", tag: "Prêmio" },
          { title: "Employer Branding", subtitle: "Reconhecimento como empregador", body: "A Stellar Gaming é reconhecida como uma das melhores empresas para trabalhar, com foco em cultura, desenvolvimento e bem-estar dos colaboradores.", icon: "⭐", color: "#d9f22a", tag: "Cultura" },
          { title: "Inovação Tecnológica", subtitle: "Destaque em tecnologia", body: "Reconhecimento pela adoção de tecnologias de ponta, incluindo IA, automação e plataformas digitais que colocam a Stellar à frente do mercado.", icon: "💡", color: "#4FC3F7", tag: "Tech" },
          { title: "Crescimento Acelerado", subtitle: "Expansão de mercado", body: "A Stellar Gaming figura entre as empresas de crescimento mais rápido no setor de entretenimento digital, com expansão consistente de usuários e receita.", icon: "📈", color: "#00C853", tag: "Negócio" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Esses prêmios são o resultado do trabalho de cada estrela da constelação. Incluindo você, que começa hoje! 💪",
      layout: "card-deck",
    },
  ]);

  // ── MÓDULO 3: FALANDO DE NEGÓCIO ────────────────────────────────────────
  const mod3 = await insertModule({
    trailId,
    slug: "gc-negocio",
    title: "Módulo 3: Falando de Negócio",
    subtitle: "O mercado de iGaming",
    description: "Entenda o mercado de apostas esportivas, o dicionário da bet e como a Stellar se posiciona.",
    orderIndex: 3,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 4,
  });
  await insertChapter({ moduleId: mod3, slug: "gc-neg-todos", title: "Mercado iGaming e Dicionário da Bet", description: "Entenda o mercado e aprenda os termos do setor.", profileType: "todos", orderIndex: 1 });
  await insertChapter({ moduleId: mod3, slug: "gc-neg-lideranca", title: "Planejamento Estratégico (Liderança)", description: "Visão estratégica do negócio para líderes.", profileType: "lideranca", orderIndex: 2 });
  await insertSlides(mod3, [
    {
      title: "O Mercado de iGaming no Brasil",
      content: "O **iGaming** (interactive gaming) é o mercado de jogos e apostas online. No Brasil, esse mercado passou por uma transformação enorme:\n\n**2018** — A Lei 13.756 autorizou as apostas esportivas de quota fixa no Brasil.\n\n**2023** — O governo regulamentou o setor, criando regras claras para operadores.\n\n**2024** — Início da operação regulamentada, com licenças e fiscalização oficial.\n\nO Brasil se tornou um dos maiores mercados de iGaming do mundo, com milhões de usuários ativos.",
      betinhaSpeech: "O mercado de iGaming no Brasil é enorme e está crescendo muito rápido. A Stellar está no centro dessa transformação!",
      layout: "default",
    },
    {
      title: "Dicionário da Bet 📖",
      content: JSON.stringify({
        entries: [
          { term: "iGaming", symbol: "iG", definition: "Interactive Gaming — mercado de jogos e apostas online, incluindo apostas esportivas, cassino, poker e outros jogos digitais.", category: "Mercado" },
          { term: "Apostas de Quota Fixa", symbol: "AQF", definition: "Modalidade de aposta onde as odds (cotações) são definidas no momento da aposta e não mudam, independente do volume apostado.", category: "Apostas" },
          { term: "Odds / Cotação", definition: "Número que representa a probabilidade de um evento ocorrer e determina o quanto você ganha se acertar. Ex: odds 2.00 significa que você dobra o valor apostado.", category: "Apostas" },
          { term: "Mercado", definition: "Cada possibilidade de aposta disponível em um evento. Ex: 'Resultado Final', 'Ambas Marcam', 'Total de Gols'.", category: "Apostas" },
          { term: "Pré-jogo", definition: "Apostas realizadas antes do início do evento esportivo.", category: "Apostas" },
          { term: "Ao Vivo / Live", definition: "Apostas realizadas durante o evento, com odds atualizadas em tempo real conforme o jogo se desenvolve.", category: "Apostas" },
          { term: "Cash Out", definition: "Recurso que permite ao apostador encerrar uma aposta antes do fim do evento, garantindo parte do lucro ou limitando o prejuízo.", category: "Produto" },
          { term: "Bônus de Boas-vindas", definition: "Oferta especial para novos usuários que se cadastram na plataforma, geralmente um bônus no primeiro depósito.", category: "Marketing" },
          { term: "Freebets", definition: "Apostas gratuitas concedidas pela plataforma como promoção. O apostador não arrisca dinheiro próprio.", category: "Marketing" },
          { term: "GGR", symbol: "GGR", definition: "Gross Gaming Revenue — Receita Bruta de Jogo. É o total apostado pelos usuários menos os prêmios pagos.", category: "Financeiro" },
          { term: "NGR", symbol: "NGR", definition: "Net Gaming Revenue — Receita Líquida de Jogo. É o GGR menos os bônus pagos e custos de processamento.", category: "Financeiro" },
          { term: "Depósito", definition: "Ação de adicionar dinheiro à conta na plataforma para realizar apostas.", category: "Produto" },
          { term: "Saque", definition: "Ação de retirar dinheiro da conta na plataforma para a conta bancária do usuário.", category: "Produto" },
          { term: "KYC", symbol: "KYC", definition: "Know Your Customer — processo de verificação de identidade do usuário, exigido pela regulamentação.", category: "Compliance" },
          { term: "Responsabilidade no Jogo", definition: "Conjunto de práticas e ferramentas para promover o jogo saudável e prevenir a dependência, exigido pela regulamentação.", category: "Compliance" },
          { term: "Afiliado", definition: "Parceiro que promove a plataforma e recebe comissão por cada novo usuário que se cadastra através do seu link.", category: "Marketing" },
          { term: "Retenção", definition: "Estratégias para manter os usuários ativos na plataforma, como promoções, programas de fidelidade e comunicação personalizada.", category: "Marketing" },
          { term: "Churn", definition: "Taxa de usuários que deixam de usar a plataforma em um determinado período.", category: "Métricas" },
          { term: "DAU / MAU", symbol: "DAU/MAU", definition: "Daily/Monthly Active Users — usuários ativos diários/mensais. Métricas fundamentais de engajamento da plataforma.", category: "Métricas" },
          { term: "Odd Boost", definition: "Promoção que aumenta temporariamente as odds de determinados eventos para atrair apostas.", category: "Marketing" },
        ],
      }),
      betinhaSpeech: "Esse dicionário vai te ajudar muito nas reuniões! Clica nos termos para ver as definições. Pode salvar no coração que vai precisar! 😄",
      layout: "dictionary",
    },
    {
      title: "A Stellar no Mercado",
      content: "A **Stellar Gaming** é a empresa que opera a **EstrelaBet**, uma das maiores plataformas de apostas esportivas e jogos do Brasil.\n\n**Nosso posicionamento:**\n• Plataforma 100% digital, acessível pelo app e web\n• Foco em apostas esportivas, especialmente futebol\n• Cassino online com centenas de jogos\n• Atendimento ao cliente de excelência\n• Operação regulamentada e responsável\n\n**Nossos diferenciais:**\n• Tecnologia de ponta para experiência do usuário\n• Odds competitivas e mercados variados\n• Promoções e bônus atrativos\n• Programa de responsabilidade no jogo",
      betinhaSpeech: "A EstrelaBet não é só uma plataforma — é uma experiência! E você agora faz parte do time que constrói isso todos os dias.",
      layout: "list",
    },
  ]);

  // ── MÓDULO 4: PLANEJAMENTO ESTRATÉGICO ──────────────────────────────────
  const mod4 = await insertModule({
    trailId,
    slug: "gc-planejamento",
    title: "Módulo 4: Planejamento Estratégico",
    subtitle: "Para onde vamos",
    description: "Conheça a estratégia, OKRs e o Ciclo de Performance da Stellar.",
    orderIndex: 4,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 4,
  });
  await insertChapter({ moduleId: mod4, slug: "gc-plan-todos", title: "Estratégia e OKRs", description: "Visão, missão, estratégia e como medimos resultados.", profileType: "todos", orderIndex: 1 });
  await insertChapter({ moduleId: mod4, slug: "gc-plan-lideranca", title: "Gestão de Performance (Liderança)", description: "Como liderar times com foco em resultados e OKRs.", profileType: "lideranca", orderIndex: 2 });
  await insertSlides(mod4, [
    {
      title: "Nossa Estratégia",
      content: "A Stellar Gaming opera com um modelo de planejamento estratégico baseado em **OKRs** (Objectives and Key Results) — uma metodologia que conecta os objetivos da empresa com as metas de cada time e pessoa.\n\n**Como funciona:**\n• A empresa define os **Objetivos Estratégicos** anuais\n• Cada área desdobra em **Key Results** mensuráveis\n• Times e pessoas alinham suas metas individuais\n• O acompanhamento é feito nos rituais corporativos\n\nEsse modelo garante que todos estejam remando na mesma direção.",
      betinhaSpeech: "OKRs são a bússola da Stellar! Cada um de nós tem metas que contribuem para os objetivos maiores da empresa. Você vai conhecer as suas metas logo no início!",
      layout: "default",
    },
    {
      title: "Ciclo de Performance",
      content: JSON.stringify({
        cards: [
          { title: "1ª Etapa: PLANEJAR", subtitle: "Janeiro e Julho", body: "Definição e contratação de metas. É o momento de alinhar com sua liderança o que será entregue no semestre, com metas claras e mensuráveis.", icon: "🎯", color: "#d9f22a" },
          { title: "2ª Etapa: ACOMPANHAR", subtitle: "Durante o semestre", body: "Acompanhamento periódico dos resultados, do PDI (Plano de Desenvolvimento Individual) e participação nos rituais corporativos.", icon: "📊", color: "#4FC3F7" },
          { title: "3ª Etapa: AVALIAR", subtitle: "Junho e Dezembro", body: "Avaliação das metas e dos valores. Momento de reflexão sobre o que foi entregue e como foi entregue.", icon: "✅", color: "#00C853" },
          { title: "4ª Etapa: GESTÃO DE CONSEQUÊNCIAS", subtitle: "Após avaliação", body: "Premiação corporativa, ciclo de reconhecimentos, feedback e Plano de Desenvolvimento Individual para o próximo ciclo.", icon: "🏆", color: "#FF6B35" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "O Ciclo de Performance tem 4 etapas e acontece 2 vezes por ano — em Janeiro e Julho. Fique de olho nas datas!",
      layout: "card-deck",
    },
    {
      title: "Ferramentas de Gestão",
      content: JSON.stringify({
        cards: [
          { title: "Qulture.Rocks", subtitle: "Performance e Engajamento", body: "Plataforma para pesquisas de clima e engajamento, avaliação de desempenho e acompanhamento de OKRs, metas e objetivos.", icon: "📈", color: "#d9f22a" },
          { title: "Comp.vc", subtitle: "Ciclos de Performance", body: "Gestão de mérito, decisões e registros relacionados a reconhecimento e evolução profissional.", icon: "💰", color: "#4FC3F7" },
          { title: "Jira", subtitle: "Chamados e Solicitações", body: "Abertura de chamados para dúvidas sobre folha, benefícios, contratos, férias, rescisões e outros temas que precisam de acompanhamento.", icon: "🎫", color: "#FF6B35" },
          { title: "Intranet", subtitle: "Base de Conhecimento", body: "Nossa base de dados interna com processos, políticas, documentos, benefícios, organograma e muito mais.", icon: "📚", color: "#9C27B0" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Essas ferramentas vão fazer parte do seu dia a dia. Anota aí: Qulture.Rocks para performance, Jira para chamados e a Intranet para tudo mais!",
      layout: "card-deck",
    },
  ]);

  // ── MÓDULO 5: NOSSOS VALORES E PATROCÍNIOS ──────────────────────────────
  const mod5 = await insertModule({
    trailId,
    slug: "gc-valores",
    title: "Módulo 5: Nossos Valores e Patrocínios",
    subtitle: "O que nos guia",
    description: "Conheça os valores que guiam cada decisão na Stellar e nossos patrocínios esportivos.",
    orderIndex: 5,
    pointsReward: 200,
    bonusPoints: 100,
    deadlineDays: 4,
  });
  await insertChapter({ moduleId: mod5, slug: "gc-val-todos", title: "Nossos Valores", description: "Os valores que guiam cada decisão na Stellar.", profileType: "todos", orderIndex: 1 });
  await insertChapter({ moduleId: mod5, slug: "gc-val-patrocinios", title: "Patrocínios e Posicionamento de Marca", description: "Como a Stellar se posiciona no mercado esportivo.", profileType: "todos", orderIndex: 2 });
  await insertSlides(mod5, [
    {
      title: "Nossos Valores",
      content: JSON.stringify({
        intro: "Os valores da Stellar não são apenas palavras na parede — eles guiam cada decisão, cada contratação e cada entrega. Conheça o que nos define:",
        values: [
          {
            name: "Foco no Cliente",
            tagline: "O cliente é o centro de tudo",
            description: "Cada decisão que tomamos começa e termina no cliente. Entendemos suas necessidades, antecipamos seus desejos e entregamos experiências que superam expectativas.",
            icon: "🎯",
            color: "#d9f22a",
            howToLive: [
              "Questione sempre: 'Como isso impacta o cliente?'",
              "Traga a voz do cliente para as reuniões e decisões",
              "Priorize melhorias que geram valor real para quem usa nosso produto",
            ],
            dilemma: {
              question: "Você tem uma funcionalidade tecnicamente perfeita, mas que complica a vida do usuário. O que faz?",
              stellarWay: "Refaz. Tecnologia existe para servir o cliente, não o contrário. Simplicidade e usabilidade sempre ganham.",
            },
          },
          {
            name: "Dono do Negócio",
            tagline: "Pense e aja como dono",
            description: "Cada estrela da Stellar age como se a empresa fosse sua. Isso significa cuidar dos recursos, tomar decisões responsáveis e se importar com os resultados como um todo.",
            icon: "🏠",
            color: "#FF6B35",
            howToLive: [
              "Questione gastos desnecessários e sugira alternativas",
              "Não espere alguém mandar — identifique problemas e resolva",
              "Pense no impacto de longo prazo, não só no curto prazo",
            ],
            dilemma: {
              question: "Você percebe que um processo está gerando custo desnecessário, mas não é da sua área. O que faz?",
              stellarWay: "Levanta a mão e aponta. Dono do negócio não tem 'não é comigo'. Você comunica, sugere e acompanha.",
            },
          },
          {
            name: "Excelência com Velocidade",
            tagline: "Rápido e bem feito",
            description: "No mercado de iGaming, velocidade é vantagem competitiva. Mas velocidade sem qualidade não sustenta. Na Stellar, entregamos rápido e bem — sem escolher um em detrimento do outro.",
            icon: "⚡",
            color: "#4FC3F7",
            howToLive: [
              "Defina o que é 'bom o suficiente' antes de começar",
              "Entregue em ciclos curtos e melhore iterativamente",
              "Não deixe o perfeito ser inimigo do bom — mas não entregue mal feito",
            ],
            dilemma: {
              question: "Você pode entregar algo em 2 dias com 80% de qualidade, ou em 1 semana com 100%. O prazo é crítico. O que faz?",
              stellarWay: "Entrega em 2 dias, comunica o que está faltando e planeja a melhoria. Transparência e velocidade juntas.",
            },
          },
          {
            name: "Colaboração",
            tagline: "Juntos somos mais fortes",
            description: "Nenhuma estrela brilha sozinha. Na Stellar, os melhores resultados vêm de times que colaboram, compartilham conhecimento e se apoiam mutuamente.",
            icon: "🤝",
            color: "#9C27B0",
            howToLive: [
              "Compartilhe conhecimento proativamente — não guarde para si",
              "Peça ajuda quando precisar — isso é força, não fraqueza",
              "Celebre as conquistas do time, não só as suas",
            ],
            dilemma: {
              question: "Você tem uma solução para um problema de outra área, mas compartilhar vai tomar seu tempo. O que faz?",
              stellarWay: "Compartilha. O sucesso da empresa é maior que o sucesso individual. E colaboração gera reciprocidade.",
            },
          },
          {
            name: "Inovação",
            tagline: "Questione, experimente, evolua",
            description: "O mercado de iGaming muda rápido. Quem não inova, fica para trás. Na Stellar, incentivamos questionar o status quo, testar novas ideias e aprender com os erros.",
            icon: "💡",
            color: "#00C853",
            howToLive: [
              "Questione processos que parecem ultrapassados",
              "Proponha experimentos — mesmo que pequenos",
              "Aprenda com os erros sem medo de tentar de novo",
            ],
            dilemma: {
              question: "Você tem uma ideia inovadora, mas não tem certeza se vai funcionar. O que faz?",
              stellarWay: "Testa em pequena escala, mede os resultados e apresenta os aprendizados. Na Stellar, tentativa bem estruturada é sempre bem-vinda.",
            },
          },
        ],
      }),
      betinhaSpeech: "Esses valores não são decoração — eles são o DNA da Stellar! Clica em cada um para conhecer melhor e ver os dilemas. São situações reais do dia a dia!",
      layout: "values",
    },
    {
      title: "Nossos Patrocínios Esportivos",
      content: JSON.stringify({
        cards: [
          { title: "Patrocínio ao Futebol Brasileiro", subtitle: "Presença nos maiores clubes", body: "A EstrelaBet é parceira de grandes clubes do futebol brasileiro, levando a marca para milhões de torcedores em todo o país. Essa presença reforça nossa posição como referência no mercado de apostas esportivas.", icon: "⚽", color: "#d9f22a" },
          { title: "Eventos Esportivos", subtitle: "Presença em grandes eventos", body: "Patrocinamos eventos esportivos de grande porte, garantindo visibilidade da marca e conexão com o público apaixonado por esportes.", icon: "🏟️", color: "#FF6B35" },
          { title: "Marketing Esportivo", subtitle: "Estratégia de marca", body: "Nossa estratégia de patrocínio vai além da visibilidade — criamos experiências únicas para os fãs e construímos uma relação genuína com o esporte brasileiro.", icon: "📣", color: "#4FC3F7" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Os patrocínios são parte importante da nossa estratégia de marca! Quando você vê a EstrelaBet em um jogo, é o resultado de muito trabalho do nosso time de marketing.",
      layout: "card-deck",
    },
  ]);

  // ── MÓDULO 6: AI FIRST ──────────────────────────────────────────────────
  const mod6 = await insertModule({
    trailId,
    slug: "gc-ai-first",
    title: "Módulo 6: AI First — Nossa Cultura de IA",
    subtitle: "Inteligência Artificial no dia a dia",
    description: "Como a Stellar abraça a IA como ferramenta estratégica e como você pode usar no seu trabalho.",
    orderIndex: 6,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 4,
  });
  await insertChapter({ moduleId: mod6, slug: "gc-ai-todos", title: "AI First: Nossa Cultura de IA", description: "Como a IA faz parte do dia a dia na Stellar.", profileType: "todos", orderIndex: 1 });
  await insertChapter({ moduleId: mod6, slug: "gc-ai-lideranca", title: "Liderando Times na Era da IA (Liderança)", description: "Como liderar times que usam IA como ferramenta estratégica.", profileType: "lideranca", orderIndex: 2 });
  await insertSlides(mod6, [
    {
      title: "AI First: O que Significa?",
      content: "Na Stellar, **AI First** não é um slogan — é uma forma de trabalhar.\n\nSignifica que, antes de resolver qualquer problema, perguntamos: **'Como a IA pode ajudar aqui?'**\n\nNão se trata de substituir pessoas — é sobre potencializar o que cada um faz de melhor, eliminando tarefas repetitivas e liberando tempo para o que realmente importa: criatividade, estratégia e relacionamentos.",
      betinhaSpeech: "AI First é sobre trabalhar mais inteligente, não mais difícil! A IA é nossa aliada — e quem aprende a usá-la bem tem uma vantagem enorme.",
      layout: "highlight",
    },
    {
      title: "Ferramentas de IA na Stellar",
      content: JSON.stringify({
        cards: [
          { title: "Kant — Nossa IA Interna", subtitle: "Integrado ao Ro.am", body: "O Kant é nossa plataforma de IA em construção, integrada ao Ro.am. Você pode conversar com o agente, delegar tarefas, automatizar rotinas e acessar ferramentas conectadas como GitHub, e-mail e Jira.", icon: "🤖", color: "#d9f22a" },
          { title: "Grupo AI First no Ro.am", subtitle: "Comunidade de aprendizado", body: "Espaço voluntário para compartilhar novidades, aprendizados e dúvidas sobre IA. Se você testou algo interessante, compartilhe! Se descobriu uma ferramenta nova, traga para o grupo.", icon: "💬", color: "#4FC3F7" },
          { title: "IA Leaders", subtitle: "Referências em IA", body: "Cada área tem IA Leaders — pessoas que se aprofundaram no uso de IA e são referências para o time. Eles estão no grupo AI First e podem te ajudar a começar.", icon: "👑", color: "#9C27B0" },
          { title: "Ferramentas Externas", subtitle: "Conectar e integrar", body: "Microsoft Copilot, Power BI com IA, HubSpot AI, Salesforce Einstein e outras ferramentas do ecossistema que usamos no dia a dia com recursos de IA integrados.", icon: "🔗", color: "#FF6B35" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "O Kant é incrível! Você pode pedir pra ele rascunhar e-mails, organizar anotações, resumir documentos... Experimenta assim que tiver acesso ao Ro.am!",
      layout: "card-deck",
    },
    {
      title: "Como Usar IA no Seu Trabalho",
      content: "**Possibilidades com o Kant e outras IAs:**\n\n• **Automatizar tarefas recorrentes:** agendar relatórios, criar lembretes, gerar resumos automáticos\n\n• **Consultar e interagir com ferramentas:** GitHub, e-mail, Jira e outros sistemas integrados\n\n• **Criar bots de equipe:** agentes especializados no contexto do seu time\n\n• **Simplificar processos:** rascunhar respostas de e-mail, organizar anotações, criar apresentações\n\n• **Auxiliar em análise e pesquisas:** resumir documentos, explorar ideias, analisar dados\n\n**Dica:** Comece pequeno. Escolha uma tarefa repetitiva do seu dia a dia e experimente automatizá-la com IA.",
      betinhaSpeech: "Não precisa ser expert em IA para começar! Escolhe uma tarefa chata do seu dia a dia e testa. O importante é experimentar e compartilhar o que aprendeu.",
      layout: "list",
    },
  ]);

  // ── MÓDULO 7: RITUAIS, CANAIS E SISTEMAS ────────────────────────────────
  const mod7 = await insertModule({
    trailId,
    slug: "gc-rituais",
    title: "Módulo 7: Nossos Rituais, Canais e Sistemas",
    subtitle: "Como nos comunicamos e trabalhamos",
    description: "Conheça os rituais corporativos, os canais de comunicação e os sistemas que usamos no dia a dia.",
    orderIndex: 7,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 4,
  });
  await insertChapter({ moduleId: mod7, slug: "gc-rit-todos", title: "Rituais e Canais de Comunicação", description: "Os rituais corporativos e como nos comunicamos.", profileType: "todos", orderIndex: 1 });
  await insertChapter({ moduleId: mod7, slug: "gc-rit-sistemas", title: "Nossos Sistemas", description: "As plataformas e ferramentas que usamos no dia a dia.", profileType: "todos", orderIndex: 2 });
  await insertSlides(mod7, [
    {
      title: "Nossos Rituais Corporativos",
      content: JSON.stringify({
        cards: [
          { title: "All Hands — Papo de Estrela", subtitle: "Mensal", body: "Alinhamento mensal estratégico de metas, projetos, resultados e reconhecimento com a empresa inteira. É o momento de todos estarem na mesma página.", icon: "🌟", color: "#d9f22a" },
          { title: "GIROBET", subtitle: "Esporádico", body: "Evento para alinhamento de temas, processos e comunicados rápidos. Quando há algo importante que não pode esperar o All Hands.", icon: "🔄", color: "#4FC3F7" },
          { title: "Rock Stars", subtitle: "Semestral", body: "Evento de reconhecimento no encerramento de cada Ciclo de Performance. Momento de celebrar quem se destacou e inspirar o time.", icon: "🎸", color: "#FF6B35" },
          { title: "Shaking Hands", subtitle: "Anual", body: "O ritual anual em que a liderança se alinha sobre onde já chegamos, onde estamos agora e, principalmente, para onde vamos.", icon: "🤝", color: "#9C27B0" },
          { title: "All Stars", subtitle: "Anual — Presencial em BH", body: "Encontro anual presencial em Belo Horizonte para fortalecer a cultura, alinhar estratégia e direcionar os próximos passos da empresa.", icon: "⭐", color: "#00C853" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Os rituais são sagrados na Stellar! Eles garantem que todo mundo esteja alinhado e que as conquistas sejam celebradas. Anota no calendário!",
      layout: "card-deck",
    },
    {
      title: "Nossos Canais de Comunicação",
      content: JSON.stringify({
        cards: [
          { title: "Betinha", subtitle: "Comunicação interna", body: "Responsável pela divulgação interna de comunicados institucionais, sorteios, novidades e também tira dúvidas dos colaboradores. Sou eu! 😄", icon: "⭐", color: "#d9f22a" },
          { title: "Ro.am", subtitle: "Escritório virtual — principal ferramenta", body: "Nosso escritório virtual e principal ferramenta de comunicação interna. Por lá você se conecta, trabalha junto e se comunica todo dia: chats, videochamadas, grupos, gravação de reuniões e Magic Minutes. Acesse pelo navegador, app ou desktop.", icon: "🏠", color: "#4FC3F7" },
          { title: "Stellar News", subtitle: "Canal oficial — leitura obrigatória", body: "Canal oficial de comunicados institucionais. Aqui publicamos informações estratégicas, decisões da companhia e diretrizes. Somente admins publicam.", icon: "📢", color: "#FF6B35" },
          { title: "All Hands (canal)", subtitle: "Comunicação do dia a dia", body: "Espaço aberto para trocas rápidas, avisos operacionais e conversas que envolvem o time como um todo. Comunicação ágil e colaborativa.", icon: "💬", color: "#00C853" },
          { title: "Comunicados PJ", subtitle: "Exclusivo para PJs", body: "Canal exclusivo para Prestadores de Serviço com comunicados sobre benefícios, faturamento, NF, prazos e orientações administrativas.", icon: "📋", color: "#9C27B0", tag: "PJ" },
          { title: "Lideranças", subtitle: "Exclusivo para líderes", body: "Canal exclusivo para líderes com alinhamentos estratégicos, direcionamentos de gestão e temas sensíveis que exigem contexto de liderança.", icon: "👑", color: "#FF4081", tag: "Liderança" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "O Ro.am é o coração da comunicação na Stellar! Fique sempre disponível lá durante o dia. E se for sair, clica em 'Exit' e registra seu horário de retorno.",
      layout: "card-deck",
    },
    {
      title: "Combinados no Ro.am",
      content: "**Regras de ouro do Ro.am:**\n\n• Fique sempre **disponível** na plataforma ao longo do dia. Assim, o time saberá quando pode contar com você!\n\n• Vai sair para uma reunião presencial, almoço ou compromisso pessoal?\n→ Clique em **'Exit'** (canto superior direito), **'Will Return Today'** e registre o seu horário de retorno.\n\n**Canais essenciais:**\n• **Stellar News** — leitura obrigatória (somente admins publicam)\n• **All Hands** — comunicação ágil do dia a dia\n• **Comunicados PJ** — exclusivo para PJs\n• **Lideranças** — exclusivo para líderes\n• **Grupo AI First** — voluntário, para compartilhar sobre IA",
      betinhaSpeech: "Disponível no Ro.am é regra! Não precisa ficar grudado na tela, mas o time precisa saber que pode contar com você.",
      layout: "list",
    },
    {
      title: "Nossos Sistemas",
      content: JSON.stringify({
        cards: [
          { title: "Qulture.Rocks", subtitle: "Performance e Engajamento", body: "Pesquisas de clima e engajamento, avaliação de desempenho e acompanhamento de OKRs, metas e objetivos.", icon: "📊", color: "#d9f22a" },
          { title: "Convenia", subtitle: "RH e Administrativo", body: "Solicitar e acompanhar férias, manter e consultar dados cadastrais, acessar informações administrativas relacionadas ao vínculo com a empresa.", icon: "📁", color: "#4FC3F7" },
          { title: "Inhire", subtitle: "Recrutamento e Seleção", body: "Solicitar e acompanhar abertura de vagas, gerenciar processos seletivos, fazer indicação de candidatos e acompanhar o status das posições.", icon: "👥", color: "#FF6B35" },
          { title: "Comp.vc", subtitle: "Ciclos de Performance", body: "Ciclos de performance, gestão de mérito e decisões relacionadas a reconhecimento e evolução profissional.", icon: "💰", color: "#9C27B0" },
          { title: "Jira", subtitle: "Chamados e Solicitações", body: "Abertura de chamados para dúvidas sobre folha, benefícios, contratos, férias, rescisões e outros temas que precisam de acompanhamento e histórico.", icon: "🎫", color: "#00C853" },
          { title: "Intranet", subtitle: "Base de Conhecimento", body: "Nossa base de dados interna com processos, políticas, documentos, benefícios, organograma e muito mais. Se procura algo, geralmente está lá!", icon: "📚", color: "#FF4081" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Esses sistemas são seus aliados no dia a dia! Salva os links na Intranet — lá você encontra o acesso a todos eles.",
      layout: "card-deck",
    },
  ]);

  // ── MÓDULO 8: NOSSA ROTINA — ENCERRAMENTO ───────────────────────────────
  const mod8 = await insertModule({
    trailId,
    slug: "gc-rotina",
    title: "Módulo 8: Nossa Rotina, Nosso Dia a Dia",
    subtitle: "Dress code, combinados e escritórios",
    description: "Tudo sobre o dia a dia na Stellar: dress code, combinados, escritórios e canal de denúncia.",
    orderIndex: 8,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 3,
  });
  await insertChapter({ moduleId: mod8, slug: "gc-rot-todos", title: "Combinados e Rotina", description: "Dress code, regras de convivência e estrutura dos escritórios.", profileType: "todos", orderIndex: 1 });
  await insertSlides(mod8, [
    {
      title: "Dress Code",
      content: "**Camisa corporativa:** é brinde, mas não é de uso obrigatório.\n\nPor aqui, você pode se vestir da maneira que se sentir mais confortável!\n\n**Só não vale:** usar roupas com a logo da concorrência. 😄\n\nA Stellar acredita que pessoas confortáveis trabalham melhor. Seja autêntico(a)!",
      betinhaSpeech: "Liberdade de expressão no dress code! Só não aparece com a camisa da concorrência, tá? 😄 Fora isso, seja você mesmo!",
      layout: "highlight",
    },
    {
      title: "Nossos Combinados",
      content: "**Representação da empresa:**\nNão é permitido representar ou falar em nome da empresa e de seus clientes para terceiros ou a imprensa, a menos que tenha recebido autorização da presidência ou da área de Relações Públicas.\n\n**Confidencialidade:**\nNão é permitido expor dados pessoais de clientes e fornecedores, logins/senhas, planejamento estratégico, planos de negócios, orçamento ou propriedade intelectual.\n\n**Plataforma de apostas:**\nNão é permitido realizar qualquer tipo de compra ou contratação de produtos e/ou serviços (apostas) ofertados na plataforma www.estrelabet.bet.br.",
      betinhaSpeech: "Esses combinados são importantes! Confidencialidade é levada muito a sério aqui. Em caso de dúvida, consulte sua liderança ou o time de Gente e Cultura.",
      layout: "list",
    },
    {
      title: "Nossos Escritórios",
      content: "**Acesso aos prédios:**\nAs entradas são através de **reconhecimento facial**. Em caso de problemas, acione o Time de Facilities.\n\n**Nas copas você vai encontrar:**\n• Frutas frescas\n• Biscoitos doces e salgados\n• Máquina com café e chá (gratuitos)\n• Pipocas, refrigerantes, cerveja e sucos\n\n**Nos banheiros:**\n• Absorvente disponível\n\n**Quick Massage:**\nSessões de quick massage nos escritórios para promover bem-estar:\n• **Belo Horizonte:** segundas e quartas-feiras\n• **São Paulo:** sextas-feiras\n• Cada pessoa pode agendar até 4 sessões por mês\n• Contraindicado para gestantes e pessoas com sintomas gripais",
      betinhaSpeech: "Os escritórios da Stellar são incríveis! Café gratuito, frutas e até quick massage! Aproveita tudo isso — é pra você mesmo.",
      layout: "list",
    },
    {
      title: "Canal de Denúncia",
      content: "A Stellar tem um **canal de denúncia** onde tratamos todas as denúncias com **imparcialidade e sigilo**.\n\n**Como acionar:**\n• **E-mail:** denuncia@intlmkt.com.br\n• Conversar com sua **liderança**\n• Conversar com o time de **Gente e Cultura**\n\nQualquer situação de assédio moral, sexual, discriminação ou violação de políticas deve ser reportada. Garantimos sigilo e tratamento justo para todos os casos.",
      betinhaSpeech: "O canal de denúncia existe para garantir um ambiente seguro e respeitoso para todos. Não hesite em usá-lo se precisar. Sua segurança é prioridade!",
      layout: "highlight",
    },
  ]);

  console.log("✅ Trilha Gente e Cultura: 8 módulos inseridos com conteúdo completo do roteiro");
}

// ─────────────────────────────────────────────────────────────────────────────
// TRILHA 2: DEPARTAMENTO PESSOAL
// ─────────────────────────────────────────────────────────────────────────────
async function seedDepartamentoPessoal() {
  const trailId = await insertTrail({
    slug: "departamento-pessoal",
    title: "Trilha de Onboarding: Departamento Pessoal",
    description: "Tudo sobre benefícios, salário, ponto eletrônico, jornada de trabalho e ausências.",
    icon: "FileText",
    color: "#4FC3F7",
    orderIndex: 2,
  });

  // ── MÓDULO 1: BENEFÍCIOS DE SER ESTRELA ─────────────────────────────────
  const mod1 = await insertModule({
    trailId,
    slug: "dp-beneficios",
    title: "Módulo 1: Benefícios de Ser Estrela",
    subtitle: "VT, VA, Plano de Saúde, Incentivos e muito mais",
    description: "Conheça todos os benefícios da Stellar: vale-transporte, alimentação, plano de saúde, odonto, seguro de vida, incentivos e benefícios de lazer.",
    orderIndex: 1,
    pointsReward: 200,
    bonusPoints: 100,
    deadlineDays: 5,
  });
  await insertChapter({ moduleId: mod1, slug: "dp-ben-clt", title: "Benefícios CLT", description: "Todos os benefícios para colaboradores CLT.", profileType: "clt", orderIndex: 1 });
  await insertChapter({ moduleId: mod1, slug: "dp-ben-pj", title: "Benefícios PJ", description: "Todos os benefícios para prestadores de serviço PJ.", profileType: "pj", orderIndex: 2 });
  await insertChapter({ moduleId: mod1, slug: "dp-ben-todos", title: "Benefícios para Todos", description: "Benefícios de lazer e bem-estar para CLT e PJ.", profileType: "todos", orderIndex: 3 });
  await insertSlides(mod1, [
    {
      title: "Vale-Transporte e Vale-Mobilidade",
      content: JSON.stringify({
        cards: [
          {
            title: "CLT | Vale-Transporte",
            subtitle: "Desconto de R$ 1,00 em folha",
            body: "A recarga é feita diretamente na folha de pagamento.\n\n• Regime Híbrido (3x presencial/semana ou escala 12x36): pagamento fixo considerando 16 dias úteis ao mês.\n• Regime 100% presencial: pagamento fixo considerando 22 dias úteis ao mês.",
            icon: "🚌",
            color: "#00C853",
            tag: "CLT",
          },
          {
            title: "PJ | Vale-Mobilidade",
            subtitle: "Para PJs em regime híbrido (mín. 3x/semana)",
            body: "Crédito realizado pelo cartão Caju até o dia 30 de cada mês.\n\nValores:\n• Belo Horizonte: R$ 250,00\n• São Paulo: R$ 350,00",
            icon: "🚗",
            color: "#FF6B35",
            tag: "PJ",
          },
        ],
        columns: 2,
      }),
      betinhaSpeech: "O vale-transporte CLT tem desconto de apenas R$ 1,00 em folha. E o vale-mobilidade PJ é creditado direto no Caju!",
      layout: "card-deck",
    },
    {
      title: "Vale-Alimentação — Cartão Caju",
      content: "Aqui na Stellar, usamos o **cartão Caju**, que possibilita o uso flexível em estabelecimentos de refeição e alimentação.\n\n**Valores — Escala Comercial:**\n\n| Cidade | Valor |\n|---|---|\n| Belo Horizonte e demais cidades | R$ 880,00 |\n| São Paulo (capital e estado) | R$ 1.100,00 |\n\n**Valores — Escala 12x36:**\n\n| Cidade | Valor |\n|---|---|\n| Belo Horizonte e demais cidades | R$ 640,00 |\n| São Paulo (capital e estado) | R$ 800,00 |\n\n**Perdi o vale, o que faço?**\nEntre em contato com o Departamento Pessoal imediatamente por e-mail. A solicitação do cartão adicional é R$ 15,00. São 7 dias úteis para o recebimento do novo cartão.",
      betinhaSpeech: "O Caju é flexível — você pode usar em restaurantes e supermercados! E se perder o cartão, aciona o DP imediatamente.",
      layout: "default",
    },
    {
      title: "Plano de Saúde e Odontológico",
      content: JSON.stringify({
        cards: [
          {
            title: "CLT | Plano de Saúde SulAmérica",
            subtitle: "100% custeado pela empresa",
            body: "Plano Direto Nacional Enfermaria.\n\n• Ativação no 1º dia útil do mês subsequente\n• Acesso pelo app: carteirinha digital, rede, exames\n• Inclusão de dependentes legais (cônjuges e filhos) em até 1 semana após admissão\n• Plano coparticipativo: consulta até R$ 30, PA até R$ 50, exames até R$ 30\n• Fator de coparticipação: 30%",
            icon: "❤️",
            color: "#EF5350",
            tag: "CLT",
          },
          {
            title: "CLT | Plano Odontológico SulAmérica",
            subtitle: "100% custeado pela empresa",
            body: "• Ativação no 1º dia útil do mês subsequente\n• Dependentes: cônjuges, filhos, pai/mãe, sogro(a), genro/nora, sobrinhos, irmãos e netos\n• Valor por dependente: R$ 14,22/vida\n• Inclusão via chamado no portal de Gente e Cultura",
            icon: "🦷",
            color: "#4FC3F7",
            tag: "CLT",
          },
          {
            title: "PJ | Plano de Saúde SulAmérica",
            subtitle: "Plano Especial 100",
            body: "• Solicitação pelo formulário na Intranet até o dia 10 de cada mês\n• Ativação no 1º dia útil do mês subsequente\n• CNPJ com mínimo 6 meses de abertura (MEI e Empresário Individual)\n\nDocumentos necessários: contrato de prestação de serviço, última NF, contrato social/MEI, comprovante de endereço, documentos pessoais",
            icon: "❤️",
            color: "#EF5350",
            tag: "PJ",
          },
          {
            title: "PJ | Plano Odontológico",
            subtitle: "Mesmos dependentes que o CLT",
            body: "Dependentes: cônjuges, filhos, pai/mãe, sogro(a), genro/nora, sobrinhos, irmãos e netos.\n\nValor: R$ 14,22/vida.",
            icon: "🦷",
            color: "#4FC3F7",
            tag: "PJ",
          },
        ],
        columns: 2,
      }),
      betinhaSpeech: "O plano de saúde é um dos benefícios mais valorizados! CLT tem 100% custeado pela empresa. PJ pode contratar pelo formulário na Intranet.",
      layout: "card-deck",
    },
    {
      title: "Seguro de Vida",
      content: "A Stellar oferece **Seguro de Vida Prudential** para toda a constelação:\n\n**Cobertura:**\n• **Colaborador:** 24 salários, limitado a R$ 1.000.000,00\n• **Cônjuge:** 50% de 24 salários, limitado a R$ 500.000,00\n• **Filhos:** 25% de 24 salários, limitado a R$ 100.000,00\n• **Assistência Funeral:** R$ 7.000,00\n\nO seguro é automático — não é necessário nenhuma ação para ativar.",
      betinhaSpeech: "O seguro de vida é automático e cobre você e sua família. É uma proteção importante que a Stellar oferece para toda a constelação!",
      layout: "highlight",
    },
    {
      title: "Incentivos e Programas Especiais",
      content: JSON.stringify({
        cards: [
          {
            title: "Programa de Indicação #EstrelaIndica",
            subtitle: "Indique e ganhe bônus",
            body: "Indique alguém para uma vaga e ganhe bônus se a pessoa for contratada!\n\nRegras: a pessoa indicada precisa ser contratada; você precisa indicar antes dela se candidatar; uma indicação a cada 3 meses; pagamento após período de experiência.\n\nValores: Head/Gerente R$ 700 | Supervisores/Coordenadores/Especialistas R$ 600 | Analistas R$ 500",
            icon: "⭐",
            color: "#d9f22a",
          },
          {
            title: "PJ | Bonificação Contratual Adicional",
            subtitle: "Pagamento em dezembro",
            body: "Bonificação a título de incentivo por cumprimento de metas e prazos contratuais. Pagamento em dezembro de cada ano. Aplica-se exclusivamente a PJs. Valor e critérios conforme contrato.",
            icon: "💰",
            color: "#FF6B35",
            tag: "PJ",
          },
          {
            title: "PJ | Incentivo para Período de Pausa",
            subtitle: "Após 12 meses de prestação de serviços",
            body: "30 dias corridos de pausa, alinhados com a liderança e registrados via Convenia. Durante a pausa: 1/3 do valor contratual mensal, proporcional aos dias gozados.",
            icon: "🏖️",
            color: "#4FC3F7",
            tag: "PJ",
          },
          {
            title: "CLT | Auxílio Home Office",
            subtitle: "Para regime híbrido (3x/semana)",
            body: "R$ 120,00 por mês, pago junto com a folha de pagamento.\n\nNão é pago em período de férias. Não válido para regime 100% presencial ou escala 12x36.",
            icon: "🏠",
            color: "#9C27B0",
            tag: "CLT",
          },
        ],
        columns: 2,
      }),
      betinhaSpeech: "O #EstrelaIndica é incrível! Se você conhece alguém que seria perfeito para a Stellar, indique e ainda ganhe um bônus. Ganha você, ganha a empresa!",
      layout: "card-deck",
    },
    {
      title: "Descontos em Educação",
      content: JSON.stringify({
        cards: [
          { title: "Cultura Inglesa", subtitle: "Desconto exclusivo", body: "Acesse o link exclusivo da EstrelaBet, informe que trabalha na empresa e solicite ao RH uma declaração de comprovação de vínculo.", icon: "🇬🇧", color: "#d9f22a" },
          { title: "Faculdade FUMEC", subtitle: "20% de desconto", body: "Entre em contato: 0800 0300 200 ou (31) 98635-3302 (WhatsApp) e apresente o contracheque. O desconto é apenas para cursos a serem iniciados.", icon: "🎓", color: "#4FC3F7" },
          { title: "Unicesumar", subtitle: "20% de desconto (EAD e híbrido)", body: "10% pelo convênio + 10% por pontualidade. Válido a partir da 2ª mensalidade. Para colaboradores, dependentes e cônjuges. Cursos de graduação, pós, técnicos e profissionalizantes.", icon: "📚", color: "#FF6B35" },
          { title: "Grupo Ânima", subtitle: "Descontos variados", body: "Descontos em cursos de Graduação e Pós-graduação nas instituições: UNA, UniBH, Faculdades Milton Campos, FASEH, Anhembi Morumbi, São Judas, BSP, UniSociesc, UniRitter, FADERGS, UniCuritiba, Unisul, UNIFACS, UnP, AGES, UNIFG, FPB e IBMR.", icon: "🏫", color: "#9C27B0" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Investir em educação é investir em você! A Stellar tem parcerias incríveis com faculdades e cursos de idiomas. Aproveita!",
      layout: "card-deck",
    },
    {
      title: "Premiação Semestral",
      content: "A **Premiação Semestral** é uma das formas de reconhecimento mais importantes da Stellar.\n\n**Como funciona:**\n• Pagamento em até 2 meses após o fechamento do semestre\n• Para PJ: obrigatória emissão de nota fiscal\n• No mês de início, períodos inferiores a 15 dias não são considerados\n• Em caso de rescisão durante o ciclo, não é devida nenhuma parcela\n\n**Múltiplos de salário (anual):**\n\n| Cargo | Múltiplo |\n|---|---|\n| Diretor | 5x |\n| Head | 4x |\n| Gerente | 3,5x |\n| Coordenador | 3x |\n| Especialista | 3x |\n| Supervisor | 2x |\n| Analista | 2x |\n| Assistente | 2x |",
      betinhaSpeech: "A premiação semestral é uma das melhores partes de ser estrela! Foca nas metas e nos valores — eles são a base para o reconhecimento.",
      layout: "default",
    },
    {
      title: "Benefícios de Lazer e Bem-Estar",
      content: JSON.stringify({
        cards: [
          { title: "Wellhub", subtitle: "Acesso automático em 10-15 dias", body: "Acesso à plataforma Wellhub com centenas de academias, estúdios e atividades físicas. Pode adicionar até 3 dependentes. Disponível para CLT e PJ.", icon: "💪", color: "#00C853" },
          { title: "Conexa Saúde", subtitle: "Telemedicina e terapia online", body: "Uma consulta gratuita de telemedicina no pronto-atendimento + duas sessões de terapia online gratuitas mensalmente. Pode adicionar até 2 dependentes.", icon: "🏥", color: "#4FC3F7" },
          { title: "Day Off Aniversário", subtitle: "Um dia só seu!", body: "No mês do seu aniversário, escolha um dia para tirar folga. Combine com sua liderança. Válido apenas no mês do aniversário.", icon: "🎂", color: "#FF6B35" },
          { title: "Day Off Aniversário dos Filhos", subtitle: "Curta em família!", body: "No aniversário dos filhos biológicos ou adotivos cadastrados na Convenia, você tem um dia de folga. Alinhe com a liderança.", icon: "👶", color: "#9C27B0" },
          { title: "Licença Paternidade Estendida", subtitle: "30 dias corridos", body: "30 dias corridos para aproveitar com seu bebê. Kit Baby Estrelinha: envie a certidão de nascimento para o DP (dp@estrelabet.com) e receba o kit em casa.", icon: "👨‍👩‍👧", color: "#d9f22a" },
          { title: "OnHappy", subtitle: "Viagens com descontos especiais", body: "Benefício corporativo de viagens mais práticas e econômicas. Todos os colaboradores são cadastrados automaticamente. Acesse o site e ative sua conta.", icon: "✈️", color: "#FF4081" },
          { title: "Cartão SESC (CLT)", subtitle: "Gratuito para CLTs", body: "Descontos e benefícios em lazer, esporte, cultura e viagens em todo o Brasil. Inclua dependentes: pai, mãe, cônjuge, filhos, enteados, netos.", icon: "🎭", color: "#4FC3F7", tag: "CLT" },
          { title: "Quick Massage", subtitle: "Nos escritórios", body: "Sessões de 15 minutos nos escritórios. BH: segundas e quartas. SP: sextas. Até 4 sessões por mês. Contraindicado para gestantes e pessoas com sintomas gripais.", icon: "💆", color: "#00C853" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Olha que lista incrível de benefícios! A Stellar se preocupa com o seu bem-estar dentro e fora do trabalho. Aproveita tudo isso!",
      layout: "card-deck",
    },
  ]);

  // ── MÓDULO 2: ROTINAS DE DP ──────────────────────────────────────────────
  const mod2 = await insertModule({
    trailId,
    slug: "dp-rotinas",
    title: "Módulo 2: Rotinas de DP — Salário, Ponto e Ausências",
    subtitle: "Pagamento, jornada e ausências permitidas",
    description: "Tudo sobre salário CLT, pagamento PJ, ponto eletrônico, jornada de trabalho e ausências permitidas.",
    orderIndex: 2,
    pointsReward: 200,
    bonusPoints: 100,
    deadlineDays: 5,
  });
  await insertChapter({ moduleId: mod2, slug: "dp-rot-clt", title: "Salário, Ponto e Ausências (CLT)", description: "Tudo sobre pagamento, ponto eletrônico e ausências para CLTs.", profileType: "clt", orderIndex: 1 });
  await insertChapter({ moduleId: mod2, slug: "dp-rot-pj", title: "Pagamento e Nota Fiscal (PJ)", description: "Como funciona o pagamento e a emissão de NF para PJs.", profileType: "pj", orderIndex: 2 });
  await insertChapter({ moduleId: mod2, slug: "dp-rot-lideranca", title: "Responsabilidades da Liderança no DP (Liderança)", description: "O que a liderança precisa fazer no dia a dia do DP.", profileType: "lideranca", orderIndex: 3 });
  await insertSlides(mod2, [
    {
      title: "CLT | Salário e Adiantamento",
      content: "**Pagamento:**\nRealizado até o **5º dia útil** do mês subsequente.\nO contracheque é disponibilizado mensalmente via **Convenia**.\n\n**Adiantamento Salarial:**\n• Disponível automaticamente a partir do **2º mês**\n• Valor: **20%** do salário-base contratual\n• Data de pagamento: até o dia **20** do mês vigente\n• Não quer receber? Abra um chamado informando que não possui interesse.",
      betinhaSpeech: "Salário até o 5º dia útil e adiantamento disponível a partir do 2º mês. Tudo automático — mas se não quiser o adiantamento, é só abrir um chamado!",
      layout: "highlight",
    },
    {
      title: "PJ | Pagamento e Nota Fiscal",
      content: "**Pagamento:**\nAté o **5º dia útil** com a emissão da nota dentro do prazo.\n\n**Emissão da Nota Fiscal:**\n• Considere no cálculo o **valor mensal contratual**\n• Envie a NF até o **dia 25** do mês vigente\n• E-mail: **notas.pj@estrelabet.com** (integrado ao Oracle)\n• Acesse o Oracle em **janela anônima** (para não conflitar com o login corporativo)\n\n**Pontos de atenção:**\n• O endereço da empresa na NF deve ser o mesmo do Oracle\n• Verifique se os dados bancários estão corretos (Nubank e PicPay podem ter bloqueios)\n• Admissões após o dia 01: cálculo proporcional conforme orientado na Intranet",
      betinhaSpeech: "PJ: NF até o dia 25 para receber no 5º dia útil! E lembra: acessa o Oracle em janela anônima. Isso é importante para não ter problema de login!",
      layout: "list",
    },
    {
      title: "CLT | Jornada de Trabalho",
      content: JSON.stringify({
        cards: [
          { title: "Jornada Semanal", subtitle: "Padrão comercial", body: "44 horas semanais | 08h às 18h\n\nFlexibilidade: 1 hora antes ou depois para entrada e saída (exceto escala 12x36).\n\nEscala 12x36: 180h mensais com 1 hora de intervalo.", icon: "🕐", color: "#d9f22a" },
          { title: "Intervalos Obrigatórios", subtitle: "Pausas durante o expediente", body: "• 4 a 6 horas de trabalho: intervalo mínimo de 15 minutos\n• Acima de 6 horas: intervalo mínimo de 1 hora\n• Entre jornadas: descanso mínimo de 11 horas consecutivas", icon: "☕", color: "#4FC3F7" },
          { title: "Tolerâncias e Horas Extras", subtitle: "Regras importantes", body: "• Tolerância diária: até 10 minutos de atraso (não impacta o saldo)\n• Máximo de 2 horas extras por dia (com autorização prévia da liderança)\n• Horas extras em domingos/feriados: evitar, salvo casos alinhados\n• Período noturno (22h-5h): horas extras apenas com autorização", icon: "⏰", color: "#FF6B35" },
          { title: "Registros de Ponto Obrigatórios", subtitle: "4 batidas por dia", body: "1. ENTRADA: início das atividades\n2. SAÍDA DO ALMOÇO: pausa para refeição\n3. VOLTA DO ALMOÇO: retorno das atividades\n4. SAÍDA: fim do expediente", icon: "📱", color: "#9C27B0" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Ponto eletrônico é sério! São 4 batidas por dia — entrada, saída almoço, volta almoço e saída. Não esqueça nenhuma!",
      layout: "card-deck",
    },
    {
      title: "Sistema de Ponto Eletrônico",
      content: "**Aplicativos de ponto:**\n\nVocê receberá o e-mail de primeiro acesso com link, código da empresa, login e senha no seu e-mail corporativo.\n\nCódigo da empresa: **a288431**\n\n**Dois aplicativos obrigatórios:**\n• **Ahgora Multi** — para registro do ponto\n• **My Ahgora** — para todos os ajustes e lançamentos\n\n**Regras essenciais:**\n• O registro de ponto deve ser realizado no **horário exato** da ocorrência\n• É **proibido** registrar ponto em nome de outra pessoa\n• Ajustes manuais frequentes comprometem a confiabilidade do controle de jornada\n\n**Fechamento do ponto:**\nApuração pelo DP do **21° ao 20°** do mês seguinte.",
      betinhaSpeech: "Dois apps de ponto: Ahgora Multi para bater o ponto e My Ahgora para ajustes. Código da empresa: a288431. Salva esse número!",
      layout: "list",
    },
    {
      title: "Ausências Permitidas — CLT",
      content: JSON.stringify({
        cards: [
          { title: "Atestado Médico", subtitle: "1 dia ou mais", body: "Justifica ausência por motivos de saúde. Lance no sistema com o anexo. Afastamentos acima de 15 dias: registre os primeiros 15 dias; a partir do 16º, o INSS assume com apoio do RH.", icon: "🏥", color: "#EF5350" },
          { title: "Declaração de Comparecimento", subtitle: "Período do dia", body: "Para consultas e exames durante o expediente. Abona somente as horas ausentes. Exige registro de ponto que comprove cumprimento parcial da jornada.", icon: "📋", color: "#4FC3F7" },
          { title: "Atestado de Óbito", subtitle: "2 dias corridos", body: "Para falecimento de cônjuge, companheiro(a), ascendentes, descendentes, irmãos e dependentes legais. Anexar certidão de óbito e informar parentesco.", icon: "🕊️", color: "#9C27B0" },
          { title: "Atestado de Casamento", subtitle: "3 dias consecutivos", body: "A partir da data do casamento. Anexar certidão de casamento.", icon: "💍", color: "#FF6B35" },
          { title: "Acompanhamento Familiar", subtitle: "Conforme legislação", body: "Para acompanhamento de dependentes legais. Documentação necessária conforme o caso.", icon: "👨‍👩‍👧", color: "#00C853" },
          { title: "Declaração Escolar", subtitle: "Dependentes até 14 anos", body: "Abono para acompanhar dependentes de até 14 anos em atividades escolares.", icon: "🎒", color: "#d9f22a" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Ausências têm regras! O mais importante: lance o atestado no sistema em até 48 horas e entregue o original ao DP em até 5 dias úteis.",
      layout: "card-deck",
    },
    {
      title: "Responsabilidades da Liderança no DP",
      content: "**O que a liderança precisa fazer no dia a dia:**\n\n• **Acompanhar, validar e ajustar o ponto diário** dos liderados\n\n• **Monitorar horas extras, atrasos e intervalos** — e agir quando necessário\n\n• **Lançar os afastamentos:** Day Off, falta injustificada, troca de escala, etc.\n\n• **Informar ao DP** recorrências de faltas, licenças prolongadas e situações que precisam de atenção\n\n**Ausências lançadas pelo RH (não pela liderança):**\n• Licença Maternidade (120 dias corridos)\n• Licença Paternidade (30 dias corridos)\n• Auxílio-Doença (afastamentos superiores a 15 dias)\n• Licença Militar Definitiva",
      betinhaSpeech: "Líderes: o ponto é responsabilidade de vocês também! Monitorem diariamente e informem o DP sobre qualquer situação fora do comum.",
      layout: "list",
    },
  ]);

  console.log("✅ Trilha Departamento Pessoal: 2 módulos inseridos com conteúdo completo do roteiro");
}

// ─────────────────────────────────────────────────────────────────────────────
// TRILHA 3: SAÚDE E SEGURANÇA DO TRABALHO
// ─────────────────────────────────────────────────────────────────────────────
async function seedSegurancaTrabalho() {
  const trailId = await insertTrail({
    slug: "seguranca-trabalho",
    title: "Trilha de Onboarding: Saúde e Segurança do Trabalho",
    description: "Conheça as normas de segurança, ergonomia, CIPAA, brigada de incêndio e como agir em acidentes.",
    icon: "Shield",
    color: "#EF5350",
    orderIndex: 3,
  });

  // ── MÓDULO 1: MISSÃO E ATUAÇÃO ──────────────────────────────────────────
  const mod1 = await insertModule({
    trailId,
    slug: "sst-missao",
    title: "Módulo 1: Nossa Missão e Atuação em SST",
    subtitle: "O que é Saúde e Segurança do Trabalho",
    description: "Entenda a missão da área de SST, como atuamos e as Normas Regulamentadoras que seguimos.",
    orderIndex: 1,
    pointsReward: 100,
    bonusPoints: 50,
    deadlineDays: 3,
  });
  await insertChapter({ moduleId: mod1, slug: "sst-mis-todos", title: "Missão e Atuação em SST", description: "O que é SST e como a Stellar cuida da saúde e segurança.", profileType: "todos", orderIndex: 1 });
  await insertSlides(mod1, [
    {
      title: "Nossa Missão em SST",
      content: "**Missão:** Garantir um ambiente seguro, saudável e sem impactos ambientais, protegendo a integridade física e o bem-estar de todos.\n\n**Como atuamos:**\nIdentificamos e controlamos os **riscos ocupacionais** — físicos, químicos, biológicos, ergonômicos, de acidentes e psicossociais — prevenindo situações que possam afetar sua saúde ou causar acidentes.\n\n**Base legal:**\nSeguimos as práticas orientadas nas **Normas Regulamentadoras (NRs)**, que abordam diferentes contextos de trabalho e são obrigatórias por lei.",
      betinhaSpeech: "Saúde e segurança não é burocracia — é cuidado com você! A Stellar leva isso muito a sério. Vamos aprender juntos como manter o ambiente seguro?",
      layout: "highlight",
    },
    {
      title: "O que São as Normas Regulamentadoras?",
      content: "As **Normas Regulamentadoras (NRs)** são regras criadas pelo Ministério do Trabalho que estabelecem os requisitos mínimos de segurança e saúde para os trabalhadores.\n\n**Exemplos de NRs relevantes para nosso contexto:**\n\n• **NR-1** — Disposições Gerais e Gerenciamento de Riscos\n• **NR-5** — CIPAA (Comissão Interna de Prevenção de Acidentes e Assédio)\n• **NR-17** — Ergonomia\n• **NR-23** — Proteção Contra Incêndios\n\nConhecer essas normas é importante para entender seus direitos e responsabilidades.",
      betinhaSpeech: "As NRs são a lei que protege você no trabalho! Não precisa decorar todas, mas é bom conhecer as principais que se aplicam ao nosso dia a dia.",
      layout: "default",
    },
  ]);

  // ── MÓDULO 2: RISCOS E PERIGOS ──────────────────────────────────────────
  const mod2 = await insertModule({
    trailId,
    slug: "sst-riscos",
    title: "Módulo 2: Riscos e Perigos no Trabalho",
    subtitle: "Identificando e prevenindo riscos",
    description: "Aprenda a diferença entre perigo e risco, conheça os tipos de riscos ocupacionais e como a ergonomia protege sua saúde.",
    orderIndex: 2,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 4,
  });
  await insertChapter({ moduleId: mod2, slug: "sst-ris-todos", title: "Riscos Ocupacionais e Ergonomia", description: "Tipos de riscos e como a ergonomia protege sua saúde.", profileType: "todos", orderIndex: 1 });
  await insertSlides(mod2, [
    {
      title: "Perigo vs. Risco: Qual a Diferença?",
      content: "**Perigo** é a fonte ou situação com potencial de causar dano. É algo que existe independente de você.\n\n**Risco** é a probabilidade de o perigo causar dano, considerando a exposição e as consequências.\n\n**Exemplo prático:**\n• **Perigo:** fio elétrico exposto\n• **Risco:** probabilidade de levar um choque ao tocar no fio\n\nEntender essa diferença é fundamental para identificar e controlar situações perigosas no ambiente de trabalho.",
      betinhaSpeech: "Perigo é o que existe. Risco é a chance de ser afetado por ele. Identificar os dois é o primeiro passo para se proteger!",
      layout: "default",
    },
    {
      title: "Tipos de Riscos Ocupacionais",
      content: JSON.stringify({
        cards: [
          { title: "Riscos Físicos", subtitle: "Agentes físicos no ambiente", body: "Exposição a agentes físicos que podem prejudicar a saúde.\n\nExemplos: ruído excessivo, calor, frio, vibração, radiação e umidade.", icon: "🔊", color: "#FF6B35" },
          { title: "Riscos Químicos", subtitle: "Substâncias nocivas", body: "Contato com substâncias químicas que podem prejudicar a saúde.\n\nExemplos: poeiras, fumos, gases, vapores, solventes e produtos de limpeza.", icon: "⚗️", color: "#9C27B0" },
          { title: "Riscos Biológicos", subtitle: "Micro-organismos e contaminantes", body: "Exposição a micro-organismos e materiais contaminados.\n\nExemplos: vírus, bactérias, fungos, sangue contaminado e lixo hospitalar.", icon: "🦠", color: "#EF5350" },
          { title: "Riscos Ergonômicos", subtitle: "Condições que afetam o corpo", body: "Relacionados às condições de trabalho que afetam o corpo.\n\nExemplos: má postura, esforço repetitivo, levantamento de peso e mobiliário inadequado.", icon: "🪑", color: "#4FC3F7" },
          { title: "Riscos de Acidentes", subtitle: "Situações de acidente imediato", body: "Situações que podem causar acidentes imediatos.\n\nExemplos: máquinas sem proteção, fios expostos, piso escorregadio, quedas e incêndios.", icon: "⚠️", color: "#FFD700" },
          { title: "Riscos Psicossociais", subtitle: "Impactos na saúde mental", body: "Relacionados à organização do trabalho e impactos na saúde mental e emocional.\n\nExemplos: excesso de cobrança, assédio moral, sobrecarga, estresse e conflitos interpessoais.", icon: "🧠", color: "#00C853" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "São 6 tipos de riscos ocupacionais! No nosso contexto de escritório, os mais comuns são os ergonômicos e psicossociais. Fique atento!",
      layout: "card-deck",
    },
    {
      title: "Ergonomia: Cuide do Seu Corpo",
      content: JSON.stringify({
        cards: [
          { title: "Postura Correta", subtitle: "Quadris e encosto", body: "Posicione seus quadris para trás, o mais próximo possível do encosto da cadeira. Mantenha a coluna apoiada e os ombros relaxados.", icon: "🪑", color: "#d9f22a" },
          { title: "Ajuste da Cadeira", subtitle: "Cotovelos em 90°", body: "A cadeira possui altura ajustável e encosto inclinável. Ajuste a altura em relação à mesa de forma que seus cotovelos fiquem dobrados em 90°.", icon: "⚙️", color: "#4FC3F7" },
          { title: "Posição do Monitor", subtitle: "Nível dos olhos", body: "Mantenha o monitor diretamente à frente dos olhos, com a parte superior da tela ao nível dos olhos ou ligeiramente abaixo. Ajuste brilho e contraste para conforto visual.", icon: "🖥️", color: "#FF6B35" },
          { title: "Organização do Espaço", subtitle: "Itens ao alcance", body: "Mantenha os itens frequentemente usados ao alcance das mãos para evitar movimentos repetitivos e torções desnecessárias.", icon: "📐", color: "#9C27B0" },
          { title: "Apoio de Pés", subtitle: "Quando necessário", body: "Após ajustar a cadeira, pode ser necessário usar suporte para os pés. Os joelhos devem estar no mesmo nível dos quadris.", icon: "👟", color: "#00C853" },
          { title: "Posição do Mouse", subtitle: "Próximo ao teclado", body: "Posicione o mouse próximo ao teclado para minimizar a amplitude de movimento entre os dois. Isso reduz o esforço nos ombros e braços.", icon: "🖱️", color: "#EF5350" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Ergonomia é prevenção! Uma postura correta hoje evita dores e problemas de saúde no futuro. Vale muito a pena ajustar sua estação de trabalho!",
      layout: "card-deck",
    },
  ]);

  // ── MÓDULO 3: CIPAA E BRIGADA ───────────────────────────────────────────
  const mod3 = await insertModule({
    trailId,
    slug: "sst-cipaa",
    title: "Módulo 3: CIPAA e Brigada de Emergência",
    subtitle: "Prevenção e resposta a emergências",
    description: "Conheça a CIPAA, a Brigada de Emergência e como participar dessas iniciativas.",
    orderIndex: 3,
    pointsReward: 100,
    bonusPoints: 50,
    deadlineDays: 3,
  });
  await insertChapter({ moduleId: mod3, slug: "sst-cip-todos", title: "CIPAA e Brigada de Emergência", description: "Como funcionam a CIPAA e a Brigada na Stellar.", profileType: "todos", orderIndex: 1 });
  await insertSlides(mod3, [
    {
      title: "O que é a CIPAA?",
      content: "A **CIPAA** — Comissão Interna de Prevenção de Acidentes e de Assédio — é um grupo formado por representantes da empresa e dos colaboradores.\n\n**Como atua:**\n• Identificação de riscos no ambiente de trabalho\n• Promoção de campanhas e treinamentos de segurança\n• Investigação de acidentes ocorridos\n• Discussão de temas relevantes, como assédio moral e sexual\n\n**Como participar:**\nA eleição e indicação dos membros ocorre **anualmente**. Fique atento aos comunicados e participe! Ser membro da CIPAA é uma forma de contribuir para um ambiente mais seguro para todos.",
      betinhaSpeech: "A CIPAA existe para proteger você e todos os colegas! Se tiver interesse em participar, fique de olho nos comunicados sobre a eleição anual.",
      layout: "default",
    },
    {
      title: "Brigada de Emergência",
      content: "A **Brigada de Emergência** é formada por colaboradores **voluntários** treinados em:\n\n• **Primeiros socorros** — como agir em situações de emergência médica\n• **Combate a incêndio** — uso de extintores e procedimentos de evacuação\n\n**Como participar:**\nFique atento aos **treinamentos anuais** divulgados pelo time de SST. Qualquer colaborador pode se voluntariar para fazer parte da brigada.\n\n**Por que participar?**\nAlém de contribuir para a segurança de todos, você adquire habilidades valiosas que podem ser úteis dentro e fora do trabalho.",
      betinhaSpeech: "A brigada é formada por voluntários como você! Se tiver interesse em aprender primeiros socorros e combate a incêndio, se voluntarie no próximo treinamento!",
      layout: "highlight",
    },
  ]);

  // ── MÓDULO 4: ACIDENTES DE TRABALHO ────────────────────────────────────
  const mod4 = await insertModule({
    trailId,
    slug: "sst-acidentes",
    title: "Módulo 4: Acidentes de Trabalho",
    subtitle: "O que fazer em caso de acidente",
    description: "Entenda o que é acidente de trabalho, suas causas e o que fazer se acontecer.",
    orderIndex: 4,
    pointsReward: 150,
    bonusPoints: 75,
    deadlineDays: 4,
  });
  await insertChapter({ moduleId: mod4, slug: "sst-acid-todos", title: "Acidentes de Trabalho e Prevenção", description: "Tipos de acidentes, causas e o que fazer.", profileType: "todos", orderIndex: 1 });
  await insertSlides(mod4, [
    {
      title: "O que é Acidente de Trabalho?",
      content: "**Definição:** Acidente de trabalho é aquele que ocorre quando estamos a serviço da empresa e é caracterizado quando existe uma **lesão corporal, perturbação funcional ou doença** que poderá gerar incapacidade ou não ao colaborador.\n\n**Tipos de acidente:**\n\n• **Típico:** acontece durante a atividade na empresa\n• **De trajeto:** no caminho casa ↔ trabalho\n• **Doença ocupacional:** causada pelo ambiente ou atividade de trabalho",
      betinhaSpeech: "Acidente de trabalho inclui o trajeto de casa para o trabalho! Se acontecer qualquer coisa no caminho, comunique imediatamente à empresa.",
      layout: "default",
    },
    {
      title: "O que Fazer em Caso de Acidente",
      content: JSON.stringify({
        cards: [
          { title: "1. Atendimento Imediato", subtitle: "Primeiro passo", body: "Busque ou receba atendimento médico imediato após o acidente. Sua saúde é a prioridade número um.", icon: "🏥", color: "#EF5350" },
          { title: "2. Notificação", subtitle: "Informe imediatamente", body: "Informe o ocorrido (acidente ou incidente) ao seu superior imediato e à área de Saúde e Segurança. Não deixe para depois.", icon: "📢", color: "#FF6B35" },
          { title: "3. Emissão da CAT", subtitle: "Comunicado de Acidente", body: "A empresa emite a CAT (Comunicado de Acidente do Trabalho) e realiza a análise do acidente. Isso é obrigação legal da empresa.", icon: "📋", color: "#4FC3F7" },
          { title: "4. Acompanhamento", subtitle: "Processo junto ao INSS", body: "Em afastamentos superiores a 15 dias, acompanhe o processo junto ao INSS e mantenha a empresa informada sobre sua recuperação.", icon: "🔄", color: "#9C27B0" },
        ],
        columns: 2,
      }),
      betinhaSpeech: "Em caso de acidente: atendimento médico primeiro, depois notifica a empresa. Não tenta 'resolver sozinho' — a empresa precisa saber para te proteger legalmente!",
      layout: "card-deck",
    },
    {
      title: "Causas dos Acidentes",
      content: JSON.stringify({
        cards: [
          {
            title: "Condição Insegura",
            subtitle: "Problema no ambiente",
            body: "São situações no ambiente de trabalho que oferecem risco ao colaborador, geralmente relacionadas à estrutura, equipamentos ou organização do local.\n\nExemplos: piso molhado sem sinalização, fios expostos, iluminação inadequada, equipamentos sem manutenção.",
            icon: "⚠️",
            color: "#FF6B35",
          },
          {
            title: "Ato Inseguro",
            subtitle: "Comportamento de risco",
            body: "São comportamentos ou atitudes do colaborador que aumentam o risco de acidentes.\n\nExemplos: não usar EPI, improvisar ferramentas, ignorar sinalização de segurança, trabalhar com pressa excessiva.",
            icon: "🚫",
            color: "#EF5350",
          },
        ],
        columns: 2,
      }),
      betinhaSpeech: "A maioria dos acidentes pode ser evitada! Identifique condições inseguras e reporte. E evite atos inseguros — não vale o risco!",
      layout: "card-deck",
    },
    {
      title: "Prevenção é o Melhor Remédio",
      content: "**Como contribuir para um ambiente seguro:**\n\n• **Reporte condições inseguras** ao time de SST ou à sua liderança imediatamente\n\n• **Participe dos treinamentos** de segurança — eles existem para te proteger\n\n• **Cuide da sua ergonomia** — ajuste sua estação de trabalho corretamente\n\n• **Respeite as sinalizações** de segurança nos escritórios\n\n• **Não ignore sintomas** — dores recorrentes, cansaço excessivo e estresse prolongado são sinais de alerta\n\n• **Fale com o time de SST** se tiver dúvidas ou preocupações\n\n**Lembre-se:** segurança é responsabilidade de todos, não só do time de SST!",
      betinhaSpeech: "Prevenção é responsabilidade de todos! Se você viu algo errado, fala. Se está se sentindo sobrecarregado, fala. A Stellar quer você bem!",
      layout: "list",
    },
  ]);

  console.log("✅ Trilha Saúde e Segurança do Trabalho: 4 módulos inseridos com conteúdo completo do roteiro");
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
  console.log("   Trilhas: 3 | Módulos: 14 | Capítulos: 20+ | Slides: 50+");
} catch (err) {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
} finally {
  await db.end();
}
