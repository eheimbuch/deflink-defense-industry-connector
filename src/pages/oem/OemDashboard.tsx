import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlusCircle, Building, Calendar, Tag, LogOut } from 'lucide-react';
import type { OemRequest } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
function OemRequestCard({ request }: { request: OemRequest }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg">{request.betreff}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Building className="h-4 w-4" /> {request.unternehmen}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{request.beschreibung}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Erstellt am: {new Date(request.erstelltAm).toLocaleDateString('de-DE')}</span>
        </div>
        {request.kategorie && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Tag className="h-3 w-3" /> {request.kategorie}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
export function OemDashboard() {
  const navigate = useNavigate();
  const { data: requests, isLoading, error } = useQuery<OemRequest[], Error>({
    queryKey: ['oem-requests'],
    queryFn: () => api('/api/oem/requests'),
    retry: (failureCount, error: any) => {
      if (error.message.includes('401') || error.message.includes('Nicht autorisiert')) return false;
      return failureCount < 3;
    },
  });
  const logoutMutation = useMutation({
    mutationFn: () => api('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => navigate('/'),
  });
  if (error && (error.message.includes('401') || error.message.includes('Nicht autorisiert'))) {
    navigate('/oem/login');
    return null;
  }
  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OEM Bedarfsübersicht</h1>
          <p className="text-muted-foreground">Hier finden Sie alle aktuell eingetragenen Bedarfe.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link to="/oem/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Neuen Bedarf eintragen
            </Link>
          </Button>
          <Button variant="outline" onClick={() => logoutMutation.mutate()}>
            <LogOut className="mr-2 h-4 w-4" /> Abmelden
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-16 w-full" /></CardContent>
              <CardFooter><Skeleton className="h-4 w-1/2" /></CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg text-destructive">
          <h3 className="text-xl font-semibold">Fehler beim Laden der Daten</h3>
          <p className="text-muted-foreground mt-2">{error.message}</p>
        </div>
      ) : requests && requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <OemRequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">Keine Bedarfe gefunden</h3>
          <p className="text-muted-foreground mt-2">Tragen Sie den ersten Bedarf ein, um zu beginnen.</p>
        </div>
      )}
    </PageContainer>
  );
}