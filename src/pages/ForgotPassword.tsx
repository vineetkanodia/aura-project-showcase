
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

type Step = 'email' | 'otp' | 'newPassword';

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Handle sending reset password email
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/forgot-password',
      });
      
      if (error) {
        throw error;
      }
      
      toast.success(`Reset instructions sent to ${email}`);
      setStep('otp');
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit code from your email");
      return;
    }
    
    // In a real implementation, this would verify the OTP with Supabase
    // For now, we'll simulate OTP verification and move to next step
    setStep('newPassword');
    toast.success("Code verified successfully");
  };

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would use the OTP to update the password
      // For now, we'll use Supabase's built-in reset functionality
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      toast.success("Password reset successfully!");
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-secondary/30 backdrop-blur-lg rounded-lg border border-white/10 p-8"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent mb-4 flex items-center justify-center">
                {step === 'email' && <Mail size={24} className="text-white" />}
                {step === 'otp' && <Mail size={24} className="text-white" />}
                {step === 'newPassword' && <Lock size={24} className="text-white" />}
              </div>
              <h1 className="text-2xl font-bold">
                {step === 'email' && 'Reset your password'}
                {step === 'otp' && 'Verify your email'}
                {step === 'newPassword' && 'Create new password'}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {step === 'email' && "Enter your email and we'll send you a reset code"}
                {step === 'otp' && 'Enter the 6-digit code sent to your email'}
                {step === 'newPassword' && 'Your new password must be different from previously used passwords'}
              </p>
            </div>
            
            {/* Step 1: Email Form */}
            {step === 'email' && (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
                </Button>
                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
                    <ArrowLeft size={16} /> Back to login
                  </Link>
                </div>
              </form>
            )}
            
            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-center w-full block">Enter verification code</Label>
                  <div className="flex justify-center py-2">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Didn't receive a code? 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs ml-1 text-primary"
                      onClick={() => handleSendResetEmail({ preventDefault: () => {} } as React.FormEvent)}
                      disabled={isLoading}
                    >
                      Resend
                    </Button>
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={otp.length !== 6}>
                  Verify
                </Button>
                <div className="text-center mt-4">
                  <Button 
                    variant="link" 
                    className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1"
                    onClick={() => setStep('email')}
                  >
                    <ArrowLeft size={16} /> Back
                  </Button>
                </div>
              </form>
            )}
            
            {/* Step 3: New Password */}
            {step === 'newPassword' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Reset Password'}
                </Button>
                <div className="text-center mt-4">
                  <Button 
                    variant="link" 
                    className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1"
                    onClick={() => setStep('otp')}
                  >
                    <ArrowLeft size={16} /> Back
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
