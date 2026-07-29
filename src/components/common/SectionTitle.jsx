export default function SectionTitle({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''} style={{ marginBottom: 40 }}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p className="sub">{subtitle}</p>}
    </div>
  )
}
