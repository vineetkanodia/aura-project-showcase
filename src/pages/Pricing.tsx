
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  is_popular: boolean;
}

const PricingCard = ({ 
  plan, 
  isLoading, 
  isLoggedIn 
}: { 
  plan: SubscriptionPlan, 
  isLoading: boolean,
  isLoggedIn: boolean
}) => {
  const navigate = useNavigate();
  
  const handleSubscribe = () => {
    if (!isLoggedIn) {
      toast.error('Please log in to subscribe to this plan');
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }
    navigate(`/subscription?plan=${plan.id}`);
  };
  
  return (
    <Card className={`flex flex-col overflow-hidden border ${
      plan.is_popular ? 'border-primary shadow-md shadow-primary/20' : 'border-white/10'
    }`}>
      {plan.is_popular && (
        <div className="bg-primary py-1 px-3 text-xs font-medium text-center text-primary-foreground">
          MOST POPULAR
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.interval}</span>
        </div>
        
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check size={18} className="text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSubscribe}
          className={`w-full ${plan.is_popular ? '' : 'bg-white/5 hover:bg-white/10 text-white'}`}
          variant={plan.is_popular ? 'default' : 'outline'}
        >
          Choose {plan.name}
        </Button>
      </CardFooter>
    </Card>
  );
};

const PricingCardSkeleton = () => {
  return (
    <Card className="flex flex-col overflow-hidden border border-white/10">
      <CardHeader>
        <Skeleton className="h-7 w-24 mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      
      <CardContent className="flex-1">
        <Skeleton className="h-10 w-28 mb-6" />
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data as SubscriptionPlan[];
    }
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Get access to premium projects and features with our subscription plans.
              Choose the option that works best for you.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {isLoading ? (
              <>
                <PricingCardSkeleton />
                <PricingCardSkeleton />
                <PricingCardSkeleton />
              </>
            ) : plans && plans.length > 0 ? (
              plans.map((plan) => (
                <PricingCard 
                  key={plan.id} 
                  plan={plan} 
                  isLoading={isLoading}
                  isLoggedIn={!!user}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Plans Available</h3>
                <p className="text-muted-foreground mb-6">
                  We're currently updating our subscription plans. Please check back soon.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-4">Have questions?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Contact our support team for more information about our subscription plans 
              or if you need help choosing the right option for you.
            </p>
            <Button variant="outline" onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
