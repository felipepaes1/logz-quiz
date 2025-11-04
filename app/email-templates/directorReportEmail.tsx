import * as React from "react";
import { getFaixaFromScore, Faixa } from "../(marketing)/utils/emailScore";

export type DiretoriaReportEmailProps = {
  name: string;
  score: number;
};

export default function DiretoriaReportEmail({ name, score }: DiretoriaReportEmailProps) {
  const faixa = getFaixaFromScore(score);

  function renderContentByFaixa(faixa: Faixa) {
    if (faixa === "critica") {
      return (
        <>
          <p style={styles.tag}><b>Faixa de nota:</b> 0 – 5 | Gestão com oportunidades críticas de melhoria</p>

          <Section title="Cenário identificado">
            <p>
              A gestão de usinagem ainda carece de integração entre setores e de informações confiáveis
              para orientar decisões. Os controles podem estar dispersos em planilhas ou anotações manuais,
              dificultando enxergar o impacto das ferramentas de corte nos custos de produção.
              Sem essa visão consolidada, a diretoria perde previsibilidade e trabalha
              de forma mais reativa do que estratégica.
            </p>
          </Section>

          <Section title="Oportunidades e próximos passos">
            <p>
              Este é o momento de estruturar uma base sólida de dados — conectar estoque, compras e produção —
              e começar a medir indicadores reais de consumo. Com essa organização, é possível reduzir urgências,
              controlar custos e planejar investimentos de forma precisa.
            </p>
          </Section>

          <Section title="Como a Log Z pode ajudar">
            <p>
              A Log Z simplifica o controle e transforma informações em indicadores visuais.
              Com a plataforma, a diretoria passa a ter previsibilidade financeira, relatórios confiáveis
              e decisões baseadas em fatos. O primeiro passo é digitalizar o controle de ferramentas
              e unificar a comunicação entre os setores.
            </p>
          </Section>
        </>
      );
    }

    if (faixa === "estruturada") {
      return (
        <>
          <p style={styles.tag}><b>Faixa de nota:</b> 5,1 – 9 | Gestão estruturada, mas com pontos de evolução</p>

          <Section title="Cenário identificado">
            <p>
              Sua gestão já demonstra práticas consistentes e organização, mas ainda existem oportunidades
              de avanço na análise e integração dos dados. O acompanhamento de consumo e custos pode estar acontecendo,
              porém com limitações de visibilidade em tempo real e cruzamento entre setores.
            </p>
          </Section>

          <Section title="Oportunidades e próximos passos">
            <p>
              Com o processo estruturado, o foco agora é evoluir da gestão reativa para a preditiva —
              usando dados históricos para antecipar cenários, comparar desempenho e identificar desperdícios.
              A consolidação de informações entre produção, estoque e compras permite enxergar
              o custo real da usinagem e aumentar a rentabilidade.
            </p>
          </Section>

          <Section title="Como a Log Z pode ajudar">
            <p>
              A Log Z automatiza relatórios e entrega dashboards claros para apoiar decisões estratégicas.
              Com isso, a diretoria consegue visualizar onde estão os principais custos e oportunidades de redução,
              agindo com base em fatos e em tempo real. É o passo que transforma o controle em inteligência
              e os dados em resultados.
            </p>
          </Section>
        </>
      );
    }

    // excelencia
    return (
      <>
        <p style={styles.tag}><b>Faixa de nota:</b> 9,1 – 10 | Gestão de excelência e foco em performance contínua</p>

        <Section title="Cenário identificado">
          <p>
            Sua empresa já apresenta uma gestão madura e orientada por dados,
            com processos bem definidos e indicadores confiáveis. O desafio atual é continuar evoluindo —
            transformando os dados já estruturados em inteligência preditiva e inovação contínua.
          </p>
        </Section>

        <Section title="Oportunidades e próximos passos">
          <p>
            Com uma base sólida, o próximo nível está em aprimorar as análises comparativas entre centros de custo,
            operadores e máquinas, buscando melhorias contínuas e ganhos de performance.
            Trata-se de consolidar o conhecimento em cultura e transformar eficiência em vantagem competitiva.
          </p>
        </Section>

        <Section title="Como a Log Z pode ajudar">
          <p>
            A Log Z apoia empresas em estágio avançado de maturidade, fornecendo relatórios personalizados,
            comparativos e indicadores de alta precisão. A plataforma reforça a previsibilidade e mantém
            o alto padrão de controle, apoiando a diretoria na evolução constante dos resultados.
          </p>
        </Section>
      </>
    );
  }

  return (
    <EmailWrapper>
      <Header title="🧠 Diagnóstico Log Z — Diretoria" score={score} name={name} />
      {renderContentByFaixa(faixa)}
      <Footer />
    </EmailWrapper>
  );
}


function EmailWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.outer}>
      <div style={styles.card}>{children}</div>
    </div>
  );
}

function Header({ title, score, name }: { title: string; score: number; name: string }) {
  return (
    <>
      <h2 style={styles.h2}>{title}</h2>
      <p>Olá {name},</p>
      <p>
        Abaixo está seu diagnóstico executivo com foco em previsibilidade, custo e maturidade de gestão.
      </p>
      <p style={styles.scoreBox}>
        <b>Sua pontuação:</b> {score.toFixed(1)} / 10
      </p>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={styles.h3}>{title}</h3>
      <div style={styles.p}>{children}</div>
    </div>
  );
}

function Footer() {
  return (
    <>
      <hr style={styles.hr} />
      <p style={styles.footerText}>
        Log Z • Visibilidade de custo real por operação e por centro de custo
      </p>
      <p style={styles.footerText}>
        Controle previsível de consumo de ferramenta = margem protegida.
      </p>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  outer: {
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#111",
    padding: "24px",
    backgroundColor: "#f9fafb",
  },
  card: {
    maxWidth: "520px",
    margin: "0 auto",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "24px",
  },
  h2: {
    margin: "0 0 16px",
    color: "#0f172a",
    fontSize: "18px",
    lineHeight: "1.4",
  },
  h3: {
    margin: "0 0 8px",
    color: "#0f172a",
    fontSize: "15px",
  },
  p: {
    color: "#111",
    fontSize: "14px",
  },
  scoreBox: {
    backgroundColor: "#0ea5e9",
    color: "#fff",
    padding: "12px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center",
    marginTop: "16px",
  },
  tag: {
    marginTop: "20px",
    backgroundColor: "#e0f2fe",
    border: "1px solid #7dd3fc",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "12px",
    color: "#075985",
    fontWeight: "bold",
  },
  hr: {
    border: 0,
    borderTop: "1px solid #e5e7eb",
    margin: "24px 0",
  },
  footerText: {
    fontSize: "12px",
    color: "#6b7280",
    margin: "0 0 4px",
  },
};
