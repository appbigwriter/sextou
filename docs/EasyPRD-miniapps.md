# EasyPRD Miniapps Premium

Documento: `EasyPRD-miniapps.md`  
Suite sugerida: **SextouTools Premium / Premium Artifact Apps**  
Versão: 1.0  
Idioma base: pt-BR  
Público-alvo: empresas e empreendedores brasileiros que vivem nos EUA.

## Visão geral

Este documento lista 20 mini apps premium focados na criação rápida de artefatos comerciais. O escopo exclui SDRs, bots de atendimento e automações conversacionais, pois esses recursos farão parte de outro produto.

O acesso a esse pacote de ferramentas é Premium ou seja, o cliente paga uma assinatura mensal para ter acesso a todas as ferramentas , eles serao identificado pelo campo bolean "is_premium" na tabela users e validado no momento do login. para se tornar premium o usuario devera pagar uma assinatura mensal de $19.00. o pagamento será feito atravez de link de pagamento com stripe e renovado automaticamente a cada mes.

Cada mini app deve entregar materiais prontos para uso, como vídeos, imagens, propostas, contratos, e-mails, posts, apresentações, e-books, infográficos, landing pages, catálogos, mídia kits e documentos operacionais.

## Padrão comum recomendado para todos os mini apps

Mesmo com PRD simplificado, todos os mini apps devem seguir estes princípios básicos:

- Fazer parte de uma suite de mini apps.
- Exigir usuário logado para gerar e salvar resultados.
- Ter design mobile-first.
- Salvar histórico de uso.
- Usar interface guiada com dropdowns, presets e templates sempre que possível.
- Gerar artefatos exportáveis.
- Registrar entradas, saídas, modelo usado, custo estimado, status e data.
- Separar processamento de IA no back-end.
- Permitir copiar, baixar, duplicar, favoritar e regenerar resultados.

## Tabelas globais sugeridas para a suite

Estas tabelas podem ser compartilhadas entre todos os mini apps:

```sql
mini_apps
mini_app_runs
mini_app_templates
mini_app_assets
mini_app_exports
user_brand_profiles
user_integrations
usage_credits
api_jobs
asset_folders
```

---

# 1. Gerador de Vídeos Virais

## Nome do App

**Gerador de Vídeos Virais**

## PRD básico

Mini app para transformar uma ideia simples, produto, serviço ou promoção em um pacote completo de vídeo curto para Reels, TikTok, Shorts e anúncios verticais.

O usuário informa o tipo de negócio, objetivo do vídeo, público-alvo, oferta, tom desejado e formato. O sistema gera roteiro, gancho inicial, narração, cenas, legenda, thumbnail, título, hashtags e, em uma versão premium, o próprio vídeo curto.

Entrega principal:

- Roteiro curto.
- Gancho viral.
- Narração.
- Sequência de cenas.
- Texto na tela.
- Legenda para publicação.
- Título e thumbnail briefing.
- Versões para Instagram, TikTok e YouTube Shorts.

## Potencializadores

- OpenAI, Anthropic ou Gemini para roteiro e variações criativas.
- Heygen, Runway, Pika, Luma, Kling ou Veo para geração de vídeo.
- ElevenLabs para narração realista em PT/EN/ES.
- AssemblyAI, Deepgram ou Whisper para transcrição e legendas.
- Canva Connect API para exportar artes e thumbnails.
- Cloudinary ou Mux para armazenamento, processamento e entrega de vídeo.

## Sugestão de tabelas DB

```sql
viral_video_projects
viral_video_scripts
viral_video_scenes
viral_video_voiceovers
viral_video_renders
viral_video_templates
viral_video_platform_versions
```

---

# 2. Gerador de Email Marketing

## Nome do App

**Gerador de Email Marketing**

## PRD básico

Mini app para criar campanhas completas de e-mail marketing para venda, reativação, lançamento, relacionamento e nutrição de leads.

O usuário escolhe o objetivo da campanha, segmento de público, oferta, tom de comunicação, idioma e quantidade de e-mails. O sistema gera uma sequência estruturada com assunto, preview text, corpo do e-mail, CTA, segmentação sugerida e calendário de disparo.

Entrega principal:

- Campanha completa de e-mails.
- Assuntos alternativos.
- Preview text.
- Corpo do e-mail em PT/EN/ES.
- CTAs.
- Calendário de envio.
- Segmentos sugeridos.
- Versões de teste A/B.

## Potencializadores

- OpenAI, Claude ou Gemini para copywriting e personalização.
- Mailchimp Marketing API para criação de campanhas e listas.
- SendGrid ou Amazon SES para envio transacional e marketing.
- HubSpot ou ActiveCampaign para sincronização com CRM.
- ZeroBounce ou NeverBounce para validação de e-mails.
- Postmark para e-mails transacionais de alta entregabilidade.

## Sugestão de tabelas DB

```sql
email_campaign_projects
email_campaign_sequences
email_messages
email_subject_variants
email_a_b_tests
email_segments
email_export_logs
```

---

# 3. Gestor de Redes Sociais

## Nome do App

**Gestor de Redes Sociais**

## PRD básico

Mini app para gerar planejamento, calendário e conteúdos de redes sociais para pequenas empresas que precisam postar com frequência.

O usuário informa tipo de negócio, redes prioritárias, frequência de postagem, objetivos, datas importantes e tom de marca. O sistema cria um calendário mensal com ideias de posts, legendas, formatos, roteiros curtos, hashtags e sugestões visuais.

Entrega principal:

- Calendário editorial mensal.
- Posts por plataforma.
- Legendas.
- Roteiros de vídeo.
- Ideias de carrossel.
- Hashtags.
- Sugestões de imagem.
- Datas comemorativas relevantes.

## Potencializadores

- OpenAI, Claude ou Gemini para estratégia e criação de posts.
- Canva Connect API para gerar artes com templates.
- Meta Graph API para Instagram e Facebook.
- LinkedIn API para posts B2B, quando aplicável.
- Buffer, Hootsuite ou Later API para agendamento.
- Replicate, Ideogram, Midjourney via parceiros ou GPT Image para imagens.

## Sugestão de tabelas DB

```sql
social_media_plans
social_media_calendar_items
social_media_posts
social_media_assets
social_media_platform_versions
social_media_hashtag_sets
social_media_templates
```

---

# 4. Gestor de Canal do YouTube

## Nome do App

**Gestor de Canal do YouTube**

## PRD básico

Mini app para organizar e profissionalizar canais de YouTube de empresas, especialistas, criadores e projetos editoriais.

O usuário informa nicho, público, objetivo do canal, estilo de vídeo, frequência e temas. O sistema gera estratégia de canal, calendário editorial, ideias de vídeos, roteiros, títulos, descrições, tags, capítulos e briefing de thumbnail.

Entrega principal:

- Estratégia básica do canal.
- Calendário de vídeos.
- Ideias por série/editoria.
- Roteiros completos.
- Títulos otimizados.
- Descrições.
- Tags.
- Capítulos.
- Briefings de thumbnails.

## Potencializadores

- YouTube Data API para análise de canal, vídeos, playlists e metadados.
- OpenAI, Claude ou Gemini para roteiro, estratégia e SEO.
- Google Trends API ou SerpAPI para tendências de busca.
- Canva Connect API para thumbnails.
- VidIQ ou TubeBuddy, quando houver integração disponível.
- AssemblyAI ou Whisper para transcrição de vídeos existentes.

## Sugestão de tabelas DB

```sql
youtube_channel_projects
youtube_video_ideas
youtube_scripts
youtube_titles
youtube_descriptions
youtube_thumbnail_briefs
youtube_content_calendar
```

---

# 5. Proposta Comercial Premium

## Nome do App

**Proposta Comercial Premium**

## PRD básico

Mini app para criar propostas comerciais profissionais para prestadores de serviço, agências, contractors e pequenos negócios.

O usuário informa cliente, serviço, escopo, prazo, condições, preço, diferenciais e idioma. O sistema gera uma proposta estruturada com apresentação, diagnóstico, escopo, entregáveis, cronograma, investimento, termos e próximos passos.

Entrega principal:

- Proposta comercial em PDF/DOCX.
- Escopo detalhado.
- Cronograma.
- Preço e pacotes.
- Termos comerciais.
- Versão em inglês.
- Mensagem curta para envio ao cliente.

## Potencializadores

- OpenAI, Claude ou Gemini para redação comercial.
- PandaDoc, DocuSign ou Dropbox Sign para assinatura.
- Stripe para link de pagamento ou depósito inicial.
- Canva Connect API para layout visual.
- Google Drive ou Dropbox API para armazenamento.
- PDF.co ou DocRaptor para geração avançada de PDF.

## Sugestão de tabelas DB

```sql
proposal_projects
proposal_sections
proposal_pricing_options
proposal_terms
proposal_exports
proposal_signature_requests
proposal_client_profiles
```

---

# 6. Quote Visual Generator

## Nome do App

**Quote Visual Generator**

## PRD básico

Mini app para gerar orçamentos visuais a partir de fotos, descrições, medidas e tipo de serviço.

O usuário envia imagens, seleciona categoria de serviço, informa localização, urgência, medidas aproximadas e observações. O sistema gera checklist, escopo, materiais, riscos, preço sugerido e proposta final.

Entrega principal:

- Orçamento visual.
- Lista de materiais.
- Checklist de execução.
- Observações técnicas.
- Faixa de preço sugerida.
- Proposta final em PDF.
- Mensagem para envio ao cliente.

## Potencializadores

- OpenAI Vision ou Gemini Vision para análise de imagens.
- Google Maps Platform para estimativa geográfica e deslocamento.
- Homewyse, RSMeans ou bases próprias para referência de custo, quando licenciadas.
- Stripe para depósito inicial.
- Canva Connect API para layout do orçamento.
- Cloudinary para upload, compressão e armazenamento de imagens.

## Sugestão de tabelas DB

```sql
visual_quote_projects
visual_quote_images
visual_quote_measurements
visual_quote_materials
visual_quote_price_items
visual_quote_risk_notes
visual_quote_exports
```

---

# 7. Landing Page Express AI

## Nome do App

**Landing Page Express AI**

## PRD básico

Mini app para criar a estrutura e o conteúdo de uma landing page de venda, captura ou campanha em poucos minutos.

O usuário informa produto/serviço, público-alvo, promessa, oferta, prova social, CTA e idioma. O sistema gera copy completa, seções da página, headlines, FAQ, SEO básico e versão exportável para HTML, WordPress ou construtor visual.

Entrega principal:

- Copy completa da landing page.
- Estrutura de seções.
- Headlines e CTAs.
- FAQ.
- SEO title e meta description.
- Versão HTML simples.
- Briefing visual para designer.

## Potencializadores

- OpenAI, Claude ou Gemini para copy e estrutura.
- Vercel API ou Netlify API para publicação rápida.
- WordPress REST API para criação de página.
- Webflow API ou Framer API para publicação visual.
- Canva Connect API para assets.
- Stripe ou PayPal para integração de pagamento.

## Sugestão de tabelas DB

```sql
landing_page_projects
landing_page_sections
landing_page_copy_blocks
landing_page_ctas
landing_page_faqs
landing_page_exports
landing_page_publish_jobs
```

---

# 8. Brand Kit Generator

## Nome do App

**Brand Kit Generator**

## PRD básico

Mini app para criar um kit inicial de marca para novos negócios, freelancers e pequenos empreendedores.

O usuário informa tipo de negócio, público, personalidade da marca, estilo visual, idioma e referências. O sistema gera nome, slogan, manifesto, tom de voz, bio, pitch, paleta sugerida, prompts de imagem e guia visual inicial.

Entrega principal:

- Nome e alternativas.
- Slogan.
- Pitch curto.
- Manifesto.
- Tom de voz.
- Bio para redes sociais.
- Paleta sugerida.
- Prompts para logotipo/imagens.
- Mini brand guide.

## Potencializadores

- OpenAI, Claude ou Gemini para estratégia de marca.
- GPT Image, Ideogram ou Leonardo para exploração visual.
- Canva Connect API para brand templates.
- Brandfetch API para referências e benchmark de marcas.
- Google Fonts API para sugestões tipográficas.
- Coolors API ou lógica própria para paletas.

## Sugestão de tabelas DB

```sql
brand_kit_projects
brand_name_options
brand_voice_profiles
brand_color_palettes
brand_prompt_sets
brand_bio_variants
brand_kit_exports
```

---

# 9. Ads Creative Factory

## Nome do App

**Ads Creative Factory**

## PRD básico

Mini app para gerar pacotes de criativos para anúncios pagos em Meta, Google, TikTok e YouTube.

O usuário escolhe objetivo da campanha, público, oferta, plataforma, tom e formato. O sistema gera textos, headlines, descrições, roteiros, variações de imagem, ângulos criativos e matriz de testes.

Entrega principal:

- Pacote de anúncios por plataforma.
- Headlines.
- Primary text.
- Descrições.
- Roteiros curtos.
- Ideias visuais.
- CTAs.
- Matriz de testes A/B.

## Potencializadores

- OpenAI, Claude ou Gemini para copy e estratégia.
- Meta Marketing API para estrutura de campanhas e criativos.
- Google Ads API para anúncios de pesquisa e display.
- TikTok Marketing API para campanhas e assets.
- Canva Connect API para criativos.
- GPT Image, Ideogram ou Replicate para imagens.

## Sugestão de tabelas DB

```sql
ads_creative_projects
ads_campaign_angles
ads_copy_variants
ads_visual_prompts
ads_platform_versions
ads_ab_test_matrix
ads_export_packages
```

---

# 10. Google Business Profile Pack

## Nome do App

**Google Business Profile Pack**

## PRD básico

Mini app para gerar materiais de otimização de presença local no Google Business Profile.

O usuário informa categoria do negócio, cidade, serviços, diferenciais, fotos disponíveis e tom de comunicação. O sistema gera descrição do negócio, posts semanais, FAQ, lista de serviços, mensagens de atualização e plano de reputação.

Entrega principal:

- Descrição otimizada do negócio.
- Lista de produtos/serviços.
- Posts semanais.
- FAQ.
- Textos para atualização de perfil.
- Plano de reputação.
- Respostas-modelo para reviews, sem função de bot.

## Potencializadores

- Google Business Profile API para sincronização de perfil e posts, quando aplicável.
- Google Maps Platform para dados locais.
- OpenAI, Claude ou Gemini para textos e otimização local.
- Canva Connect API para imagens de posts.
- BrightLocal ou Semrush Local para auditoria local, quando integrável.
- Places API para validação de dados de localização.

## Sugestão de tabelas DB

```sql
gbp_projects
gbp_business_profiles
gbp_service_items
gbp_post_ideas
gbp_faq_items
gbp_review_response_templates
gbp_local_audit_notes
```

---

# 11. Review-to-Marketing Studio

## Nome do App

**Review-to-Marketing Studio**

## PRD básico

Mini app para transformar avaliações, depoimentos e comentários positivos em materiais de marketing.

O usuário cola reviews ou importa avaliações autorizadas. O sistema identifica temas, benefícios percebidos, frases fortes e transforma isso em posts, carrosséis, anúncios, roteiros de vídeo, prova social e depoimentos formatados.

Entrega principal:

- Posts baseados em reviews.
- Carrosséis.
- Roteiros de vídeo.
- Depoimentos editados.
- Frases de prova social.
- Anúncios usando prova social.
- Pacote visual para redes.

## Potencializadores

- OpenAI, Claude ou Gemini para análise de sentimento e copy.
- Google Business Profile API, Yelp Fusion API ou Facebook Graph API para importar reviews, respeitando permissões.
- Canva Connect API para carrosséis.
- GPT Image ou Ideogram para artes.
- ElevenLabs para transformar depoimentos em áudio.
- Cloudinary para organizar assets.

## Sugestão de tabelas DB

```sql
review_marketing_projects
review_imports
review_insights
review_quote_blocks
review_social_posts
review_ad_variants
review_asset_exports
```

---

# 12. YouTube Shorts Repurposer

## Nome do App

**YouTube Shorts Repurposer**

## PRD básico

Mini app para reaproveitar vídeos longos, lives, podcasts ou aulas em ideias e pacotes de YouTube Shorts.

O usuário envia link, transcrição ou arquivo de vídeo. O sistema identifica trechos fortes, cria cortes sugeridos, títulos, legendas, descrições, thumbnails e roteiro de reedição.

Entrega principal:

- Lista de cortes sugeridos.
- Títulos para Shorts.
- Legendas.
- Descrições.
- Hashtags.
- Thumbnail briefing.
- Roteiro de edição.
- Calendário de publicação.

## Potencializadores

- YouTube Data API para metadados e importação autorizada.
- AssemblyAI, Deepgram ou Whisper para transcrição.
- OpenAI, Claude ou Gemini para seleção de trechos e copy.
- Mux ou Cloudinary para processamento de vídeo.
- Runway ou CapCut API, quando disponível, para edição assistida.
- Canva Connect API para thumbnails.

## Sugestão de tabelas DB

```sql
youtube_repurpose_projects
youtube_source_videos
youtube_transcripts
youtube_clip_suggestions
youtube_short_packages
youtube_thumbnail_briefs
youtube_publish_calendar
```

---

# 13. Manual de Processos AI

## Nome do App

**Manual de Processos AI**

## PRD básico

Mini app para transformar conhecimento informal da empresa em processos claros, checklists e manuais de treinamento.

O usuário informa o tipo de processo, área da empresa, etapas conhecidas, responsáveis, ferramentas usadas e nível de detalhe. O sistema gera SOPs, checklists, scripts internos, instruções para funcionários e versão resumida para treinamento.

Entrega principal:

- SOP completo.
- Checklist operacional.
- Manual de treinamento.
- Script de execução.
- Papéis e responsabilidades.
- Versão rápida para impressão.
- Documento em DOCX/PDF.

## Potencializadores

- OpenAI, Claude ou Gemini para estruturação de processos.
- Notion API para publicar manuais internos.
- Google Drive API para armazenar documentos.
- Loom API ou ferramenta similar para anexar vídeos de treinamento.
- Lucidchart, Miro ou Mermaid para fluxogramas.
- PDF.co ou DocRaptor para geração profissional de PDF.

## Sugestão de tabelas DB

```sql
process_manual_projects
process_sops
process_checklists
process_roles
process_training_modules
process_flowcharts
process_document_exports
```

---

# 14. Catálogo Comercial Generator

## Nome do App

**Catálogo Comercial Generator**

## PRD básico

Mini app para gerar catálogos comerciais de produtos, serviços, pacotes e preços para pequenos negócios.

O usuário informa categoria, lista de produtos/serviços, descrições, fotos, preços, diferenciais e idioma. O sistema gera catálogo PDF, tabela comercial, textos de venda, categorias, pacotes e apresentação simples.

Entrega principal:

- Catálogo em PDF.
- Descrições de produtos/serviços.
- Tabela de preços.
- Pacotes comerciais.
- Apresentação curta.
- Versão PT/EN.
- Arquivo pronto para envio.

## Potencializadores

- OpenAI, Claude ou Gemini para descrições e organização comercial.
- Canva Connect API para layout do catálogo.
- Airtable API ou Google Sheets API para importar produtos.
- Shopify API, WooCommerce API ou Square API para sincronizar catálogo.
- Cloudinary para imagens.
- DocRaptor ou PDF.co para exportação PDF.

## Sugestão de tabelas DB

```sql
catalog_projects
catalog_categories
catalog_items
catalog_price_tables
catalog_package_options
catalog_image_assets
catalog_exports
```

---

# 15. Press Kit & Media Kit Builder

## Nome do App

**Press Kit & Media Kit Builder**

## PRD básico

Mini app para criar press kits e media kits profissionais para empresas, eventos, artistas, creators e empreendedores.

O usuário informa história, fundador, marca, números, diferenciais, fotos, público e objetivo do kit. O sistema gera release, bio, one-page, mídia kit, pitch para imprensa, descrição institucional e apresentação curta.

Entrega principal:

- Press release.
- Bio do fundador ou artista.
- One-page institucional.
- Media kit.
- Pitch para imprensa.
- Dados e números organizados.
- Apresentação PDF.

## Potencializadores

- OpenAI, Claude ou Gemini para redação editorial e institucional.
- Canva Connect API para layout profissional.
- Cision, Muck Rack ou bases de imprensa, quando licenciadas.
- Google Drive ou Dropbox API para pasta compartilhável.
- Brandfetch API para assets de marca.
- DocuSign ou Dropbox Sign para documentos anexos, quando necessário.

## Sugestão de tabelas DB

```sql
press_kit_projects
press_releases
founder_bios
media_kit_metrics
media_pitch_templates
press_assets
press_kit_exports
```

---

# 16. Gerador de Imagens Virais

## Nome do App

**Gerador de Imagens Virais**

## PRD básico

Mini app para criar imagens virais e peças visuais nos principais formatos digitais, com templates prontos para redes sociais, anúncios, thumbnails e posts.

O usuário escolhe plataforma, formato, objetivo, estilo visual, texto principal, imagem de referência e identidade da marca. O sistema gera prompts, variações visuais, textos curtos e arquivos adaptados aos principais tamanhos.

Entrega principal:

- Imagens para Instagram feed.
- Stories/Reels cover.
- TikTok cover.
- YouTube thumbnail.
- Facebook post.
- LinkedIn post.
- Google Ads display.
- Prompts editáveis.
- Pacote de variações.

## Potencializadores

- GPT Image, Ideogram, Leonardo, Midjourney via parceiros ou Replicate para geração de imagens.
- Canva Connect API para aplicar templates e redimensionar formatos.
- Cloudinary para resize, crop e otimização.
- Remove.bg para remoção de fundo.
- Brandfetch API para importar logos e cores de marca.
- OCR/vision para validar texto legível na imagem.

## Sugestão de tabelas DB

```sql
viral_image_projects
viral_image_templates
viral_image_prompts
viral_image_generations
viral_image_format_versions
viral_image_brand_assets
viral_image_exports
```

---

# 17. Gerador de Contratos

## Nome do App

**Gerador de Contratos Multi Idiomas**

## PRD básico

Mini app para gerar modelos de contratos simples, termos de serviço, acordos comerciais e documentos operacionais em múltiplos idiomas.

O usuário seleciona tipo de contrato, país/estado de referência, idioma, partes envolvidas, escopo, prazo, preço e cláusulas desejadas. O sistema gera um modelo editável com linguagem clara, campos variáveis e aviso de revisão jurídica.

Entrega principal:

- Contrato base em PT/EN/ES.
- Termos comerciais.
- Cláusulas opcionais.
- Campos editáveis.
- Resumo executivo.
- Checklist de revisão.
- Exportação DOCX/PDF.

Observação importante: o app não substitui advogado. Deve gerar modelos administrativos e recomendar revisão profissional para documentos legais sensíveis.

## Potencializadores

- OpenAI, Claude ou Gemini para geração estruturada e tradução.
- DeepL API para tradução profissional.
- DocuSign ou Dropbox Sign para assinatura eletrônica.
- Lawrina, Rocket Lawyer API ou bases licenciadas, se disponíveis.
- Google Drive API para armazenamento.
- PDF.co ou DocRaptor para geração de PDF.

## Sugestão de tabelas DB

```sql
contract_projects
contract_templates
contract_parties
contract_clauses
contract_language_versions
contract_signature_requests
contract_exports
```

---

# 18. Gerador de Apresentações Virais

## Nome do App

**Gerador de Apresentações Virais**

## PRD básico

Mini app para criar apresentações persuasivas, visuais e compartilháveis para negócios, aulas, pitches, webinars, propostas e conteúdo viral.

O usuário informa tema, objetivo, público, número de slides, tom, formato e chamada para ação. O sistema gera estrutura, roteiro slide a slide, títulos fortes, bullets, notas do apresentador, sugestões visuais e versão exportável.

Entrega principal:

- Estrutura da apresentação.
- Slides com títulos e conteúdo.
- Notas do apresentador.
- Sugestões visuais.
- CTA final.
- Versão pitch deck.
- Versão carrossel social.
- Exportação PPTX/PDF.

## Potencializadores

- OpenAI, Claude ou Gemini para narrativa e conteúdo.
- Canva Connect API para criar slides com templates.
- Google Slides API ou Microsoft Graph API para exportar apresentações.
- Gamma, Beautiful.ai ou Pitch, quando houver integração disponível.
- GPT Image ou Ideogram para imagens de apoio.
- ElevenLabs para narração opcional da apresentação.

## Sugestão de tabelas DB

```sql
presentation_projects
presentation_decks
presentation_slides
presentation_speaker_notes
presentation_visual_briefs
presentation_template_choices
presentation_exports
```

---

# 19. Gerador de E-Books

## Nome do App

**Gerador de E-Books**

## PRD básico

Mini app para gerar e-books curtos, guias, manuais, lead magnets e materiais educativos para captação de leads ou venda de conhecimento.

O usuário informa tema, público, objetivo, tamanho, tom, idioma, estrutura desejada e oferta final. O sistema gera sumário, capítulos, introdução, conteúdo, conclusão, CTA, capa sugerida e versão exportável em PDF/DOCX/EPUB.

Entrega principal:

- Título e subtítulo.
- Sumário.
- Capítulos.
- Boxes e destaques.
- CTA final.
- Bio do autor.
- Capa sugerida.
- PDF/DOCX/EPUB.

## Potencializadores

- OpenAI, Claude ou Gemini para escrita longa e estrutura editorial.
- Gemini long context para analisar materiais extensos do usuário.
- Canva Connect API para capa e diagramação.
- Google Docs API para edição colaborativa.
- EPUB generator ou Pandoc para exportação EPUB.
- Grammarly API ou LanguageTool para revisão, quando aplicável.

## Sugestão de tabelas DB

```sql
ebook_projects
ebook_outlines
ebook_chapters
ebook_sections
ebook_cover_briefs
ebook_language_versions
ebook_exports
```

---

# 20. Gerador de Infográficos

## Nome do App

**Gerador de Infográficos**

## PRD básico

Mini app para transformar dados, listas, processos, comparações ou conteúdos educativos em infográficos prontos para publicação.

O usuário informa tema, objetivo, formato, dados principais, público e estilo visual. O sistema organiza a informação, define hierarquia visual, cria textos curtos, sugere ícones, cores, layout e gera versões para redes, PDF e apresentação.

Entrega principal:

- Roteiro visual do infográfico.
- Título e subtítulos.
- Dados organizados.
- Blocos de informação.
- Sugestões de ícones.
- Briefing visual.
- Versão para redes sociais.
- Versão PDF.

## Potencializadores

- OpenAI, Claude ou Gemini para síntese e estruturação.
- GPT Image, Ideogram ou Gemini Image para visual inicial.
- Canva Connect API para montar templates editáveis.
- Datawrapper, Flourish ou QuickChart para gráficos.
- Google Sheets API para importar dados.
- Cloudinary para exportar múltiplos formatos.

## Sugestão de tabelas DB

```sql
infographic_projects
infographic_data_sources
infographic_layout_blocks
infographic_visual_elements
infographic_chart_configs
infographic_format_versions
infographic_exports
```

---

# Observações finais de produto

## Escopo fora desta linha premium

Os seguintes recursos devem ficar fora desta linha de mini apps e entrar em outro produto específico:

- SDRs.
- Bots de atendimento.
- Chatbots comerciais.
- Agentes de prospecção ativa.
- Atendimento por WhatsApp, telefone ou chat.
- Follow-up automático conversacional.

## Característica central da linha

A linha Premium deve ser vendida como uma fábrica de artefatos prontos para uso:

> O empreendedor informa o objetivo, escolhe alguns presets, adiciona contexto e recebe um pacote profissional pronto para copiar, baixar, editar ou publicar.

## Recomendações de implementação

- Começar pelos apps com maior percepção visual e ROI imediato.
- Priorizar exportação PDF, DOCX, PNG, MP4, PPTX e ZIP.
- Criar templates reutilizáveis por nicho.
- Salvar tudo no histórico do usuário.
- Permitir duplicar projetos anteriores.
- Separar custo por geração em `api_jobs`.
- Criar camada de créditos para controlar uso de APIs pagas.

## Ordem sugerida de desenvolvimento

1. Gerador de Vídeos Virais.
2. Gerador de Imagens Virais.
3. Gerador de Email Marketing.
4. Gestor de Redes Sociais.
5. Gerador de Apresentações Virais.
6. Proposta Comercial Premium.
7. Gerador de E-Books.
8. Gerador de Infográficos.
9. Gestor de Canal do YouTube.
10. Landing Page Express AI.
11. Brand Kit Generator.
12. Ads Creative Factory.
13. Quote Visual Generator.
14. Catálogo Comercial Generator.
15. Google Business Profile Pack.
16. Review-to-Marketing Studio.
17. YouTube Shorts Repurposer.
18. Manual de Processos AI.
19. Press Kit & Media Kit Builder.
20. Gerador de Contratos Multi Idiomas.
