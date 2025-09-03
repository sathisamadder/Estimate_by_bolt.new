export interface PileCalculation {
  diameter: number; // inches
  height: number; // feet
  mainRodDia: number; // mm
  mainRodCount: number;
  stirrupDia: number; // mm
  stirrupSpacing: number; // inches
  concreteVolume: number; // cubic feet
  steelWeight: number; // kg
}

export interface FootingCalculation {
  length: number; // feet
  width: number; // feet
  depth: number; // inches
  mainRodDia: number; // mm
  mainRodSpacing: number; // inches
  distributionRodDia: number; // mm
  distributionRodSpacing: number; // inches
  concreteVolume: number; // cubic feet
  steelWeight: number; // kg
}

export interface ColumnCalculation {
  length: number; // feet
  width: number; // feet
  height: number; // feet
  mainRodDia: number; // mm
  mainRodCount: number;
  tieRodDia: number; // mm
  tieSpacing: number; // inches
  concreteVolume: number; // cubic feet
  steelWeight: number; // kg
}

export interface BeamCalculation {
  length: number; // feet
  width: number; // inches
  depth: number; // inches
  topRodDia: number; // mm
  topRodCount: number;
  bottomRodDia: number; // mm
  bottomRodCount: number;
  stirrupDia: number; // mm
  stirrupSpacing: number; // inches
  concreteVolume: number; // cubic feet
  steelWeight: number; // kg
}

export interface SlabCalculation {
  length: number; // feet
  width: number; // feet
  thickness: number; // inches
  mainRodDia: number; // mm
  mainRodSpacing: number; // inches
  distributionRodDia: number; // mm
  distributionRodSpacing: number; // inches
  concreteVolume: number; // cubic feet
  steelWeight: number; // kg
}

export interface ProjectEstimate {
  piles: PileCalculation[];
  footings: FootingCalculation[];
  columns: ColumnCalculation[];
  beams: BeamCalculation[];
  slabs: SlabCalculation[];
  totalConcreteVolume: number;
  totalSteelWeight: number;
}