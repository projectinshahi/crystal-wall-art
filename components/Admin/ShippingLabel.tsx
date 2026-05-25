import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

export interface LabelItem {
  title: string;
  quantity: number;
  size?: string | null;
  thickness?: string | null;
  orientation?: string | null;
  mounting_method?: string | null;
}

export interface LabelData {
  orderNumber: string;
  shipmentNumber: string;
  customerName: string;
  phone?: string | null;
  address: string;
  trackingId?: string | null;
  courier?: string | null;
  items: LabelItem[];
}

interface Props {
  data: LabelData;
  /** A4 fits 4 labels per page; A6 = single label per page */
  size?: "A4" | "A6";
}

export function ShippingLabel({ data, size = "A6" }: Props) {
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (barcodeRef.current && data.trackingId) {
      try {
        JsBarcode(barcodeRef.current, data.trackingId, {
          format: "CODE128",
          displayValue: true,
          fontSize: 12,
          height: 40,
          margin: 0,
        });
      } catch (e) {
        console.warn("Barcode render failed", e);
      }
    }
  }, [data.trackingId]);

  return (
    <div
      className="shipping-label"
      style={{
        width: size === "A6" ? "105mm" : "190mm",
        minHeight: size === "A6" ? "148mm" : "auto",
        padding: "6mm",
        border: "1px solid #000",
        background: "#fff",
        color: "#000",
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        boxSizing: "border-box",
        pageBreakAfter: "always",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #000", paddingBottom: "4mm", marginBottom: "3mm" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px" }}>Crystal Art</div>
          <div style={{ fontSize: "10px" }}>Shipping Label</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div><strong>Order:</strong> {data.orderNumber}</div>
          <div><strong>Shipment:</strong> {data.shipmentNumber}</div>
        </div>
      </div>

      <div style={{ marginBottom: "3mm" }}>
        <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase" }}>Deliver To</div>
        <div style={{ fontWeight: 700, fontSize: "13px" }}>{data.customerName}</div>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.3 }}>{data.address}</div>
        {data.phone && <div><strong>Phone:</strong> {data.phone}</div>}
      </div>

      {data.courier && (
        <div style={{ marginBottom: "2mm" }}>
          <strong>Courier:</strong> {data.courier}
        </div>
      )}

      {data.trackingId && (
        <div style={{ margin: "3mm 0", textAlign: "center" }}>
          <svg ref={barcodeRef} />
        </div>
      )}

      <div style={{ borderTop: "1px dashed #000", paddingTop: "2mm", marginTop: "2mm" }}>
        <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", marginBottom: "1mm" }}>Items ({data.items.length})</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #000" }}>
              <th style={{ textAlign: "left", padding: "2px" }}>Item</th>
              <th style={{ textAlign: "left", padding: "2px" }}>Variant</th>
              <th style={{ textAlign: "right", padding: "2px" }}>Qty</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((it, i) => {
              const variant = [it.size, it.thickness, it.orientation, it.mounting_method].filter(Boolean).join(" / ");
              return (
                <tr key={i} style={{ borderBottom: "1px dotted #999" }}>
                  <td style={{ padding: "2px" }}>{it.title}</td>
                  <td style={{ padding: "2px" }}>{variant || "-"}</td>
                  <td style={{ padding: "2px", textAlign: "right" }}>{it.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Opens a print window with the given labels rendered.
 * Pass labels already converted to HTML strings (we render React → string via createRoot + flush).
 */
export function printLabels(labels: LabelData[], size: "A4" | "A6" = "A6") {
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) return;

  const renderLabel = (data: LabelData) => {
    let barcodeSvg = "";
    if (data.trackingId) {
      // Render barcode to SVG string in the parent window
      const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      try {
        JsBarcode(svgEl, data.trackingId, {
          format: "CODE128", displayValue: true, fontSize: 12, height: 40, margin: 0,
        });
        barcodeSvg = `<div style="margin:3mm 0;text-align:center">${svgEl.outerHTML}</div>`;
      } catch { /* ignore */ }
    }

    const itemsRows = data.items.map(it => {
      const variant = [it.size, it.thickness, it.orientation, it.mounting_method].filter(Boolean).join(" / ");
      return `<tr style="border-bottom:1px dotted #999">
        <td style="padding:2px">${escape(it.title)}</td>
        <td style="padding:2px">${escape(variant || "-")}</td>
        <td style="padding:2px;text-align:right">${it.quantity}</td>
      </tr>`;
    }).join("");

    const labelWidth = size === "A6" ? "105mm" : "190mm";
    const labelMinHeight = size === "A6" ? "148mm" : "auto";

    return `<div class="shipping-label" style="width:${labelWidth};min-height:${labelMinHeight};padding:6mm;border:1px solid #000;background:#fff;color:#000;font-family:Arial,sans-serif;font-size:11px;box-sizing:border-box;page-break-after:always;margin:0 auto 4mm">
      <div style="display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:4mm;margin-bottom:3mm">
        <div>
          <div style="font-weight:700;font-size:14px">Crystal Art</div>
          <div style="font-size:10px">Shipping Label</div>
        </div>
        <div style="text-align:right">
          <div><strong>Order:</strong> ${escape(data.orderNumber)}</div>
          <div><strong>Shipment:</strong> ${escape(data.shipmentNumber)}</div>
        </div>
      </div>
      <div style="margin-bottom:3mm">
        <div style="font-size:10px;color:#555;text-transform:uppercase">Deliver To</div>
        <div style="font-weight:700;font-size:13px">${escape(data.customerName)}</div>
        <div style="white-space:pre-wrap;line-height:1.3">${escape(data.address)}</div>
        ${data.phone ? `<div><strong>Phone:</strong> ${escape(data.phone)}</div>` : ""}
      </div>
      ${data.courier ? `<div style="margin-bottom:2mm"><strong>Courier:</strong> ${escape(data.courier)}</div>` : ""}
      ${barcodeSvg}
      <div style="border-top:1px dashed #000;padding-top:2mm;margin-top:2mm">
        <div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:1mm">Items (${data.items.length})</div>
        <table style="width:100%;border-collapse:collapse;font-size:10px">
          <thead><tr style="border-bottom:1px solid #000">
            <th style="text-align:left;padding:2px">Item</th>
            <th style="text-align:left;padding:2px">Variant</th>
            <th style="text-align:right;padding:2px">Qty</th>
          </tr></thead>
          <tbody>${itemsRows}</tbody>
        </table>
      </div>
    </div>`;
  };

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Shipping Labels</title>
    <style>
      @page { size: ${size}; margin: 5mm; }
      body { margin: 0; padding: 0; background: #f5f5f5; }
      @media print { body { background: #fff; } .shipping-label { margin: 0 auto !important; } }
    </style>
  </head><body>
    ${labels.map(renderLabel).join("")}
    <script>window.onload = () => { setTimeout(() => window.print(), 300); };</script>
  </body></html>`;

  w.document.open();
  w.document.write(html);
  w.document.close();
}

function escape(s: string) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
