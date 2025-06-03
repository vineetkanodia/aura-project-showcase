
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FolderOpen, DollarSign, Download, Plus, Edit, Trash2, Eye } from 'lucide-react';

// Mock data for demonstration
const mockStats = {
  totalUsers: 1247,
  totalProjects: 45,
  totalRevenue: 12340,
  totalDownloads: 8950
};

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Pro', joinDate: '2024-01-15', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'Free', joinDate: '2024-02-20', status: 'active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', plan: 'Enterprise', joinDate: '2024-01-10', status: 'banned' },
];

const mockProjects = [
  { id: 1, title: 'E-commerce Dashboard', category: 'Web App', type: 'Premium', downloads: 234, revenue: 1560 },
  { id: 2, title: 'Landing Page Template', category: 'Template', type: 'Free', downloads: 567, revenue: 0 },
  { id: 3, title: 'Mobile Chat App', category: 'Mobile', type: 'Premium', downloads: 123, revenue: 820 },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, projects, and analytics</p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="hover-scale">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="hover-scale">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockStats.totalProjects}</div>
                      <p className="text-xs text-muted-foreground">+3 new this month</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="hover-scale">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${mockStats.totalRevenue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="hover-scale">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockStats.totalDownloads.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+15% from last month</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user actions and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div className="flex-1">
                          <p className="text-sm">User downloaded "E-commerce Dashboard"</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Management</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left p-4">User</th>
                          <th className="text-left p-4">Plan</th>
                          <th className="text-left p-4">Join Date</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={user.plan === 'Free' ? 'secondary' : 'default'}>
                                {user.plan}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm">{user.joinDate}</td>
                            <td className="p-4">
                              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Project Management</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="hover-scale">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <Badge variant={project.type === 'Premium' ? 'default' : 'secondary'}>
                            {project.type}
                          </Badge>
                        </div>
                        <CardDescription>{project.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Downloads:</span>
                            <span className="text-sm font-medium">{project.downloads}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Revenue:</span>
                            <span className="text-sm font-medium">${project.revenue}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Monthly revenue over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">Chart placeholder - Revenue data visualization</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>New user registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">Chart placeholder - User growth visualization</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Download Analytics</CardTitle>
                    <CardDescription>Most popular projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">Chart placeholder - Download analytics</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Distribution</CardTitle>
                    <CardDescription>Plan distribution across users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">Chart placeholder - Subscription data</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
