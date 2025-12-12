import { Entity, IndexedEntity, type Env } from "./core-utils";
import type { OemRequest, ProviderProfile } from "@shared/types";
import { MOCK_OEM_REQUESTS, MOCK_PROVIDER_PROFILES } from "@shared/mock-data";
// Utility to hash passwords
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
// SETTINGS ENTITY: Singleton for system-wide settings
export class SettingsEntity extends Entity<{ oemPasswordHash: string }> {
  static readonly entityName = "settings";
  static readonly initialState = { oemPasswordHash: "" };
  constructor(env: Env) {
    super(env, 'singleton');
  }
  static async ensureSeed(env: Env): Promise<void> {
    const settings = new SettingsEntity(env);
    // Log the start of the seeding check
    console.log('Checking if settings exists');
    const exists = await settings.exists();
    console.log(`Settings exists: ${exists}`);
    if (!exists) {
      // Log seeding actions
      console.log('Seeding default OEM password with oem123');
      const defaultPasswordHash = await hashPassword('oem123');
      console.log(`Computed default hash=${defaultPasswordHash.slice(0,16)}...`);
      await settings.save({ oemPasswordHash: defaultPasswordHash });
      console.log('Settings seeded successfully');
    }
  }
}
// OEM REQUEST ENTITY
export class OemRequestEntity extends IndexedEntity<OemRequest> {
  static readonly entityName = "oem-request";
  static readonly indexName = "oem-requests";
  static readonly initialState: OemRequest = {
    id: "",
    unternehmen: "",
    ansprechpartner: "",
    email: "",
    betreff: "",
    beschreibung: "",
    erstelltAm: "",
    status: "offen",
  };
  static seedData = MOCK_OEM_REQUESTS;
}
// PROVIDER PROFILE ENTITY
export class ProviderProfileEntity extends IndexedEntity<ProviderProfile> {
  static readonly entityName = "provider-profile";
  static readonly indexName = "provider-profiles";
  static readonly initialState: ProviderProfile = {
    id: "",
    firmenname: "",
    ansprechpartner: "",
    email: "",
    kurzbeschreibung: "",
    beschreibung: "",
    schwerpunkte: [],
    standort: "",
    status: 'draft',
  };
  static seedData = MOCK_PROVIDER_PROFILES;
}