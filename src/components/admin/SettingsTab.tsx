import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import type { OemRequest, ProviderProfile } from '@shared/types';
// Helper for CSV export
function downloadCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
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
    URL.revokeObjectURL(url);
  }
}
interface SettingsTabProps {
  oemRequests: OemRequest[];
  providerProfiles: ProviderProfile[];
}
export function SettingsTab({ oemRequests, providerProfiles }: SettingsTabProps) {
  const [newPassword, setNewPassword] = useState('');
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
        <CardHeader>
          <CardTitle>OEM-Passwort ändern</CardTitle>
          <CardDescription>Ändern Sie das zentrale Passwort für den OEM-Bereich.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-grow w-full space-y-2">
              <Label htmlFor="new-password">Neues Passwort</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Neues Passwort eingeben" />
            </div>
            <Button type="submit" disabled={passwordMutation.isPending} className="w-full sm:w-auto">
              {passwordMutation.isPending ? 'Speichern...' : 'Speichern'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Datenexport</CardTitle>
          <CardDescription>Exportieren Sie Bedarfs- oder Dienstleisterdaten als CSV-Datei.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={() => downloadCSV(oemRequests, 'oem-bedarfe.csv')}>
            <Download className="mr-2 h-4 w-4" /> OEM-Bedarfe exportieren
          </Button>
          <Button variant="outline" onClick={() => downloadCSV(providerProfiles, 'dienstleister.csv')}>
            <Download className="mr-2 h-4 w-4" /> Dienstleister exportieren
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}