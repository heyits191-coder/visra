
import React, { useState } from 'react';
import { Apple, Chrome, Square, ChevronLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

type AuthView = 'LOGIN' | 'SIGNUP' | 'FORGOT_INIT' | 'OTP_VERIFY' | 'RESET_PASSWORD';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotFlow, setIsForgotFlow] = useState(false);

  const handleAction = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mock API Interaction
    setTimeout(() => {
      setIsLoading(false);
      
      switch (view) {
        case 'LOGIN':
          if (email && password) {
            onLogin();
          } else {
            setError('Please provide valid credentials.');
          }
          break;
          
        case 'SIGNUP':
          setIsForgotFlow(false);
          setView('OTP_VERIFY');
          break;
          
        case 'FORGOT_INIT':
          if (email) {
            setIsForgotFlow(true);
            setView('OTP_VERIFY');
          } else {
            setError('Enter your email or phone to receive a code.');
          }
          break;
          
        case 'OTP_VERIFY':
          if (otp === '1234') {
            if (isForgotFlow) {
              setView('RESET_PASSWORD');
            } else {
              onLogin();
            }
          } else {
            setError('Incorrect code. Hint: 1234');
            setOtp('');
          }
          break;
          
        case 'RESET_PASSWORD':
          if (newPassword && newPassword === confirmPassword) {
            setView('LOGIN');
            setEmail('');
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');
          } else {
            setError('Passwords do not match.');
          }
          break;
      }
    }, 1200);
  };

  const renderSocials = () => (
    <div className="w-full animate-in fade-in duration-700 delay-150">
      <div className="my-8 flex w-full items-center gap-4">
        <div className="h-[1px] flex-1 bg-zinc-100"></div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">OR</span>
        <div className="h-[1px] flex-1 bg-zinc-100"></div>
      </div>

      <div className="w-full space-y-3">
        <button 
          type="button"
          onClick={() => onLogin()}
          className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[14px] font-medium text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98] h-12 shadow-sm"
        >
          <Chrome size={18} className="text-[#4285F4]" />
          <span className="flex-1 text-center pr-5">Continue with Google</span>
        </button>
        
        <button 
          type="button"
          onClick={() => onLogin()}
          className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[14px] font-medium text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98] h-12 shadow-sm"
        >
          <Square size={18} className="text-[#00A4EF] fill-[#00A4EF]" />
          <span className="flex-1 text-center pr-5">Continue with Microsoft</span>
        </button>

        <button 
          type="button"
          onClick={() => onLogin()}
          className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[14px] font-medium text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98] h-12 shadow-sm"
        >
          <Apple size={18} className="text-zinc-900 fill-zinc-900" />
          <span className="flex-1 text-center pr-5">Continue with Apple</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white text-zinc-900 font-sans antialiased py-12 px-6 overflow-y-auto">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        
        {/* Visra Logo */}
        <div className="mb-12 flex h-16 w-16 items-center justify-center rounded-[20px] bg-zinc-900 text-white font-black text-3xl shadow-2xl ring-1 ring-zinc-800 transition-transform hover:scale-105 duration-300 shrink-0">
          V
        </div>

        {/* Dynamic Header */}
        <div className="text-center mb-10 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {view === 'LOGIN' && "Welcome back"}
            {view === 'SIGNUP' && "Create your account"}
            {view === 'FORGOT_INIT' && "Reset password"}
            {view === 'OTP_VERIFY' && "Verify your device"}
            {view === 'RESET_PASSWORD' && "New password"}
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            {view === 'OTP_VERIFY' 
              ? `Verification code sent to ${email || 'your device'}` 
              : "Design intelligence at your fingertips."}
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="w-full mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center gap-3 border border-red-100 animate-in shake duration-300">
            <ShieldCheck size={16} /> {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleAction} className="w-full space-y-4">
          {(view === 'LOGIN' || view === 'SIGNUP' || view === 'FORGOT_INIT') && (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or phone number"
                className="w-full rounded-xl border border-zinc-200 bg-white px-5 py-3 text-base focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 h-12"
                required
              />

              {(view === 'LOGIN' || view === 'SIGNUP') && (
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={view === 'LOGIN' ? "Password" : "Create password"}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-5 py-3 text-base focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 h-12"
                    required
                  />
                  {view === 'LOGIN' && (
                    <button 
                      type="button"
                      onClick={() => { setView('FORGOT_INIT'); setError(null); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#10a37f] hover:underline uppercase tracking-wider"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {view === 'OTP_VERIFY' && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full text-center text-3xl font-black tracking-[0.6em] rounded-xl border border-zinc-200 bg-white px-4 py-4 focus:border-zinc-900 focus:outline-none transition-all h-20 placeholder:text-zinc-200"
                required
              />
              <div className="text-center">
                <button 
                  type="button"
                  className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-[0.2em]"
                >
                  Resend code
                </button>
              </div>
            </div>
          )}

          {view === 'RESET_PASSWORD' && (
            <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full rounded-xl border border-zinc-200 bg-white px-5 py-3 text-base focus:border-zinc-900 focus:outline-none transition-all h-12"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-zinc-200 bg-white px-5 py-3 text-base focus:border-zinc-900 focus:outline-none transition-all h-12"
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:bg-zinc-100 disabled:text-zinc-300 disabled:cursor-not-allowed h-12 flex items-center justify-center gap-2 mt-4 shadow-xl shadow-zinc-200"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <>
                {view === 'LOGIN' && 'Log in'}
                {view === 'SIGNUP' && 'Sign up'}
                {view === 'FORGOT_INIT' && 'Send Code'}
                {view === 'OTP_VERIFY' && 'Verify Code'}
                {view === 'RESET_PASSWORD' && 'Update Password'}
                {!isLoading && <ArrowRight size={16} />}
              </>
            )}
          </button>
        </form>

        {/* Switch Links */}
        <div className="w-full mt-8 text-center space-y-6">
          {view === 'LOGIN' && (
            <p className="text-sm font-medium text-zinc-500">
              Don't have an account? <button onClick={() => { setView('SIGNUP'); setError(null); }} className="text-[#10a37f] font-semibold hover:underline">Sign up</button>
            </p>
          )}
          {view === 'SIGNUP' && (
            <p className="text-sm font-medium text-zinc-500">
              Already have an account? <button onClick={() => { setView('LOGIN'); setError(null); }} className="text-[#10a37f] font-semibold hover:underline">Log in</button>
            </p>
          )}
          {(view === 'FORGOT_INIT' || view === 'OTP_VERIFY' || view === 'RESET_PASSWORD') && (
            <button 
              onClick={() => { setView('LOGIN'); setError(null); setIsForgotFlow(false); }}
              className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors mx-auto uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Back to login
            </button>
          )}
        </div>

        {/* Social Buttons List (Visible only on Login/Signup) */}
        {(view === 'LOGIN' || view === 'SIGNUP') && renderSocials()}
      </div>

      {/* Simplified Footer */}
      <footer className="mt-auto pt-16 w-full flex flex-col items-center gap-4 shrink-0">
        <div className="flex items-center justify-center gap-8 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
          <span className="hover:text-zinc-600 cursor-pointer transition-colors">Terms</span>
          <span className="h-1 w-1 rounded-full bg-zinc-200"></span>
          <span className="hover:text-zinc-600 cursor-pointer transition-colors">Privacy</span>
        </div>
        <div className="text-[10px] font-black text-zinc-100 tracking-[0.4em] uppercase select-none pointer-events-none">
          VISRA STUDIO
        </div>
      </footer>
    </div>
  );
};
