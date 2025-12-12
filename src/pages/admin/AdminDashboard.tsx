import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Trash2, LogOut, Shield, Briefcase, Settings, Download } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import type { OemRequest, ProviderProfile } from '@shared/types';
// Helper for CSV export
function downloadCSV(data: any[], filename: string) {
  if (data.length === 0) {
    toast.info('Keine Daten zum Exportieren vorhanden.');
    return;
  }
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
// OEM Requests Table Component
function OemRequestsTable({ data, onDelete }: { data: OemRequest[], onDelete: (id: string) => void }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteDialog(true);
  };
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Unternehmen</TableHead>
                <TableHead>Betreff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{new Date(req.erstelltAm).toLocaleDateString('de-DE')}</TableCell>
                  <TableCell>{req.unternehmen}</TableCell>
                  <TableCell>{req.betreff}</TableCell>
                  <TableCell><Badge variant={req.status === 'erledigt' ? 'default' : 'secondary'}>{req.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleDeleteClick(req.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Löschen</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle><AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedId && onDelete(selectedId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
// Providers Table Component
function ProvidersTable({ data, onStatusChange, onDelete }: { data: ProviderProfile[], onStatusChange: (id: string, status: 'freigeschaltet' | 'draft') => void, onDelete: (id: string) => void }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const handleDeleteClick = (id: string) => {
      setSelectedId(id);
      setShowDeleteDialog(true);
    };
  return (
    <>
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Firma</TableHead>
              <TableHead>Ansprechpartner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((prov) => (
              <TableRow key={prov.id}>
                <TableCell>{prov.firmenname}</TableCell>
                <TableCell>{prov.ansprechpartner}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={prov.status === 'freigeschaltet'}
                      onCheckedChange={(checked) => onStatusChange(prov.id, checked ? 'freigeschaltet' : 'draft')}
                    />
                    <Badge variant={prov.status === 'freigeschaltet' ? 'default' : 'outline'}>
                      {prov.status === 'freigeschaltet' ? 'Freigeschaltet' : 'Entwurf'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(prov.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle><AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedId && onDelete(selectedId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
// Settings Component
function SettingsTab({ oemRequests, providerProfiles }: { oemRequests: OemRequest[], providerProfiles: ProviderProfile[] }) {
  const [newPassword, setNewPassword] = useState('');
  const queryClient = useQueryClient();
  const passwordMutation = useMutation({
    mutationFn: (password: string) => api('/api/admin/settings', { method: 'PATCH', body: JSON.stringify({ oemPassword: password }) }),
    onSuccess: () => {
      toast.success('Passwort erfolgreich aktualisiert.');
      setNewPassword('');
    },
    onError: (err: Error) => toast.error('Fehler beim Aktualisieren des Passworts.', { description: err.message }),
  });
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length >= 6) {
      passwordMutation.mutate(newPassword);
    } else {
      toast.error('Das Passwort muss mindestens 6 Zeichen lang sein.');
    }
  };
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader><CardTitle>OEM-Passwort ändern</CardTitle><CardDescription>Ändern Sie das zentrale Passwort für den OEM-Bereich.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="flex items-end gap-4">
            <div className="flex-grow space-y-2">
              <Label htmlFor="new-password">Neues Passwort</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Neues Passwort eingeben" />
            </div>
            <Button type="submit" disabled={passwordMutation.isPending}>Speichern</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Datenexport</CardTitle><CardDescription>Exportieren Sie Bedarfs- oder Dienstleisterdaten als CSV-Datei.</CardDescription></CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline" onClick={() => downloadCSV(oemRequests, 'oem-bedarfe.csv')}><Download className="mr-2 h-4 w-4" /> OEM-Bedarfe exportieren</Button>
          <Button variant="outline" onClick={() => downloadCSV(providerProfiles, 'dienstleister.csv')}><Download className="mr-2 h-4 w-4" /> Dienstleister exportieren</Button>
        </CardContent>
      </Card>
    </div>
  );
}
export function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: oemRequests, isLoading: oemLoading, error: oemError } = useQuery<OemRequest[]>({
    queryKey: ['admin-oem-requests'],
    queryFn: () => api('/api/admin/oem-requests'),
  });
  const { data: providerProfiles, isLoading: providersLoading, error: providersError } = useQuery<ProviderProfile[]>({
    queryKey: ['admin-providers'],
    queryFn: () => api('/api/admin/providers'),
  });
  const logoutMutation = useMutation({
    mutationFn: () => api('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => navigate('/'),
  });
  const deleteOemMutation = useMutation({
    mutationFn: (id: string) => api(`/api/admin/oem-requests/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Bedarf gelöscht.');
      queryClient.invalidateQueries({ queryKey: ['admin-oem-requests'] });
    },
    onError: (err: Error) => toast.error('Fehler beim Löschen.', { description: err.message }),
  });
  const deleteProviderMutation = useMutation({
    mutationFn: (id: string) => api(`/api/admin/providers/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Dienstleister gelöscht.');
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
    },
    onError: (err: Error) => toast.error('Fehler beim Löschen.', { description: err.message }),
  });
  const updateProviderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'freigeschaltet' | 'draft' }) =>
      api(`/api/admin/providers/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => {
      toast.success('Status aktualisiert.');
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
    },
    onError: (err: Error) => toast.error('Fehler beim Aktualisieren.', { description: err.message }),
  });
  const authError = oemError || providersError;
  if (authError && (authError as Error).message.includes('Nicht autorisiert')) {
    navigate('/oem/login');
    return null;
  }
  return (
    <PageContainer>
      <Toaster richColors />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Verwalten Sie hier die Plattforminhalte.</p>
        </div>
        <Button variant="outline" onClick={() => logoutMutation.mutate()}><LogOut className="mr-2 h-4 w-4" /> Abmelden</Button>
      </div>
      <Tabs defaultValue="oem-requests">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="oem-requests"><Shield className="mr-2 h-4 w-4" /> OEM Bedarfe</TabsTrigger>
          <TabsTrigger value="providers"><Briefcase className="mr-2 h-4 w-4" /> Dienstleister</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" /> Einstellungen</TabsTrigger>
        </TabsList>
        <TabsContent value="oem-requests" className="mt-6">
          {oemLoading ? <p>Lade Bedarfe...</p> : oemRequests && <OemRequestsTable data={oemRequests} onDelete={(id) => deleteOemMutation.mutate(id)} />}
        </TabsContent>
        <TabsContent value="providers" className="mt-6">
          {providersLoading ? <p>Lade Dienstleister...</p> : providerProfiles && <ProvidersTable data={providerProfiles} onStatusChange={(id, status) => updateProviderStatusMutation.mutate({ id, status })} onDelete={(id) => deleteProviderMutation.mutate(id)} />}
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <SettingsTab oemRequests={oemRequests || []} providerProfiles={providerProfiles || []} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}