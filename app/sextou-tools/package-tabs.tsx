"use client"

import { useState } from "react"
import Link from "next/link"

export type CatalogCard = {
  slug: string
  title: string
  description: string
  icon: string
  href: string
}

type PackageKey = "basico" | "pro" | "premium"

const TABS: {
  key: PackageKey
  label: string
  tag: string
  note: string
}[] = [
  {
    key: "basico",
    label: "PACOTE BÁSICO",
    tag: "Grátis",
    note: "Ferramentas gratuitas, liberadas para qualquer usuário cadastrado.",
  },
  {
    key: "pro",
    label: "PACOTE PRO",
    tag: "Anunciantes",
    note: "Liberado automaticamente para quem tem anúncio ativo na plataforma.",
  },
  {
    key: "premium",
    label: "PACOTE PREMIUM",
    tag: "Premium",
    note: "Apps avançados — exigem anúncio ativo e assinatura Premium.",
  },
]

export function PackageTabs({
  basico,
  pro,
  premium,
}: {
  basico: CatalogCard[]
  pro: CatalogCard[]
  premium: CatalogCard[]
}) {
  const [active, setActive] = useState<PackageKey>("basico")

  const data: Record<PackageKey, CatalogCard[]> = { basico, pro, premium }
  const cards = data[active]
  const activeTab = TABS.find((t) => t.key === active)!

  return (
    <section className="mb-12">
      {/* TABS */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {TABS.map((tab) => {
          const isActive = tab.key === active
          const count = data[tab.key].length
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-gradient-to-r from-[#FF3D57] to-[#FF8C00] text-white"
                  : "border border-white/10 bg-white/5 text-[#A09D97] hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-black/20 text-white" : "bg-white/10 text-[#A09D97]"
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* TAB DESCRIPTION */}
      <div className="mb-6 flex items-center gap-2 text-sm text-[#A09D97]">
        <span className="rounded-full bg-[#FF8C00]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#FF8C00]">
          {activeTab.tag}
        </span>
        <span>{activeTab.note}</span>
      </div>

      {/* CARDS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.slug}
            href={card.href}
            className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-[#171717] p-6 transition hover:border-[#FF3D57]/30 hover:bg-[#1F1F1F]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF3D57]/15 to-[#FF8C00]/15 font-mono text-xs font-bold text-[#FF8C00]">
                  {card.icon}
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#A09D97]">
                  {activeTab.tag}
                </span>
              </div>
              <div>
                <h3 className="font-toolkit text-lg font-bold text-[#F0EDE6] transition group-hover:text-[#FF8C00]">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#A09D97]">{card.description}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#FF3D57]">
              Abrir
              <span className="transition group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
