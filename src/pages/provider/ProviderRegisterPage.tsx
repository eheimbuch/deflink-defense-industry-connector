import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { Toaster, toast } from '@/components/ui/sonner';
import { Checkbox } from '@/components/ui/checkbox';
const providerProfileSchema = z.object({
  firmenname: z.string().min(2, { message: "Firmenname ist erforderlich." }),
  ansprechpartner: z.string().min(2, { message: "Ansprechpartner ist erforderlich." }),
  email: z.string().email({ message: "Gültige E-Mail-Adresse ist erforderlich." }),
  logoUrl: z.string().url({ message: "Bitte geben Sie eine gültige URL ein." }).optional().or(z.literal('')),
  kurzbeschreibung: z.string().min(10, { message: "Kurzbeschreibung ist erforderlich." }).max(100, { message: "Maximal 100 Zeichen." }),
  beschreibung: z.string().min(50, { message: "Beschreibung muss mindestens 50 Zeichen lang sein." }),
  standort: z.string().min(2, { message: "Standort ist erforderlich." }),
  datenschutz: z.boolean().refine(val => val === true, { message: "Sie müssen den Datenschutzhinweisen zustimmen." }),
});
export function ProviderRegisterPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof providerProfileSchema>>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      firmenname: '',
      ansprechpartner: '',
      email: '',
      logoUrl: '',
      kurzbeschreibung: '',
      beschreibung: '',
      standort: '',
      datenschutz: false,
    },
  });
  function onSubmit(values: z.infer<typeof providerProfileSchema>) {
    console.log(values);
    toast.success('Profil erfolgreich übermittelt!', {
      description: 'Nach Prüfung wird es in der Übersicht angezeigt.',
    });
    setTimeout(() => navigate('/providers'), 2000);
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
                  <FormItem>
                    <FormLabel>Firmenname</FormLabel>
                    <FormControl><Input placeholder="z.B. Cyber Solutions AG" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="ansprechpartner" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ansprechpartner</FormLabel>
                    <FormControl><Input placeholder="Anna Schmidt" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kontakt-E-Mail</FormLabel>
                    <FormControl><Input type="email" placeholder="kontakt@cyber-solutions.de" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="standort" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standort</FormLabel>
                    <FormControl><Input placeholder="Berlin, Deutschland" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="logoUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo-URL (Optional)</FormLabel>
                  <FormControl><Input placeholder="https://beispiel.de/logo.png" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="kurzbeschreibung" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kurzbeschreibung (max. 100 Zeichen)</FormLabel>
                  <FormControl><Input placeholder="Spezialist für sichere Kommunikationssysteme" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="beschreibung" render={({ field }) => (
                <FormItem>
                  <FormLabel>Detaillierte Beschreibung / Leistungen</FormLabel>
                  <FormControl><Textarea placeholder="Beschreiben Sie hier Ihr Leistungsportfolio..." rows={6} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="datenschutz" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Datenschutzhinweise</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Ich habe die Datenschutzhinweise gelesen und akzeptiere sie.
                    </p>
                    <FormMessage />
                  </div>
                </FormItem>
              )} />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Abbrechen</Button>
                <Button type="submit">Profil absenden</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}