
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useNewsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Email validation function
  const isValidEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if email already exists
      const { data: existingSubscribers, error: checkError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', email)
        .limit(1);

      if (checkError) throw checkError;

      if (existingSubscribers && existingSubscribers.length > 0) {
        toast.info('This email is already subscribed to our newsletter');
        setIsSubmitting(false);
        return;
      }

      // Insert new subscriber
      const { error } = await supabase
        .from('subscribers')
        .insert({ email });

      if (error) throw error;

      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    email,
    setEmail,
    isSubmitting,
    handleSubscribe
  };
};
