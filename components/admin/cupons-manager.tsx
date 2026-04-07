"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Coupon {
  id: string
  code: string
  discountType: string
  discountValue: number
  validFrom: string
  validUntil: string
  maxUses: number
  timesUsed: number
  isActive: boolean
}

export function CuponsManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 10,
    validFrom: "",
    validUntil: "",
    maxUses: 100,
  })

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then(res => res.json())
      .then(data => setCoupons(data))
  }, [])

  const handleCreate = async () => {
    if (!newCoupon.code || !newCoupon.validFrom || !newCoupon.validUntil) return

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      })

      if (res.ok) {
        const created = await res.json()
        setCoupons([...coupons, created])
        setNewCoupon({
          code: "",
          discountType: "PERCENTAGE",
          discountValue: 10,
          validFrom: "",
          validUntil: "",
          maxUses: 100,
        })
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Error creating coupon:", error)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (res.ok) {
        setCoupons(coupons.map(c => 
          c.id === id ? { ...c, isActive: !currentStatus } : c
        ))
      }
    } catch (error) {
      console.error("Error toggling coupon:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" })
      if (res.ok) {
        setCoupons(coupons.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error("Error deleting coupon:", error)
    }
  }

  const getDiscountLabel = (type: string, value: number) => {
    if (type === "PERCENTAGE") return `${value}%`
    if (type === "FIXED_AMOUNT") return `$${value}`
    if (type === "FREE") return "Grátis"
    return ""
  }

  return (
    <div className="space-y-6">
      {/* Create New */}
      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>Novo Cupom</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                placeholder="Código"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              />
              <select
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newCoupon.discountType}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
              >
                <option value="PERCENTAGE">Porcentagem</option>
                <option value="FIXED_AMOUNT">Valor Fixo</option>
                <option value="FREE">Grátis</option>
              </select>
              <Input
                type="number"
                placeholder="Valor"
                value={newCoupon.discountValue}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseFloat(e.target.value) })}
              />
              <Input
                type="date"
                value={newCoupon.validFrom}
                onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
              />
              <Input
                type="date"
                value={newCoupon.validUntil}
                onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Limite de uso"
                value={newCoupon.maxUses}
                onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="bg-[#F97316] hover:bg-[#EA580C]">Salvar</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsCreating(true)} className="bg-[#F97316] hover:bg-[#EA580C]">
          + Novo Cupom
        </Button>
      )}

      {/* List */}
      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <span className="bg-[#F97316] text-white px-3 py-1 rounded font-bold">
                  {coupon.code}
                </span>
                <div>
                  <div className="font-medium">{getDiscountLabel(coupon.discountType, coupon.discountValue)}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(coupon.validFrom).toLocaleDateString("pt-BR")} - {new Date(coupon.validUntil).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {coupon.timesUsed}/{coupon.maxUses} usos
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  coupon.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {coupon.isActive ? "Ativo" : "Inativo"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                >
                  {coupon.isActive ? "Desativar" : "Ativar"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(coupon.id)}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {coupons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum cupom encontrado
          </div>
        )}
      </div>
    </div>
  )
}