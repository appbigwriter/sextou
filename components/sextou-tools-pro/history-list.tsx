interface SextouToolsProHistoryListProps {
  items?: Array<{
    title: string
    subtitle?: string
    timestamp: string
  }>
}

export function SextouToolsProHistoryList({ items = [] }: SextouToolsProHistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-[#171717] p-6 text-sm leading-6 text-[#A09D97]">
        O historico do SextouTools PRO vai aparecer aqui assim que voce comecar a usar os apps.
      </div>
    )
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#171717] p-3">
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={`${item.title}-${item.timestamp}`}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <p className="font-semibold text-[#F0EDE6]">{item.title}</p>
            {item.subtitle ? <p className="mt-1 text-xs text-[#A09D97]">{item.subtitle}</p> : null}
            <p className="mt-2 font-mono text-xs text-[#A09D97]">{item.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
