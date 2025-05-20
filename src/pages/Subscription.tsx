
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const planId = searchParams.get('plan');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  
  useEffect(() => {
    if (!user) {
      toast.error('Please log in to manage subscriptions');
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }
    
    window.scrollTo(0, 0);
  }, [user, navigate]);
  
  const { data: plan, isLoading: isPlanLoading } = useQuery({
    queryKey: ['subscriptionPlan', planId],
    queryFn: async () => {
      if (!planId) return null;
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      if (error) throw error;
      return data as SubscriptionPlan;
    },
    enabled: !!planId
  });
  
  const { data: currentSubscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ['userSubscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans:plan_id(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card expiry (MM/YY)
    if (name === 'expiry') {
      const expiry = value.replace(/[^0-9]/g, '').slice(0, 4);
      
      if (expiry.length > 2) {
        setCardDetails(prev => ({
          ...prev,
          [name]: `${expiry.slice(0, 2)}/${expiry.slice(2)}`
        }));
      } else {
        setCardDetails(prev => ({ ...prev, [name]: expiry }));
      }
    } 
    // Format card number with spaces
    else if (name === 'number') {
      const cardNumber = value.replace(/[^0-9]/g, '').slice(0, 16);
      const formatted = cardNumber.replace(/(.{4})/g, '$1 ').trim();
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
    } 
    // CVC (3 or 4 digits)
    else if (name === 'cvc') {
      const cvc = value.replace(/[^0-9]/g, '').slice(0, 4);
      setCardDetails(prev => ({ ...prev, [name]: cvc }));
    } 
    // Card holder name
    else {
      setCardDetails(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }
    
    if (!plan) {
      toast.error('Please select a subscription plan');
      return;
    }
    
    // Validate card details (basic validation)
    if (cardDetails.number.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid card number');
      return;
    }
    
    if (!cardDetails.name) {
      toast.error('Please enter the cardholder name');
      return;
    }
    
    if (cardDetails.expiry.length !== 5) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (cardDetails.cvc.length < 3) {
      toast.error('Please enter a valid CVC');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would process payment via Stripe or similar
      
      // For demo purposes, simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get one month from now for period end
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      
      // Cancel any existing subscription
      if (currentSubscription) {
        await supabase
          .from('user_subscriptions')
          .update({ status: 'canceled' })
          .eq('id', currentSubscription.id);
      }
      
      // Create new subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          status: 'active',
          current_period_end: periodEnd.toISOString()
        });
      
      if (error) throw error;
      
      toast.success(`Successfully subscribed to ${plan.name} plan!`);
      navigate('/profile');
      
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const cancelSubscription = async () => {
    if (!currentSubscription) return;
    
    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'canceled' })
        .eq('id', currentSubscription.id);
      
      if (error) throw error;
      
      toast.success('Subscription canceled successfully');
      navigate('/profile');
      
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Subscription</h1>
              <p className="text-muted-foreground">
                Subscribe to a plan or manage your existing subscription
              </p>
            </motion.div>
            
            <Tabs defaultValue={currentSubscription ? "current" : "subscribe"}>
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
                <TabsTrigger value="current">Current Plan</TabsTrigger>
              </TabsList>
              
              {/* Subscribe tab */}
              <TabsContent value="subscribe" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Plan details */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Subscription Plan</h2>
                    
                    {isPlanLoading ? (
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-7 w-28 mb-2" />
                          <Skeleton className="h-5 w-full" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-8 w-32 mb-4" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                          </div>
                        </CardContent>
                      </Card>
                    ) : plan ? (
                      <Card className={`border ${plan.is_popular ? "border-primary" : "border-white/10"}`}>
                        <CardHeader>
                          <CardTitle>{plan.name}</CardTitle>
                          <p className="text-muted-foreground">{plan.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-6">
                            <span className="text-3xl font-bold">${plan.price}</span>
                            <span className="text-muted-foreground">/{plan.interval}</span>
                          </div>
                          
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check size={18} className="text-primary mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center py-6">
                            <p className="mb-4">No plan selected</p>
                            <Button onClick={() => navigate('/pricing')}>
                              Choose a plan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  {/* Payment form */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="number">Card Number</Label>
                            <Input 
                              id="number"
                              name="number"
                              placeholder="1234 5678 9012 3456"
                              value={cardDetails.number}
                              onChange={handleInputChange}
                              className="bg-background"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="name">Cardholder Name</Label>
                            <Input 
                              id="name"
                              name="name"
                              placeholder="John Smith"
                              value={cardDetails.name}
                              onChange={handleInputChange}
                              className="bg-background"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input 
                                id="expiry"
                                name="expiry"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={handleInputChange}
                                className="bg-background"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="cvc">CVC</Label>
                              <Input 
                                id="cvc"
                                name="cvc"
                                placeholder="123"
                                value={cardDetails.cvc}
                                onChange={handleInputChange}
                                className="bg-background"
                                required
                              />
                            </div>
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full mt-6"
                            disabled={!plan || isProcessing}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            {isProcessing ? 'Processing...' : `Subscribe (${plan ? `$${plan.price}/${plan.interval}` : '$0'})` }
                          </Button>
                          
                          <p className="text-xs text-center text-muted-foreground mt-4">
                            This is a demo application. No actual payment will be processed.
                          </p>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Current subscription tab */}
              <TabsContent value="current">
                {isSubscriptionLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-60" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-10 w-40 mt-6" />
                  </div>
                ) : currentSubscription ? (
                  <div>
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Current Subscription</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold">Plan</h3>
                            <p className="text-xl">{currentSubscription.subscription_plans.name}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold">Price</h3>
                            <p className="text-xl">${currentSubscription.subscription_plans.price}/{currentSubscription.subscription_plans.interval}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold">Status</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="h-3 w-3 rounded-full bg-green-500"></div>
                              <p>Active</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold">Next Billing Date</h3>
                            <p>{new Date(currentSubscription.current_period_end).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-white/10">
                          <Button 
                            variant="destructive" 
                            onClick={cancelSubscription}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Cancel Subscription'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="text-center">
                      <Button variant="outline" onClick={() => navigate('/pricing')}>
                        View Other Plans
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-4">No Active Subscription</h3>
                    <p className="text-muted-foreground mb-8">
                      You don't have any active subscription plans.
                      Subscribe now to access premium content and features.
                    </p>
                    <Button onClick={() => navigate('/pricing')}>
                      View Plans
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
