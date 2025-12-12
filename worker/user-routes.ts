import { Hono } from "hono";
import type { Env } from './core-utils';
import { SettingsEntity, OemRequestEntity, ProviderProfileEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { OemRequest, ProviderProfile } from "@shared/types";
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'DefLink API' }}));
  // AUTH
  app.post('/api/auth/oem-login', async (c) => {
    const { password } = (await c.req.json()) as { password?: string };
    if (!isStr(password)) return bad(c, 'Passwort erforderlich');
    await SettingsEntity.ensureSeed(c.env);
    const settings = new SettingsEntity(c.env);
    const { oemPasswordHash } = await settings.getState();
    const inputHash = await hashPassword(password);
    if (inputHash === oemPasswordHash) {
      const cookie = 'oemSession=valid; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400';
      c.header('Set-Cookie', cookie);
      return ok(c, { loggedIn: true });
    }
    return c.json({ success: false, error: 'Ungültiges Passwort' }, 401);
  });
  // OEM REQUESTS (Protected)
  const oemRoutes = new Hono<{ Bindings: Env }>();
  oemRoutes.use('*', async (c, next) => {
    const cookie = c.req.header('cookie') || '';
    if (cookie.includes('oemSession=valid')) {
      await next();
    } else {
      return c.json({ success: false, error: 'Nicht autorisiert' }, 401);
    }
  });
  oemRoutes.get('/requests', async (c) => {
    await OemRequestEntity.ensureSeed(c.env);
    const page = await OemRequestEntity.list(c.env, null, 100); // Fetch up to 100
    // Sort descending by date
    const sortedItems = page.items.sort((a, b) => {
        const dateA = a.erstelltAm.split('.').reverse().join('-');
        const dateB = b.erstelltAm.split('.').reverse().join('-');
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    return ok(c, sortedItems);
  });
  oemRoutes.post('/requests', async (c) => {
    const body = await c.req.json<Partial<OemRequest>>();
    if (!body.unternehmen || !body.ansprechpartner || !body.email || !body.betreff || !body.beschreibung) {
      return bad(c, 'Fehlende Pflichtfelder');
    }
    const newRequest: OemRequest = {
      id: crypto.randomUUID(),
      unternehmen: body.unternehmen,
      ansprechpartner: body.ansprechpartner,
      email: body.email,
      telefon: body.telefon,
      betreff: body.betreff,
      beschreibung: body.beschreibung,
      kategorie: body.kategorie,
      zeitraum: body.zeitraum,
      erstelltAm: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    };
    const created = await OemRequestEntity.create(c.env, newRequest);
    return ok(c, created);
  });
  app.route('/api/oem', oemRoutes);
  // PROVIDERS (Public)
  app.get('/api/providers', async (c) => {
    await ProviderProfileEntity.ensureSeed(c.env);
    const page = await ProviderProfileEntity.list(c.env, null, 100);
    const approved = page.items.filter(p => p.status === 'freigeschaltet');
    return ok(c, approved);
  });
  app.post('/api/providers', async (c) => {
    const body = await c.req.json<Partial<ProviderProfile>>();
     if (!body.firmenname || !body.ansprechpartner || !body.email || !body.kurzbeschreibung || !body.beschreibung || !body.standort || !body.schwerpunkte) {
      return bad(c, 'Fehlende Pflichtfelder');
    }
    const newProfile: ProviderProfile = {
      id: crypto.randomUUID(),
      firmenname: body.firmenname,
      ansprechpartner: body.ansprechpartner,
      email: body.email,
      telefon: body.telefon,
      logoUrl: body.logoUrl,
      kurzbeschreibung: body.kurzbeschreibung,
      beschreibung: body.beschreibung,
      schwerpunkte: body.schwerpunkte,
      standort: body.standort,
      website: body.website,
      status: 'freigeschaltet', // For MVP, auto-approve
    };
    const created = await ProviderProfileEntity.create(c.env, newProfile);
    return ok(c, created);
  });
}