export const getMockedCampaigns = async () => {
  return {
    success: true,
    campaigns: [
      {
        id: "1",
        nome_da_campanha: "Campanha de Verão",
        motivo_da_campanha: "Promoção de verão para clientes VIP",
        data_criacao: "2024-06-01T10:00:00Z",
        campaign_items: [
          {
            id: "item-1",
            telefone: "123456789",
            nome_cliente: "João Silva",
            mensagem_personalizada:
              "Aproveite nossa oferta exclusiva de verão!",
          },
          {
            id: "item-2",
            telefone: "987654321",
            nome_cliente: "Maria Oliveira",
            mensagem_personalizada:
              "Descontos especiais para você neste verão!",
          },
        ],
      },
      {
        id: "2",
        nome_da_campanha: "Campanha de Inverno",
        motivo_da_campanha: "Ofertas de inverno para novos clientes",
        data_criacao: "2024-05-15T14:30:00Z",
        campaign_items: [
          {
            id: "item-3",
            telefone: "555666777",
            nome_cliente: "Carlos Pereira",
            mensagem_personalizada:
              "Venha aproveitar nossas promoções de inverno!",
          },
        ],
      },
    ],
  };
};

export const getMockedCampaign = async (id: string) => {
  return {
    success: true,
    campaign: {
      id: id,
      nome_da_campanha: "Campanha de Verão",
      motivo_da_campanha: "Promoção de verão para clientes VIP",
      data_criacao: "2024-06-01T10:00:00Z",
      campaign_items: [
        {
          id: "item-1",
          telefone: "123456789",
          nome_cliente: "João Silva",
          mensagem_personalizada: "Aproveite nossa oferta exclusiva de verão!",
        },
        {
          id: "item-2",
          telefone: "987654321",
          nome_cliente: "Maria Oliveira",
          mensagem_personalizada: "Descontos especiais para você neste verão!",
        },
      ],
    },
  };
};
