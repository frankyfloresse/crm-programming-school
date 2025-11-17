import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../api/services/auth.service';

const activateAccountSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ActivateAccountFormData = z.infer<typeof activateAccountSchema>;

export default function ActivateAccountPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivateAccountFormData>({
    resolver: zodResolver(activateAccountSchema),
  });

  useEffect(() => {
    // Basic token validation check
    if (!token || token.length < 10) {
      setTokenValid(false);
    } else {
      setTokenValid(true);
    }
  }, [token]);

  const onSubmit = async (data: ActivateAccountFormData) => {
    if (!token || !tokenValid) {
      alert('Invalid activation token');
      return;
    }

    setIsLoading(true);
    try {
      await authService.activateAccount({
        token,
        password: data.password,
      });

      alert('Account activated successfully! You can now login.');
      navigate('/auth');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to activate account';
      alert(errorMessage);
      if (errorMessage.includes('Invalid or expired activation token')) {
        setTokenValid(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-base-200 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-error mb-2">Invalid Activation Link</h1>
            <p className="text-base-content/70 mb-6">
              This activation link is invalid or has expired. Please contact your administrator for a new activation link.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/auth')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-base-200 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Activate Your Account</h1>
          <p className="text-base-content/70">
            Set your password to activate your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.password.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.confirmPassword.message}</span>
              </label>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Activating...' : 'Activate Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-base-content/70">
            Already have an account?{' '}
            <button
              className="link link-primary"
              onClick={() => navigate('/auth')}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}