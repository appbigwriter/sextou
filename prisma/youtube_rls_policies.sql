-- ==============================================================================
-- YOUTUBE GROWTH STUDIO AI - Row Level Security (RLS) & Gate Premium Policies
-- ==============================================================================

-- 1. Habilitar RLS em todas as tabelas
ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_content_items ENABLE ROW LEVEL SECURITY;

-- 2. Criar Políticas Base (Leitura e Escrita apenas para o proprietário E que seja Premium)

-- YOUTUBE CHANNELS
CREATE POLICY "Premium_Only_Select_YoutubeChannels" ON public.youtube_channels
  FOR SELECT USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Insert_YoutubeChannels" ON public.youtube_channels
  FOR INSERT WITH CHECK (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Update_YoutubeChannels" ON public.youtube_channels
  FOR UPDATE USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Delete_YoutubeChannels" ON public.youtube_channels
  FOR DELETE USING (user_id = auth.uid()::text AND is_user_premium());

-- YOUTUBE CONTENT PLANS
CREATE POLICY "Premium_Only_Select_YoutubeContentPlans" ON public.youtube_content_plans
  FOR SELECT USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Insert_YoutubeContentPlans" ON public.youtube_content_plans
  FOR INSERT WITH CHECK (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Update_YoutubeContentPlans" ON public.youtube_content_plans
  FOR UPDATE USING (user_id = auth.uid()::text AND is_user_premium());

CREATE POLICY "Premium_Only_Delete_YoutubeContentPlans" ON public.youtube_content_plans
  FOR DELETE USING (user_id = auth.uid()::text AND is_user_premium());

-- YOUTUBE CONTENT ITEMS
CREATE POLICY "Premium_Only_Select_YoutubeContentItems" ON public.youtube_content_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.youtube_content_plans p
      WHERE p.id = plan_id AND p.user_id = auth.uid()::text
    ) AND is_user_premium()
  );

CREATE POLICY "Premium_Only_Insert_YoutubeContentItems" ON public.youtube_content_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.youtube_content_plans p
      WHERE p.id = plan_id AND p.user_id = auth.uid()::text
    ) AND is_user_premium()
  );

CREATE POLICY "Premium_Only_Update_YoutubeContentItems" ON public.youtube_content_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.youtube_content_plans p
      WHERE p.id = plan_id AND p.user_id = auth.uid()::text
    ) AND is_user_premium()
  );

CREATE POLICY "Premium_Only_Delete_YoutubeContentItems" ON public.youtube_content_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.youtube_content_plans p
      WHERE p.id = plan_id AND p.user_id = auth.uid()::text
    ) AND is_user_premium()
  );
