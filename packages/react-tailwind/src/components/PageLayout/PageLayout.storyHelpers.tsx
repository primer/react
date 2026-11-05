export const Placeholder = ({height, label}: {height: number | string; label: string}) => (
  <div
    className="box-border grid place-items-center rounded-md border border-muted bg-inset px-6 py-1"
    style={{height}}
  >
    {label}
  </div>
)
