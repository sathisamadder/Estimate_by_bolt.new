import React from "react";
import { computeItem, EstimationRates } from "@/lib/estimation";

interface DimensionsRaw {
  length?: any;
  width?: any;
  height?: any;
  thickness?: any;
  quantity?: any;
  multiple?: any;
  mainBarCount?: any;
  mainBarDiaMm?: any;
  stirrupDiaMm?: any;
  stirrupSpacingIn?: any;
  clearCoverIn?: any;
  lapLengthIn?: any;
}

interface EstimateItemMinimal {
  id: string;
  itemId: string; // maps to item definition id
  description?: string;
  dimensions: DimensionsRaw;
  totalCost: number;
}

interface ReportTableProps {
  items: EstimateItemMinimal[];
  rates: EstimationRates;
  formatBDT: (n: number) => string;
}

function toNumericDims(d: DimensionsRaw) {
  return {
    length: Number(d.length) || 0,
    width: d.width != null ? Number(d.width) || 0 : undefined,
    height: d.height != null ? Number(d.height) || 0 : undefined,
    thickness: d.thickness != null ? Number(d.thickness) || 0 : undefined,
    quantity: d.quantity != null ? Number(d.quantity) || 1 : 1,
    multiple: d.multiple != null ? Number(d.multiple) || 1 : 1,
    mainBarCount: d.mainBarCount != null ? Number(d.mainBarCount) || 0 : 0,
    mainBarDiaMm: d.mainBarDiaMm != null ? Number(d.mainBarDiaMm) || 0 : 0,
    stirrupDiaMm: d.stirrupDiaMm != null ? Number(d.stirrupDiaMm) || 0 : 0,
    stirrupSpacingIn:
      d.stirrupSpacingIn != null ? Number(d.stirrupSpacingIn) || 0 : 0,
    clearCoverIn: d.clearCoverIn != null ? Number(d.clearCoverIn) || 0 : 0,
    lapLengthIn: d.lapLengthIn != null ? Number(d.lapLengthIn) || 0 : 0,
  };
}

export const ReportTable: React.FC<ReportTableProps> = ({ items, rates, formatBDT }) => {
  const rows = items.map((it) => {
    const dims = toNumericDims(it.dimensions);
    const comp = computeItem(it.itemId, dims as any, rates as any);
    return {
      id: it.id,
      name: it.description || it.itemId,
      volume: comp.materials.volume,
      area: comp.materials.area,
      bricks: Math.round(comp.materials.bricks || 0),
      cement: Number((comp.materials.cement || 0).toFixed(2)),
      sand: Number((comp.materials.sand || 0).toFixed(2)),
      aggregate: Number((comp.materials.aggregate || 0).toFixed(2)),
      steel: Number((comp.materials.steel || 0).toFixed(2)),
      subtotal: Number((comp.costs.subtotal || 0).toFixed(2)),
    };
  });

  const totals = rows.reduce(
    (acc, r) => {
      acc.volume += r.volume;
      acc.cement += r.cement;
      acc.sand += r.sand;
      acc.aggregate += r.aggregate;
      acc.steel += r.steel;
      acc.bricks += r.bricks;
      acc.subtotal += r.subtotal;
      return acc;
    },
    { volume: 0, cement: 0, sand: 0, aggregate: 0, steel: 0, bricks: 0, subtotal: 0 },
  );

  return (
    <div className="overflow-x-auto hide-on-print">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Detailed Estimate Report</h3>
        <div className="space-x-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-3 py-2 rounded-md bg-brand-500 text-white"
          >
            Print
          </button>
        </div>
      </div>

      <table className="report-table w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-right">Volume (cft)</th>
            <th className="p-2 text-right">Bricks</th>
            <th className="p-2 text-right">Cement (bags)</th>
            <th className="p-2 text-right">Sand (cft)</th>
            <th className="p-2 text-right">Aggregate (cft)</th>
            <th className="p-2 text-right">Steel (kg)</th>
            <th className="p-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="p-2">{r.name}</td>
              <td className="p-2 text-right">{r.volume.toFixed(3)}</td>
              <td className="p-2 text-right">{r.bricks}</td>
              <td className="p-2 text-right">{r.cement}</td>
              <td className="p-2 text-right">{r.sand}</td>
              <td className="p-2 text-right">{r.aggregate}</td>
              <td className="p-2 text-right">{r.steel}</td>
              <td className="p-2 text-right">{formatBDT(r.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold border-t">
            <td className="p-2">Total</td>
            <td className="p-2 text-right">{totals.volume.toFixed(3)}</td>
            <td className="p-2 text-right">{totals.bricks}</td>
            <td className="p-2 text-right">{totals.cement.toFixed(2)}</td>
            <td className="p-2 text-right">{totals.sand.toFixed(2)}</td>
            <td className="p-2 text-right">{totals.aggregate.toFixed(2)}</td>
            <td className="p-2 text-right">{totals.steel.toFixed(2)}</td>
            <td className="p-2 text-right">{formatBDT(totals.subtotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ReportTable;
