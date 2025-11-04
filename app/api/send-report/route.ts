import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import { createElement } from "react";

import SellerReportEmail from "../../email-templates/sellerReportEmail";
import DiretorReportEmail from "../../email-templates/directorReportEmail";
import UsinagemReportEmail from "../../email-templates/usinagemReportEmail";
import { sendMail } from "../../services/mailer";

type EmailTemplateComponent = (props: { name: string; score: number }) => JSX.Element;

type TemplateConfig = {
  component: EmailTemplateComponent;
  subjectPrefix: string;
};

const TEMPLATE_BY_ROLE: Record<string, TemplateConfig> = {
  "Comprador": {
    component: SellerReportEmail,
    subjectPrefix: "Diagnóstico Log Z • Compras",
  },
  "Diretor": {
    component: DiretorReportEmail,
    subjectPrefix: "Diagnóstico Log Z • Diretoria",
  },
  "Supervisor/Gerente de usinagem": {
    component: UsinagemReportEmail,
    subjectPrefix: "Diagnóstico Log Z • Usinagem",
  },
};

const DEFAULT_TEMPLATE: TemplateConfig = TEMPLATE_BY_ROLE["Supervisor/Gerente de usinagem"];

type AnswerPayload = {
  questionId: number;
  questionType?: string;
  question: string;
  answer: string;
  optionValue?: number;
  monthlySpend?: number;
};

type AdminEmailPayload = {
  name: string;
  email: string;
  company: string;
  role: string;
  scoreOn10: number;
  scorePercentage: number;
  efficiencyGain?: number;
  economyPotential?: number;
  answers: AnswerPayload[];
};

type RequestPayload = {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  score?: number;
  scorePercentage?: number;
  efficiencyGain?: number;
  economyPotential?: number;
  answers?: unknown;
};

function normalizeScore(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  const normalized = numeric > 10 ? numeric / 10 : numeric;
  return Math.min(Math.max(Number(normalized.toFixed(1)), 0), 10);
}

function resolveTemplate(role: string | undefined | null): TemplateConfig {
  if (!role) {
    return DEFAULT_TEMPLATE;
  }

  return TEMPLATE_BY_ROLE[role] ?? DEFAULT_TEMPLATE;
}

function buildSubject(prefix: string, score: number) {
  return `${prefix} | Nota ${score.toFixed(1)}/10`;
}

type SummaryPayload = {
  name: string;
  email: string;
  company: string;
  role: string;
  scorePercentage: number;
};

function buildSummaryText(payload: SummaryPayload, scoreOn10: number) {
  return [
    `Nome: ${payload.name}`,
    `Empresa: ${payload.company || "Nao informado"}`,
    `Cargo: ${payload.role}`,
    `E-mail: ${payload.email}`,
    `Nota (0-10): ${scoreOn10.toFixed(1)}`,
    `Nota (%): ${(payload.scorePercentage ?? scoreOn10 * 10).toFixed(1)}%`,
  ].join("\n");
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function formatCurrency(value: number | undefined): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  return currencyFormatter.format(value);
}

function formatOptionalNumber(value: number | undefined, suffix = ""): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  return `${decimalFormatter.format(value)}${suffix}`;
}

function normalizeAnswers(rawValue: unknown): AnswerPayload[] {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  const normalized: AnswerPayload[] = [];

  for (const entry of rawValue) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const entryRecord = entry as Record<string, unknown>;
    const maybeQuestion = entryRecord.question;
    const maybeAnswer = entryRecord.answer;
    const questionText =
      typeof maybeQuestion === "string"
        ? maybeQuestion.trim()
        : String(maybeQuestion ?? "").trim();
    const answerText =
      typeof maybeAnswer === "string"
        ? maybeAnswer.trim()
        : String(maybeAnswer ?? "").trim();

    if (!questionText || !answerText) {
      continue;
    }

    const normalizedEntry: AnswerPayload = {
      questionId: Number.isFinite(Number(entryRecord.questionId))
        ? Number(entryRecord.questionId)
        : 0,
      questionType:
        typeof entryRecord.questionType === "string"
          ? String(entryRecord.questionType)
          : undefined,
      question: questionText,
      answer: answerText,
    };

    const optionValue = Number(entryRecord.optionValue);
    if (Number.isFinite(optionValue)) {
      normalizedEntry.optionValue = optionValue;
    }

    const monthlySpend = Number(entryRecord.monthlySpend);
    if (Number.isFinite(monthlySpend)) {
      normalizedEntry.monthlySpend = monthlySpend;
    }

    normalized.push(normalizedEntry);
  }

  return normalized;
}

function buildAdminHtml(payload: AdminEmailPayload): string {
  const infoRows = [
    ["Nome", escapeHtml(payload.name)],
    ["Empresa", escapeHtml(payload.company || "Nao informado")],
    ["Cargo", escapeHtml(payload.role || "Nao informado")],
    ["E-mail", escapeHtml(payload.email)],
  ];

  const indicatorsRows = [
    ["Nota (0-10)", decimalFormatter.format(payload.scoreOn10)],
    ["Nota (%)", formatOptionalNumber(payload.scorePercentage, "%")],
    [
      "Ganho de eficiencia estimado",
      formatOptionalNumber(payload.efficiencyGain, "%"),
    ],
    [
      "Potencial de economia",
      formatCurrency(payload.economyPotential),
    ],
  ];

  const answersRows =
    payload.answers.length > 0
      ? payload.answers
          .map((answer, index) => {
            const typeLabel = answer.questionType
              ? ` <span style="color:#64748b;font-size:12px;">(${escapeHtml(
                  answer.questionType,
                )})</span>`
              : "";
            const formattedMonthlySpend = formatCurrency(answer.monthlySpend);
            const formattedOptionValue =
              typeof answer.optionValue === "number" &&
              Number.isFinite(answer.optionValue)
                ? integerFormatter.format(answer.optionValue)
                : "-";

            return `<tr>
              <td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#475569;">${integerFormatter.format(
                index + 1,
              )}</td>
              <td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;line-height:1.4;">
                ${escapeHtml(answer.question)}${typeLabel}
              </td>
              <td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#0f172a;line-height:1.4;">
                ${escapeHtml(answer.answer)}
              </td>
              <td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#475569;text-align:center;">
                ${formattedOptionValue}
              </td>
              <td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#475569;text-align:right;">
                ${formattedMonthlySpend}
              </td>
            </tr>`;
          })
          .join("")
      : `<tr>
          <td colspan="5" style="padding:16px;color:#64748b;text-align:center;border-bottom:1px solid #e2e8f0;">
            Nenhuma resposta registrada.
          </td>
        </tr>`;

  const infoTable = infoRows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 0;color:#64748b;font-size:13px;">${label}</td>
          <td style="padding:8px 0;color:#0f172a;font-weight:600;">${value}</td>
        </tr>`,
    )
    .join("");

  const indicatorsTable = indicatorsRows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 0;color:#64748b;font-size:13px;">${label}</td>
          <td style="padding:8px 0;color:#0f172a;font-weight:600;">${value}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Diagnostico Log Z - Novo resultado</title>
    </head>
    <body style="background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;">
        <h2 style="margin:0 0 8px;color:#0f172a;">Novo diagnostico concluido</h2>
        <p style="margin:0 0 24px;color:#475569;line-height:1.6;">
          Um participante finalizou o quiz na landing page. Veja abaixo os dados e as respostas registradas.
        </p>

        <h3 style="margin:24px 0 12px;color:#0f172a;">Dados do participante</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${infoTable}
          </tbody>
        </table>

        <h3 style="margin:32px 0 12px;color:#0f172a;">Indicadores calculados</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${indicatorsTable}
          </tbody>
        </table>

        <h3 style="margin:32px 0 12px;color:#0f172a;">Respostas</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr>
              <th style="text-align:left;padding:12px;border-bottom:2px solid #0ea5e9;color:#0369a1;">#</th>
              <th style="text-align:left;padding:12px;border-bottom:2px solid #0ea5e9;color:#0369a1;">Pergunta</th>
              <th style="text-align:left;padding:12px;border-bottom:2px solid #0ea5e9;color:#0369a1;">Resposta</th>
              <th style="text-align:center;padding:12px;border-bottom:2px solid #0ea5e9;color:#0369a1;">Valor</th>
              <th style="text-align:right;padding:12px;border-bottom:2px solid #0ea5e9;color:#0369a1;">Consumo estimado</th>
            </tr>
          </thead>
          <tbody>
            ${answersRows}
          </tbody>
        </table>

        <p style="margin:32px 0 0;color:#94a3b8;font-size:12px;text-align:center;">
          Enviado automaticamente pelo formulario da LOG Z.
        </p>
      </div>
    </body>
  </html>`;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as RequestPayload;

    const name = payload.name?.trim();
    const email = payload.email?.trim();
    const company = payload.company?.trim() ?? "";
    const role = payload.role ?? "";

    if (!name) {
      return NextResponse.json(
        { message: "Nome é obrigatório." },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: "E-mail é obrigatório." },
        { status: 400 },
      );
    }

    const scoreOn10 = normalizeScore(
      payload.score ?? payload.scorePercentage,
    );
    const scorePercentage =
      typeof payload.scorePercentage === "number"
        ? payload.scorePercentage
        : Math.min(Math.max(scoreOn10 * 10, 0), 100);

    const efficiencyGain = Number.isFinite(Number(payload.efficiencyGain))
      ? Number(payload.efficiencyGain)
      : undefined;
    const economyPotential = Number.isFinite(Number(payload.economyPotential))
      ? Number(payload.economyPotential)
      : undefined;
    const answers = normalizeAnswers(payload.answers);

    const templateConfig = resolveTemplate(role);
    const EmailComponent = templateConfig.component;

    const { renderToStaticMarkup } = await import("react-dom/server");

    const emailHtml =
      "<!DOCTYPE html>" +
      renderToStaticMarkup(
        createElement(EmailComponent, {
          name,
          score: scoreOn10,
        }),
      );

    await sendMail({
      to: email,
      subject: buildSubject(templateConfig.subjectPrefix, scoreOn10),
      html: emailHtml,
    });

    const adminRecipients =
      typeof process.env.MAIL_TO === "string"
        ? process.env.MAIL_TO.split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    if (adminRecipients.length > 0) {
      const adminHtml = buildAdminHtml({
        name,
        email,
        company,
        role,
        scoreOn10,
        scorePercentage,
        efficiencyGain,
        economyPotential,
        answers,
      });

      try {
        await sendMail({
          to: adminRecipients,
          subject: `Novo diagnostico concluido | ${name}`,
          html: adminHtml,
          disableDefaultBcc: true,
        });
      } catch (adminError) {
        console.error(
          "[email] Falha ao enviar diagnostico para administrador:",
          adminError,
        );
      }
    }

    const summary = buildSummaryText(
      {
        name,
        email,
        company,
        role,
        scorePercentage,
      },
      scoreOn10,
    );

    console.log("[email] Diagnóstico enviado para usuário:", summary);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[email] Falha ao enviar diagnóstico:", error);
    return NextResponse.json(
      { message: "Não foi possível enviar o e-mail. Tente novamente mais tarde." },
      { status: 500 },
    );
  }
}
