import { InventoryItem } from "../types";

export interface CustodyRecord {
  blockHeight: number;
  hash: string;
  previousHash: string;
  itemId: string;
  itemName: string;
  timestamp: number;
  action: "ORIGIN_SCAN" | "QC_CHECK" | "QA_AUTHORIZED" | "DESTINATION_SCAN";
  actor: string;
  payload: string; // Stringified metadata
}

export class LedgerService {
  private static chain: CustodyRecord[] = [];

  // Simulate a SHA-256 hash generation for the OS prototype
  private static generateHash(
    previousHash: string,
    timestamp: number,
    payload: string,
  ): string {
    const raw = previousHash + timestamp.toString() + payload;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return (
      Math.abs(hash).toString(16).padStart(16, "0") +
      crypto.randomUUID().split("-")[0]
    );
  }

  static getGenesisBlock(): string {
    return "0000000000000000";
  }

  static commitRecord(
    item: InventoryItem,
    action: CustodyRecord["action"],
    actor: string,
  ): CustodyRecord {
    const previousHash =
      this.chain.length > 0
        ? this.chain[this.chain.length - 1].hash
        : this.getGenesisBlock();
    const timestamp = Date.now();

    // Immutable subset of data
    const payloadData = {
      id: item.id,
      weight: item.weight,
      condition: item.condition,
      validation: item.validation?.authorityStatus || "UNVERIFIED",
    };

    const payloadString = JSON.stringify(payloadData);
    const newHash = this.generateHash(previousHash, timestamp, payloadString);

    const record: CustodyRecord = {
      blockHeight: this.chain.length + 1,
      hash: newHash,
      previousHash,
      itemId: item.id,
      itemName: item.name,
      timestamp,
      action,
      actor,
      payload: payloadString,
    };

    this.chain.push(record);
    return record;
  }

  static getLedger(): CustodyRecord[] {
    return [...this.chain].reverse(); // Newest first for UI
  }
}
