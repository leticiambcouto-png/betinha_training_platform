# Plataforma TBI Stellar Gaming — TODO

## Funcionalidades Implementadas

- [x] Schema do banco de dados (trails, modules, slides, quiz_questions, user_progress, badges, user_badges, quiz_attempts)
- [x] Seed com conteúdo completo do PDF (11 módulos da trilha TBI Gente e Cultura)
- [x] Upload do avatar da Betinha para CDN
- [x] Identidade visual "Stellar Gaming" — tema dark com verde neon (#00C853)
- [x] Componente Betinha com avatar, balão de fala, efeito typewriter e TTS
- [x] Layout principal da plataforma (PlatformLayout) com sidebar e mobile menu
- [x] Página Home/Landing com hero, features e CTA
- [x] Página de Trilhas com listagem e progresso visual
- [x] Trilha "TBI Gente e Cultura" com 11 módulos
- [x] Trilha "TBI de DP" — estrutura pronta (em breve)
- [x] Trilha "TBI de Segurança do Trabalho" — estrutura pronta (em breve)
- [x] Página de detalhe da trilha com lista de módulos e status de progresso
- [x] Visualizador de módulos com slides, navegação e Betinha narradora
- [x] Sistema de gamificação: pontos por conclusão e bônus por prazo
- [x] Progressão visual: barra de progresso, níveis (1-6) e badges
- [x] 8 badges desbloqueáveis (Primeiro Passo, Estrela em Ascensão, etc.)
- [x] Quiz interativo ao final de cada módulo
- [x] Geração de quizzes com IA (LLM) baseada no conteúdo dos slides
- [x] Feedback explicativo para respostas certas e erradas no quiz
- [x] Dashboard do colaborador com stats, badges, ranking e progresso
- [x] Leaderboard/Ranking com pódio top 3 e lista completa
- [x] Painel administrativo com stats, gestão de usuários e geração de quizzes
- [x] TTS (Text-to-Speech) para a Betinha narrar o conteúdo em português
- [x] Autenticação via Manus OAuth com perfis individuais
- [x] Controle de acesso: admin vs. usuário comum
- [x] Testes Vitest: 18 testes passando (auth, trails, modules, quiz, dashboard, admin)

## Roadmap (Melhorias Futuras)

- [x] Conteudo completo para TBI de DP (concluído na revisão do roteiro oficial)
- [x] Conteudo completo para TBI de Segurança do Trabalho (concluído na revisão do roteiro oficial)
- [x] Remover gating hardcoded de 'Em breve' nas trilhas DP e SST (Trails, Admin, Dashboard, ModuleViewer)
- [ ] Upload de novos treinamentos via PPT/PDF pelo admin
- [ ] Notificações de prazo para conclusão de módulos
- [ ] Certificado de conclusão da trilha
- [ ] Modo de revisão dos módulos já concluídos

## Bugs Reportados

- [x] TTS da Betinha não está emitindo som (corrigido: usando Web Speech API nativa do navegador)
- [x] Conteúdo dos módulos da TBI Gente e Cultura estava duplicado (corrigido: removidas 18 duplicatas do banco, adicionada constraint UNIQUE em modules.slug)

## Integração com StellarHub

- [x] Replicar identidade visual do StellarHub: paleta de cores, fonte Barlow, variáveis CSS
- [x] Adaptar layout da plataforma TBI para usar sidebar e estrutura de navegação do StellarHub
- [x] Substituir logo/marca "Stellar Gaming" por "Stellar Space" com ícone correto (S estilizado idêntico ao StellarHub)
- [x] Ajustar PlatformLayout para ser compatível com o visual do StellarHub
- [x] Garantir que todas as páginas (trilhas, módulos, quiz, dashboard, admin) usem o novo visual

## Ajustes de UX

- [x] Remover TTS (Web Speech API) da Betinha — manter apenas balão de texto animado (typewriter), sem voz

## Acesso Livre (sem OAuth)

- [x] Remover obrigatoriedade de login Manus OAuth
- [x] Criar tela de login simples com nome + email (nome + e-mail corporativo)
- [x] Adaptar backend para sessão por cookie simples (JWT local via loginSimple)
- [x] Remover redirecionamentos para tela de login OAuth em todas as páginas
- [x] 21 testes Vitest passando (inclui 3 novos testes para loginSimple)

## Ajustes de Nomenclatura

- [x] Substituir "TBI" por "Trilha de Onboarding" em todo o site (frontend, banco de dados, seed)

## Ajustes de Textos (Rodada 2)

- [x] Remover todos os "TBI" restantes no site (banco de dados e frontend)
- [x] Atualizar mensagem da Betinha no painel inicial
- [x] Substituir "badge" por "conquista" em todo o site
- [x] Atualizar texto de quizzes
- [x] Atualizar título do Ranking

## Reestruturação de Módulos e Capítulos

- [x] Atualizar schema: adicionar tabela chapters (capítulos dentro de módulos) e campo profile_type (CLT/PJ/Liderança/Todos)
- [x] Reescrever seed com nova estrutura: 3 trilhas, 6 módulos, 23 capítulos por perfil, 35 slides
- [x] Atualizar backend: helpers getChaptersByModule, getChaptersByModuleAndProfile, getChapterBySlug no db.ts
- [x] Atualizar backend: router chapters.byModule e chapters.bySlug no routers.ts
- [x] Atualizar frontend TrailDetail: exibir capítulos expandíveis por módulo com badge de perfil
- [x] Atualizar frontend ModuleViewer: painel lateral de capítulos com badge de perfil
- [x] Adicionar 4 testes Vitest para chapters (byModule, byModule com filtro, bySlug, NOT_FOUND)
- [x] 25 testes Vitest passando

## Revisão de Conteúdo e Formatos (Roteiro Oficial — Opção B)

- [x] Atualizar schema: ampliar enum layout de slides para incluir timeline, card-deck, dictionary, values, video-placeholder
- [x] Executar migration SQL do novo enum
- [x] Criar componente TimelineSlide (linha do tempo interativa com marcos e prêmios)
- [x] Criar componente CardDeckSlide (cards interativos com expansão)
- [x] Criar componente DictionarySlide (dicionário com termos e definições em cards)
- [x] Criar componente ValuesSlide (valores com descrição e dilemas interativos)
- [x] Criar componente VideoPlaceholderSlide (placeholder de vídeo com thumbnail e descrição)
- [x] Atualizar ModuleViewer para renderizar os novos tipos de slide por layout
- [x] Reescrever seed Gente e Cultura: 8 módulos (Boas-vindas, História+Prêmios, Falando de Negócio+Dicionário, Planejamento Estratégico, Valores+Patrocínios, AI First, Rituais/Canais/Sistemas, Nossa Rotina)
- [x] Reescrever seed Departamento Pessoal: 2 módulos (Benefícios de Ser Estrela, Rotinas de DP)
- [x] Reescrever seed Saúde e Segurança: 4 módulos (Missão e Atuação, Riscos e Perigos, CIPAA e Brigada, Acidentes do Trabalho)
- [x] Executar seed: 3 trilhas, 14 módulos, 23 capítulos, 48 slides
- [x] 26 testes Vitest passando
- [x] Salvar checkpoint

## Seleção de Perfil Contratual (CLT / PJ)

- [x] Adicionar campo contractType (enum: clt | pj) na tabela users do banco
- [x] Executar migration SQL do novo campo
- [x] Atualizar tela de login: seleção visual "Você é CLT ou PJ?" com cards interativos
- [x] Betinha muda fala dinamicamente conforme perfil selecionado
- [x] Botão de submit só ativa com nome, e-mail e perfil preenchidos
- [x] Atualizar backend loginSimple para salvar contractType no usuário
- [x] Atualizar upsertUser no db.ts para persistir contractType
- [x] Backend chapters.byModule filtra automaticamente pelo contractType do usuário logado (todos + perfil)
- [x] CardDeckSlide filtra cards por tag (CLT/PJ) baseado no contractType do usuário
- [x] ModuleViewer passa contractType para CardDeckSlide
- [x] 26 testes Vitest passando
- [x] Checkpoint salvo
