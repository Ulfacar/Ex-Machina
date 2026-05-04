'use client'

export default function Sparkline({ data, color = 'oklch(0.58 0.18 264)', height = 32 }: { data: number[], color?: string, height?: number }) {
  const w = 200, h = height
  const max = Math.max(...data), min = Math.min(...data)
  const sx = (i: number) => (i / (data.length - 1)) * w
  const sy = (v: number) => h - 4 - ((v - min) / (max - min || 1)) * (h - 8)
  const d = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i).toFixed(1)} ${sy(v).toFixed(1)}`).join(' ')
  const dArea = d + ` L ${w} ${h} L 0 ${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <defs>
        <linearGradient id={`spk-${color.replace(/[^a-z0-9]/g, '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.18} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={dArea} fill={`url(#spk-${color.replace(/[^a-z0-9]/g, '')})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
