export type AuthorityStatus = 'AI_OBSERVED' | 'USER_VALIDATED' | 'STAKEHOLDER_REVIEWED' | 'AUTHORIZED_SURVEY_INPUT' | 'OFFICIAL_RECORD' | 'UNVERIFIED';

export type ValidationStatus = 'PENDING' | 'ACCEPTED' | 'DISPUTED' | 'ESCALATED';

export type AgentPersona = 'MASTER_SURVEYOR' | 'QC_COMPLIANCE' | 'CIRCULAR_BROKER' | 'COUNSELING_AGENT';

export interface ValidationRecord<T> {
  value: T;
  source: string;
  confidence: number;
  validationStatus: ValidationStatus;
  authorityStatus: AuthorityStatus;
  requiresHumanValidation: boolean;
  requiresAuthorizedReview: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  weight: number;
  status: 'KEEP' | 'DONATE' | 'TRASH' | 'DETECTED';
  condition: string;
  timestamp: number;
  tariffCredit: number;
  carbonSaved: number;
  cartonCount?: number; // Estimated number of boxes needed
  assetDna?: {
    hash: string;
    meshId: string;
    valorizationCertificate: string;
    lastAudit: number;
  };
  boundingBox?: {
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
  };
  validation?: ValidationRecord<number>; // Validated weight
  advisory?: {
    cwtImpact: number;
    lightBulkyFlag: boolean;
    packingMaterialImpact: string;
  };
  qcFlags?: string[];
}

export interface UserProfile {
  rank: string;
  branch: string;
  moveType: 'PCS' | 'RETIREMENT' | 'SEPARATION' | 'CORPORATE';
  weightAllowance: number;
  destination?: {
    base: string;
    housingModel: string;
    readinessScore: number;
  };
  assessment?: {
    projectType: string;
    painPoints: string[];
    specialInstructions: string;
    proGearWeight: number;
    hazmatFlags: string[];
  };
}

export interface WasteMetrics {
  totalWeight: number;
  totalCarbonSaved: number;
  totalTariffCredit: number;
  inventoryCount: number;
  divertedWeight: number;
  circularValorizationScore: number;
}

export interface Badge {
  id: string;
  name: string;
  xp: number;
  timestamp: number;
}

export interface QCEvent {
  id: string;
  timestamp: number;
  type: 'PACKING_PROTOCOL' | 'IMPROPER_HANDLING' | 'DIGITAL_SIGN_OFF_HOLD';
  description: string;
  resolved: boolean;
}

export interface ClaimsEvent {
  id: string;
  timestamp: number;
  type: 'DAMAGE_COMPARISON' | 'CUSTODY_TRANSFER';
  description: string;
  status: 'DRAFT' | 'READY_FOR_PACKET';
}

export interface ITVEvent {
  id: string;
  timestamp: number;
  type: 'WAYPOINT' | 'GPS_UPDATE' | 'SIT' | 'ETA_UPDATE' | 'DELAY_RISK';
  location: string;
  description: string;
}
