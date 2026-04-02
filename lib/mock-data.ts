export interface Ad {
  id: string
  title: string
  description: string
  price: number
  category: string
  city: string
  state: string
  images: string[]
  whatsapp: string
  website?: string
  instagram?: string
  featured: boolean
  createdAt: string
}

export const categories = [
  'Alimentação',
  'Beleza e Estética',
  'Construção e Reformas',
  'Serviços Automotivos',
  'Limpeza e Manutenção',
  'Consultoria e Contabilidade',
  'Saúde e Bem-estar',
  'Educação',
  'Tecnologia',
  'Outros Serviços'
]

export const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Restaurante Sabor Brasileiro',
    description: 'Comida caseira brasileira com tempero de mãe. Marmitex, pratos à la carte e eventos. Aberto todos os dias!',
    price: 15,
    category: 'Alimentação',
    city: 'Miami',
    state: 'FL',
    images: ['/placeholder-food.jpg'],
    whatsapp: '+1-305-555-0101',
    website: 'https://saborbr.com',
    instagram: '@saborbr',
    featured: true,
    createdAt: '2026-03-28'
  },
  {
    id: '2',
    title: 'Salão de Beleza Glamour',
    description: 'Cabelo, manicure, pedicure e maquiagem. Profissionais brasileiras experientes. Agende já!',
    price: 50,
    category: 'Beleza e Estética',
    city: 'Orlando',
    state: 'FL',
    images: ['/placeholder-beauty.jpg'],
    whatsapp: '+1-407-555-0202',
    instagram: '@salaoglamour',
    featured: true,
    createdAt: '2026-03-27'
  },
  {
    id: '3',
    title: 'Construções e Reformas Silva',
    description: 'Renovações completas, pintura, drywall, pisos. Orçamento gratuito. 15 anos de experiência.',
    price: 0,
    category: 'Construção e Reformas',
    city: 'Tampa',
    state: 'FL',
    images: ['/placeholder-construction.jpg'],
    whatsapp: '+1-813-555-0303',
    featured: false,
    createdAt: '2026-03-26'
  },
  {
    id: '4',
    title: 'Auto Center Brasil',
    description: 'Mecânica geral, troca de óleo, freios, suspensão. Atendemos todos os modelos. Preços justos!',
    price: 80,
    category: 'Serviços Automotivos',
    city: 'Fort Lauderdale',
    state: 'FL',
    images: ['/placeholder-auto.jpg'],
    whatsapp: '+1-954-555-0404',
    website: 'https://autocenterbr.com',
    featured: false,
    createdAt: '2026-03-25'
  },
  {
    id: '5',
    title: 'Limpeza Impecável',
    description: 'Limpeza residencial e comercial. Equipe treinada, produtos ecológicos. Limpeza profunda disponível.',
    price: 120,
    category: 'Limpeza e Manutenção',
    city: 'Jacksonville',
    state: 'FL',
    images: ['/placeholder-cleaning.jpg'],
    whatsapp: '+1-904-555-0505',
    instagram: '@limpezaimpecavel',
    featured: false,
    createdAt: '2026-03-24'
  },
  {
    id: '6',
    title: 'Contabilidade Fácil',
    description: 'Declaração de impostos, contabilidade para pequenas empresas. Atendimento em português!',
    price: 200,
    category: 'Consultoria e Contabilidade',
    city: 'Miami',
    state: 'FL',
    images: ['/placeholder-accounting.jpg'],
    whatsapp: '+1-305-555-0606',
    website: 'https://contabilidadefacil.com',
    featured: true,
    createdAt: '2026-03-23'
  },
  {
    id: '7',
    title: 'Clínica Dr. Santos',
    description: 'Clínica geral, pediatria, exames. Aceita diversos seguros. Agendamento online disponível.',
    price: 0,
    category: 'Saúde e Bem-estar',
    city: 'Orlando',
    state: 'FL',
    images: ['/placeholder-health.jpg'],
    whatsapp: '+1-407-555-0707',
    website: 'https://clinicadrsantos.com',
    featured: false,
    createdAt: '2026-03-22'
  },
  {
    id: '8',
    title: 'Escola de Inglês Fluente',
    description: 'Aulas particulares e em grupo. Preparação para TOEFL. Professores nativos e brasileiros.',
    price: 40,
    category: 'Educação',
    city: 'Tampa',
    state: 'FL',
    images: ['/placeholder-education.jpg'],
    whatsapp: '+1-813-555-0808',
    instagram: '@escolafluente',
    featured: false,
    createdAt: '2026-03-21'
  },
  {
    id: '9',
    title: 'TechBR - Assistência Técnica',
    description: 'Conserto de celulares, computadores, tablets. Diagnóstico gratuito. Garantia de 90 dias.',
    price: 60,
    category: 'Tecnologia',
    city: 'Miami',
    state: 'FL',
    images: ['/placeholder-tech.jpg'],
    whatsapp: '+1-305-555-0909',
    website: 'https://techbr.com',
    featured: true,
    createdAt: '2026-03-20'
  },
  {
    id: '10',
    title: 'Transporte e Mudanças Brasil',
    description: 'Mudanças locais e interestaduais. Embalagem profissional. Seguro completo disponível.',
    price: 150,
    category: 'Outros Serviços',
    city: 'Fort Lauderdale',
    state: 'FL',
    images: ['/placeholder-moving.jpg'],
    whatsapp: '+1-954-555-1010',
    featured: false,
    createdAt: '2026-03-19'
  }
]

export function getAdById(id: string): Ad | undefined {
  return mockAds.find(ad => ad.id === id)
}

export function getAdsByCategory(category: string): Ad[] {
  return mockAds.filter(ad => ad.category === category)
}

export function getFeaturedAds(): Ad[] {
  return mockAds.filter(ad => ad.featured)
}
