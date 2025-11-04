'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RegisterSchema } from '@/zod/auth-schema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

export const RegisterForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const { register } = useAuth();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onRegister = async (params: any, toastId: string | number) => {
    setLoading(true);

    try {
      await register(params);
      navigate('/dashboard');
    } catch (err: any) {
      const error = err.response?.data;

      toast.error(err.response?.data ?? 'Произошла ошибка при регистрации', {
        id: toastId,
      });

      if (error) {
        form.control.setError('password', {});
        form.control.setError('email', {});
        form.control.setError('username', { message: error });
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    const id = toast.loading('Подождите...', {
      dismissible: false,
      duration: 6000,
    });
    setLoading(true);
    await onRegister(data, id);
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Регистрация</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Заполните необходимые данные для создания аккаунта
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
                    type="text"
                    placeholder="Введите имя пользователя"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Почта</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
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
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
          >
            Регистрация
          </Button>
        </div>
        <div className="text-center text-sm">
          Уже есть аккаунт?
          <Link to="/login" className="ml-1 underline underline-offset-4">
            Войти
          </Link>
        </div>
      </form>
    </Form>
  );
};
