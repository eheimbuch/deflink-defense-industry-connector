import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, LogIn } from 'lucide-react';
import { Toaster, toast } from 'sonner';
export function OemLoginPage() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (password: string) => api('/api/auth/oem-login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
    onSuccess: () => {
      toast.success('Login erfolgreich!');
      navigate('/oem/dashboard');
    },
    onError: () => {
      toast.error('Falsches Passwort. Bitte versuchen Sie es erneut.');
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      mutation.mutate(password);
    }
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Toaster richColors />
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">OEM-Bereich Login</CardTitle>
          <CardDescription>Bitte geben Sie das Passwort ein, um fortzufahren.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Anmelden...' : <> <LogIn className="mr-2 h-4 w-4" /> Anmelden </>}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}