import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { useToast } from '../../components/common/Toast';

export const ForgotPasswordPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('aditya@demo.health');
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState('4821');
  const [newPassword, setNewPassword] = useState('demo123');
  const [resetDone, setResetDone] = useState(false);
  const { showToast } = useToast();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast('Verification OTP sent to registered mobile/email (Demo OTP: 4821)', 'info');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetDone(true);
    showToast('Password updated successfully. You can now login.', 'success');
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Account Recovery & Reset
          </h1>
          <p className="text-xs text-muted-foreground">
            Recover access using your registered health identifier or mobile OTP
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{resetDone ? 'Password Reset Complete' : sent ? 'Verify Security OTP' : 'Forgot Password'}</CardTitle>
            <CardDescription>
              {resetDone
                ? 'Your password has been changed.'
                : sent
                ? 'Enter the 4-digit code sent to your terminal'
                : 'Enter your email or phone to receive a verification code'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetDone ? (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="h-10 w-10 text-success mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Your credentials have been securely updated in local demonstration memory.
                </p>
                <Link to="/login">
                  <Button variant="primary" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            ) : !sent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Send Verification Code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Security Code (Demo: 4821)
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-surface border border-input rounded-md text-foreground font-mono text-center tracking-widest text-sm focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full">
                  Update Password
                </Button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-border text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
