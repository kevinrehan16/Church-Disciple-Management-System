import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, LockKeyhole, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useChangePassword } from '../../hooks/usePass';

// 1. Zod Schema kasama ang Email
const changePasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  currentPassword: z.string().min(1, "Current or temporary password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePassForm({ emailProp }: { emailProp?: string }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: changePasswordMutate } = useChangePassword();

  // 2. React Hook Form setup
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      email: emailProp || '', // Kung may emailProp, gamitin ito; kung wala, default sa empty string
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 3. Submit Handler
  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    try {
      console.log("Password change data:", data);
      alert("You can now re-login to your account.");

      changePasswordMutate(data);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Password change failed:", error);
      alert("Failed to change password. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Email Address */}
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <div className="relative group" style={{ '--active-parent': theme.activeParentBg } as React.CSSProperties}>
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-[var(--active-parent)] transition-colors" />
                <input 
                    type="email"
                    {...register('email')}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent)] focus:ring-4 focus:ring-[var(--active-parent)]/20"
                    placeholder="admin@church.com"
                    readOnly={!!emailProp}
                />
                </div>
                {errors.email && <p className="text-red-600 text-[11px] font-medium">{errors.email.message}</p>}
            </div>

            {/* Current / Temporary Password */}
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Temporary Password</label>
                <div className="relative group" style={{ '--active-parent': theme.activeParentBg } as React.CSSProperties}>
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-[var(--active-parent)] transition-colors" />
                <input 
                    type="password"
                    {...register('currentPassword')}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent)] focus:ring-4 focus:ring-[var(--active-parent)]/20"
                    placeholder="••••••••"
                />
                </div>
                {errors.currentPassword && <p className="text-red-600 text-[11px] font-medium">{errors.currentPassword.message}</p>}
            </div>

            {/* New Password */}
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">New Password</label>
                <div className="relative group" style={{ '--active-parent': theme.activeParentBg } as React.CSSProperties}>
                <LockKeyhole className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-[var(--active-parent)] transition-colors" />
                <input 
                    type="password" 
                    {...register('newPassword')}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent)] focus:ring-4 focus:ring-[var(--active-parent)]/20"
                    placeholder="••••••••"
                />
                </div>
                {errors.newPassword && <p className="text-red-600 text-[11px] font-medium">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
                <div className="relative group" style={{ '--active-parent': theme.activeParentBg } as React.CSSProperties}>
                <LockKeyhole className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-[var(--active-parent)] transition-colors" />
                <input 
                    type="password" 
                    {...register('confirmPassword')}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 focus:border-[var(--active-parent)] focus:ring-4 focus:ring-[var(--active-parent)]/20"
                    placeholder="••••••••"
                />
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-[11px] font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <button 
                disabled={isLoading}
                type="submit" 
                className="w-full mt-2 flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: theme.activeParentBg, boxShadow: `0 10px 15px -3px ${theme.activeParentBg}40` }}
            >
                {isLoading ? "Updating Password..." : "Update Password"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
        </form>
    </>
  );
}