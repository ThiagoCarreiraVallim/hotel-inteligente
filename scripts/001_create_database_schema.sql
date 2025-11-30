-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hotels table
CREATE TABLE IF NOT EXISTS public.hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  location TEXT,
  total_rooms INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'marketing', 'sales', 'manager')),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE SET NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create hotel_configurations table
CREATE TABLE IF NOT EXISTS public.hotel_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(hotel_id, config_key)
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  event_type TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  expected_attendees INTEGER,
  status TEXT CHECK (status IN ('planned', 'active', 'completed', 'cancelled')) DEFAULT 'planned',
  metadata JSONB,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  campaign_type TEXT CHECK (campaign_type IN ('pre_event', 'during_event', 'post_event', 'general')),
  status TEXT CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed')) DEFAULT 'draft',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  sent_date TIMESTAMP WITH TIME ZONE,
  target_audience TEXT,
  message_template TEXT,
  excel_file_url TEXT,
  metrics JSONB,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create data_imports table
CREATE TABLE IF NOT EXISTS public.data_imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  import_type TEXT CHECK (import_type IN ('totvs', 'manual', 'asksuite', 'other')),
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  total_records INTEGER,
  processed_records INTEGER DEFAULT 0,
  error_log TEXT,
  imported_by UUID REFERENCES public.profiles(id),
  imported_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create intelligent_profiles table (AI-generated insights)
CREATE TABLE IF NOT EXISTS public.intelligent_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  profile_type TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  insights JSONB,
  recommendations JSONB,
  confidence_score NUMERIC(3, 2),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  notification_type TEXT CHECK (notification_type IN ('campaign_suggestion', 'event_reminder', 'data_alert', 'system')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create campaign_templates table
CREATE TABLE IF NOT EXISTS public.campaign_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT,
  message_template TEXT NOT NULL,
  excel_template_url TEXT,
  variables JSONB,
  is_default BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for hotels (users can see their own hotel or all if admin)
CREATE POLICY "hotels_select" ON public.hotels FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = hotels.id OR profiles.role = 'admin')
  )
);

CREATE POLICY "hotels_insert_admin" ON public.hotels FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "hotels_update_admin" ON public.hotels FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- RLS Policies for hotel_configurations
CREATE POLICY "hotel_configurations_select" ON public.hotel_configurations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = hotel_configurations.hotel_id OR profiles.role = 'admin')
  )
);

CREATE POLICY "hotel_configurations_insert" ON public.hotel_configurations FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = hotel_configurations.hotel_id OR profiles.role IN ('admin', 'manager'))
  )
);

CREATE POLICY "hotel_configurations_update" ON public.hotel_configurations FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = hotel_configurations.hotel_id OR profiles.role IN ('admin', 'manager'))
  )
);

-- RLS Policies for events
CREATE POLICY "events_select" ON public.events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = events.hotel_id OR profiles.role = 'admin')
  )
);

CREATE POLICY "events_insert" ON public.events FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = events.hotel_id OR profiles.role = 'admin')
  )
);

CREATE POLICY "events_update" ON public.events FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = events.hotel_id OR profiles.role = 'admin')
  )
);

CREATE POLICY "events_delete" ON public.events FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = events.hotel_id OR profiles.role IN ('admin', 'manager'))
  )
);

-- RLS Policies for campaigns
CREATE POLICY "campaigns_select" ON public.campaigns FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = campaigns.hotel_id OR profiles.role = 'admin')
  )
);

CREATE POLICY "campaigns_insert" ON public.campaigns FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = campaigns.hotel_id OR profiles.role = 'admin')
  )
);

CREATE POLICY "campaigns_update" ON public.campaigns FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = campaigns.hotel_id OR profiles.role = 'admin')
  )
);

CREATE POLICY "campaigns_delete" ON public.campaigns FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = campaigns.hotel_id OR profiles.role IN ('admin', 'manager'))
  )
);

-- RLS Policies for data_imports
CREATE POLICY "data_imports_select" ON public.data_imports FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = data_imports.hotel_id OR profiles.role = 'admin')
  )
);

CREATE POLICY "data_imports_insert" ON public.data_imports FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = data_imports.hotel_id OR profiles.role = 'admin')
  )
);

-- RLS Policies for intelligent_profiles
CREATE POLICY "intelligent_profiles_select" ON public.intelligent_profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = intelligent_profiles.hotel_id OR profiles.role = 'admin')
  )
);

-- RLS Policies for notifications
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for campaign_templates
CREATE POLICY "campaign_templates_select" ON public.campaign_templates FOR SELECT USING (
  hotel_id IS NULL OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = campaign_templates.hotel_id OR profiles.role = 'admin')
  )
);

CREATE POLICY "campaign_templates_insert" ON public.campaign_templates FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = campaign_templates.hotel_id OR profiles.role = 'admin')
  )
);

CREATE POLICY "campaign_templates_update" ON public.campaign_templates FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = campaign_templates.hotel_id OR profiles.role = 'admin')
  )
);

-- RLS Policies for activity_logs
CREATE POLICY "activity_logs_select" ON public.activity_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.hotel_id = activity_logs.hotel_id OR profiles.role = 'admin')
  )
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_hotel_id ON public.profiles(hotel_id);
CREATE INDEX idx_events_hotel_id ON public.events(hotel_id);
CREATE INDEX idx_events_dates ON public.events(start_date, end_date);
CREATE INDEX idx_campaigns_hotel_id ON public.campaigns(hotel_id);
CREATE INDEX idx_campaigns_event_id ON public.campaigns(event_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_data_imports_hotel_id ON public.data_imports(hotel_id);
CREATE INDEX idx_activity_logs_hotel_id ON public.activity_logs(hotel_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON public.hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotel_configurations_updated_at BEFORE UPDATE ON public.hotel_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_templates_updated_at BEFORE UPDATE ON public.campaign_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
