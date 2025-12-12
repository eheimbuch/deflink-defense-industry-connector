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
  app.post('/api/auth/logout', (c) => {
    const cookie = 'oemSession=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
    c.header('Set-Cookie', cookie);
    return ok(c, { loggedOut: true });
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
    const sortedItems = page.items.sort((a, b) => new Date(b.erstelltAm).getTime() - new Date(a.erstelltAm).getTime());
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
      erstelltAm: new Date().toISOString(),
      status: 'offen',
    };
    const created = await OemRequestEntity.create(c.env, newRequest);
    return ok(c, created);
  });
  app.route('/api/oem', oemRoutes);
  // PROVIDERS (Public)
  app.get('/api/providers', async (c) => {
    await ProviderProfileEntity.ensureSeed(c.env);
    const page = await ProviderProfileEntity.list(c.env, null, 100);
    const approved = page.items
      .filter(p => p.status === 'freigeschaltet')
      .sort((a, b) => a.firmenname.localeCompare(b.firmenname));
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
      status: 'draft',
    };
    const created = await ProviderProfileEntity.create(c.env, newProfile);
    return ok(c, created);
  });
  // ADMIN ROUTES (Protected)
  const adminRoutes = new Hono<{ Bindings: Env }>();
  adminRoutes.use('*', async (c, next) => {
    const cookie = c.req.header('cookie') || '';
    if (cookie.includes('oemSession=valid')) {
      await next();
    } else {
      return c.json({ success: false, error: 'Nicht autorisiert' }, 401);
    }
  });
  // Admin: OEM Requests
  adminRoutes.get('/oem-requests', async (c) => {
    const page = await OemRequestEntity.list(c.env, null, 200);
    const sorted = page.items.sort((a, b) => new Date(b.erstelltAm).getTime() - new Date(a.erstelltAm).getTime());
    return ok(c, sorted);
  });
  adminRoutes.patch('/oem-requests/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Partial<OemRequest>>();
    const entity = new OemRequestEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c);
    await entity.patch(body);
    return ok(c, await entity.getState());
  });
  adminRoutes.delete('/oem-requests/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await OemRequestEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
  // Admin: Providers
  adminRoutes.get('/providers', async (c) => {
    const page = await ProviderProfileEntity.list(c.env, null, 200);
    const sorted = page.items.sort((a, b) => a.firmenname.localeCompare(b.firmenname));
    return ok(c, sorted);
  });
  adminRoutes.patch('/providers/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<{ status?: 'draft' | 'freigeschaltet' }>();
    if (!body.status) return bad(c, 'Status is required');
    const entity = new ProviderProfileEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c);
    await entity.patch({ status: body.status });
    return ok(c, await entity.getState());
  });
  adminRoutes.delete('/providers/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ProviderProfileEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
  // Admin: Settings
  adminRoutes.patch('/settings', async (c) => {
    const { oemPassword } = await c.req.json<{ oemPassword?: string }>();
    if (!isStr(oemPassword)) return bad(c, 'New password is required');
    const hash = await hashPassword(oemPassword);
    const settings = new SettingsEntity(c.env);
    await settings.patch({ oemPasswordHash: hash });
    return ok(c, { success: true });
  });
  app.route('/api/admin', adminRoutes);
}