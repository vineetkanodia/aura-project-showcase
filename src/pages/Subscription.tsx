
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';

const subscriptionPlans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Access to free projects',
      'Basic templates',
      'Community support',
      'Limited downloads per month'
    ],
    buttonText: 'Current Plan',
    popular: false,
    icon: Zap
  },
  {
    name: 'Pro',
    price: 19,
    description: 'For serious developers',
    features: [
      'All free features',
      'Access to premium projects',
      'Priority support',
      'Unlimited downloads',
      'Early access to new projects',
      'Source code with comments'
    ],
    buttonText: 'Upgrade to Pro',
    popular: true,
    icon: Crown
  },
  {
    name: 'Enterprise',
    price: 49,
    description: 'For teams and organizations',
    features: [
      'All Pro features',
      'Team collaboration tools',
      'Custom project requests',
      'White-label solutions',
      'Direct developer support',
      'Commercial usage rights'
    ],
    buttonText: 'Contact Sales',
    popular: false,
    icon: Star
  }
];

const Subscription = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '60px 60px' }}></div>
          </div>
          
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/5 blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
              <p className="text-muted-foreground text-lg">
                Unlock premium projects and advanced features with our flexible subscription plans.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {subscriptionPlans.map((plan, index) => {
                const IconComponent = plan.icon;
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative"
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                        Most Popular
                      </Badge>
                    )}
                    <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : ''} hover-scale`}>
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-4">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant={plan.popular ? "default" : "outline"}
                          disabled={plan.name === 'Free'}
                        >
                          {plan.buttonText}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-24 max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-card">
                  <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                  <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
                </div>
                <div className="p-6 rounded-lg bg-card">
                  <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                  <p className="text-muted-foreground">We offer a 30-day money-back guarantee. If you're not satisfied within the first 30 days, we'll provide a full refund.</p>
                </div>
                <div className="p-6 rounded-lg bg-card">
                  <h3 className="font-semibold mb-2">What's included in premium projects?</h3>
                  <p className="text-muted-foreground">Premium projects include complete source code, detailed documentation, deployment guides, and priority support from our development team.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Subscription;
