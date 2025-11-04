import type { FC } from 'react';
import { Cloud } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import { Link } from 'react-router-dom';

const Login: FC = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Cloud className="size-5" />
            </div>
            <p className="text-accent-foreground font-bold">useCloud</p>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden overflow-hidden rounded-tl-xl rounded-bl-xl lg:block">
        <img
          src="/login.png"
          className="absolute inset-0 h-full w-full object-cover"
          alt="auth-cat"
        />
      </div>
    </div>
  );
};

export default Login;
