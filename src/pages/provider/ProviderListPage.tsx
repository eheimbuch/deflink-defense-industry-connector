import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlusCircle, MapPin, Tag } from 'lucide-react';
import { MOCK_PROVIDER_PROFILES } from '@/lib/mock-data-deflink';
import { ProviderProfile } from '@/types/domain';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
function ProviderCard({ provider }: { provider: ProviderProfile }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={provider.logoUrl} alt={`${provider.firmenname} Logo`} />
          <AvatarFallback>{provider.firmenname.substring(0, 2)}</AvatarFallback>
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
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {provider.schwerpunkte.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" /> {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export function ProviderListPage() {
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
      {MOCK_PROVIDER_PROFILES.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PROVIDER_PROFILES.map((provider) => (
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