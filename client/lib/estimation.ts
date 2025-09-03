import { z } from "zod";

export type Mode = "volume" | "wall" | "area";

export interface ItemDef {
  id: string;
  name: string;
  unit: string; // display unit for primary measurement (cft/sft/point)
  mode: Mode;
  // Coefficients per cft of concrete or effective volume
  cement: number; // bags per cft (or effective)
  sand: number; // cft per cft
  aggregate: number; // cft per cft
  steel: number; // kg per cft
  defaultThickness?: number; // ft (for slabs, walls, finishes)
  brickPerCft?: number; // nos per cft for masonry
}

export interface Category {
  label: string;
  items: ItemDef[];
}

export interface EstimationRates {
  cement: number; // per bag
  sand: number; // per cft
  aggregate: number; // per cft
  brick: number; // per piece
  steel: number; // per kg
  labor: number; // per day proxy (scaled by volume/area)
  wastagePercent: number; // % applied to materials (not labor)
  overheadPercent: number; // % on subtotal
  profitPercent: number; // % on subtotal
  taxPercent: number; // % on (subtotal + overhead + profit)
  // Mix and conversion parameters
  dryFactor: number; // dry volume factor (e.g., 1.54)
  cementBagVolumeCft: number; // cft per bag (e.g., 1.25)
  concreteMix: { c: number; s: number; a: number }; // e.g., 1:1.5:3
  mortarMix: { c: number; s: number }; // e.g., 1:5
  brickPerCft: number; // nos per cft of wall volume
  steelFactor: number; // multiplier for steel coefficients
}

export const DEFAULT_RATES: EstimationRates = {
  cement: 650,
  sand: 1200,
  aggregate: 1800,
  brick: 12,
  steel: 85,
  labor: 800,
  wastagePercent: 3,
  overheadPercent: 10,
  profitPercent: 7,
  taxPercent: 5,
  dryFactor: 1.54,
  cementBagVolumeCft: 1.25,
  concreteMix: { c: 1, s: 1.5, a: 3 },
  mortarMix: { c: 1, s: 5 },
  brickPerCft: 11.43,
  steelFactor: 1,
};

export const CATEGORIES: Record<string, Category> = {
  foundation: {
    label: "Foundation Works",
    items: [
      {
        id: "pile",
        name: "Pile",
        unit: "cft",
        mode: "volume",
        cement: 0.38,
        sand: 1.6,
        aggregate: 3.2,
        steel: 200,
      },
      {
        id: "pile_cap",
        name: "Pile Cap",
        unit: "cft",
        mode: "volume",
        cement: 0.35,
        sand: 1.5,
        aggregate: 3.0,
        steel: 110,
        defaultThickness: 2.0,
      },
      {
        id: "mat_foundation",
        name: "Mat Foundation",
        unit: "cft",
        mode: "volume",
        cement: 0.36,
        sand: 1.6,
        aggregate: 3.1,
        steel: 110,
        defaultThickness: 1.5,
      },
      {
        id: "footing",
        name: "Isolated Footing",
        unit: "cft",
        mode: "volume",
        cement: 0.35,
        sand: 1.5,
        aggregate: 3.0,
        steel: 100,
      },
      {
        id: "combined_footing",
        name: "Combined Footing",
        unit: "cft",
        mode: "volume",
        cement: 0.35,
        sand: 1.5,
        aggregate: 3.0,
        steel: 110,
      },
      {
        id: "strap_footing",
        name: "Strap Footing",
        unit: "cft",
        mode: "volume",
        cement: 0.35,
        sand: 1.5,
        aggregate: 3.0,
        steel: 110,
      },
      {
        id: "strip_footing",
        name: "Strip Footing",
        unit: "cft",
        mode: "volume",
        cement: 0.34,
        sand: 1.5,
        aggregate: 2.9,
        steel: 110,
      },
      {
        id: "raft",
        name: "Raft Foundation",
        unit: "cft",
        mode: "volume",
        cement: 0.36,
        sand: 1.6,
        aggregate: 3.1,
        steel: 110,
        defaultThickness: 1.5,
      },
      {
        id: "retaining_wall",
        name: "Retaining Wall",
        unit: "sft",
        mode: "wall",
        cement: 0.0,
        sand: 0.0,
        aggregate: 0.0,
        steel: 140,
        defaultThickness: 0.75,
        brickPerCft: 0,
      },
      {
        id: "water_reservoir",
        name: "UG Water Reservoir",
        unit: "cft",
        mode: "volume",
        cement: 0.0,
        sand: 0.0,
        aggregate: 0.0,
        steel: 0,
        defaultThickness: 0.58,
      },
      {
        id: "septic_tank",
        name: "Septic Tank",
        unit: "cft",
        mode: "volume",
        cement: 0.0,
        sand: 0.0,
        aggregate: 0.0,
        steel: 0,
        defaultThickness: 0.83,
      },
    ],
  },
  structure: {
    label: "Structural Works",
    items: [
      {
        id: "column",
        name: "Column",
        unit: "cft",
        mode: "volume",
        cement: 0.38,
        sand: 1.5,
        aggregate: 2.8,
        steel: 180,
      },
      {
        id: "beam",
        name: "Beam",
        unit: "cft",
        mode: "volume",
        cement: 0.36,
        sand: 1.5,
        aggregate: 2.8,
        steel: 160,
      },
      {
        id: "slab",
        name: "Slab",
        unit: "cft",
        mode: "volume",
        cement: 0.32,
        sand: 1.4,
        aggregate: 2.4,
        steel: 90,
        defaultThickness: 0.42,
      },
      {
        id: "stair",
        name: "Stair",
        unit: "cft",
        mode: "volume",
        cement: 0.35,
        sand: 1.5,
        aggregate: 3.0,
        steel: 120,
      },
      {
        id: "lintel",
        name: "Lintel",
        unit: "cft",
        mode: "volume",
        cement: 0.34,
        sand: 1.5,
        aggregate: 2.8,
        steel: 80,
      },
      {
        id: "lift_core",
        name: "Lift Core",
        unit: "cft",
        mode: "wall",
        cement: 0,
        sand: 0,
        aggregate: 0,
        steel: 0,
        defaultThickness: 0.67,
      },
      {
        id: "overhead_tank",
        name: "Overhead Tank",
        unit: "cft",
        mode: "volume",
        cement: 0,
        sand: 0,
        aggregate: 0,
        steel: 0,
        defaultThickness: 0.67,
      },
    ],
  },
  masonry: {
    label: "Masonry Works",
    items: [
      {
        id: "brick_wall",
        name: "Brick Wall",
        unit: "sft",
        mode: "wall",
        cement: 0.0,
        sand: 0.0,
        aggregate: 0.0,
        steel: 0,
        defaultThickness: 0.33,
        brickPerCft: 500,
      },
      {
        id: "block_wall",
        name: "Block Wall",
        unit: "sft",
        mode: "wall",
        cement: 0.0,
        sand: 0.0,
        aggregate: 0.0,
        steel: 0,
        defaultThickness: 0.5,
        brickPerCft: 280,
      },
      {
        id: "partition",
        name: "Partition Wall",
        unit: "sft",
        mode: "wall",
        cement: 0.0,
        sand: 0.0,
        aggregate: 0.0,
        steel: 0,
        defaultThickness: 0.25,
        brickPerCft: 450,
      },
    ],
  },
  finishing: {
    label: "Finishing Works",
    items: [
      {
        id: "plaster",
        name: "Plaster Work",
        unit: "sft",
        mode: "area",
        cement: 0.35,
        sand: 1.5,
        aggregate: 0.0,
        steel: 0,
        defaultThickness: 0.05,
      },
      {
        id: "tiles",
        name: "Tile Work",
        unit: "sft",
        mode: "area",
        cement: 0.25,
        sand: 1.0,
        aggregate: 0.0,
        steel: 0,
        defaultThickness: 0.03,
      },
      {
        id: "paint",
        name: "Paint Work",
        unit: "sft",
        mode: "area",
        cement: 0.0,
        sand: 0.0,
        aggregate: 0.0,
        steel: 0,
        defaultThickness: 0.0,
      },
    ],
  },
  utilities: {
    label: "Utility Works",
    items: [
      {
        id: "plumbing",
        name: "Plumbing Work",
        unit: "point",
        mode: "area",
        cement: 0,
        sand: 0,
        aggregate: 0,
        steel: 0,
      },
      {
        id: "electrical",
        name: "Electrical Work",
        unit: "point",
        mode: "area",
        cement: 0,
        sand: 0,
        aggregate: 0,
        steel: 0,
      },
      {
        id: "hvac",
        name: "HVAC Work",
        unit: "point",
        mode: "area",
        cement: 0,
        sand: 0,
        aggregate: 0,
        steel: 0,
      },
    ],
  },
  custom: {
    label: "Custom",
    items: [
      {
        id: "custom",
        name: "Custom Item",
        unit: "unit",
        mode: "volume",
        cement: 0.35,
        sand: 1.5,
        aggregate: 3.0,
        steel: 120,
      },
    ],
  },
};

export const ALL_ITEMS: ItemDef[] = Object.values(CATEGORIES).flatMap(
  (c) => c.items,
);

export function findItemDef(id: string | undefined): ItemDef | undefined {
  if (!id) return undefined;
  return ALL_ITEMS.find((i) => i.id === id);
}

export function getUnitLabel(
  itemId: string | undefined,
  field: "length" | "width" | "height" | "thickness",
): string {
  const def = findItemDef(itemId);
  if (!def) return "ft";

  // Structural members: width/length often specified in inches in drawings
  const inchesForPlan = new Set(["column", "beam", "lintel"]);

  if (def.id === "pile") {
    if (field === "width") return "in"; // diameter
    if (field === "height") return "ft"; // length/depth
    if (field === "length") return "ft"; // not used but keep
    return field === "thickness" ? "-" : "ft";
  }

  if (def.id === "footing" || def.id === "pile_cap") {
    if (field === "thickness") return "in"; // depth captured in inches per reference
  }

  if (inchesForPlan.has(def.id)) {
    if (field === "length" || field === "width") return "in";
    if (field === "height") return "ft";
    return "-";
  }

  if (def.mode === "area") {
    if (field === "height") return "-";
    if (field === "thickness") return def.defaultThickness ? "ft" : "-";
    return "ft";
  }
  if (def.mode === "wall") {
    if (field === "width") return "-";
    return "ft";
  }
  return "ft";
}

export const DimensionsSchema = z.object({
  length: z.number().nonnegative(),
  width: z.number().nonnegative().optional(),
  height: z.number().nonnegative().optional(),
  thickness: z.number().nonnegative().optional(),
  quantity: z.number().positive().default(1),
  multiple: z.number().positive().default(1),
});

export interface DimensionsInput {
  length: number;
  width?: number;
  height?: number;
  thickness?: number;
  quantity?: number;
  multiple?: number;
  // Reinforcement extras
  mainBarCount?: number; // nos
  mainBarDiaMm?: number; // mm
  stirrupDiaMm?: number; // mm
  stirrupSpacingIn?: number; // inches
  clearCoverIn?: number; // inches
  lapLengthIn?: number; // inches
}

export interface ComputedMaterials {
  volume: number; // cft
  area: number; // sft for finishes/walls display
  bricks: number; // nos
  cement: number; // bags
  sand: number; // cft
  aggregate: number; // cft
  steel: number; // kg
  laborBasis: number; // scalar used to compute labor cost
}

export interface ItemComputationResult {
  materials: ComputedMaterials;
  costs: {
    cement: number;
    sand: number;
    aggregate: number;
    brick: number;
    steel: number;
    labor: number;
    subtotal: number; // base cost before adjustments
  };
  totalWithAdjustments: number; // optional per-item roll-up including wastage/overhead/profit/tax
}

export function computeItem(
  itemId: string,
  dim: DimensionsInput,
  rates: EstimationRates,
): ItemComputationResult {
  const def = findItemDef(itemId);
  const safe: Required<DimensionsInput> = {
    length: dim.length || 0,
    width: dim.width ?? 0,
    height: dim.height ?? 0,
    thickness: dim.thickness ?? 0,
    quantity: dim.quantity ?? 1,
    multiple: dim.multiple ?? 1,
    mainBarCount: dim.mainBarCount ?? 0,
    mainBarDiaMm: dim.mainBarDiaMm ?? 0,
    stirrupDiaMm: dim.stirrupDiaMm ?? 0,
    stirrupSpacingIn: dim.stirrupSpacingIn ?? 0,
    clearCoverIn: dim.clearCoverIn ?? 0,
    lapLengthIn: dim.lapLengthIn ?? 0,
  } as Required<DimensionsInput>;

  let volume = 0;
  let area = 0;
  let bricks = 0;

  if (def) {
    // Special cases based on PDF
    switch (def.id) {
      case "pile": {
        // width as diameter (ft), height as length (ft)
        const d = safe.width || 0;
        const L = safe.height || safe.length;
        volume = ((Math.PI * Math.pow(d, 2)) / 4) * L;
        break;
      }
      case "water_reservoir": {
        const tWall = safe.thickness || def.defaultThickness || 0.58; // ~7"
        const tBot = 0.67; // 8"
        const tTop = 0.5; // 6"
        const L = safe.length,
          W = safe.width,
          H = safe.height;
        const walls = 2 * (L + W) * H * tWall;
        const bottom = L * W * tBot;
        const top = L * W * tTop;
        volume = walls + bottom + top;
        break;
      }
      case "overhead_tank": {
        const tWall = safe.thickness || def.defaultThickness || 0.67; // ~8"
        const tBot = 0.5; // 6"
        const tTop = 0.33; // 4"
        const L = safe.length,
          W = safe.width,
          H = safe.height;
        const walls = 2 * (L + W) * H * tWall;
        const bottom = L * W * tBot;
        const top = L * W * tTop;
        volume = walls + bottom + top;
        break;
      }
      case "septic_tank": {
        const tWall = safe.thickness || def.defaultThickness || 0.83; // 10"
        const tBot = 0.67;
        const tTop = 0.5;
        const L = safe.length,
          W = safe.width,
          H = safe.height;
        const walls = 2 * (L + W) * H * tWall;
        const bottom = L * W * tBot;
        const top = L * W * tTop;
        volume = walls + bottom + top;
        break;
      }
      case "lift_core": {
        const t = safe.thickness || def.defaultThickness || 0.67;
        const L = safe.length,
          W = safe.width,
          H = safe.height;
        volume = 2 * (L + W) * H * t;
        break;
      }
      default: {
        if (def.mode === "wall") {
          const t = safe.thickness || def.defaultThickness || 0.33;
          area = safe.length * safe.height; // sft one face
          volume = area * t;
          bricks = (rates.brickPerCft || def.brickPerCft || 0) * volume;
        } else if (def.mode === "area") {
          area = safe.length * (safe.width || 1);
          const t = def.defaultThickness ?? 0.0;
          volume = area * t;
        } else {
          // Convert thickness for footing & pile cap from inches to feet if provided
          const tInFt =
            (def.id === "footing" || def.id === "pile_cap") && safe.thickness
              ? safe.thickness / 12
              : safe.thickness;
          const depth = def.defaultThickness
            ? tInFt || def.defaultThickness
            : tInFt || safe.height;
          if (depth) {
            volume = safe.length * (safe.width || 1) * depth;
          } else {
            volume = safe.length * (safe.width || 1) * (safe.height || 1);
          }
        }
      }
    }
  } else {
    // Generic fallback
    volume = safe.length * (safe.width || 1) * (safe.height || 1);
  }

  const multiplier = safe.quantity * safe.multiple;
  volume *= multiplier;
  area *= multiplier;
  bricks *= multiplier;

  // Base materials before wastage using mix ratios
  let cement = 0;
  let sand = 0;
  let aggregate = 0;
  let steel = 0;
  if (def) {
    if (def.mode === "volume" || def.id === "retaining_wall") {
      const dry = volume * (rates.dryFactor || 1.54);
      const sum =
        (rates.concreteMix?.c || 1) +
        (rates.concreteMix?.s || 1.5) +
        (rates.concreteMix?.a || 3);
      const cementVol = (dry * (rates.concreteMix?.c || 1)) / sum;
      cement = cementVol / (rates.cementBagVolumeCft || 1.25);
      sand = (dry * (rates.concreteMix?.s || 1.5)) / sum;
      aggregate = (dry * (rates.concreteMix?.a || 3)) / sum;
      // Reinforcement: detailed calc for piles
      if (def.id === "pile" && safe.width && (safe.height || safe.length)) {
        const unitByMm: Record<number, number> = {
          10: 0.19,
          12: 0.27,
          16: 0.48,
          20: 0.75,
          25: 1.17,
        };
        const L = safe.height || safe.length; // ft
        const nMain = safe.mainBarCount || 7;
        const mainDia = safe.mainBarDiaMm || 20;
        const mainWpf = unitByMm[mainDia] || 0.75;
        const lapFt = (safe.lapLengthIn || 30) / 12;
        const mainSteel = nMain * (L + lapFt) * mainWpf;

        const coverFt = (safe.clearCoverIn || 3) / 12;
        const dClearFt = Math.max((safe.width || 0) - 2 * coverFt, 0);
        const circumferenceFt = Math.PI * dClearFt;
        const spacingFt = (safe.stirrupSpacingIn || 6) / 12;
        const nSpirals = spacingFt > 0 ? Math.ceil(L / spacingFt) : 0;
        const stirDia = safe.stirrupDiaMm || 10;
        const stirWpf = unitByMm[stirDia] || 0.19;
        const spiralSteel = nSpirals * circumferenceFt * stirWpf;
        steel = (mainSteel + spiralSteel) * (rates.steelFactor || 1);
      } else {
        steel = volume * (def.steel || 0) * (rates.steelFactor || 1);
      }
    } else if (def.mode === "wall") {
      const wallBricks = (rates.brickPerCft || def.brickPerCft || 0) * volume;
      const dry = volume * (rates.dryFactor || 1.54);
      const sum = (rates.mortarMix?.c || 1) + (rates.mortarMix?.s || 5);
      const cementVol = (dry * (rates.mortarMix?.c || 1)) / sum;
      cement = cementVol / (rates.cementBagVolumeCft || 1.25);
      sand = (dry * (rates.mortarMix?.s || 5)) / sum;
      aggregate = 0;
      bricks = wallBricks;
      steel = (def.steel || 0) * volume * (rates.steelFactor || 1);
    } else if (def.mode === "area") {
      // Thin layer materials using mortar mix where applicable (e.g., plaster/tiles bedding)
      if (def.id === "paint") {
        cement = 0;
        sand = 0;
        aggregate = 0;
        steel = 0;
      } else {
        const dry = volume * (rates.dryFactor || 1.54);
        const sum = (rates.mortarMix?.c || 1) + (rates.mortarMix?.s || 5);
        const cementVol = (dry * (rates.mortarMix?.c || 1)) / sum;
        cement = cementVol / (rates.cementBagVolumeCft || 1.25);
        sand = (dry * (rates.mortarMix?.s || 5)) / sum;
        aggregate = 0;
        steel = 0;
      }
    }
  }

  // Apply wastage on materials (not labor)
  const wastageFactor = 1 + (rates.wastagePercent || 0) / 100;
  cement *= wastageFactor;
  sand *= wastageFactor;
  aggregate *= wastageFactor;
  steel *= wastageFactor;

  const cementCost = cement * rates.cement;
  const sandCost = sand * rates.sand;
  const aggregateCost = aggregate * rates.aggregate;
  const brickCost = bricks * rates.brick;
  const laborBasis = def && def.mode === "area" ? area || volume : volume;
  const laborCost = laborBasis * rates.labor * 0.5;
  const steelCost = steel * rates.steel;

  const subtotal =
    cementCost + sandCost + aggregateCost + brickCost + steelCost + laborCost;

  const withOverhead = subtotal * (1 + (rates.overheadPercent || 0) / 100);
  const withProfit = withOverhead * (1 + (rates.profitPercent || 0) / 100);
  const totalWithAdjustments = withProfit * (1 + (rates.taxPercent || 0) / 100);

  return {
    materials: {
      volume,
      area,
      bricks,
      cement,
      sand,
      aggregate,
      steel,
      laborBasis,
    },
    costs: {
      cement: cementCost,
      sand: sandCost,
      aggregate: aggregateCost,
      brick: brickCost,
      steel: steelCost,
      labor: laborCost,
      subtotal,
    },
    totalWithAdjustments,
  };
}

export interface ProjectTotals {
  subtotal: number;
  overhead: number;
  profit: number;
  tax: number;
  grandTotal: number;
}

export function computeProjectTotals(
  itemSubtotals: number[],
  rates: EstimationRates,
): ProjectTotals {
  const subtotal = itemSubtotals.reduce((a, b) => a + b, 0);
  const overhead = (subtotal * (rates.overheadPercent || 0)) / 100;
  const profit = ((subtotal + overhead) * (rates.profitPercent || 0)) / 100;
  const tax = ((subtotal + overhead + profit) * (rates.taxPercent || 0)) / 100;
  const grandTotal = subtotal + overhead + profit + tax;
  return { subtotal, overhead, profit, tax, grandTotal };
}

export function formatCurrencyBDT(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
