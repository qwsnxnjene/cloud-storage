import { type FC, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Cloud, Moon, Sun, LogOut, User, Mail, Calendar, Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Dashboard: FC = () => {
  const { user, logout, updateTheme } = useAuth();
  const navigate = useNavigate();

  // Sync theme class with user's theme preference
  useEffect(() => {
    if (user) {
      if (user.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [user?.theme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleThemeToggle = async () => {
    if (user) {
      const newTheme = user.theme === 'light' ? 'dark' : 'light';
      try {
        await updateTheme(newTheme);
      } catch (error) {
        console.error('Failed to update theme:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  // Get user initials for avatar
  const userInitials = user.username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Cloud className="size-5" />
            </div>
            <span className="text-foreground font-bold">useCloud</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleThemeToggle}
                aria-label="Toggle theme"
              >
                {user.theme === 'light' ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className="size-4" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 md:px-6 md:py-10">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">
                      Добро пожаловать, {user.username}!
                    </CardTitle>
                    <CardDescription>
                      Управляйте вашими файлами и настройками
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {user.theme === 'light' ? 'Светлая тема' : 'Тёмная тема'}
                  </Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
                      <Mail className="text-muted-foreground size-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm font-medium">
                        Электронная почта
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
                      <User className="text-muted-foreground size-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm font-medium">
                        ID пользователя
                      </p>
                      <p className="text-foreground font-mono text-sm font-semibold">
                        {user.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
                      <Calendar className="text-muted-foreground size-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm font-medium">
                        Дата регистрации
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Files Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Files className="size-5" />
                  <CardTitle>Мои файлы</CardTitle>
                </div>
                <CardDescription>
                  Управление и хранение ваших файлов
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                  <Files className="mb-4 size-12 opacity-20" />
                  <p className="text-sm">
                    Функции управления файлами будут доступны позже...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  );
};

export default Dashboard;
