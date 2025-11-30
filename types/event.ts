export interface Event {
  nome: string;
  data_inicio: string;
  data_fim: string;
  salao?: string | null;
  numero_hospedes?: number | null;
  possiveis_hospedes?: string[] | null;
}
