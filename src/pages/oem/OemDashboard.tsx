import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlusCircle, Building, Calendar, Tag } from 'lucide-react';
import { MOCK_OEM_REQUESTS } from '@/lib/mock-data-deflink';
import { OemRequest } from '@/types/domain';
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
          <span>Erstellt am: {request.erstelltAm}</span>
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
  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OEM Bedarfsübersicht</h1>
          <p className="text-muted-foreground">Hier finden Sie alle aktuell eingetragenen Bedarfe.</p>
        </div>
        <Button asChild>
          <Link to="/oem/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Neuen Bedarf eintragen
          </Link>
        </Button>
      </div>
      {MOCK_OEM_REQUESTS.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_OEM_REQUESTS.map((request) => (
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