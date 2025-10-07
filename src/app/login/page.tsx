
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { Bot, Home } from 'lucide-react';
import Link from 'next/link';

const translations = {
    en: {
      title: 'Login or Sign Up',
      description: 'Access your account or create a new one to continue.',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      namePlaceholder: 'John Doe',
      loginButton: 'Login',
      signupButton: 'Sign Up',
      toggleToSignup: "Don't have an account? Sign Up",
      toggleToLogin: 'Already have an account? Login',
      signupSuccess: 'Account created successfully!',
      loginSuccess: 'Logged in successfully!',
      welcomeBack: 'Welcome back!',
      genericError: 'An error occurred. Please try again.',
      goHome: 'Back to Store',
    },
    es: {
      title: 'Iniciar Sesión o Registrarse',
      description: 'Accede a tu cuenta o crea una nueva para continuar.',
      emailLabel: 'Correo Electrónico',
      passwordLabel: 'Contraseña',
      nameLabel: 'Nombre Completo',
      namePlaceholder: 'Juan Pérez',
      loginButton: 'Iniciar Sesión',
      signupButton: 'Registrarse',
      toggleToSignup: '¿No tienes una cuenta? Regístrate',
      toggleToLogin: '¿Ya tienes una cuenta? Inicia Sesión',
      signupSuccess: '¡Cuenta creada exitosamente!',
      loginSuccess: '¡Inicio de sesión exitoso!',
      welcomeBack: '¡Bienvenido de nuevo!',
      genericError: 'Ocurrió un error. Por favor, inténtalo de nuevo.',
      goHome: 'Volver a la Tienda',
    },
};

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'es' ? 'es' : 'en';
  const t = translations[lang];

  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const auth = getAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let user: User;
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        user = userCredential.user;
        toast({ title: t.loginSuccess, description: t.welcomeBack });
      } else {
        if (!values.name) {
          form.setError('name', { message: 'Name is required for sign up.' });
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        await updateProfile(userCredential.user, { displayName: values.name });
        user = userCredential.user;
        toast({ title: t.signupSuccess });
      }
      router.push(`/?lang=${lang}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || t.genericError,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
       <div className="absolute top-4 left-4">
         <Link href={`/?lang=${lang}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
            <Home className="h-4 w-4" />
            {t.goHome}
        </Link>
      </div>
      <div className="inline-flex items-center gap-4 mb-4">
        <Bot className="h-10 w-10 text-primary" />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.nameLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.namePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.emailLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.passwordLabel}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {isLogin ? t.loginButton : t.signupButton}
              </Button>
            </form>
          </Form>
          <Button
            variant="link"
            className="w-full mt-4"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? t.toggleToSignup : t.toggleToLogin}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
