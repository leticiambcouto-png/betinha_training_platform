import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Trophy, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { StellarStar } from "@/components/StellarStar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Betinha } from "@/components/Betinha";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: string[];
  orderIndex: number;
}

interface QuizResult {
  questionId: number;
  correct: boolean;
  correctIndex: number;
  explanation: string;
}

export default function Quiz() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const moduleId = parseInt(params.id);

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { data: modData } = trpc.modules.detail.useQuery({ moduleId }, { enabled: !!moduleId });
  const { data: questions, refetch: refetchQuestions, isLoading } = trpc.quiz.getQuestions.useQuery(
    { moduleId },
    { enabled: !!moduleId }
  );

  const generateMutation = trpc.quiz.generateWithAI.useMutation();
  const submitMutation = trpc.quiz.submit.useMutation();
  const utils = trpc.useUtils();

  // Auto-generate if no questions
  useEffect(() => {
    if (!isLoading && questions && questions.length === 0) {
      handleGenerateQuiz();
    }
  }, [isLoading, questions?.length]);

  const handleGenerateQuiz = async () => {
    setGenerating(true);
    try {
      await generateMutation.mutateAsync({ moduleId });
      await refetchQuestions();
      toast.success("Quiz gerado com sucesso pela IA!");
    } catch {
      toast.error("Erro ao gerar quiz. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelect = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = async () => {
    if (!questions || !modData?.module) return;
    const answers = questions.map((q: Question) => ({
      questionId: q.id,
      selectedIndex: selectedAnswers[q.id] ?? -1,
    }));

    try {
      const result = await submitMutation.mutateAsync({
        moduleId,
        trailId: modData.module.trailId,
        answers,
      });
      setResults(result.results);
      setScore(result.score);
      setPassed(result.passed);
      setSubmitted(true);
      utils.dashboard.myStats.invalidate();
    } catch {
      toast.error("Erro ao enviar respostas. Tente novamente.");
    }
  };

  const allAnswered = questions && questions.length > 0 &&
    questions.every((q: Question) => selectedAnswers[q.id] !== undefined);

  if (isLoading || generating) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <p className="text-foreground font-semibold">
              {generating ? "Gerando quiz com IA..." : "Carregando quiz..."}
            </p>
            <p className="text-muted-foreground text-sm">
              {generating ? "A Betinha está preparando perguntas personalizadas para você!" : ""}
            </p>
          </div>
        </div>
      </PlatformLayout>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="text-center space-y-4 max-w-md">
            <Sparkles className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-xl font-bold text-foreground">Quiz não disponível</h2>
            <p className="text-muted-foreground">Nenhuma pergunta encontrada para este módulo.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/trilhas")}>Voltar</Button>
              <Button onClick={handleGenerateQuiz} className="bg-primary text-primary-foreground">
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar com IA
              </Button>
            </div>
          </div>
        </div>
      </PlatformLayout>
    );
  }

  // Results screen
  if (submitted) {
    return (
      <PlatformLayout>
        <div className="p-6 lg:p-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">{passed ? "🎉" : "💪"}</div>
            <h1 className="text-3xl font-black text-foreground mb-2">
              {passed ? "Parabéns!" : "Continue tentando!"}
            </h1>
            <div className={`text-6xl font-black mb-2 ${passed ? "text-primary" : "text-yellow-400"}`}>
              {score}%
            </div>
            <p className="text-muted-foreground">
              {results.filter((r) => r.correct).length} de {results.length} respostas corretas
            </p>
            {!passed && (
              <p className="text-sm text-muted-foreground mt-2">Você precisa de 70% para passar. Revise o conteúdo e tente novamente!</p>
            )}
          </motion.div>

          {/* Betinha feedback */}
          <div className="mb-6">
            <Betinha
              speech={
                passed
                  ? `Incrível! Você tirou ${score}% no quiz! Estou muito orgulhosa de você! Continue assim e logo você vai completar toda a trilha!`
                  : `Não desanime! Você tirou ${score}%. Revise o conteúdo do módulo e tente novamente — eu acredito em você!`
              }
              size="sm"
            />
          </div>

          {/* Question review */}
          <div className="space-y-4 mb-8">
            {questions.map((q: Question, i: number) => {
              const result = results.find((r) => r.questionId === q.id);
              const selected = selectedAnswers[q.id];
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-xl border p-4 ${result?.correct ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}
                >
                  <div className="flex items-start gap-2 mb-3">
                    {result?.correct ? (
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    <p className="font-semibold text-foreground text-sm">{q.question}</p>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {q.options.map((opt, j) => (
                      <div
                        key={j}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          j === result?.correctIndex
                            ? "bg-primary/20 text-primary border border-primary/40 font-semibold"
                            : j === selected && !result?.correct
                            ? "bg-destructive/20 text-destructive border border-destructive/40"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {j === result?.correctIndex && "✓ "}
                        {j === selected && !result?.correct && "✗ "}
                        {opt}
                      </div>
                    ))}
                  </div>
                  {result?.explanation && (
                    <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
                      💡 {result.explanation}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/trilhas")}>
              Ver Trilhas
            </Button>
            {!passed && (
              <Button
                className="flex-1 bg-primary text-primary-foreground"
                onClick={() => { setSubmitted(false); setSelectedAnswers({}); setCurrentQ(0); }}
              >
                Tentar Novamente
              </Button>
            )}
            {passed && (
              <Button
                className="flex-1 bg-primary text-primary-foreground"
                onClick={() => navigate("/dashboard")}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Ver Painel
              </Button>
            )}
          </div>
        </div>
      </PlatformLayout>
    );
  }

  const q = questions[currentQ];
  const progressPct = ((currentQ + 1) / questions.length) * 100;

  return (
    <PlatformLayout>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">Quiz — {modData?.module.title}</span>
            </div>
            <span className="text-sm text-muted-foreground">{currentQ + 1} / {questions.length}</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>

        {/* Betinha */}
        <div className="mb-6">
          <Betinha
            speech={
              currentQ === 0
                ? "Hora do quiz! Leia cada pergunta com atenção e escolha a melhor resposta. Você consegue!"
                : currentQ === questions.length - 1
                ? "Última pergunta! Você chegou até aqui, continue com calma e confiança!"
                : `Pergunta ${currentQ + 1} de ${questions.length}. Você está indo bem!`
            }
            size="sm"
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border rounded-2xl p-6 mb-6"
          >
            <p className="text-lg font-semibold text-foreground mb-6">{q.question}</p>
            <div className="space-y-3">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  onClick={() => handleSelect(q.id, j)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm ${
                    selectedAnswers[q.id] === j
                      ? "border-primary bg-primary/15 text-foreground font-semibold"
                      : "border-border bg-muted/30 text-foreground hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center mr-3 text-xs font-bold flex-shrink-0 ${
                    selectedAnswers[q.id] === j ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + j)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentQ > 0 && (
            <Button variant="outline" onClick={() => setCurrentQ(currentQ - 1)} className="border-border">
              Anterior
            </Button>
          )}
          {currentQ < questions.length - 1 ? (
            <Button
              className="flex-1 bg-primary text-primary-foreground"
              onClick={() => setCurrentQ(currentQ + 1)}
              disabled={selectedAnswers[q.id] === undefined}
            >
              Próxima
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="flex-1 bg-primary text-primary-foreground"
              onClick={handleSubmit}
              disabled={!allAnswered || submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <StellarStar size={16} color="#d9f22a" className="mr-2" />
              )}
              Enviar Respostas
            </Button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {questions.map((_: Question, i: number) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentQ ? "w-6 bg-primary" : selectedAnswers[questions[i].id] !== undefined ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </PlatformLayout>
  );
}
