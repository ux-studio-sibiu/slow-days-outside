import { CSSProperties, ReactNode } from "react";

// ── DecorLayer ────────────────────────────────────────────────────────────────
// Fullsize absolute overlay that holds individually positioned decorative
// images. Parent must have position: relative.
//
// Usage:
//   <div style={{ position: "relative" }}>
//     <DecorLayer opacity={0.22}>
//       <DecorItem src="/images/foliage-1.svg" left="5%" top="10%" width="12rem" rotate={-15} />
//       <DecorItem src="/images/butterfly-2.svg" right="8%" bottom="15%" width="8rem" rotate={20} flipX />
//       <DecorItem src="/images/sun-3.svg" left="50%" top="5%" width="6rem" rotate={45} opacity={0.4} />
//     </DecorLayer>
//     <div>page content sits above</div>
//   </div>

interface DecorLayerProps {
  children: ReactNode;
  className?: string;
  /** rgba/hex/named color — alpha channel controls overall transparency. Also sets currentColor for SvgItem children. */
  color?: string;
  zIndex?: number;
  filter?: string;
}

export function DecorLayer({ children, className, color, zIndex = 0, filter }: DecorLayerProps) {
  // Split rgba(r,g,b,a) → solid rgb for `color` (drives currentColor in SvgItems)
  // + numeric `opacity` on the container. This prevents per-path alpha compounding:
  // overlapping paths inside an SVG would otherwise stack opacity and create dark edges.
  let solidColor = color;
  let opacity: number | undefined;
  const rgba = color?.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
  if (rgba) {
    solidColor = `rgb(${rgba[1]},${rgba[2]},${rgba[3]})`;
    opacity = parseFloat(rgba[4]);
  }

  return (
    <div aria-hidden="true" className={["decor-layer", className].filter(Boolean).join(" ")} style={{ position: "absolute", top: 0, left: 0, right: 0, minHeight: "100%", zIndex, pointerEvents: "none", overflow: "hidden", color: solidColor, opacity, filter }}>
      {children}
    </div>
  );
}

// ── DecorItem ─────────────────────────────────────────────────────────────────
// One decorative image, absolutely positioned within a DecorLayer.
// All transform props combine into a single transform string.

interface DecorItemProps {
  src: string;
  width?: CSSProperties["width"];
  top?: CSSProperties["top"];
  right?: CSSProperties["right"];
  bottom?: CSSProperties["bottom"];
  left?: CSSProperties["left"];
  rotate?: number;
  scale?: number;
  opacity?: number;
  flipX?: boolean;
  flipY?: boolean;
}

export function DecorItem({
  src,
  width = "8rem",
  top,
  right,
  bottom,
  left,
  rotate = 0,
  scale = 1,
  opacity = 1,
  flipX = false,
  flipY = false,
}: DecorItemProps) {
  const sx = flipX ? -scale : scale;
  const sy = flipY ? -scale : scale;
  const transform =
    [
      rotate !== 0 && `rotate(${rotate}deg)`,
      (sx !== 1 || sy !== 1) && `scale(${sx}, ${sy})`,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <img src={src} alt="" style={{ position: "absolute", display: "block", width, height: "auto", top, right, bottom, left, transform, opacity, userSelect: "none" }} />
  );
}
