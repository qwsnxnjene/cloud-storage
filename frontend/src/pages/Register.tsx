import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '@/components/register-form';
import { Cloud } from 'lucide-react';

const Register: FC = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden overflow-hidden rounded-tr-xl rounded-br-xl lg:block">
        <img
          src="/register.png"
          className="absolute inset-0 h-full w-full object-cover"
          alt="auth"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Cloud className="size-5" />
            </div>
            <p className="text-accent-foreground font-bold">PetMarket</p>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
