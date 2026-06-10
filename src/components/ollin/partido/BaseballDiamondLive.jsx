export default function BaseballDiamondLive({ summary }) {
  const onFirst = summary?.runners?.first
  const onSecond = summary?.runners?.second
  const onThird = summary?.runners?.third

  return (
    <div className="ollin-field-wrap">
      <svg viewBox="0 0 320 320" className="ollin-diamond-svg" role="img" aria-label="Diamante de béisbol">
        <polygon
          points="160,40 280,160 160,280 40,160"
          fill="rgba(26, 92, 66, 0.35)"
          stroke="#4ecdc4"
          strokeWidth="2"
        />
        <polygon points="160,120 220,160 160,200 100,160" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.3)" />

        {[
          { active: onSecond, cx: 160, cy: 120, label: '2B' },
          { active: onThird, cx: 100, cy: 160, label: '3B' },
          { active: onFirst, cx: 220, cy: 160, label: '1B' },
          { active: true, cx: 160, cy: 200, label: 'Home' },
        ].map(({ active, cx, cy, label }) => (
          <g key={label}>
            <rect
              x={cx - 14}
              y={cy - 14}
              width="28"
              height="28"
              transform={`rotate(45 ${cx} ${cy})`}
              fill={active ? 'rgba(240, 192, 48, 0.85)' : 'rgba(255,255,255,0.15)'}
              stroke={active ? '#f0c030' : 'rgba(255,255,255,0.4)'}
            />
          </g>
        ))}
      </svg>

      <div className="ollin-baseball-counts">
        <span>{summary?.inning || summary?.statusLong || 'En juego'}</span>
        {summary?.outs != null && <span>{summary.outs} out{summary.outs === 1 ? '' : 's'}</span>}
        {summary?.balls != null && summary?.strikes != null && (
          <span>
            Conteo {summary.balls}-{summary.strikes}
          </span>
        )}
        <span className="ollin-baseball-event">STRIKE · HIT · HOME RUN</span>
      </div>
    </div>
  )
}
