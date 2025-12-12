import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlusCircle, MapPin, Tag, Mail, Phone, Globe } from 'lucide-react';
import type { ProviderProfile } from '@shared/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
function ProviderCard({ provider }: { provider: ProviderProfile }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={provider.logoUrl} alt={`${provider.firmenname} Logo`} />
          <AvatarFallback>{provider.firmenname.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{provider.firmenname}</CardTitle>
          <CardDescription>{provider.kurzbeschreibung}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-4">{provider.beschreibung}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>{provider.standort}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {provider.schwerpunkte.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" /> {tag}
            </Badge>
          ))}
        </div>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="p-0 h-auto">Kontakt anzeigen</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-semibold">{provider.firmenname}</h4>
              <div className="flex items-center pt-2">
                <Mail className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">{provider.email}</span>
              </div>
              {provider.telefon && (
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-xs text-muted-foreground">{provider.telefon}</span>
                </div>
              )}
              {provider.website && (
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 opacity-70" />
                  <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline">{provider.website}</a>
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      </CardFooter>
    </Card>
  );
}
export function ProviderListPage() {
  const { data: providers, isLoading, error } = useQuery<ProviderProfile[], Error>({
    queryKey: ['providers'],
    queryFn: () => api('/api/providers'),
  });
  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dienstleisterverzeichnis</h1>
          <p className="text-muted-foreground">Finden Sie spezialisierte Dienstleister für den Verteidigungssektor.</p>
        </div>
        <Button asChild size="lg">
          <Link to="/providers/register">
            <PlusCircle className="mr-2 h-4 w-4" /> Als Dienstleister eintragen
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col h-full">
              <CardHeader className="flex-row items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2"><Skeleton className="h-6 w-40" /><Skeleton className="h-4 w-48" /></div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4"><Skeleton className="h-20 w-full" /></CardContent>
              <CardContent><Skeleton className="h-6 w-3/4" /></CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg text-destructive">
          <h3 className="text-xl font-semibold">Fehler beim Laden der Dienstleister</h3>
          <p className="text-muted-foreground mt-2">{error.message}</p>
        </div>
      ) : providers && providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">Keine Dienstleister gefunden</h3>
          <p className="text-muted-foreground mt-2">Seien Sie der erste Dienstleister, der sich registriert.</p>
        </div>
      )}
    </PageContainer>
  );
}