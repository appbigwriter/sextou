interface HistoryListProps {
  items?: Array<{
    title: string
    timestamp: string
  }>
}

export function HistoryList({ items = [] }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6 text-sm text-[#A09D97]">
        O historico por usuario sera preenchido assim que os mini-apps da fase 2 forem publicados.
      </div>
    )
  }

  return (
    <div className="rounded-[22px] border border-white/10 bg-[#171717] p-3">
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={`${item.title}-${item.timestamp}`}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <p className="font-semibold text-[#F0EDE6]">{item.title}</p>
            <p className="font-mono text-xs text-[#A09D97]">{item.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
