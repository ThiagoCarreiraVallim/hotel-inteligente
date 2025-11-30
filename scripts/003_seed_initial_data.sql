-- Insert sample hotels
INSERT INTO public.hotels (name, code, location, total_rooms, active) VALUES
('Grand Hotel Paradise', 'GHP001', 'São Paulo, SP', 250, true),
('Beach Resort Marina', 'BRM002', 'Rio de Janeiro, RJ', 180, true),
('Mountain View Hotel', 'MVH003', 'Campos do Jordão, SP', 120, true)
ON CONFLICT (code) DO NOTHING;

-- Insert default campaign templates
INSERT INTO public.campaign_templates (name, description, template_type, message_template, variables, is_default) VALUES
(
  'Campanha Pré-Evento',
  'Template para campanhas antes do evento acontecer',
  'pre_event',
  'Olá! O evento {event_name} está chegando. Reserve agora com {discount}% de desconto até {deadline}. Contato: {hotel_contact}',
  '{"event_name": "Nome do Evento", "discount": "Desconto %", "deadline": "Data Limite", "hotel_contact": "Contato"}',
  true
),
(
  'Campanha Durante Evento',
  'Template para campanhas durante o evento',
  'during_event',
  'O evento {event_name} está acontecendo AGORA em nosso hotel! Últimas vagas disponíveis. Reserve: {booking_link}',
  '{"event_name": "Nome do Evento", "booking_link": "Link de Reserva"}',
  true
),
(
  'Campanha Pós-Evento',
  'Template para follow-up após eventos',
  'post_event',
  'Obrigado por participar do {event_name}! Confira as fotos e agende sua próxima visita: {gallery_link}',
  '{"event_name": "Nome do Evento", "gallery_link": "Link da Galeria"}',
  true
),
(
  'Campanha Geral',
  'Template genérico para campanhas',
  'general',
  'Promoção especial! {offer_description}. Válido até {validity_date}. Reserve agora: {booking_link}',
  '{"offer_description": "Descrição da Oferta", "validity_date": "Data de Validade", "booking_link": "Link"}',
  true
)
ON CONFLICT DO NOTHING;
