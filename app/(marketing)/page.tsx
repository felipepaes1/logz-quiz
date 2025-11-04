"use client";

import React, { useState, useEffect } from "react";
import logoDark from "../logo-logz-light.svg"
import Image from "next/image"
import Script from "next/script";
import { ArrowBigRight, ArrowRight } from "lucide-react";

type QuestionOption = {
  text: string;
  value: number;
  icon: string;
  monthlySpend?: number;
};

type Question = {
  id: number;
  type: "identification" | "pain" | "hope" | "solution" | "commitment";
  question: string;
  description: string;
  options: QuestionOption[];
};

const OPTION_WEIGHTS = [0.4, 0.3, 0.2, 0.1] as const;
const MAX_OPTION_WEIGHT = OPTION_WEIGHTS[0];
const QUESTION_WEIGHTS = [3.0, 2.5, 2.0, 1.5, 1.0] as const;

const createOption = (
  text: string,
  value: number,
  icon: string = "\u2192",
  monthlySpend?: number
): QuestionOption => ({
  text,
  value,
  icon,
  monthlySpend,
});

const directorQuestions: Question[] = [
  {
    id: 1,
    type: "identification",
    question:
      "Como a dire\u00e7\u00e3o acompanha os indicadores de custo e efici\u00eancia da usinagem?",
    description: "Escolha como esses indicadores s\u00e3o acompanhados hoje.",
    options: [
      createOption(
        "Dashboards e relat\u00f3rios atualizados com base em dados reais",
        5,
        "\u{1F4C8}"
      ),
      createOption(
        "Acompanhamos mensalmente com base em planilhas internas",
        15,
        "\u{1F4C3}"
      ),
      createOption(
        "Recebemos informa\u00e7\u00f5es parciais dos setores de compras e produ\u00e7\u00e3o",
        25,
        "\u{1F4C2}"
      ),
      createOption(
        "N\u00e3o h\u00e1 acompanhamento estruturado de indicadores",
        30,
        "\u26A0\uFE0F"
      ),
    ],
  },
  {
    id: 2,
    type: "hope",
    question:
      "Qual \u00e9 a principal prioridade da sua gest\u00e3o em rela\u00e7\u00e3o ao uso e consumo de ferramentas de corte?",
    description:
      "Mostre qual objetivo estrat\u00e9gico est\u00e1 guiando as decis\u00f5es da diretoria.",
    options: [
      createOption("Reduzir custos e desperd\u00edcios", 30, "\u{1F4B0}"),
      createOption(
        "Disponibilidade e produtividade da produ\u00e7\u00e3o",
        25,
        "\u2699\uFE0F"
      ),
      createOption(
        "Rastreabilidade e previsibilidade de consumo",
        20,
        "\u{1F4E6}"
      ),
      createOption(
        "Integrar estoque e compras para decis\u00f5es mais r\u00e1pidas",
        15,
        "\u{1F501}"
      ),
    ],
  },
  {
    id: 3,
    type: "identification",
    question:
      "Voc\u00ea sabe quanto a sua empresa consome, em m\u00e9dia, por m\u00eas em ferramentas de corte?",
    description:
      "Informe a faixa de gasto que melhor representa sua opera\u00e7\u00e3o.",
    options: [
      createOption("A partir de R$ 35.000,00/m\u00eas", 30, "\u{1F4B5}", 35_000),
      createOption("R$ 15.000,00 a R$ 35.000,00/m\u00eas", 25, "\u{1F4B8}", 25_000),
      createOption("R$ 8.000,00 a R$ 20.000,00/m\u00eas", 20, "\u{1F4C8}", 14_000),
      createOption("R$ 3.000,00 a R$ 10.000,00/m\u00eas", 15, "\u{1F4DD}", 6_500),
    ],
  },
  {
    id: 4,
    type: "pain",
    question:
      "Como funciona hoje o processo de compras de ferramentas de corte na sua empresa?",
    description:
      "Indique como as decis\u00f5es de compra s\u00e3o tomadas atualmente.",
    options: [
      createOption("Baseado em relat\u00f3rios e previs\u00f5es de consumo", 5, "\u{1F4C9}"),
      createOption("Compras por estoque m\u00ednimo definido", 15, "\u{1F4CE}"),
      createOption("Cota\u00e7\u00f5es pontuais conforme a necessidade", 25, "\u{1F4DE}"),
      createOption(
        "Compras emergenciais indicadas pelos operadores",
        30,
        "\u{1F198}"
      ),
    ],
  },
  {
    id: 5,
    type: "solution",
    question:
      "Quais fatores mais influenciam a escolha de fornecedores ou marcas de ferramentas?",
    description:
      "Mostre o que pesa mais nas negocia\u00e7\u00f5es com fornecedores atualmente.",
    options: [
      createOption("Desempenho t\u00e9cnico e durabilidade", 10, "\u{1F6E1}\uFE0F"),
      createOption("Rapidez e confiabilidade na entrega", 20, "\u{1F69A}"),
      createOption("Suporte t\u00e9cnico e hist\u00f3rico de parceria", 15, "\u{1F91D}"),
      createOption("Menor pre\u00e7o no curto prazo", 30, "\u{1F4B8}"),
    ],
  },
];

const supervisorQuestions: Question[] = [
  {
    id: 1,
    type: "identification",
    question:
      "Como \u00e9 feito o controle de entradas e sa\u00eddas das ferramentas atualmente?",
    description:
      "Selecione a op\u00e7\u00e3o que melhor descreve o controle do almoxarifado.",
    options: [
      createOption("Controle automatizado e atualizado em tempo real", 5, "\u{1F5A5}\uFE0F"),
      createOption("Temos um sistema, mas sem integra\u00e7\u00e3o com a produ\u00e7\u00e3o", 15, "\u{1F504}"),
      createOption("Pelo almoxarifado, mas sem registro detalhado", 25, "\u{1F4E6}"),
      createOption("Manualmente (em planilhas ou cadernos)", 30, "\u270F\uFE0F"),
    ],
  },
  {
    id: 2,
    type: "hope",
    question: "O que voc\u00ea espera de um gerenciador de ferramentas?",
    description:
      "Aponte a funcionalidade que traria maior impacto imediato.",
    options: [
      createOption("Controle e rastreabilidade por operador/m\u00e1quina", 30, "\u{1F527}"),
      createOption("Automatizar reposi\u00e7\u00f5es e pedidos de compra", 25, "\u{1F916}"),
      createOption("Acompanhar consumo e estoque em tempo real", 20, "\u{1F440}"),
      createOption("Reduzir o desperd\u00edcio e o custo mensal", 15, "\u267B\uFE0F"),
    ],
  },
  {
    id: 3,
    type: "identification",
    question:
      "Voc\u00ea sabe quanto a sua empresa consome, em m\u00e9dia, por m\u00eas em ferramentas de corte?",
    description:
      "Informe a faixa de gasto que melhor representa sua opera\u00e7\u00e3o.",
    options: [
      createOption("A partir de R$ 35.000,00/m\u00eas", 30, "\u{1F4B5}", 35_000),
      createOption("R$ 15.000,00 a R$ 35.000,00/m\u00eas", 25, "\u{1F4B8}", 25_000),
      createOption("R$ 8.000,00 a R$ 20.000,00/m\u00eas", 20, "\u{1F4C8}", 14_000),
      createOption("R$ 3.000,00 a R$ 10.000,00/m\u00eas", 15, "\u{1F4DD}", 6_500),
    ],
  },
  {
    id: 4,
    type: "pain",
    question: "Quantas m\u00e1quinas est\u00e3o em opera\u00e7\u00e3o atualmente?",
    description:
      "Selecione a faixa que representa o tamanho da sua opera\u00e7\u00e3o.",
    options: [
      createOption("Mais de 20 m\u00e1quinas", 30, "\u{1F3ED}"),
      createOption("De 15 a 20 m\u00e1quinas", 25, "\u2699\uFE0F"),
      createOption("De 10 a 15 m\u00e1quinas", 20, "\u{1F527}"),
      createOption("Menos de 10 m\u00e1quinas", 10, "\u{1F6E0}\uFE0F"),
    ],
  },
  {
    id: 5,
    type: "solution",
    question: "Voc\u00ea possui um setor de usinagem na sua ind\u00fastria?",
    description:
      "Entenda em que est\u00e1gio est\u00e1 a estrutura de usinagem da empresa.",
    options: [
      createOption("Sim, com produ\u00e7\u00e3o interna", 30, "\u{1F3E2}"),
      createOption("Sim, mas terceirizamos parte do processo", 20, "\u{1F91D}"),
      createOption("N\u00e3o, apenas compramos pe\u00e7as usinadas", 10, "\u{1F6D2}"),
      createOption("Estamos avaliando implantar um setor de usinagem", 15, "\u{1F680}"),
    ],
  },
];

const buyerQuestions: Question[] = [
  {
    id: 1,
    type: "identification",
    question:
      "A equipe de compras tem acesso a hist\u00f3ricos de consumo e custos das ferramentas?",
    description:
      "Mostre o n\u00edvel de visibilidade que o time de compras possui hoje.",
    options: [
      createOption("Sim, temos dados completos e atualizados", 5, "\u{1F4DA}"),
      createOption("Temos sistema, mas sem integra\u00e7\u00e3o com a produ\u00e7\u00e3o", 15, "\u{1F517}"),
      createOption("Temos informa\u00e7\u00f5es parciais em planilhas", 25, "\u{1F4C4}"),
      createOption("N\u00e3o, compramos sem esse n\u00edvel de detalhe", 30, "\u{1F648}"),
    ],
  },
  {
    id: 2,
    type: "pain",
    question: "Como funciona o processo de compra de ferramentas de corte?",
    description:
      "Explique como a necessidade de reposi\u00e7\u00e3o \u00e9 identificada atualmente.",
    options: [
      createOption("Utilizamos relat\u00f3rios ou sistemas para prever necessidade", 5, "\u{1F4C5}"),
      createOption("Temos um planejamento de consumo mensal", 15, "\u{1F5A9}\uFE0F"),
      createOption("Compramos conforme o estoque m\u00ednimo definido", 25, "\u{1F4E6}"),
      createOption("S\u00f3 compramos quando o operador informa que acabou", 30, "\u23F0"),
    ],
  },
  {
    id: 3,
    type: "identification",
    question:
      "Voc\u00ea sabe quanto a sua empresa consome, em m\u00e9dia, por m\u00eas em ferramentas de corte?",
    description:
      "Informe a faixa de gasto que melhor representa sua opera\u00e7\u00e3o.",
    options: [
      createOption("A partir de R$ 35.000,00/m\u00eas", 30, "\u{1F4B5}", 35_000),
      createOption("R$ 15.000,00 a R$ 35.000,00/m\u00eas", 25, "\u{1F4B8}", 25_000),
      createOption("R$ 8.000,00 a R$ 20.000,00/m\u00eas", 20, "\u{1F4C8}", 14_000),
      createOption("R$ 3.000,00 a R$ 10.000,00/m\u00eas", 15, "\u{1F4DD}", 6_500),
    ],
  },
  {
    id: 4,
    type: "solution",
    question:
      "Qual o fator determinante para escolha do fornecedor ou marca da ferramenta?",
    description:
      "Mostre o que tem mais peso na decis\u00e3o final de compra.",
    options: [
      createOption("Hist\u00f3rico de parceria / suporte t\u00e9cnico", 15, "\u{1F91D}"),
      createOption("Durabilidade e desempenho t\u00e9cnico", 10, "\u{1F6E0}\uFE0F"),
      createOption("Rapidez na entrega", 20, "\u26A1\uFE0F"),
      createOption("Pre\u00e7o mais baixo", 30, "\u{1F4B0}"),
    ],
  },
  {
    id: 5,
    type: "pain",
    question: "Com que frequ\u00eancia ocorrem faltas ou excessos de estoque?",
    description:
      "Avalie a previsibilidade atual das compras e do estoque.",
    options: [
      createOption("Nunca, o estoque \u00e9 sempre suficiente", 5, "\u2705"),
      createOption("Raramente, temos controle razo\u00e1vel", 15, "\u{1F642}"),
      createOption("\u00c0s vezes, principalmente com ferramentas cr\u00edticas", 25, "\u26A0\uFE0F"),
      createOption("Frequentemente \u2014 isso atrasa a produ\u00e7\u00e3o", 30, "\u274C"),
    ],
  },
 ];

const getQuestionsByRole = (role: string): Question[] => {
  switch (role) {
    case "Supervisor/Gerente de usinagem":
      return supervisorQuestions;
    case "Comprador":
      return buyerQuestions;
    case "Diretor":
    case "Outros":
      return directorQuestions;
    default:
      return directorQuestions;
  }
};

const QuizLOGZ: React.FC = () => {
  // intro, userInfo, userRole, quiz, loading, result
  const [stage, setStage] = useState<
    "intro" | "userInfo" | "userRole" | "quiz" | "loading" | "result"
  >("intro");

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOptionIndices, setSelectedOptionIndices] = useState<Record<number, number>>(
    {}
  );
  const [score, setScore] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userCompany, setUserCompany] = useState<string>("");
  const [userNameError, setUserNameError] = useState<string>("");
  const [userRoleError, setUserRoleError] = useState<string>("");
  const [isSendingReport, setIsSendingReport] = useState<boolean>(false);
  const [sendReportError, setSendReportError] = useState<string | null>(null);
  const [sendReportSuccess, setSendReportSuccess] = useState<boolean>(false);

  const questions = getQuestionsByRole(userRole);

  // efeito da tela de "loading"
  useEffect(() => {
    if (stage === "loading") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage("result"), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [stage]);


  useEffect(() => {
    if (stage === "result") {
      const maxScore = questions.reduce((total, _, index) => {
        const questionWeight =
          QUESTION_WEIGHTS[index] ??
          QUESTION_WEIGHTS[QUESTION_WEIGHTS.length - 1] ??
          1;
        return total + questionWeight;
      }, 0);
      const percentage =
        maxScore === 0 ? 0 : Math.min((score / maxScore) * 100, 100);

      console.log(
        "[QuizLOGZ] Score total:",
        score.toFixed(2),
        "| Percentual:",
        percentage.toFixed(2)
      );
    }
  }, [stage, score, questions.length]);

  const handleNameSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const cleanedName = userName.trim();

    if (!cleanedName) {
      setUserNameError("Informe seu nome para continuar.");
      return;
    }

    setUserName(cleanedName);
    setUserNameError("");
    setStage("userRole");
  };

  const handleRoleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!userRole) {
      setUserRoleError("Selecione seu cargo para continuar.");
      return;
    }

    setUserRoleError("");
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOptionIndices({});
    setScore(0);
    setLoadingProgress(0);
    setStage("quiz");
  };

  const handleAnswer = (optionIndex: number) => {
    const optionWeight = OPTION_WEIGHTS[optionIndex] ?? 0;
    const questionWeight =
      QUESTION_WEIGHTS[currentQuestion] ??
      QUESTION_WEIGHTS[QUESTION_WEIGHTS.length - 1] ??
      1;
    const normalizedValue =
      MAX_OPTION_WEIGHT === 0 ? 0 : optionWeight / MAX_OPTION_WEIGHT;
    const contribution = questionWeight * normalizedValue;
    const newAnswers: Record<number, number> = {
      ...answers,
      [currentQuestion]: contribution,
    };
    const newOptionSelections: Record<number, number> = {
      ...selectedOptionIndices,
      [currentQuestion]: optionIndex,
    };
    const previousContribution = answers[currentQuestion] ?? 0;

    setAnswers(newAnswers);
    setSelectedOptionIndices(newOptionSelections);
    setScore((prev) => prev - previousContribution + contribution);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 300);
    } else {
      setTimeout(() => setStage("loading"), 300);
    }
  };
  // progresso da barrinha
  const totalQuestions = questions.length || 1;
  const progress =
    ((currentQuestion + 1) / totalQuestions) * 100;

  // Componentes SVG ===========================
  const GearIcon: React.FC = () => (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      className="gear-icon"
    >
      <defs>
        <linearGradient
          id="gearGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00bffe" />
          <stop offset="100%" stopColor="#0088cc" />
        </linearGradient>
      </defs>
      <circle
        cx="60"
        cy="60"
        r="25"
        fill="url(#gearGradient)"
        opacity="0.2"
      />
      <path
        d="M60 10 L65 25 L80 25 L70 35 L75 50 L60 40 L45 50 L50 35 L40 25 L55 25 Z"
        fill="url(#gearGradient)"
        opacity="0.6"
      />
      <circle
        cx="60"
        cy="60"
        r="35"
        stroke="url(#gearGradient)"
        strokeWidth="3"
        fill="none"
        opacity="0.4"
      />
      <circle
        cx="60"
        cy="60"
        r="15"
        fill="url(#gearGradient)"
      />
    </svg>
  );

  const TrophyIcon: React.FC = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient
          id="trophyGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
        <linearGradient
          id="baseGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#808080" />
        </linearGradient>
      </defs>
      <path
        d="M30 15 L30 35 Q30 45 40 45 L40 55 L35 55 L35 70 L65 70 L65 55 L60 55 L60 45 Q70 45 70 35 L70 15 Z"
        fill="url(#trophyGradient)"
        stroke="#B8860B"
        strokeWidth="2"
      />
      <rect
        x="30"
        y="70"
        width="40"
        height="10"
        rx="2"
        fill="url(#baseGradient)"
      />
      <circle
        cx="50"
        cy="30"
        r="8"
        fill="#FFD700"
        opacity="0.6"
      />
      <path
        d="M25 15 Q20 15 20 25 Q20 35 30 35"
        stroke="url(#trophyGradient)"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M75 15 Q80 15 80 25 Q80 35 70 35"
        stroke="url(#trophyGradient)"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );

  const ChartIcon: React.FC = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient
          id="chartGradient"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00bffe" />
          <stop offset="100%" stopColor="#0088cc" />
        </linearGradient>
      </defs>
      <rect
        x="10"
        y="50"
        width="12"
        height="20"
        rx="2"
        fill="url(#chartGradient)"
        opacity="0.6"
      />
      <rect
        x="26"
        y="40"
        width="12"
        height="30"
        rx="2"
        fill="url(#chartGradient)"
        opacity="0.7"
      />
      <rect
        x="42"
        y="25"
        width="12"
        height="45"
        rx="2"
        fill="url(#chartGradient)"
        opacity="0.8"
      />
      <rect
        x="58"
        y="10"
        width="12"
        height="60"
        rx="2"
        fill="url(#chartGradient)"
      />
      <path
        d="M15 55 L32 45 L48 30 L64 15"
        stroke="#00bffe"
        strokeWidth="2"
        strokeDasharray="3 3"
        opacity="0.5"
      />
    </svg>
  );

  const CheckmarkIcon: React.FC = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <circle
        cx="15"
        cy="15"
        r="14"
        fill="#00bffe"
        opacity="0.2"
        stroke="#00bffe"
        strokeWidth="2"
      />
      <path
        d="M8 15 L13 20 L22 10"
        stroke="#00bffe"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const MoneyIcon: React.FC = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <defs>
        <linearGradient
          id="moneyGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      <circle
        cx="30"
        cy="30"
        r="25"
        fill="url(#moneyGradient)"
        opacity="0.2"
      />
      <circle
        cx="30"
        cy="30"
        r="20"
        stroke="url(#moneyGradient)"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M30 15 L30 45 M20 25 Q30 20 30 30 Q30 40 40 35"
        stroke="url(#moneyGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  // ================= RENDER STAGES =================

  if (stage === "intro") {
    return (
      <div className="quiz-container">
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #0a1628 0%, #1a2642 50%, #0f1b2e 100%);
            min-height: 100vh;
            overflow-x: hidden;
          }

          .quiz-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            overflow: hidden;
          }

          .quiz-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 30%, rgba(0, 191, 254, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 136, 204, 0.08) 0%, transparent 50%);
            pointer-events: none;
          }

          .intro-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 248, 0.92) 100%);
            border-radius: 2rem;
            padding: 3.5rem;
            max-width: 900px;
            width: 100%;
            box-shadow: 
              0 30px 90px rgba(0, 0, 0, 0.3),
              0 10px 30px rgba(0, 191, 254, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
            position: relative;
            z-index: 1;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(20px);
            animation: slideUp 0.6s ease-out;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .gear-icon {
            display: block;
            margin: 0 auto 2rem;
            animation: rotate 8s linear infinite;
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .intro-logo {
            display: block;
            margin: 0 auto 2rem;
          }

          .intro-header {
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .intro-badge {
            display: inline-block;
            background: linear-gradient(135deg, #00bffe, #0088cc);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 2rem;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 15px rgba(0, 191, 254, 0.3);
          }

          .intro-title {
            font-size: 2.8rem;
            font-weight: 800;
            color: #0a1628;
            line-height: 1.2;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #0a1628, #1a2642);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .intro-subtitle {
            font-size: 1.3rem;
            color: #475569;
            font-weight: 500;
            line-height: 1.6;
          }

          .intro-hook {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.08));
            border-left: 4px solid #ef4444;
            padding: 1.5rem;
            border-radius: 1rem;
            margin: 2rem 0;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.1);
          }

          .hook-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #dc2626;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .hook-text {
            color: #64748b;
            font-size: 1rem;
            line-height: 1.7;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2.5rem 0;
          }

          .stat-card {
            background: linear-gradient(135deg, rgba(0, 191, 254, 0.08), rgba(0, 136, 204, 0.05));
            padding: 1.5rem;
            border-radius: 1rem;
            border: 1px solid rgba(0, 191, 254, 0.2);
            text-align: center;
            transition: all 0.3s ease;
          }

          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 191, 254, 0.2);
            border-color: rgba(0, 191, 254, 0.4);
          }

          .stat-number {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #00bffe, #0088cc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
          }

          .stat-label {
            color: #64748b;
            font-size: 0.95rem;
            font-weight: 600;
          }

          .intro-cta {
            text-align: center;
            margin-top: 2.5rem;
          }

          .cta-button {
            background: linear-gradient(135deg, #00bffe, #0088cc);
            color: white;
            border: none;
            padding: 1.25rem 3rem;
            font-size: 1.2rem;
            font-weight: 700;
            border-radius: 3rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 
              0 10px 30px rgba(0, 191, 254, 0.4),
              0 5px 15px rgba(0, 0, 0, 0.2);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
          }

          .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s;
          }

          .cta-button:hover::before {
            left: 100%;
          }

          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 
              0 15px 40px rgba(0, 191, 254, 0.5),
              0 8px 20px rgba(0, 0, 0, 0.3);
          }

          .cta-button:active {
            transform: translateY(0);
          }

          .trust-badges {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
            flex-wrap: wrap;
          }

          .trust-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #64748b;
            font-size: 0.9rem;
            font-weight: 500;
          }

          @media (max-width: 768px) {
            .intro-card {
              padding: 2rem;
            }

            .intro-title {
              font-size: 2rem;
            }

            .intro-subtitle {
              font-size: 1.1rem;
            }

            .stats-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div className="intro-card">
          <Image
            src={logoDark}
            alt="Logz Tech Logo (dark)"
            className="intro-logo h-24 w-auto"
            loading="lazy"
            decoding="async"
          />

          <div className="intro-header">
            <div className="intro-badge">Diagnóstico Executivo LOG Z</div>
            <h1 className="intro-title">
              Sua usinagem é eficiente ou apenas arranca cavaco?
            </h1>
            <p className="intro-subtitle">
              Descubra o nível de gestão da sua empresa 
              e quanto está sendo desperdiçado
            </p>
          </div>

          <div className="intro-hook">
            <div className="hook-title">
              <span></span>⚠️ A VERDADE QUE NINGUÉM TE CONTA:
            </div>
            <p className="hook-text">
              <strong>
                87% das empresas de usinagem
              </strong>{" "}
              Não sabem quanto estão perdendo com gestão ineficiente de
              ferramentas. Enquanto você lê isso, suas ferramentas estão
              sendo desperdiçadas, seu estoque está desorganizado, e{" "}
              <strong>
               até 15% do seu faturamento está indo pelo ralo
              </strong>
              .
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">15%</div>
              <div className="stat-label">
                Redução de Custos Comprovada
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number">+40h</div>
              <div className="stat-label">
                Economizadas por Mês
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">
                Visibilidade do Estoque
              </div>
            </div>
          </div>

          <div className="intro-cta">
            <button
              className="cta-button"
              onClick={() => setStage("userInfo")}
            >
            🚀 Descobrir Meu Potencial de Economia
            </button>
            <div className="trust-badges">
              <div className="trust-badge">
                <CheckmarkIcon />
                <span>3 minutos</span>
              </div>
              <div className="trust-badge">
                <CheckmarkIcon />
                <span>100% confidencial</span>
              </div>
              <div className="trust-badge">
                <CheckmarkIcon />
                <span>Resultado imediato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "userInfo") {
    return (
      <div className="quiz-container">
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #0a1628 0%, #1a2642 50%, #0f1b2e 100%);
            min-height: 100vh;
            overflow-x: hidden;
          }

          .quiz-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            overflow: hidden;
          }

          .quiz-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 30%, rgba(0, 191, 254, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 136, 204, 0.08) 0%, transparent 50%);
            pointer-events: none;
          }

          .user-info-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 248, 0.92) 100%);
            border-radius: 2rem;
            padding: 3rem;
            width: min(520px, 100%);
            box-shadow: 
              0 30px 90px rgba(0, 0, 0, 0.25),
              0 10px 30px rgba(0, 191, 254, 0.18),
              inset 0 1px 0 rgba(255, 255, 255, 0.7);
            position: relative;
            z-index: 1;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(24px);
            animation: slideUp 0.5s ease-out;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .user-info-title {
            color: #0f172a;
            font-size: 1rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            margin-bottom: 2.5rem;
            display: block;
          }

          .user-info-form {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

          .user-info-field {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .user-info-label-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            color: #0f172a;
            font-weight: 600;
            font-size: 1.1rem;
            letter-spacing: 0.02em;
          }

          .user-info-required {
            color: #ef4444;
            font-size: 1.2rem;
            margin-left: 0.5rem;
          }

          .user-info-input {
            background: transparent;
            border: none;
            border-bottom: 2px solid rgba(15, 23, 42, 0.15);
            padding: 0.75rem 0;
            color: #0f172a;
            font-size: 1.5rem;
            font-weight: 500;
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }

          .user-info-input::placeholder {
            color: rgba(100, 116, 139, 0.5);
          }

          .user-info-input:focus {
            border-bottom-color: #00bffe;
            box-shadow: 0 10px 30px rgba(0, 191, 254, 0.2);
          }

          .user-info-error {
            color: #ef4444;
            font-size: 0.95rem;
            margin-top: -1rem;
          }

          .user-info-submit {
            align-self: flex-end;
            background: linear-gradient(135deg, #00bffe, #0088cc);
            color: white;
            border: none;
            border-radius: 999px;
            padding: 0.85rem 2.5rem;
            font-size: 1rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 
              0 12px 30px rgba(0, 191, 254, 0.35),
              0 6px 15px rgba(0, 0, 0, 0.15);
          }

          .user-info-submit:hover {
            transform: translateY(-2px);
            box-shadow: 
              0 18px 45px rgba(0, 191, 254, 0.45),
              0 12px 25px rgba(0, 0, 0, 0.18);
          }

          .user-info-submit:active {
            transform: translateY(0);
          }

          @media (max-width: 640px) {
            .user-info-card {
              padding: 2.5rem 1.75rem;
            }

            .user-info-input {
              font-size: 1.25rem;
            }
          }
        `}</style>

        <div className="user-info-card">
          <span className="user-info-title">Antes de continuar...</span>

          <form
            className="user-info-form"
            onSubmit={handleNameSubmit}
          >
            <div className="user-info-field">
              <div className="user-info-label-row">
                <label htmlFor="user-name-input">Nome <span className="user-info-required">*</span></label>

              </div>
              <input
                id="user-name-input"
                type="text"
                className="user-info-input"
                placeholder="Digite sua resposta aqui..."
                value={userName}
                onChange={(event) => {
                  setUserName(event.target.value);
                  if (userNameError) {
                    setUserNameError("");
                  }
                }}
                autoFocus
              />
            </div>

            {userNameError && (
              <p className="user-info-error">{userNameError}</p>
            )}

            <button type="submit" className="user-info-submit">
              Iniciar Diagnóstico
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (stage === "userRole") {
    return (
      <div className="quiz-container">
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #0a1628 0%, #1a2642 50%, #0f1b2e 100%);
            min-height: 100vh;
            overflow-x: hidden;
          }

          .quiz-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            overflow: hidden;
          }

          .quiz-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 30%, rgba(0, 191, 254, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 136, 204, 0.08) 0%, transparent 50%);
            pointer-events: none;
          }

          .user-info-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 248, 0.92) 100%);
            border-radius: 2rem;
            padding: 3rem;
            width: min(520px, 100%);
            box-shadow: 
              0 30px 90px rgba(0, 0, 0, 0.25),
              0 10px 30px rgba(0, 191, 254, 0.18),
              inset 0 1px 0 rgba(255, 255, 255, 0.7);
            position: relative;
            z-index: 1;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(24px);
            animation: slideUp 0.5s ease-out;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .user-info-title {
            color: #0f172a;
            font-size: 1rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            margin-bottom: 1rem;
            display: block;
          }

          .user-info-subtitle {
            color: #334155;
            font-size: 1.15rem;
            font-weight: 600;
            margin-bottom: 2.5rem;
          }

          .user-info-form {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

          .user-info-field {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .user-info-label-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            color: #0f172a;
            font-weight: 600;
            font-size: 1.1rem;
            letter-spacing: 0.02em;
          }

          .user-info-required {
            color: #ef4444;
            font-size: 1.2rem;
            margin-left: 0.5rem;
          }

          .user-info-select-wrapper {
            position: relative;
          }

          .user-info-select-wrapper::after {
            content: '?';
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            color: #0f172a;
            font-size: 1.5rem;
            pointer-events: none;
          }

          .user-info-select {
            width: 100%;
            background: transparent;
            border: none;
            border-bottom: 2px solid rgba(15, 23, 42, 0.15);
            padding: 0.75rem 0;
            padding-right: 2rem;
            color: #0f172a;
            font-size: 1.2rem;
            font-weight: 500;
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
          }

          .user-info-select:focus {
            border-bottom-color: #00bffe;
            box-shadow: 0 10px 30px rgba(0, 191, 254, 0.2);
          }

          .user-info-select option {
            color: #0f172a;
          }

          .user-info-error {
            color: #ef4444;
            font-size: 0.95rem;
            margin-top: -1rem;
          }

          .user-info-submit {
            align-self: flex-end;
            background: linear-gradient(135deg, #00bffe, #0088cc);
            color: white;
            border: none;
            border-radius: 999px;
            padding: 0.85rem 2.5rem;
            font-size: 1rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 
              0 12px 30px rgba(0, 191, 254, 0.35),
              0 6px 15px rgba(0, 0, 0, 0.15);
          }

          .user-info-submit:hover {
            transform: translateY(-2px);
            box-shadow: 
              0 18px 45px rgba(0, 191, 254, 0.45),
              0 12px 25px rgba(0, 0, 0, 0.18);
          }

          .user-info-submit:active {
            transform: translateY(0);
          }

          @media (max-width: 640px) {
            .user-info-card {
              padding: 2.5rem 1.75rem;
            }

            .user-info-select {
              font-size: 1.1rem;
            }
          }
        `}</style>

        <div className="user-info-card">
          <span className="user-info-title">Quase lá</span>
          <p className="user-info-subtitle">
            {userName || "Conta pra gente"}, qual é o seu cargo hoje?
          </p>

          <form
            className="user-info-form"
            onSubmit={handleRoleSubmit}
          >
            <div className="user-info-field">
              <div className="user-info-label-row">
                <label htmlFor="user-role-select">Cargo <span className="user-info-required">*</span></label>
                
              </div>
              <div className="user-info-select-wrapper">
                <select
                  id="user-role-select"
                  className="user-info-select"
                  value={userRole}
                  onChange={(event) => {
                    setUserRole(event.target.value);
                    if (userRoleError) {
                      setUserRoleError("");
                    }
                  }}
                  autoFocus
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  <option value="Supervisor/Gerente de usinagem">
                    Supervisor/Gerente de usinagem
                  </option>
                  <option value="Comprador">Comprador</option>
                  <option value="Diretor">Diretor</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            {userRoleError && (
              <p className="user-info-error">{userRoleError}</p>
            )}

            <button type="submit" className="user-info-submit">
              Iniciar Diagnóstico
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (stage === "quiz") {
    const currentQ = questions[currentQuestion];

    return (
      <div className="quiz-container">
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #0a1628 0%, #1a2642 50%, #0f1b2e 100%);
            min-height: 100vh;
            overflow-x: hidden;
          }

          .quiz-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            overflow: hidden;
          }

          .quiz-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 30%, rgba(0, 191, 254, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 136, 204, 0.08) 0%, transparent 50%);
            pointer-events: none;
          }

          .quiz-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 248, 0.92) 100%);
            border-radius: 2rem;
            padding: 3rem;
            max-width: 800px;
            width: 100%;
            box-shadow: 
              0 30px 90px rgba(0, 0, 0, 0.3),
              0 10px 30px rgba(0, 191, 254, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
            position: relative;
            z-index: 1;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(20px);
            animation: slideUp 0.4s ease-out;
          }

          .progress-header {
            margin-bottom: 2.5rem;
          }

          .progress-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .question-counter {
            font-size: 0.9rem;
            font-weight: 600;
            color: #64748b;
          }

          .question-type-badge {
            background: linear-gradient(135deg, #00bffe, #0088cc);
            color: white;
            padding: 0.4rem 1rem;
            border-radius: 1.5rem;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .progress-bar-container {
            height: 8px;
            background: rgba(0, 191, 254, 0.1);
            border-radius: 1rem;
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #00bffe, #0088cc);
            border-radius: 1rem;
            transition: width 0.4s ease;
            box-shadow: 0 0 20px rgba(0, 191, 254, 0.5);
            position: relative;
          }

          .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .question-section {
            margin-bottom: 2rem;
          }

          .question-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #0a1628;
            line-height: 1.4;
            margin-bottom: 0.75rem;
          }

          .question-description {
            font-size: 1.05rem;
            color: #64748b;
            font-style: italic;
          }

          .options-grid {
            display: grid;
            gap: 1rem;
          }

          .option-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
            border: 2px solid rgba(0, 191, 254, 0.2);
            border-radius: 1.25rem;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 1rem;
            position: relative;
            overflow: hidden;
          }

          .option-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 191, 254, 0.1), transparent);
            transition: left 0.5s;
          }

          .option-card:hover {
            border-color: rgba(0, 191, 254, 0.5);
            transform: translateX(5px);
            box-shadow: 0 10px 30px rgba(0, 191, 254, 0.2);
          }

          .option-card:hover::before {
            left: 100%;
          }

          .option-icon {
            font-size: 2rem;
            min-width: 50px;
            text-align: center;
          }

          .option-text {
            flex: 1;
            font-size: 1.05rem;
            font-weight: 500;
            color: #1e293b;
          }

          .option-arrow {
            color: #00bffe;
            font-size: 1.5rem;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .option-card:hover .option-arrow {
            opacity: 1;
          }

          @media (max-width: 768px) {
            .quiz-card {
              padding: 2rem;
            }

            .question-title {
              font-size: 1.4rem;
            }

            .option-card {
              padding: 1.25rem;
            }
          }
        `}</style>

        <div className="quiz-card">
          <div className="progress-header">
            <div className="progress-info">
              <div className="question-counter">
                Pergunta {currentQuestion + 1} de {questions.length}
              </div>
              <div className="question-type-badge">
                {currentQ.type === 'identification' && '🎯 Identificação'}
                {currentQ.type === 'pain' && '💥 Ponto de Dor'}
                {currentQ.type === 'hope' && '✨ Oportunidade'}
                {currentQ.type === 'solution' && '🚀 Solução'}
                {currentQ.type === 'commitment' && '🤝 Próximo Passo'}
              </div>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="question-section">
            <h2 className="question-title">{currentQ.question}</h2>
            <p className="question-description">
              {currentQ.description}
            </p>
          </div>

          <div className="options-grid">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className="option-card"
                onClick={() => handleAnswer(index)}
              >
                <div className="option-icon">{option.icon}</div>
                <div className="option-text">{option.text}</div>
                <div className="option-arrow"><ArrowRight></ArrowRight></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === "loading") {
    return (
      <div className="quiz-container">
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #0a1628 0%, #1a2642 50%, #0f1b2e 100%);
            min-height: 100vh;
            overflow-x: hidden;
          }

          .quiz-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            overflow: hidden;
          }

          .quiz-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 30%, rgba(0, 191, 254, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 136, 204, 0.08) 0%, transparent 50%);
            pointer-events: none;
          }

          .loading-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 248, 0.92) 100%);
            border-radius: 2rem;
            padding: 4rem;
            max-width: 700px;
            width: 100%;
            box-shadow: 
              0 30px 90px rgba(0, 0, 0, 0.3),
              0 10px 30px rgba(0, 191, 254, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
            position: relative;
            z-index: 1;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(20px);
            text-align: center;
          }

          .loading-icon-container {
            margin-bottom: 2rem;
            position: relative;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loading-icon-container svg {
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }

          .loading-title {
            font-size: 2rem;
            font-weight: 800;
            color: #0a1628;
            margin-bottom: 1rem;
          }

          .loading-subtitle {
            font-size: 1.1rem;
            color: #64748b;
            margin-bottom: 3rem;
          }

          .loading-progress-container {
            margin-bottom: 2rem;
          }

          .loading-progress-bar {
            height: 12px;
            background: rgba(0, 191, 254, 0.1);
            border-radius: 1rem;
            overflow: hidden;
            margin-bottom: 1rem;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .loading-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00bffe, #0088cc, #00bffe);
            background-size: 200% 100%;
            border-radius: 1rem;
            transition: width 0.3s ease;
            animation: gradientMove 2s ease infinite;
            box-shadow: 0 0 20px rgba(0, 191, 254, 0.6);
          }

          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .loading-percentage {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #00bffe, #0088cc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .loading-messages {
            margin-top: 2rem;
          }

          .loading-message {
            font-size: 1rem;
            color: #475569;
            font-weight: 500;
            animation: fadeIn 0.5s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="loading-card">
          <div className="loading-icon-container">
            <ChartIcon />
          </div>

          <h2 className="loading-title">Analisando Seus Dados...</h2>
          <p className="loading-subtitle">
            Processando suas respostas para gerar um diagnóstico
            personalizado
          </p>

          <div className="loading-progress-container">
            <div className="loading-progress-bar">
              <div
                className="loading-progress-fill"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="loading-percentage">
              {Math.round(loadingProgress)}%
            </div>
          </div>

          <div className="loading-messages">
            {loadingProgress < 30 && (
              <p className="loading-message">
               Identificando pontos de melhoria...
              </p>
            )}
            {loadingProgress >= 30 && loadingProgress < 60 && (
              <p className="loading-message">
                Calculando seu potencial de economia...
              </p>
            )}
            {loadingProgress >= 60 && loadingProgress < 90 && (
              <p className="loading-message">
               Gerando recomendações personalizadas...
              </p>
            )}
            {loadingProgress >= 90 && (
              <p className="loading-message">
                Finalizando seu diagnóstico executivo...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === "result") {
    // cálculo dos indicadores
    const maxScore = questions.reduce((total, _, index) => {
      const questionWeight =
        QUESTION_WEIGHTS[index] ??
        QUESTION_WEIGHTS[QUESTION_WEIGHTS.length - 1] ??
        1;
      return total + questionWeight;
    }, 0);
    const scorePercentage =
      maxScore === 0 ? 0 : Math.min((score / maxScore) * 100, 100);
    const spendQuestionIndex = questions.findIndex(
      (question) => question.id === 3
    );
    const spendOptionIndex =
      spendQuestionIndex >= 0
        ? selectedOptionIndices[spendQuestionIndex]
        : undefined;
    const monthlySpend =
      spendQuestionIndex >= 0 &&
      typeof spendOptionIndex === "number" &&
      spendOptionIndex >= 0
        ? questions[spendQuestionIndex]?.options[spendOptionIndex]?.monthlySpend
        : undefined;
    const economyPotential =
      typeof monthlySpend === "number" && monthlySpend > 0
        ? Math.round(monthlySpend * 12 * 0.15)
        : Math.round((scorePercentage / 100) * 500_000);
    const efficiencyGain = Math.round(
      (scorePercentage / 100) * 20
    );

    const normalizedScore = Number(
      (scorePercentage / 10).toFixed(1)
    );

    const handleConsultancySubmit = async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const trimmedName = userName.trim();
      const trimmedEmail = userEmail.trim();
      const trimmedCompany = userCompany.trim();

      if (!trimmedName || !trimmedEmail || !trimmedCompany) {
        setSendReportError(
          "Preencha nome, e-mail e empresa para receber o relatório completo."
        );
        return;
      }

      setSendReportError(null);
      setSendReportSuccess(false);
      setIsSendingReport(true);

      const calendlyUrl = "https://calendly.com/vicente-logztech/45min";

      const openCalendlyWindow = () => {
        if (typeof window === "undefined") {
          return null;
        }

        try {
          const newWindow = window.open(calendlyUrl, "_blank");
          if (newWindow) {
            try {
              newWindow.opener = null;
              newWindow.focus();
            } catch {
              // noop
            }
          }
          return newWindow;
        } catch {
          return null;
        }
      };

      let calendlyWindow: Window | null = openCalendlyWindow();

      try {
        const response = await fetch("/api/send-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            company: trimmedCompany,
            role: userRole,
            score: normalizedScore,
            scorePercentage,
            efficiencyGain,
            economyPotential,
          }),
        });

        if (!response.ok) {
          let message = "Não foi possível enviar o relatório. Tente novamente.";
          if (calendlyWindow && !calendlyWindow.closed) {
            calendlyWindow.close();
          }
          try {
            const data = await response.json();
            if (data && typeof data.message === "string" && data.message.trim()) {
              message = data.message;
            }
          } catch {
            // ignora parsing
          }
          throw new Error(message);
        }

        setSendReportSuccess(true);

        if (!calendlyWindow || calendlyWindow.closed) {
          calendlyWindow = openCalendlyWindow();
        }
      } catch (error) {
        console.error("[QuizLOGZ] Falha no envio do relatório", error);
        setSendReportError(
          error instanceof Error
            ? error.message
            : "Não foi possível enviar o relatório. Tente novamente."
        );
        if (calendlyWindow && !calendlyWindow.closed) {
          try {
            calendlyWindow.close();
          } catch {
            // ignore
          }
          calendlyWindow = null;
        }
      } finally {
        setIsSendingReport(false);
      }
    };


    const profileMessages = {
      diretoria: {
        critical:
          "Você está deixando de economizar todos os meses. A operação está drenando recursos que poderiam virar lucro.",
        high:
          "O potencial de ganho é expressivo. Pequenas melhorias de gestão podem gerar economias significativas no curto prazo.",
        moderate:
          "Há espaço para evoluir a eficiência e reduzir custos operacionais sem grandes investimentos.",
        low:
          "Sua operação demonstra boa eficiência. Continue acompanhando indicadores e consolidando resultados sustentáveis.",
      },
      usinagem: {
        critical:
          "Você perde horas de trabalho por falta de gestão das ferramentas. Isso está impactando diretamente a produtividade das máquinas e da equipe.",
        high:
          "Há muito tempo sendo perdido em trocas e buscas de ferramentas. Com uma organização melhor, o rendimento do setor pode aumentar rapidamente.",
        moderate:
          "O processo de usinagem está funcional, mas ainda há gargalos no controle e disponibilidade das ferramentas.",
        low:
          "Seu setor está operando de forma eficiente. Mantenha o padrão e registre sempre as movimentações para evitar retrocessos.",
      },
      compras: {
        critical:
          "Seu gasto com ferramentas pode ser reduzido imediatamente. Há compras desnecessárias acontecendo agora - é hora de agir e retomar o controle dos custos.",
        high:
          "Você tem um grande potencial de economia. Pequenos ajustes nos pedidos e reposições já trariam resultados financeiros visíveis.",
        moderate:
          "Há oportunidades claras de negociação e planejamento de estoque que podem melhorar sua eficiência de compra.",
        low:
          "Sua gestão de compras está bem estruturada. Continue monitorando o consumo para manter a eficiência e evitar desperdícios futuros.",
      },
    } as const;

    const profileCategory: keyof typeof profileMessages =
      userRole === "Supervisor/Gerente de usinagem"
        ? "usinagem"
        : userRole === "Comprador"
        ? "compras"
        : "diretoria";

    let resultLevel = "";
    let resultMessage = "";
    let resultColor = "";

    if (scorePercentage >= 75) {
      resultLevel = "BAIXO";
      resultMessage = profileMessages[profileCategory].low;
      resultColor = "#10b981";
    } else if (scorePercentage >= 50) {
      resultLevel = "MODERADO";
      resultMessage = profileMessages[profileCategory].moderate;
      resultColor = "#3b82f6";
    } else if (scorePercentage >= 25) {
      resultLevel = "ALTO";
      resultMessage = profileMessages[profileCategory].high;
      resultColor = "#f59e0b";
    } else {
      resultLevel = "CRÍTICO";
      resultMessage = profileMessages[profileCategory].critical;
      resultColor = "#ef4444";
    }


    return (
      <div className="quiz-container">
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #0a1628 0%, #1a2642 50%, #0f1b2e 100%);
            min-height: 100vh;
            overflow-x: hidden;
          }

          .quiz-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            overflow: hidden;
          }

          .quiz-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 30%, rgba(0, 191, 254, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 136, 204, 0.08) 0%, transparent 50%);
            pointer-events: none;
          }

          .result-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 248, 0.92) 100%);
            border-radius: 2rem;
            padding: 3.5rem;
            max-width: 900px;
            width: 100%;
            box-shadow: 
              0 30px 90px rgba(0, 0, 0, 0.3),
              0 10px 30px rgba(0, 191, 254, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
            position: relative;
            z-index: 1;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(20px);
            animation: slideUp 0.6s ease-out;
          }

          .trophy-container {
            text-align: center;
            margin-bottom: 2rem;
            animation: bounceIn 0.8s ease-out;
          }

          @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }

          .result-badge {
            display: inline-block;
            background: ${resultColor};
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 2rem;
            font-size: 1.2rem;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-top: 1rem;
            box-shadow: 0 8px 25px ${resultColor}40;
          }

          .result-title {
            font-size: 2.5rem;
            font-weight: 800;
            color: #0a1628;
            text-align: center;
            margin: 1.5rem 0 1rem;
            line-height: 1.3;
          }

          .result-score {
            text-align: center;
            font-size: 1.3rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 1rem;
          }

          .result-message {
            text-align: center;
            font-size: 1.2rem;
            color: #475569;
            margin-bottom: 3rem;
            line-height: 1.6;
          }

          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 3rem 0;
          }

          .metric-card {
            background: linear-gradient(135deg, rgba(0, 191, 254, 0.08), rgba(0, 136, 204, 0.05));
            padding: 2rem;
            border-radius: 1.5rem;
            border: 2px solid rgba(0, 191, 254, 0.2);
            text-align: center;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .metric-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(0, 191, 254, 0.1) 0%, transparent 70%);
            animation: rotate 10s linear infinite;
          }

          .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 191, 254, 0.25);
            border-color: rgba(0, 191, 254, 0.4);
          }

          .metric-icon {
            margin-bottom: 1rem;
          }

          .metric-value {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #00bffe, #0088cc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
            position: relative;
            z-index: 1;
          }

          .metric-label {
            color: #64748b;
            font-size: 1rem;
            font-weight: 600;
            position: relative;
            z-index: 1;
          }

          .offer-section {
            background: linear-gradient(135deg, #0a1628, #1a2642);
            border-radius: 1.5rem;
            padding: 3rem;
            margin: 3rem 0;
            color: white;
            position: relative;
            overflow: hidden;
          }

          .offer-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 30% 50%, rgba(0, 191, 254, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(0, 136, 204, 0.1) 0%, transparent 50%);
            pointer-events: none;
          }

          .offer-content {
            position: relative;
            z-index: 1;
          }

          .offer-title {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 1rem;
            text-align: center;
          }

          .offer-subtitle {
            text-align: center;
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2rem;
          }

          .benefits-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
          }

          .benefit-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .benefit-icon {
            font-size: 1.5rem;
          }

          .benefit-text {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.95);
          }

          .cta-section {
            text-align: center;
            margin-top: 2.5rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
          }

          .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
          }

          .form-input {
            width: 100%;
            padding: 1rem;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.75rem;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .form-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }

          .form-input:focus {
            outline: none;
            border-color: #00bffe;
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 20px rgba(0, 191, 254, 0.3);
          }

          .cta-button-primary {
            background: linear-gradient(135deg, #00bffe, #0088cc);
            color: white;
            border: none;
            padding: 1.5rem 3rem;
            font-size: 1.3rem;
            font-weight: 800;
            border-radius: 3rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 
              0 15px 40px rgba(0, 191, 254, 0.4),
              0 8px 20px rgba(0, 0, 0, 0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
            width: 100%;
            margin-top: 1rem;
            position: relative;
            overflow: hidden;
          }

          .cta-button-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s;
          }

          .cta-button-primary:hover::before {
            left: 100%;
          }

          .cta-button-primary:hover {
            transform: translateY(-3px);
            box-shadow: 
              0 20px 50px rgba(0, 191, 254, 0.5),
              0 10px 25px rgba(0, 0, 0, 0.4);
          }

          .cta-button-primary:disabled {
            cursor: not-allowed;
            opacity: 0.7;
            filter: grayscale(0.1);
            box-shadow: 
              0 8px 20px rgba(0, 191, 254, 0.2),
              0 4px 12px rgba(0, 0, 0, 0.25);
          }

          .urgency-badge {
            display: inline-block;
            background: #ef4444;
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 2rem;
            font-size: 0.9rem;
            font-weight: 700;
            margin-top: 1rem;
            animation: pulse 2s ease-in-out infinite;
          }

          .form-feedback {
            margin-top: 0.75rem;
            font-size: 0.95rem;
            text-align: center;
          }

          .form-feedback.success {
            color: #34d399;
          }

          .form-feedback.error {
            color: #f87171;
          }

          .guarantee-text {
            text-align: center;
            margin-top: 1.5rem;
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.8);
          }

          @media (max-width: 768px) {
            .result-card {
              padding: 2rem;
            }

            .result-title {
              font-size: 1.8rem;
            }

            .metrics-grid {
              grid-template-columns: 1fr;
            }

            .offer-section {
              padding: 2rem;
            }

            .offer-title {
              font-size: 1.5rem;
            }
          }
        `}</style>

        <div className="result-card">
          <div className="trophy-container">
            <div className="result-badge">
              NÍVEL DE URGÊNCIA: {resultLevel}
            </div>
          </div>

          <h1 className="result-title">✅ Seu Diagnóstico Está Pronto!</h1>
          <p className="result-score">
            Sua nota: {normalizedScore.toFixed(1)} / 10 ({scorePercentage.toFixed(1)}%)
          </p>
          <p className="result-message">{resultMessage}</p>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <MoneyIcon />
              </div>
              <div className="metric-value">
                R${" "}
                {economyPotential.toLocaleString("pt-BR")}
              </div>
              <div className="metric-label">
                Potencial de economia com Gasto Oculto
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <ChartIcon />
              </div>
              <div className="metric-value">
                {efficiencyGain}%
              </div>
              <div className="metric-label">
                Ganho de Eficiência Possível
              </div>
            </div>

          </div>

          <div className="offer-section">
            <div className="offer-content">
              <h2 className="offer-title">OFERTA EXCLUSIVA PARA VOCÊ</h2>
              <p className="offer-subtitle">
                Agende agora uma{" "}
                <strong>
                  Consultoria Estratégica Gratuita
                </strong>{" "}
                com nossos especialistas LOG Z
              </p>

              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">🔍</div>
                  <div className="benefit-text">
                    Análise detalhada da sua operação
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🧭</div>
                  <div className="benefit-text">
                    Como a Log Z auxilia a estruturar a gestão
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">💻</div>
                  <div className="benefit-text">
                    Demonstração prática da Plataforma Log Z
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">📈</div>
                  <div className="benefit-text">
                    Orientações e passos para uma gestão mais eficiente
                  </div>
                </div>
              </div>

              <div className="cta-section">
                <form onSubmit={handleConsultancySubmit}>
                  <div className="form-group">
                    <label className="form-label">
                      Seu Nome Completo*
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Digite seu nome"
                      value={userName}
                      onChange={(e) =>
                        setUserName(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Email Corporativo*
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="seu.email@empresa.com"
                      value={userEmail}
                      onChange={(e) =>
                        setUserEmail(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Empresa*
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nome da sua empresa"
                      value={userCompany}
                      onChange={(e) =>
                        setUserCompany(e.target.value)
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="cta-button-primary"
                    disabled={isSendingReport}
                  >
                    {isSendingReport
                      ? "Enviando relatório..."
                      : "💼 Falar com Especialista AGORA"}
                  </button>

                  {sendReportError && (
                    <p className="form-feedback error">
                      {sendReportError}
                    </p>
                  )}

                  {sendReportSuccess && !sendReportError && (
                    <p className="form-feedback success">
                      Relatório enviado! Confira seu e-mail em instantes.
                    </p>
                  )}
                </form>

                <div className="urgency-badge">
                  ⚠️ VAGAS LIMITADAS - Apenas 5
                  consultorias por semana
                </div>

                <p className="guarantee-text">
                  <strong>100% Confidencial</strong> | Sem
                  compromisso | Resposta em 24h
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              padding: "1.5rem",
              background: "rgba(0, 191, 254, 0.05)",
              borderRadius: "1rem",
              border: "1px solid rgba(0, 191, 254, 0.2)",
            }}
          >
            <p
              style={{
                color: "#64748b",
                fontSize: "0.95rem",
                marginBottom: "0.5rem",
              }}
            >
              <strong>
                Por que empresas líderes escolhem LOG Z?
              </strong>
            </p>
            <p
              style={{
                color: "#475569",
                fontSize: "0.9rem",
              }}
            >
              Empresas de usinagem já
              reduziram seus custos em média 15% com
              nossa solução. Sistema completo de
              gestão de ferramentas com IA,
              dashboards em tempo real e suporte
              especializado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizLOGZ;
