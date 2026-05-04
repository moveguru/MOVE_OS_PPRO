/**
 * WasteDiversionLogic.ts
 * "Defense-Grade" calculations for logistics optimization.
 */

// Hypothetical tariff savings per lb based on GHC contract data
const TARIFF_RATE_PER_LB = 2.15; 

// EPA estimates: ~0.82 lbs of CO2e per lb of furniture diverted from landfill
const CARBON_FACTOR = 0.82; 

interface EstimationResult {
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

export function calculateDiversionMetrics(itemName: string, providedWeight?: number, status?: string): EstimationResult {
  const normalizedName = itemName.toLowerCase();
  
  // 1. Determine Weight
  // If AI provides a weight, use it. Otherwise, estimate based on heuristics.
  let weight = providedWeight;
  
  if (!weight || weight === 0) {
    // Simple partial match lookup
    const foundKey = Object.keys(AVERAGE_WEIGHTS).find(key => normalizedName.includes(key));
    weight = foundKey ? AVERAGE_WEIGHTS[foundKey] : 20; // Default fallback 20lbs
  }

  // 2. Calculate Credits
  // Only apply credits if the item is NOT being shipped (i.e., DONATE or TRASH)
  // For this prototype, we emphasize 'DONATE' for circular economy credits.
  const isDiverted = status === 'DONATE';

  const tariffCredit = isDiverted ? (weight * TARIFF_RATE_PER_LB) : 0;
  const carbonSaved = isDiverted ? (weight * CARBON_FACTOR) : 0;

  return {
    estimatedWeight: weight,
    tariffCredit: Number(tariffCredit.toFixed(2)),
    carbonSaved: Number(carbonSaved.toFixed(2)),
  };
}
