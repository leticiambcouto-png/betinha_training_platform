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

- [ ] Conteúdo completo para TBI de DP
- [ ] Conteúdo completo para TBI de Segurança do Trabalho
- [ ] Upload de novos treinamentos via PPT/PDF pelo admin
- [ ] Notificações de prazo para conclusão de módulos
- [ ] Certificado de conclusão da trilha
- [ ] Modo de revisão dos módulos já concluídos

## Bugs Reportados

- [x] TTS da Betinha não está emitindo som (corrigido: usando Web Speech API nativa do navegador)
- [x] Conteúdo dos módulos da TBI Gente e Cultura estava duplicado (corrigido: removidas 18 duplicatas do banco, adicionada constraint UNIQUE em modules.slug)
