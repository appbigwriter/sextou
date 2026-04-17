# Modelagem do Banco de Dados - SEXTOU.biz

## Diagrama de Entidades

```
users (anunciantes)
├── id (UUID, PK)
├── email (unique)
├── password_hash
├── full_name
├── business_name
├── whatsapp
├── instagram
├── website
├── city
├── state
├── country
├── profile_image
├── status (active, suspended, deleted)
├── is_vip (boolean)
├── created_at
└── updated_at

categories
├── id (UUID, PK)
├── name
├── slug
├── description
├── icon
├── order
└── is_active

ads (anúncios)
├── id (UUID, PK)
├── user_id (FK → users)
├── category_id (FK → categories)
├── title
├── short_description
├── full_description
├── offer_type (product, service)
├── price
├── promotion_text
├── city
├── delivery_type (local, online, both)
├── external_link
├── whatsapp_contact
├── status (draft, awaiting_payment, paid, under_review, approved, rejected, published, expired)
├── payment_status (pending, paid, refunded)
├── payment_amount
├── payment_date
├── scheduled_date (sexta-feira alvo)
├── published_at
├── expires_at
├── views_count
├── clicks_count
├── is_featured (boolean)
├── rejection_reason
├── admin_notes
├── created_at
└── updated_at

ad_images
├── id (UUID, PK)
├── ad_id (FK → ads)
├── image_url
├── order
└── uploaded_at

ad_videos
├── id (UUID, PK)
├── ad_id (FK → ads)
├── video_url
└── uploaded_at

payments
├── id (UUID, PK)
├── ad_id (FK → ads)
├── user_id (FK → users)
├── amount
├── payment_method (zelle, stripe, paypal)
├── transaction_id
├── status (pending, confirmed, failed, refunded)
├── payment_proof_url
├── confirmed_by (admin user_id)
├── confirmed_at
├── created_at
└── updated_at

leads (interesse demonstrado)
├── id (UUID, PK)
├── ad_id (FK → ads)
├── user_name (opcional)
├── user_email (opcional)
├── user_phone (opcional)
├── source (whatsapp_click, website_click, interest_button)
├── ip_address
├── user_agent
└── created_at

admin_users
├── id (UUID, PK)
├── email (unique)
├── password_hash
├── full_name
├── role (super_admin, moderator, financial)
├── permissions (JSON)
├── last_login
├── created_at
└── updated_at

admin_actions (log de auditoria)
├── id (UUID, PK)
├── admin_id (FK → admin_users)
├── action_type (approve, reject, edit, delete, etc)
├── entity_type (ad, user, payment)
├── entity_id
├── details (JSON)
└── created_at

coupons
├── id (UUID, PK)
├── code (unique)
├── discount_type (percentage, fixed_amount, free)
├── discount_value
├── valid_from
├── valid_until
├── max_uses
├── times_used
├── is_active
└── created_at

notifications
├── id (UUID, PK)
├── user_id (FK → users)
├── type (email, sms, in_app)
├── subject
├── message
├── status (pending, sent, failed)
├── sent_at
└── created_at

settings
├── id (UUID, PK)
├── key (unique)
├── value (JSON)
├── description
└── updated_at
```

## Índices Recomendados

- `users.email` (unique)
- `ads.user_id`
- `ads.category_id`
- `ads.status`
- `ads.scheduled_date`
- `ads.published_at`
- `payments.ad_id`
- `payments.status`
- `leads.ad_id`
- `admin_actions.admin_id`
- `admin_actions.entity_type + entity_id`

## Relacionamentos

- **users** 1:N **ads**
- **categories** 1:N **ads**
- **ads** 1:N **ad_images**
- **ads** 1:1 **ad_videos** (opcional)
- **ads** 1:N **payments**
- **ads** 1:N **leads**
- **admin_users** 1:N **admin_actions**

## Regras de Negócio (Database Level)

1. Um anúncio só pode ser publicado se `payment_status = 'paid'` e `status = 'approved'`
2. `scheduled_date` deve ser sempre uma sexta-feira
3. `expires_at` = `scheduled_date + 7 dias` (padrão)
4. Soft delete: usar `status = 'deleted'` em vez de remover registros
5. Todos os timestamps em UTC

## Exemplo de Status Flow

```
draft → awaiting_payment → paid → under_review → approved → published → expired
                                                ↓
                                            rejected
```
