export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface OemRequest {
  id: string;
  unternehmen: string;
  ansprechpartner: string;
  email: string;
  telefon?: string;
  betreff: string;
  beschreibung:string;
  kategorie?: 'Software' | 'Hardware' | 'Systemintegration' | 'KI/Data' | 'Beratung';
  zeitraum?: string;
  erstelltAm: string;
  status?: 'offen' | 'erledigt';
}
export interface ProviderProfile {
  id: string;
  firmenname: string;
  ansprechpartner: string;
  email: string;
  telefon?: string;
  logoUrl?: string;
  kurzbeschreibung: string;
  beschreibung: string;
  schwerpunkte: ('Softwareentwicklung' | 'KI & Data' | 'Systemintegration' | 'Prototypen/MVP' | 'Beratung/Strategie' | 'Sonstiges')[];
  standort: string;
  website?: string;
  status: 'draft' | 'freigeschaltet';
}