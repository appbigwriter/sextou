"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export interface NavLink {
  href: string
  label: string
  isAction?: boolean
}

interface MobileMenuProps {
  links: NavLink[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-700 hover:text-[#F97316] transition flex items-center justify-center"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] px-4 py-4 flex flex-col space-y-2 animate-in slide-in-from-top-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={
                link.isAction
                  ? "bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-3 rounded-lg font-semibold transition text-center mt-2"
                  : "text-slate-700 hover:text-[#F97316] transition font-medium py-3 px-2 border-b border-slate-100 last:border-0"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
