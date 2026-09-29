import { ImageResponse } from "next/og";

export const alt = "Lateral Zinkin — Ideas & Marketing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffd900", padding: 72, position: "relative", fontFamily: "serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "stretch", fontSize: 44, fontWeight: 700 }}>
            <div style={{ border: "4px solid #0d0d0d", padding: "6px 14px", background: "#f3f0e8", color: "#0d0d0d" }}>lateral</div>
            <div style={{ background: "#0d0d0d", color: "#ffd900", padding: "10px 16px" }}>Zinkin!</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, lineHeight: 1, letterSpacing: -3, color: "#0d0d0d", maxWidth: 900 }}>
            <span>Tu marca tiene una historia.</span>
            <span>La contamos desde otro ángulo.</span>
          </div>
          <div style={{ fontSize: 26, color: "#0d0d0d" }}>Marketing y comunicación · Madrid · Desde 2007</div>
        </div>
        <div style={{ position: "absolute", right: 90, top: 70, width: 70, height: 350, background: "#0d0d0d", transform: "rotate(14deg)" }} />
        <div style={{ position: "absolute", right: 70, top: 460, width: 90, height: 90, borderRadius: 45, background: "#0d0d0d" }} />
      </div>
    ),
    size,
  );
}
