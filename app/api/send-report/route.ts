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

type RequestPayload = {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  score?: number;
  scorePercentage?: number;
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
    `Empresa: ${payload.company || "Não informado"}`,
    `Cargo: ${payload.role}`,
    `E-mail: ${payload.email}`,
    `Nota (0-10): ${scoreOn10.toFixed(1)}`,
    `Nota (%): ${(payload.scorePercentage ?? scoreOn10 * 10).toFixed(1)}%`,
  ].join("\n");
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
