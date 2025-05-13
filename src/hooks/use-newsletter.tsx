
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

      if (checkError) {
        console.error('Error checking subscriber:', checkError);
        throw new Error('Error checking if email already exists');
      }

      if (existingSubscribers && existingSubscribers.length > 0) {
        toast.info('This email is already subscribed to our newsletter');
        setIsSubmitting(false);
        return;
      }

      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('subscribers')
        .insert({ email });

      if (insertError) {
        console.error('Error inserting subscriber:', insertError);
        throw new Error('Error subscribing to newsletter');
      }

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
