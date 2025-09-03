import { 
  PileCalculation, 
  FootingCalculation, 
  ColumnCalculation, 
  BeamCalculation, 
  SlabCalculation 
} from '../types/estimation';

// Steel density: 7850 kg/m³
const STEEL_DENSITY = 7850;

// Helper function to calculate steel weight
function calculateSteelWeight(diameter: number, length: number): number {
  // diameter in mm, length in meters
  const area = Math.PI * Math.pow(diameter / 2, 2) / 1000000; // m²
  return area * length * STEEL_DENSITY; // kg
}

// Helper function to convert feet to meters
function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

// Helper function to convert inches to meters
function inchesToMeters(inches: number): number {
  return inches * 0.0254;
}

export function calculatePile(
  diameter: number, // inches
  height: number, // feet
  mainRodDia: number, // mm
  mainRodCount: number,
  stirrupDia: number, // mm
  stirrupSpacing: number // inches
): PileCalculation {
  // Convert dimensions
  const diameterFt = diameter / 12;
  const radiusFt = diameterFt / 2;
  
  // Concrete volume calculation
  const concreteVolume = Math.PI * Math.pow(radiusFt, 2) * height;
  
  // Main rod steel calculation
  const mainRodLength = feetToMeters(height);
  const mainRodWeight = mainRodCount * calculateSteelWeight(mainRodDia, mainRodLength);
  
  // Stirrup calculation
  const stirrupCircumference = Math.PI * inchesToMeters(diameter - 4); // 2" cover on each side
  const stirrupCount = Math.floor((height * 12) / stirrupSpacing);
  const stirrupWeight = stirrupCount * calculateSteelWeight(stirrupDia, stirrupCircumference);
  
  const totalSteelWeight = mainRodWeight + stirrupWeight;
  
  return {
    diameter,
    height,
    mainRodDia,
    mainRodCount,
    stirrupDia,
    stirrupSpacing,
    concreteVolume,
    steelWeight: totalSteelWeight
  };
}

export function calculateFooting(
  length: number, // feet
  width: number, // feet
  depth: number, // inches
  mainRodDia: number, // mm
  mainRodSpacing: number, // inches
  distributionRodDia: number, // mm
  distributionRodSpacing: number // inches
): FootingCalculation {
  // Concrete volume calculation
  const concreteVolume = length * width * (depth / 12);
  
  // Main reinforcement calculation (along length)
  const mainRodCount = Math.floor((width * 12) / mainRodSpacing) + 1;
  const mainRodLength = feetToMeters(length);
  const mainRodWeight = mainRodCount * calculateSteelWeight(mainRodDia, mainRodLength);
  
  // Distribution reinforcement calculation (along width)
  const distributionRodCount = Math.floor((length * 12) / distributionRodSpacing) + 1;
  const distributionRodLength = feetToMeters(width);
  const distributionRodWeight = distributionRodCount * calculateSteelWeight(distributionRodDia, distributionRodLength);
  
  const totalSteelWeight = mainRodWeight + distributionRodWeight;
  
  return {
    length,
    width,
    depth,
    mainRodDia,
    mainRodSpacing,
    distributionRodDia,
    distributionRodSpacing,
    concreteVolume,
    steelWeight: totalSteelWeight
  };
}

export function calculateColumn(
  length: number, // feet
  width: number, // feet
  height: number, // feet
  mainRodDia: number, // mm
  mainRodCount: number,
  tieRodDia: number, // mm
  tieSpacing: number // inches
): ColumnCalculation {
  // Concrete volume calculation
  const concreteVolume = length * width * height;
  
  // Main rod steel calculation
  const mainRodLength = feetToMeters(height);
  const mainRodWeight = mainRodCount * calculateSteelWeight(mainRodDia, mainRodLength);
  
  // Tie rod calculation
  const tiePerimeter = 2 * (feetToMeters(length) + feetToMeters(width)) - 0.1; // 0.1m deduction for cover
  const tieCount = Math.floor((height * 12) / tieSpacing);
  const tieWeight = tieCount * calculateSteelWeight(tieRodDia, tiePerimeter);
  
  const totalSteelWeight = mainRodWeight + tieWeight;
  
  return {
    length,
    width,
    height,
    mainRodDia,
    mainRodCount,
    tieRodDia,
    tieSpacing,
    concreteVolume,
    steelWeight: totalSteelWeight
  };
}

export function calculateBeam(
  length: number, // feet
  width: number, // inches
  depth: number, // inches
  topRodDia: number, // mm
  topRodCount: number,
  bottomRodDia: number, // mm
  bottomRodCount: number,
  stirrupDia: number, // mm
  stirrupSpacing: number // inches
): BeamCalculation {
  // Concrete volume calculation
  const concreteVolume = length * (width / 12) * (depth / 12);
  
  // Top and bottom reinforcement calculation
  const rodLength = feetToMeters(length);
  const topRodWeight = topRodCount * calculateSteelWeight(topRodDia, rodLength);
  const bottomRodWeight = bottomRodCount * calculateSteelWeight(bottomRodDia, rodLength);
  
  // Stirrup calculation
  const stirrupHeight = inchesToMeters(depth - 4); // 2" cover top and bottom
  const stirrupWidth = inchesToMeters(width - 4); // 2" cover on sides
  const stirrupLength = 2 * (stirrupHeight + stirrupWidth);
  const stirrupCount = Math.floor((length * 12) / stirrupSpacing);
  const stirrupWeight = stirrupCount * calculateSteelWeight(stirrupDia, stirrupLength);
  
  const totalSteelWeight = topRodWeight + bottomRodWeight + stirrupWeight;
  
  return {
    length,
    width,
    depth,
    topRodDia,
    topRodCount,
    bottomRodDia,
    bottomRodCount,
    stirrupDia,
    stirrupSpacing,
    concreteVolume,
    steelWeight: totalSteelWeight
  };
}

export function calculateSlab(
  length: number, // feet
  width: number, // feet
  thickness: number, // inches
  mainRodDia: number, // mm
  mainRodSpacing: number, // inches
  distributionRodDia: number, // mm
  distributionRodSpacing: number // inches
): SlabCalculation {
  // Concrete volume calculation
  const concreteVolume = length * width * (thickness / 12);
  
  // Main reinforcement calculation (along length)
  const mainRodCount = Math.floor((width * 12) / mainRodSpacing) + 1;
  const mainRodLength = feetToMeters(length);
  const mainRodWeight = mainRodCount * calculateSteelWeight(mainRodDia, mainRodLength);
  
  // Distribution reinforcement calculation (along width)
  const distributionRodCount = Math.floor((length * 12) / distributionRodSpacing) + 1;
  const distributionRodLength = feetToMeters(width);
  const distributionRodWeight = distributionRodCount * calculateSteelWeight(distributionRodDia, distributionRodLength);
  
  const totalSteelWeight = mainRodWeight + distributionRodWeight;
  
  return {
    length,
    width,
    thickness,
    mainRodDia,
    mainRodSpacing,
    distributionRodDia,
    distributionRodSpacing,
    concreteVolume,
    steelWeight: totalSteelWeight
  };
}