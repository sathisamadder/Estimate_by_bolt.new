import {
  computeItem,
  DEFAULT_RATES,
  findItemDef,
  EstimationRates,
} from "../client/lib/estimation";

function printResult(name: string, res: any) {
  console.log(`\n=== ${name} ===`);
  console.log(JSON.stringify(res, null, 2));
}

const rates: EstimationRates = {
  ...DEFAULT_RATES,
};

// Sample 1: Brick wall 10ft x 10ft, default thickness
const brickWallDims = {
  length: 10,
  height: 10,
  // thickness omitted -> use default 0.417ft
};
const brickWall = computeItem("brick_wall", brickWallDims as any, rates);
printResult("Brick Wall (10x10)", {
  materials: brickWall.materials,
  costs: brickWall.costs,
  total: brickWall.totalWithAdjustments,
});

// Sample 2: Lean concrete (PCC) area 5ft x 5ft with thickness 0.33ft
const pccDims = { length: 5, width: 5, thickness: 0.33 };
const pcc = computeItem("lean_concrete", pccDims as any, rates);
printResult("Lean Concrete PCC (5x5)", {
  materials: pcc.materials,
  costs: pcc.costs,
  total: pcc.totalWithAdjustments,
});

// Sample 3: Pile, diameter 1.0 ft (12in), length 20 ft
const pileDims = { width: 1.0, height: 20 };
const pile = computeItem("pile", pileDims as any, rates);
printResult("Pile (D=1ft L=20ft)", {
  materials: pile.materials,
  costs: pile.costs,
  total: pile.totalWithAdjustments,
});

console.log("\n-- Completed sample calculations --");
