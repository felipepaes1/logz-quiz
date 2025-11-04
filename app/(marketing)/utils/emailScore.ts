export type Faixa =
  | "critica"      
  | "estruturada"  
  | "eficiente";   

export function getFaixaFromScore(score: number): Faixa {
  if (score <= 5) return "critica";
  if (score <= 9) return "estruturada";
  return "eficiente";
}
