export const mockData: Record<string, any[]> = {
  campaign_templates: [
    {
      id: "tpl_1",
      name: "Boas-vindas",
      description: "Template de boas-vindas para novos hóspedes",
      message_template: "Olá {{name}}, bem-vindo!",
      is_default: true,
      usage_count: 12,
      created_at: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "tpl_2",
      name: "Promoção de Fim de Semana",
      description: "Desconto para estadias no fim de semana",
      message_template: "Aproveite {{discount}}% off neste fim de semana!",
      is_default: false,
      usage_count: 3,
      created_at: "2024-05-01T00:00:00.000Z",
    },
  ],
  events: [
    { id: "ev_1", name: "Concerto", start_date: "2025-12-10" },
    { id: "ev_2", name: "Feira Gastronômica", start_date: "2025-11-20" },
  ],
  profiles: [
    { id: "user_1", hotel_id: "hotel_1", role: "admin" },
    { id: "user_2", hotel_id: "hotel_2", role: "user" },
  ],
  hotels: [
    { id: "hotel_1", name: "Hotel Central", active: true },
    { id: "hotel_2", name: "Pousada Sol", active: true },
  ],
  data_imports: [],
  campaigns: [],
  intelligent_profiles: [
    { id: "ip_1", name: "Visitante Frequente", score: 92 },
  ],
  notifications: [],
}
