-- RLS Policies para o Social Network Studio (Oferta11)

-- Habilitar RLS em todas as tabelas
ALTER TABLE social_network_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_network_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_network_contents ENABLE ROW LEVEL SECURITY;

-- Políticas para social_network_projects
CREATE POLICY social_network_projects_policy ON social_network_projects
  FOR ALL
  USING (user_id::text = auth.uid()::text);

-- Políticas para social_network_campaigns (através do relacionamento com project)
CREATE POLICY social_network_campaigns_policy ON social_network_campaigns
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM social_network_projects p
      WHERE p.id = social_network_campaigns.project_id
      AND p.user_id::text = auth.uid()::text
    )
  );

-- Políticas para social_network_contents (através do relacionamento com campaign)
CREATE POLICY social_network_contents_policy ON social_network_contents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM social_network_campaigns c
      JOIN social_network_projects p ON p.id = c.project_id
      WHERE c.id = social_network_contents.campaign_id
      AND p.user_id::text = auth.uid()::text
    )
  );

