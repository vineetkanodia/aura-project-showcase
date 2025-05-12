
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, User, Shield, CreditCard, Key, Mail, UserRound, Settings } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load user metadata
    setProfileData({
      firstName: user.user_metadata?.first_name || '',
      lastName: user.user_metadata?.last_name || '',
      username: user.user_metadata?.username || '',
    });
    
    setAvatarUrl(user.user_metadata?.avatar_url || null);
  }, [user, navigate]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        username: profileData.username,
        avatar_url: avatarUrl
      });
      
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwordData.newPassword 
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };
  
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Use data URLs for this demo without actual file upload to storage
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setAvatarUrl(dataUrl);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Error uploading avatar');
      setUploading(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Sidebar */}
              <div className="w-full md:w-64 mb-6 md:mb-0">
                <Card className="bg-secondary/30 backdrop-blur-lg border border-white/10">
                  <CardHeader className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 mb-4">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={avatarUrl || undefined} />
                        <AvatarFallback className="bg-primary/20 text-primary-foreground text-2xl">
                          {profileData.username ? profileData.username.charAt(0).toUpperCase() : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/80 transition-colors"
                      >
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </label>
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                      />
                    </div>
                    <CardTitle className="text-xl">{profileData.username || 'Username'}</CardTitle>
                    <CardDescription className="text-sm break-words max-w-full">
                      <span className="block">
                        {profileData.firstName} {profileData.lastName}
                      </span>
                      <span className="block text-xs mt-1 truncate max-w-[180px] mx-auto">
                        {user.email}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">
                      Account created on {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Profile Content */}
              <div className="flex-1 w-full">
                <Card className="bg-secondary/30 backdrop-blur-lg border border-white/10">
                  <Tabs defaultValue="profile" className="w-full">
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <CardTitle className="text-xl">Account Settings</CardTitle>
                      <div className="ml-auto w-full md:w-auto">
                        <TabsList className="w-full grid grid-cols-3 md:w-auto">
                          <TabsTrigger value="profile" className="flex items-center gap-2 px-3">
                            <UserRound className="h-4 w-4" /> Profile
                          </TabsTrigger>
                          <TabsTrigger value="security" className="flex items-center gap-2 px-3">
                            <Key className="h-4 w-4" /> Security
                          </TabsTrigger>
                          <TabsTrigger value="subscription" className="flex items-center gap-2 px-3">
                            <CreditCard className="h-4 w-4" /> Plan
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <CardDescription className="hidden md:block">
                        Manage your account settings and preferences
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <TabsContent value="profile" className="space-y-6">
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="username" className="flex items-center gap-2">
                              <UserRound className="h-4 w-4" /> Username
                            </Label>
                            <Input 
                              id="username" 
                              value={profileData.username}
                              onChange={handleProfileChange}
                              placeholder="Your username" 
                              className="bg-secondary/20"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName" className="flex items-center gap-2">
                                <User className="h-4 w-4" /> First Name
                              </Label>
                              <Input 
                                id="firstName" 
                                value={profileData.firstName}
                                onChange={handleProfileChange}
                                placeholder="Your first name"
                                className="bg-secondary/20" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName" className="flex items-center gap-2">
                                <User className="h-4 w-4" /> Last Name
                              </Label>
                              <Input 
                                id="lastName" 
                                value={profileData.lastName}
                                onChange={handleProfileChange}
                                placeholder="Your last name"
                                className="bg-secondary/20" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                              <Mail className="h-4 w-4" /> Email
                            </Label>
                            <Input 
                              id="email" 
                              value={user.email}
                              readOnly
                              disabled 
                              className="bg-secondary/40"
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="mt-4"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Saving...
                              </>
                            ) : 'Save Changes'}
                          </Button>
                        </form>
                      </TabsContent>
                      
                      <TabsContent value="security" className="space-y-6">
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="flex items-center gap-2">
                              <Key className="h-4 w-4" /> Current Password
                            </Label>
                            <Input 
                              id="currentPassword" 
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter your current password"
                              className="bg-secondary/20" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="newPassword" className="flex items-center gap-2">
                              <Key className="h-4 w-4" /> New Password
                            </Label>
                            <Input 
                              id="newPassword" 
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter your new password"
                              className="bg-secondary/20" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                              <Key className="h-4 w-4" /> Confirm New Password
                            </Label>
                            <Input 
                              id="confirmPassword" 
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder="Confirm your new password"
                              className="bg-secondary/20" 
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="mt-4"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Updating...
                              </>
                            ) : 'Update Password'}
                          </Button>
                        </form>
                      </TabsContent>
                      
                      <TabsContent value="subscription" className="space-y-6">
                        <div className="text-center py-8 md:py-12">
                          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-xl font-medium mb-2">Free Plan</h3>
                          <p className="text-muted-foreground mb-6">You're currently on the free plan</p>
                          <Button>Upgrade to Pro</Button>
                        </div>
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
