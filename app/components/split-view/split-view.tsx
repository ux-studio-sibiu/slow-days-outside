import "./split-view.scss";

export type SplitViewProps = {
  /** Content for the left pane. */
  left: React.ReactNode;
  /** Content for the right pane. */
  right: React.ReactNode;
  /** Optional content for a full-width pane spanning beneath both columns. */
  bottom?: React.ReactNode;
  className?: string;
};

/**
 * Splits the available space into two equal panes that sit side-by-side on
 * wide screens and stack vertically on narrow ones. An optional `bottom` pane
 * spans the full width beneath both columns. Layout-only and content agnostic.
 */
export default function SplitView({
  left,
  right,
  bottom,
  className = "",
}: SplitViewProps) {
  return (
    <div className={`nsc-split-view ${className}`.trim()}>
      <div className="split-pane split-pane-left">{left}</div>
      <div className="split-pane split-pane-right">{right}</div>
      {bottom != null && (
        <div className="split-pane split-pane-bottom">{bottom}</div>
      )}
    </div>
  );
}
