/**
 * TariffLogic.ts
 * "Defense-Grade" calculations for logistics optimization.
 * LOGIC SOURCE: GSA 500A-2026 Tariff & DoD Instruction 4715.23
 * Rates derived from GSA 500A Appendix B (Baseline Rates).
 */

// GSA 500A-2026 TARIFF CONSTANTS (Per 100 lbs / CWT)
const SIT_FIRST_DAY_RATE_2026 = 22.50; 
const SIT_PICKUP_DELIVERY_RATE_2026 = 58.75; 
const PACKING_RATE_AVG_2026 = 84.20; 

// EPA estimates: ~0.82 lbs of CO2e per lb of furniture diverted from landfill
const CARBON_FACTOR = 0.82; 

export interface EstimationResult {
  estimatedWeight: number;
  tariffCredit: number;
  carbonSaved: number;
}

const AVERAGE_WEIGHTS: Record<string, number> = {
  'sofa': 150,
  'couch': 150,
  'chair': 40,
  'table': 60,
  'bed': 180,
  'mattress': 70,
  'tv': 30,
  'television': 30,
  'shelf': 45,
  'bookshelf': 50,
  'dresser': 100,
  'cabinet': 80,
  'lamp': 10,
  'box': 25,
  'rug': 20,
};

// 2. TARIFF CALCULATION ENGINE
export function calculateDoDSavings(itemName: string, providedWeight?: number, status?: string): EstimationResult {
  const normalizedName = itemName.toLowerCase();
  
  // 1. Determine Weight (Heuristic Fallback)
  let weight = providedWeight;
  if (!weight || weight === 0) {
    const foundKey = Object.keys(AVERAGE_WEIGHTS).find(key => normalizedName.includes(key));
    weight = foundKey ? AVERAGE_WEIGHTS[foundKey] : 20; // Default fallback 20lbs
  }

  // 2. Calculate Credits (GSA CWT Logic)
  // Only apply credits if the item is NOT being shipped (i.e., DONATE)
  const isDiverted = status === 'DONATE';
  let tariffCredit = 0;

  if (isDiverted) {
      // Hundredweight (CWT) calculations
      const cwt = Math.ceil(weight / 100); // Standard tariff calculation often rounds up CWT or uses fractional based on exact rules, using exact fractional CWT for savings estimate:
      const fractionalCwt = weight / 100;
      
      // Calculate Avoided Costs (The "Credit" Value) using GSA 500A-2026
      const avoidedSIT = (SIT_FIRST_DAY_RATE_2026 * fractionalCwt) + (SIT_PICKUP_DELIVERY_RATE_2026 * fractionalCwt);
      const avoidedPacking = PACKING_RATE_AVG_2026 * fractionalCwt;
      
      tariffCredit = avoidedSIT + avoidedPacking;
  }

  const carbonSaved = isDiverted ? (weight * CARBON_FACTOR) : 0;

  return {
    estimatedWeight: weight,
    tariffCredit: Number(tariffCredit.toFixed(2)),
    carbonSaved: Number(carbonSaved.toFixed(2)),
  };
}

// 3. LOGISTICS ESTIMATION ENGINE
export function estimateCartons(cubicFeet: number): number {
  if (!cubicFeet || cubicFeet <= 0) return 0;
  // Estimate: 1 carton for every 5 cu ft of volume (Updated standard)
  return Math.ceil(cubicFeet / 5);
}
