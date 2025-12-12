import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import type { ProviderProfile } from '@shared/types';
interface ProvidersTableProps {
  data: ProviderProfile[];
  onStatusChange: (id: string, status: 'freigeschaltet' | 'draft') => void;
  onDelete: (id: string) => void;
}
export function ProvidersTable({ data, onStatusChange, onDelete }: ProvidersTableProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteDialog(true);
  };
  const confirmDelete = () => {
    if (selectedId) {
      onDelete(selectedId);
      setShowDeleteDialog(false);
      setSelectedId(null);
    }
  };
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
                          id={`status-${prov.id}`}
                          checked={prov.status === 'freigeschaltet'}
                          onCheckedChange={(checked) => onStatusChange(prov.id, checked ? 'freigeschaltet' : 'draft')}
                          aria-label={`Status für ${prov.firmenname} umschalten`}
                        />
                        <Badge variant={prov.status === 'freigeschaltet' ? 'default' : 'outline'}>
                          {prov.status === 'freigeschaltet' ? 'Freigeschaltet' : 'Entwurf'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(prov.id)} aria-label={`Profil von ${prov.firmenname} löschen`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
            <AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden. Das Dienstleisterprofil wird dauerhaft gelöscht.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}