import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { Toaster, toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
const SCHWERPUNKTE_OPTIONS = ['Softwareentwicklung', 'KI & Data', 'Systemintegration', 'Prototypen/MVP', 'Beratung/Strategie', 'Sonstiges'] as const;
const providerProfileSchema = z.object({
  firmenname: z.string().min(2, { message: "Firmenname ist erforderlich." }),
  ansprechpartner: z.string().min(2, { message: "Ansprechpartner ist erforderlich." }),
  email: z.string().email({ message: "Gültige E-Mail-Adresse ist erforderlich." }),
  telefon: z.string().optional(),
  logoUrl: z.string().url({ message: "Bitte geben Sie eine gültige URL ein." }).optional().or(z.literal('')),
  website: z.string().url({ message: "Bitte geben Sie eine gültige URL ein." }).optional().or(z.literal('')),
  kurzbeschreibung: z.string().min(10, { message: "Kurzbeschreibung ist erforderlich." }).max(100, { message: "Maximal 100 Zeichen." }),
  beschreibung: z.string().min(50, { message: "Beschreibung muss mindestens 50 Zeichen lang sein." }),
  standort: z.string().min(2, { message: "Standort ist erforderlich." }),
  schwerpunkte: z.array(z.enum(SCHWERPUNKTE_OPTIONS)).min(1, { message: "Bitte wählen Sie mindestens einen Schwerpunkt." }),
  datenschutz: z.boolean().refine(val => val === true, { message: "Sie müssen den Datenschutzhinweisen zustimmen." }),
});
type ProviderProfileFormValues = z.infer<typeof providerProfileSchema>;
export function ProviderRegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: ProviderProfileFormValues) => api('/api/providers', {
      method: 'POST',
      body: JSON.stringify(values),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success('Profil erfolgreich übermittelt!', {
        description: 'Nach Prüfung wird es in der Übersicht angezeigt.',
      });
      setTimeout(() => navigate('/providers'), 2000);
    },
    onError: (error) => {
      toast.error('Fehler beim Senden des Profils.', { description: error.message });
    }
  });
  const form = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      firmenname: '',
      ansprechpartner: '',
      email: '',
      telefon: '',
      logoUrl: '',
      website: '',
      kurzbeschreibung: '',
      beschreibung: '',
      standort: '',
      schwerpunkte: [],
      datenschutz: false,
    },
  });
  function onSubmit(values: ProviderProfileFormValues) {
    mutation.mutate(values);
  }
  return (
    <PageContainer>
      <Toaster richColors />
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Dienstleister-Profil anlegen</CardTitle>
          <CardDescription>Präsentieren Sie Ihr Unternehmen und Ihre Expertise.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="firmenname" render={({ field }) => (
                  <FormItem><FormLabel>Firmenname</FormLabel><FormControl><Input placeholder="z.B. Cyber Solutions AG" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="ansprechpartner" render={({ field }) => (
                  <FormItem><FormLabel>Ansprechpartner</FormLabel><FormControl><Input placeholder="Anna Schmidt" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Kontakt-E-Mail</FormLabel><FormControl><Input type="email" placeholder="kontakt@cyber-solutions.de" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="telefon" render={({ field }) => (
                  <FormItem><FormLabel>Telefon (Optional)</FormLabel><FormControl><Input placeholder="+49..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="standort" render={({ field }) => (
                  <FormItem><FormLabel>Standort</FormLabel><FormControl><Input placeholder="Berlin, Deutschland" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="website" render={({ field }) => (
                  <FormItem><FormLabel>Web-Adresse (Optional)</FormLabel><FormControl><Input placeholder="https://beispiel.de" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="logoUrl" render={({ field }) => (
                <FormItem><FormLabel>Logo-URL (Optional)</FormLabel><FormControl><Input placeholder="https://beispiel.de/logo.png" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="kurzbeschreibung" render={({ field }) => (
                <FormItem><FormLabel>Kurzbeschreibung (max. 100 Zeichen)</FormLabel><FormControl><Input placeholder="Spezialist für sichere Kommunikationssysteme" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="beschreibung" render={({ field }) => (
                <FormItem><FormLabel>Detaillierte Beschreibung / Leistungen</FormLabel><FormControl><Textarea placeholder="Beschreiben Sie hier Ihr Leistungsportfolio..." rows={6} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="schwerpunkte" render={() => (
                <FormItem>
                  <div className="mb-4"><FormLabel>Schwerpunkte / Kategorien</FormLabel><FormDescription>Wählen Sie mindestens einen Schwerpunkt aus.</FormDescription></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
                    {SCHWERPUNKTE_OPTIONS.map((item) => (
                      <FormField key={item} control={form.control} name="schwerpunkte" render={({ field }) => (
                        <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(field.value?.filter((value) => value !== item));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      )} />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="datenschutz" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Datenschutzhinweise</FormLabel>
                    <p className="text-sm text-muted-foreground">Ich habe die Datenschutzhinweise gelesen und akzeptiere sie.</p><FormMessage />
                  </div>
                </FormItem>
              )} />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={mutation.isPending}>Abbrechen</Button>
                <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Wird gesendet...' : 'Profil absenden'}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}