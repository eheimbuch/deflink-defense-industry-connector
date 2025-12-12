import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Shield, Briefcase, Settings } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import type { OemRequest, ProviderProfile } from '@shared/types';
import { OemRequestsTable } from '@/components/admin/OemRequestsTable';
import { ProvidersTable } from '@/components/admin/ProvidersTable';
import { SettingsTab } from '@/components/admin/SettingsTab';
import { Skeleton } from '@/components/ui/skeleton';
export function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: oemRequests, isLoading: oemLoading, error: oemError } = useQuery<OemRequest[]>({
    queryKey: ['admin-oem-requests'],
    queryFn: () => api('/api/admin/oem-requests'),
    retry: (failureCount, error: any) => {
      if (error.message.includes('401') || error.message.includes('Nicht autorisiert')) return false;
      return failureCount < 3;
    },
  });
  const { data: providerProfiles, isLoading: providersLoading, error: providersError } = useQuery<ProviderProfile[]>({
    queryKey: ['admin-providers'],
    queryFn: () => api('/api/admin/providers'),
    retry: (failureCount, error: any) => {
      if (error.message.includes('401') || error.message.includes('Nicht autorisiert')) return false;
      return failureCount < 3;
    },
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Verwalten Sie hier die Plattforminhalte.</p>
        </div>
        <Button variant="outline" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
          <LogOut className="mr-2 h-4 w-4" /> Abmelden
        </Button>
      </div>
      <Tabs defaultValue="oem-requests">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="oem-requests"><Shield className="mr-2 h-4 w-4" /> OEM Bedarfe</TabsTrigger>
          <TabsTrigger value="providers"><Briefcase className="mr-2 h-4 w-4" /> Dienstleister</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" /> Einstellungen</TabsTrigger>
        </TabsList>
        <TabsContent value="oem-requests" className="mt-6">
          {oemLoading ? (
            <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></CardContent></Card>
          ) : oemRequests ? (
            <OemRequestsTable data={oemRequests} onDelete={(id) => deleteOemMutation.mutate(id)} />
          ) : null}
        </TabsContent>
        <TabsContent value="providers" className="mt-6">
          {providersLoading ? (
            <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></CardContent></Card>
          ) : providerProfiles ? (
            <ProvidersTable
              data={providerProfiles}
              onStatusChange={(id, status) => updateProviderStatusMutation.mutate({ id, status })}
              onDelete={(id) => deleteProviderMutation.mutate(id)}
            />
          ) : null}
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <SettingsTab oemRequests={oemRequests || []} providerProfiles={providerProfiles || []} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}