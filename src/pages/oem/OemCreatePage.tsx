import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { Toaster, toast } from '@/components/ui/sonner';
import { Checkbox } from '@/components/ui/checkbox';
const oemRequestSchema = z.object({
  unternehmen: z.string().min(2, { message: "Unternehmensname ist erforderlich." }),
  ansprechpartner: z.string().min(2, { message: "Ansprechpartner ist erforderlich." }),
  email: z.string().email({ message: "Gültige E-Mail-Adresse ist erforderlich." }),
  telefon: z.string().optional(),
  betreff: z.string().min(5, { message: "Betreff ist erforderlich." }),
  beschreibung: z.string().min(20, { message: "Beschreibung muss mindestens 20 Zeichen lang sein." }),
  kategorie: z.enum(['Software', 'Hardware', 'Systemintegration', 'KI/Data', 'Beratung']).optional(),
  datenschutz: z.boolean().refine(val => val === true, { message: "Sie müssen den Datenschutzhinweisen zustimmen." }),
});
export function OemCreatePage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof oemRequestSchema>>({
    resolver: zodResolver(oemRequestSchema),
    defaultValues: {
      unternehmen: '',
      ansprechpartner: '',
      email: '',
      telefon: '',
      betreff: '',
      beschreibung: '',
      datenschutz: false,
    },
  });
  function onSubmit(values: z.infer<typeof oemRequestSchema>) {
    console.log(values);
    toast.success('Bedarf erfolgreich übermittelt!');
    setTimeout(() => navigate('/oem/dashboard'), 1500);
  }
  return (
    <PageContainer>
      <Toaster richColors />
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Neuen Bedarf eintragen</CardTitle>
          <CardDescription>Füllen Sie das Formular aus, um einen neuen Bedarf zu melden.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="unternehmen" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unternehmen / OEM-Name</FormLabel>
                    <FormControl><Input placeholder="z.B. DefTech GmbH" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="ansprechpartner" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ansprechpartner</FormLabel>
                    <FormControl><Input placeholder="Max Mustermann" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kontakt-E-Mail</FormLabel>
                    <FormControl><Input type="email" placeholder="max.mustermann@deftech.de" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="telefon" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefonnummer (Optional)</FormLabel>
                    <FormControl><Input placeholder="+49 123 456789" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="betreff" render={({ field }) => (
                <FormItem>
                  <FormLabel>Betreff / Kurzbeschreibung</FormLabel>
                  <FormControl><Input placeholder="Spezialist für Embedded Systems gesucht" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="beschreibung" render={({ field }) => (
                <FormItem>
                  <FormLabel>Detaillierte Bedarfsbeschreibung</FormLabel>
                  <FormControl><Textarea placeholder="Beschreiben Sie hier detailliert Ihren Bedarf..." rows={6} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="kategorie" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorie (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Wählen Sie eine Kategorie" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Hardware">Hardware</SelectItem>
                      <SelectItem value="Systemintegration">Systemintegration</SelectItem>
                      <SelectItem value="KI/Data">KI/Data</SelectItem>
                      <SelectItem value="Beratung">Beratung</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Button type="submit">Bedarf absenden</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}