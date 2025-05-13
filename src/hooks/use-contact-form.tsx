
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (formData: ContactFormData) => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert message into contact_messages table
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Your message has been sent! We\'ll get back to you soon.');
      return true;
      
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast.error('Failed to send message. Please try again later.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    handleSubmit,
  };
};
