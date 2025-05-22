import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import AIContentGenerator from '@/components/AIContentGenerator';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  profile: {
    username: string;
    avatar_url: string | null;
  };
  subscription?: {
    id: string;
    plan: {
      id: string;
      name: string;
    };
    status: string;
  };
  role?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  is_popular: boolean;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  // State for website settings
  const [settings, setSettings] = useState({
    siteName: 'Portfolio.',
    siteDescription: 'A professional portfolio website to showcase your work',
    contactEmail: 'contact@example.com',
    footerText: '© 2023 Portfolio. All rights reserved.'
  });

  // State for adding/editing plan
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  
  // Check if user is admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      // Direct check from the database for admin status
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user
  });

  // Fetch users data
  const { data: users, isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profileError) throw profileError;
      
      // Get user subscriptions
      const { data: subscriptions, error: subError } = await supabase
        .from('user_subscriptions')
        .select('id, user_id, status, subscription_plans:plan_id(id, name)')
        .eq('status', 'active');
      
      if (subError) throw subError;
      
      // Get user roles
      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (roleError) throw roleError;
      
      // Map profiles to users with subscriptions and roles
      const usersData = profiles.map(profile => {
        const userSubscription = subscriptions?.find(sub => sub.user_id === profile.id);
        const userRole = roles?.find(role => role.user_id === profile.id);
        
        return {
          id: profile.id,
          email: `user-${profile.id.substring(0, 5)}@example.com`, // Demo placeholder
          created_at: profile.created_at,
          last_sign_in_at: 'Not available in demo',
          profile: {
            username: profile.username || 'Not set',
            avatar_url: profile.avatar_url
          },
          subscription: userSubscription ? {
            id: userSubscription.id,
            plan: userSubscription.subscription_plans,
            status: userSubscription.status
          } : undefined,
          role: userRole?.role
        };
      });
      
      return usersData as User[];
    },
    enabled: !!isAdmin
  });

  // Fetch subscription plans
  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['adminPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*');
      
      if (error) throw error;
      return data as Plan[];
    },
    enabled: !!isAdmin
  });

  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin && user) {
      // If user is logged in but not admin, redirect to home
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    } else if (!user) {
      // If not logged in, redirect to login
      toast.error('Please log in to access this page');
      navigate('/login');
    }
  }, [isAdmin, isCheckingAdmin, user, navigate]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin?tab=${value}`);
  };

  // Save website settings (demo function)
  const saveSettings = () => {
    toast.success('Website settings saved successfully!');
  };

  // Update user role
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Check if user has a role
      const { data, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (data) {
        // Update existing role
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);
        
        if (updateError) throw updateError;
      } else {
        // Insert new role
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });
        
        if (insertError) throw insertError;
      }
      
      toast.success('User role updated successfully');
      refetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  // Delete user (demo function)
  const deleteUser = async (userId: string) => {
    try {
      // In a real app, this would delete the user from auth as well
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success('User deleted successfully');
      refetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // Save or update plan
  const savePlan = async (plan: Plan) => {
    try {
      if (plan.id) {
        // Update existing plan
        const { error } = await supabase
          .from('subscription_plans')
          .update({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            interval: plan.interval,
            features: plan.features,
            is_popular: plan.is_popular
          })
          .eq('id', plan.id);
        
        if (error) throw error;
        
        toast.success('Plan updated successfully');
      } else {
        // Create new plan
        const { error } = await supabase
          .from('subscription_plans')
          .insert({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            interval: plan.interval,
            features: plan.features,
            is_popular: plan.is_popular
          });
        
        if (error) throw error;
        
        toast.success('Plan created successfully');
      }
      
      setEditPlan(null);
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save plan');
    }
  };

  // Delete plan
  const deletePlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', planId);
      
      if (error) throw error;
      
      toast.success('Plan deleted successfully');
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will be redirected by useEffect
  }

  // The TabsContent for AI Tools tab can be improved with our enhanced AIContentGenerator
  const renderAIToolsTab = () => (
    <TabsContent value="ai">
      <Card>
        <CardHeader>
          <CardTitle>AI Content Generator</CardTitle>
          <CardDescription>
            Use Gemini AI to generate content for your projects and website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIContentGenerator 
            onContentGenerated={(content) => {
              localStorage.setItem('adminGeneratedContent', content);
              toast.success('Content generated! You can now use it in your projects.');
            }}
            defaultPrompt="Generate a professional description for a portfolio project about a responsive web application"
            label="Project Content Generator"
          />
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">AI Content Ideas</h3>
            <div className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => {
                  const textareas = document.querySelectorAll('textarea');
                  if (textareas.length > 0) {
                    textareas[0].value = "Write a professional about me section for a portfolio website of a web developer";
                  }
                }}
              >
                Generate About Me Section
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => {
                  const textareas = document.querySelectorAll('textarea');
                  if (textareas.length > 0) {
                    textareas[0].value = "Generate 5 compelling features for a premium subscription plan for a portfolio website";
                  }
                }}
              >
                Generate Subscription Features
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => {
                  const textareas = document.querySelectorAll('textarea');
                  if (textareas.length > 0) {
                    textareas[0].value = "Write a professional email response to a client inquiry about website development services";
                  }
                }}
              >
                Generate Client Response Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your website, users, and subscription plans
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-5 w-full max-w-md">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="ai">AI Tools</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="space-y-0 pb-2">
                    <CardTitle className="text-lg">Total Users</CardTitle>
                    <CardDescription>Registered accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{users?.length || 0}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="space-y-0 pb-2">
                    <CardTitle className="text-lg">Active Subscriptions</CardTitle>
                    <CardDescription>Paying users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {users?.filter(user => user.subscription?.status === 'active').length || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="space-y-0 pb-2">
                    <CardTitle className="text-lg">Available Plans</CardTitle>
                    <CardDescription>Subscription options</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{plans?.length || 0}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                    <CardDescription>Latest registrations and subscriptions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingUsers ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="flex gap-4 items-center">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-2/3" />
                              <Skeleton className="h-4 w-1/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : users && users.length > 0 ? (
                      <div className="space-y-6">
                        {users.slice(0, 5).map(user => (
                          <div key={user.id} className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                              {user.profile.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{user.profile.username}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.subscription 
                                  ? `Subscribed to ${user.subscription.plan.name} plan` 
                                  : 'Free account'}
                              </div>
                              {user.role === 'admin' && (
                                <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary mt-1">
                                  Admin
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground py-4 text-center">No user activity yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      View, edit and manage user accounts
                    </CardDescription>
                  </div>
                  <Button onClick={() => refetchUsers()} variant="outline" size="sm">
                    Refresh Users
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : users && users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table className="min-w-[800px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map(user => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.profile.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <select 
                                  className="bg-background border border-white/10 rounded p-1"
                                  value={user.role || 'user'}
                                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </TableCell>
                              <TableCell>
                                {user.subscription 
                                  ? user.subscription.plan.name
                                  : <span className="text-muted-foreground">Free</span>
                                }
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteUser(user.id)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground py-4 text-center">No users found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Plans Tab */}
            <TabsContent value="plans">
              {editPlan ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{editPlan.id ? 'Edit' : 'Create'} Plan</CardTitle>
                    <CardDescription>
                      {editPlan.id ? 'Update' : 'Add'} subscription plan details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="name">Plan Name</Label>
                        <Input 
                          id="name"
                          value={editPlan.name}
                          onChange={(e) => setEditPlan({...editPlan, name: e.target.value})}
                          className="bg-background"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description"
                          value={editPlan.description}
                          onChange={(e) => setEditPlan({...editPlan, description: e.target.value})}
                          className="bg-background"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input 
                            id="price"
                            type="number"
                            value={editPlan.price}
                            onChange={(e) => setEditPlan({...editPlan, price: parseFloat(e.target.value)})}
                            className="bg-background"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="interval">Interval</Label>
                          <select 
                            id="interval" 
                            className="w-full h-10 bg-background border border-input rounded-md px-3"
                            value={editPlan.interval}
                            onChange={(e) => setEditPlan({...editPlan, interval: e.target.value})}
                          >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Features (one per line)</Label>
                        <Textarea 
                          value={editPlan.features.join('\n')}
                          onChange={(e) => setEditPlan({
                            ...editPlan, 
                            features: e.target.value.split('\n').filter(f => f.trim())
                          })}
                          className="bg-background"
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input 
                          id="is_popular" 
                          type="checkbox"
                          checked={editPlan.is_popular}
                          onChange={(e) => setEditPlan({...editPlan, is_popular: e.target.checked})}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="is_popular">Mark as Popular</Label>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button type="button" onClick={() => savePlan(editPlan)}>
                          Save Plan
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditPlan(null)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Subscription Plans</h2>
                    <Button onClick={() => setEditPlan({
                      id: '',
                      name: '',
                      description: '',
                      price: 0,
                      interval: 'monthly',
                      features: [],
                      is_popular: false
                    })}>
                      Add New Plan
                    </Button>
                  </div>
                  
                  {isLoadingPlans ? (
                    <div className="grid gap-6 md:grid-cols-3">
                      {[1, 2, 3].map((_, i) => (
                        <Card key={i}>
                          <CardHeader>
                            <Skeleton className="h-7 w-40 mb-2" />
                            <Skeleton className="h-4 w-full" />
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Skeleton className="h-8 w-24" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                              <Skeleton className="h-10 w-24" />
                              <Skeleton className="h-10 w-24" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : plans && plans.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-3">
                      {plans.map((plan) => (
                        <Card key={plan.id} className={plan.is_popular ? 'border-primary' : ''}>
                          <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-6">
                              <span className="text-3xl font-bold">${plan.price}</span>
                              <span className="text-muted-foreground">/{plan.interval}</span>
                            </div>
                            
                            <ul className="space-y-2 mb-6">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditPlan({...plan})}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => deletePlan(plan.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">No subscription plans found</p>
                        <Button onClick={() => setEditPlan({
                          id: '',
                          name: '',
                          description: '',
                          price: 0,
                          interval: 'monthly',
                          features: [],
                          is_popular: false
                        })}>
                          Create Your First Plan
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Website Settings</CardTitle>
                  <CardDescription>Customize your website configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveSettings(); }}>
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input 
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                        className="bg-background"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea 
                        id="siteDescription"
                        value={settings.siteDescription}
                        onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                        className="bg-background"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail"
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                        className="bg-background"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="footerText">Footer Text</Label>
                      <Input 
                        id="footerText"
                        value={settings.footerText}
                        onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                        className="bg-background"
                      />
                    </div>
                    
                    <Button type="submit" className="mt-4">
                      Save Settings
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* AI Tools Tab */}
            {renderAIToolsTab()}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
