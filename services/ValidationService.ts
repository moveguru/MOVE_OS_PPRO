import { InventoryItem, ValidationRecord, AuthorityStatus, QCEvent, ClaimsEvent } from '../types';

export class ValidationService {
  static validateWeight(estimated: number, userVerified: boolean): ValidationRecord<number> {
    return {
      value: estimated,
      source: 'Gemini Vision AI',
      confidence: userVerified ? 1.0 : 0.85,
      validationStatus: userVerified ? 'ACCEPTED' : 'PENDING',
      authorityStatus: userVerified ? 'USER_VALIDATED' : 'AI_OBSERVED',
      requiresHumanValidation: !userVerified,
      requiresAuthorizedReview: true
    };
  }

  static authorizeRecord(record: ValidationRecord<any>, role: 'QA' | 'TO'): ValidationRecord<any> {
    return {
      ...record,
      validationStatus: 'ACCEPTED',
      authorityStatus: role === 'TO' ? 'OFFICIAL_RECORD' : 'STAKEHOLDER_REVIEWED',
      requiresAuthorizedReview: false
    };
  }
}

export class QCService {
  static checkCompliance(item: InventoryItem, userProfile: any): QCEvent[] {
    const events: QCEvent[] = [];

    // Protocol checks
    if (item.name.toLowerCase().includes('tv') || item.name.toLowerCase().includes('television')) {
        events.push({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'PACKING_PROTOCOL',
            description: 'High-Value Electronics: Requires strict crating/padding compliance on Day-Of.',
            resolved: false
        });
    }

    if (item.name.toLowerCase().includes('paint') || item.name.toLowerCase().includes('chemical')) {
        events.push({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'DIGITAL_SIGN_OFF_HOLD',
            description: 'Hazmat Flag: Verify item is permitted for transport or flagged for diversion.',
            resolved: false
        });
    }

    return events;
  }
}

export class ClaimsService {
  static generateDraftClaim(originItem: InventoryItem, destinationAlert: string): ClaimsEvent {
      return {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          type: 'DAMAGE_COMPARISON',
          description: \`Damage Alert at Destination. Origin state: \${originItem.condition}. Detected: \${destinationAlert}\`,
          status: 'DRAFT'
      };
  }
}
