'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginSchema } from '@/zod/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const { login } = useAuth();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onLogin = async (params: any, toastId: string | number) => {
    setLoading(true);

    try {
      await login(params);
      navigate('/dashboard');
    } catch (err: any) {
      const error = err.response?.data;

      toast.error(err.response?.data ?? 'Произошла ошибка при авторизации', {
        id: toastId,
      });

      if (error) {
        form.control.setError('password', {});
        form.control.setError('username', { message: error });
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const id = toast.loading('Подождите...', {
      dismissible: false,
      duration: 6000,
    });
    setLoading(true);
    await onLogin(data, id);
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Вход</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Заполните необходимые данные для входа в аккаунт
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя пользователя</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    id="username"
                    type="username"
                    placeholder="Введите имя пользовтеля"
                    {...field}
                  />
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
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    id="password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={loading}
            type="submit"
            className="w-full cursor-pointer"
            onClick={form.handleSubmit(onSubmit)}
          >
            Вход
          </Button>
        </div>
        <div className="text-center text-sm">
          Пока нет аккаунта?
          <Link to="/register" className="ml-1 underline underline-offset-4">
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </Form>
  );
};
