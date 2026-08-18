export default function StatCard({ label, value, icon: Icon, tone = "primary" }) {
  const tones = {
    primary: { bg: "var(--primary-100)", color: "var(--primary-700)" },
    indigo: { bg: "var(--indigo-100)", color: "var(--indigo-700)" },
    cyan: { bg: "var(--cyan-100)", color: "var(--cyan-800)" },
    success: { bg: "var(--success-100)", color: "var(--success-700)" },
    warning: { bg: "var(--warning-100)", color: "var(--warning-700)" },
  };
  const t = tones[tone] || tones.primary;

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: t.bg, color: t.color }}>
        {Icon && <Icon size={20} />}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
