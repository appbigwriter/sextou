-- ==============================================================================
-- SEXTOU ZAPLEADS CRM - Row Level Security (RLS) & Gate Premium Policies
-- Este script habilita a segurança no banco de dados para garantir que apenas
-- usuários com a flag is_premium = true possam acessar os dados do CRM.
-- Nota: Para ambientes que não usam auth.uid() do Supabase nativamente via JWT,
-- a policy assume que a role de conexão está parametrizada ou é tratada pela API.
-- ==============================================================================

-- 1. Habilitar RLS em todas as tabelas do ZapLeads
ALTER TABLE public.zap_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zap_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zap_group_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zap_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zap_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_log ENABLE ROW LEVEL SECURITY;

-- 2. Criar função utilitária para verificar se o usuário é premium
-- (Otimiza as consultas das policies)
CREATE OR REPLACE FUNCTION public.is_user_premium()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = auth.uid()::text AND is_premium = true
  );
$$;

-- 3. Criar Políticas Base (Leitura e Escrita apenas para o proprietário E que seja Premium)

-- ZAP CONNECTIONS
CREATE POLICY "Premium_Only_Select_ZapConnections" ON public.zap_connections
  FOR SELECT USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Insert_ZapConnections" ON public.zap_connections
  FOR INSERT WITH CHECK (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Update_ZapConnections" ON public.zap_connections
  FOR UPDATE USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Delete_ZapConnections" ON public.zap_connections
  FOR DELETE USING (user_id = auth.uid()::text AND is_user_premium());

-- ZAP GROUPS
CREATE POLICY "Premium_Only_Select_ZapGroups" ON public.zap_groups
  FOR SELECT USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Insert_ZapGroups" ON public.zap_groups
  FOR INSERT WITH CHECK (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Update_ZapGroups" ON public.zap_groups
  FOR UPDATE USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Delete_ZapGroups" ON public.zap_groups
  FOR DELETE USING (user_id = auth.uid()::text AND is_user_premium());

-- CONTATOS E LEADS
CREATE POLICY "Premium_Only_Select_Contacts" ON public.contacts
  FOR SELECT USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Insert_Contacts" ON public.contacts
  FOR INSERT WITH CHECK (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Update_Contacts" ON public.contacts
  FOR UPDATE USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Select_ZapLeads" ON public.zap_leads
  FOR SELECT USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Insert_ZapLeads" ON public.zap_leads
  FOR INSERT WITH CHECK (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Update_ZapLeads" ON public.zap_leads
  FOR UPDATE USING (user_id = auth.uid()::text AND is_user_premium());

-- APLICAÇÃO ANÁLOGA PARA AS DEMAIS TABELAS
-- O Consent Log é append-only, então não permitimos UPDATE/DELETE
CREATE POLICY "Premium_Only_Select_ConsentLog" ON public.consent_log
  FOR SELECT USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Insert_ConsentLog" ON public.consent_log
  FOR INSERT WITH CHECK (user_id = auth.uid()::text AND is_user_premium());
