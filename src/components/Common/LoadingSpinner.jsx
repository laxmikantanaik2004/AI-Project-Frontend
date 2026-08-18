export default function LoadingSpinner({ size = "md", label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={size === "lg" ? "spinner spinner-lg" : "spinner"} />
      {label && <span className="text-sm text-muted">{label}</span>}
    </div>
  );
}
