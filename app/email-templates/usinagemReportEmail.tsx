import * as React from "react";
import { getFaixaFromScore, Faixa } from "../(marketing)/utils/emailScore";

export type UsinagemReportEmailProps = {
  name: string;
  score: number; 
};

export default function UsinagemReportEmail({ name, score }: UsinagemReportEmailProps) {
  const faixa = getFaixaFromScore(score);

  function renderContentByFaixa(faixa: Faixa) {
    if (faixa === "critica") {
      return (
        <>
          <p style={styles.tag}><b>Faixa de nota:</b> 0 – 5 | Gestão com oportunidades críticas de melhoria</p>

          <Section title="Cenário identificado">
            <p>
              O setor de usinagem ainda depende de controles manuais ou informações não padronizadas.
              A ausência de histórico de consumo e rastreabilidade das ferramentas impacta diretamente
              o rendimento das máquinas e o custo de produção. Esse cenário gera interrupções e
              desperdícios que poderiam ser evitados com uma gestão mais estruturada.
            </p>
          </Section>

          <Section title="Oportunidades e próximos passos">
            <p>
              O foco inicial deve ser digitalizar o controle das ferramentas e criar um processo
              de registro de entradas, saídas e consumo por operação. Com isso, a equipe passa a
              enxergar o uso real de cada item, reduzindo perdas e melhorando a previsibilidade da produção.
            </p>
          </Section>

          <Section title="Como a Log Z pode ajudar">
            <p>
              A Log Z registra cada movimentação de ferramenta e oferece relatórios de consumo e custo
              por operação. Isso traz visibilidade imediata e elimina surpresas no chão de fábrica.
              A plataforma ajuda a transformar o controle manual em um processo ágil, confiável e eficiente.
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
              A usinagem já possui boas práticas de controle e organização,
              mas ainda há espaço para melhorar a integração entre setores e a análise dos dados coletados.
              O acompanhamento pode estar ocorrendo, porém com atualizações manuais
              ou falhas de comunicação entre turnos.
            </p>
          </Section>

          <Section title="Oportunidades e próximos passos">
            <p>
              O avanço agora é transformar o controle operacional em inteligência.
              Ao cruzar dados de consumo, durabilidade e desempenho de operadores, é possível
              identificar padrões, antecipar trocas e reduzir custos sem comprometer a produtividade.
            </p>
          </Section>

          <Section title="Como a Log Z pode ajudar">
            <p>
              A Log Z integra informações de estoque, consumo e operadores em tempo real.
              Os relatórios mostram o desempenho de cada ferramenta e ajudam a ajustar processos
              para melhorar a vida útil e o custo por peça. Com dados confiáveis,
              a usinagem passa a operar de forma preditiva e totalmente orientada por fatos.
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
            Sua usinagem demonstra excelência na gestão das ferramentas e domínio sobre o consumo.
            Os processos são padronizados e a operação já utiliza dados para tomar decisões assertivas.
            O desafio agora é refinar análises e buscar inovação contínua.
          </p>
        </Section>

        <Section title="Oportunidades e próximos passos">
          <p>
            Com a base sólida, o foco está em realizar comparativos avançados, avaliar desempenho
            de ferramentas por tipo de operação e aumentar a previsibilidade de resultados.
            Essa evolução transforma o controle em inteligência de performance e gera ganhos sustentáveis.
          </p>
        </Section>

        <Section title="Como a Log Z pode ajudar">
          <p>
            A Log Z apoia esse estágio com relatórios personalizados e indicadores preditivos.
            A plataforma ajuda a manter o alto nível de controle e a ampliar a capacidade analítica da equipe.
            Com isso, a usinagem segue evoluindo de forma contínua e sustentada por dados confiáveis.
          </p>
        </Section>
      </>
    );
  }

  return (
    <EmailWrapper>
      <Header title="🏭 Diagnóstico Log Z — Usinagem" score={score} name={name} />
      {renderContentByFaixa(faixa)}
      <Footer />
    </EmailWrapper>
  );
}

// ===== componentes visuais reutilizáveis =====

function EmailWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.outer}>
      <div style={styles.card}>
        {children}
      </div>
    </div>
  );
}

function Header({ title, score, name }: { title: string; score: number; name: string }) {
  return (
    <>
      <h2 style={styles.h2}>{title}</h2>
      <p>Olá {name},</p>
      <p>
        Abaixo está seu diagnóstico de eficiência em usinagem com base nas respostas do questionário.
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
        Log Z • Gestão de Ferramentas e Estoque em Usinagem
      </p>
      <p style={styles.footerText}>
        Reduza desperdício. Evite parada de máquina. Compre só o que precisa.
      </p>
    </>
  );
}

// estilos inline (seguros pra e-mail)
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
