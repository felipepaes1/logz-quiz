import * as React from "react";
import { getFaixaFromScore, Faixa } from "../(marketing)/utils/emailScore";

export type ComprasReportEmailProps = {
  name: string;
  score: number;
};

export default function ComprasReportEmail({ name, score }: ComprasReportEmailProps) {
  const faixa = getFaixaFromScore(score);

  function renderContentByFaixa(faixa: Faixa) {
    if (faixa === "critica") {
      return (
        <>
          <p style={styles.tag}><b>Faixa de nota:</b> 0 – 5 | Gestão com oportunidades críticas de melhoria</p>

          <Section title="Cenário identificado">
            <p>
              O setor de compras ainda opera de forma reativa, com reposições feitas por urgência ou hábito,
              sem base sólida em dados de consumo e estoque. Isso dificulta o planejamento financeiro e aumenta
              os custos com aquisições emergenciais. A falta de visibilidade entre consumo real e pedidos
              também reduz o poder de negociação com fornecedores.
            </p>
          </Section>

          <Section title="Oportunidades e próximos passos">
            <p>
              O primeiro passo é integrar as informações de consumo, estoque e requisições, criando um histórico confiável.
              Com isso, o comprador passa a ter previsibilidade, reduz urgências e consegue negociar melhor.
              O foco deve estar em planejar reposições com antecedência e eliminar compras não planejadas.
            </p>
          </Section>

          <Section title="Como a Log Z pode ajudar">
            <p>
              A Log Z conecta o setor de compras à produção em tempo real, automatizando alertas
              e relatórios de consumo. Com a plataforma, é possível planejar aquisições de forma estratégica,
              reduzir custos e aumentar o poder de negociação com base em dados concretos.
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
              O setor de compras demonstra boa organização e controle, mas ainda depende de atualizações manuais
              e comunicação informal entre áreas. Apesar de haver um acompanhamento de consumo,
              pode faltar visibilidade consolidada sobre o estoque e sobre o desempenho dos fornecedores.
            </p>
          </Section>

          <Section title="Oportunidades e próximos passos">
            <p>
              O momento agora é evoluir da gestão operacional para a gestão estratégica —
              padronizando indicadores, automatizando relatórios e analisando desempenho de fornecedores
              com base em dados reais. Isso traz maior previsibilidade e reduz desperdícios
              ou compras desnecessárias.
            </p>
          </Section>

          <Section title="Como a Log Z pode ajudar">
            <p>
              A Log Z centraliza informações de consumo, estoque e performance de fornecedores.
              Com relatórios automáticos e dados comparativos, o comprador atua com mais precisão e segurança.
              O resultado é uma gestão que planeja, negocia e compra de forma inteligente e previsível.
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
            O setor de compras apresenta maturidade e processos bem definidos, com decisões baseadas em dados
            e alinhamento entre áreas. O próximo passo é transformar essa eficiência em vantagem competitiva,
            refinando indicadores e adotando análises preditivas.
          </p>
        </Section>

        <Section title="Oportunidades e próximos passos">
          <p>
            A oportunidade está em fortalecer a integração com a produção e aprimorar a avaliação de fornecedores
            por desempenho e custo total. Com análises comparativas e previsões de demanda, o setor pode elevar
            a performance e garantir melhores margens de negociação.
          </p>
        </Section>

        <Section title="Como a Log Z pode ajudar">
          <p>
            A Log Z oferece relatórios avançados e dashboards que consolidam informações em tempo real.
            A plataforma permite prever demandas, ajustar políticas de compra e acompanhar resultados com precisão,
            garantindo continuidade e evolução da eficiência.
          </p>
        </Section>
      </>
    );
  }

  return (
    <EmailWrapper>
      <Header title="💼 Diagnóstico Log Z — Compras" score={score} name={name} />
      {renderContentByFaixa(faixa)}
      <Footer />
    </EmailWrapper>
  );
}

// Reuso dos mesmos helpers/estilos do e-mail anterior

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
        Este é o diagnóstico da sua maturidade de Compras com base nas respostas do questionário.
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
        Log Z • Conectando Compras e Produção com dados reais
      </p>
      <p style={styles.footerText}>
        Menos compra emergencial. Mais previsibilidade e margem.
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
