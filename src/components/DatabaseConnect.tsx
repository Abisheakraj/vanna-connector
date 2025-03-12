
import React, { useState } from 'react';
import { 
  Database, 
  ServerCog, 
  Table, 
  Lock, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface ConnectionConfig {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

const DatabaseConnect: React.FC = () => {
  const navigate = useNavigate();
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>({
    type: 'postgresql',
    host: '',
    port: '',
    username: '',
    password: '',
    database: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleConfigChange = (field: keyof ConnectionConfig, value: string) => {
    setConnectionConfig(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset connection status when config changes
    if (connectionStatus !== 'idle') {
      setConnectionStatus('idle');
    }
  };

  const getDefaultPort = (type: string) => {
    switch (type) {
      case 'postgresql':
        return '5432';
      case 'mysql':
        return '3306';
      case 'mssql':
        return '1433';
      case 'sqlite':
        return '';
      default:
        return '';
    }
  };

  const handleDatabaseTypeChange = (type: string) => {
    setConnectionConfig(prev => ({
      ...prev,
      type,
      port: getDefaultPort(type)
    }));
  };

  const testConnection = async () => {
    setIsLoading(true);
    
    // Simulate connection test
    try {
      // In a real application, you would make an API call to test the connection here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (connectionConfig.host && connectionConfig.username && connectionConfig.database) {
        setConnectionStatus('success');
        toast({
          title: "Connection successful",
          description: `Successfully connected to ${connectionConfig.database} on ${connectionConfig.host}`,
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection failed",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection failed",
        description: "Could not connect to the database. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectToDatabase = () => {
    if (connectionStatus !== 'success') {
      toast({
        title: "Test connection first",
        description: "Please test your connection before proceeding",
        variant: "destructive",
      });
      return;
    }

    // Store connection details (in a real app, you might use a context or state management)
    localStorage.setItem('databaseConnection', JSON.stringify(connectionConfig));
    
    // Navigate to database explorer
    navigate('/database/explore');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Connect Your Database</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Set up your database connection to start exploring and querying your data with natural language.
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-vanna" />
              Database Connection
            </CardTitle>
            <CardDescription>
              Enter your database credentials to establish a connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="database-type">Database Type</Label>
                  <Select 
                    value={connectionConfig.type}
                    onValueChange={(value) => handleDatabaseTypeChange(value)}
                  >
                    <SelectTrigger id="database-type" className="w-full">
                      <SelectValue placeholder="Select database type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="mssql">SQL Server</SelectItem>
                      <SelectItem value="sqlite">SQLite</SelectItem>
                      <SelectItem value="oracle">Oracle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {connectionConfig.type !== 'sqlite' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="host">Host</Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Globe className="h-4 w-4" />
                          </div>
                          <Input
                            id="host"
                            placeholder="localhost or IP address"
                            className="pl-10"
                            value={connectionConfig.host}
                            onChange={(e) => handleConfigChange('host', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="port">Port</Label>
                        <Input
                          id="port"
                          placeholder="Port"
                          value={connectionConfig.port}
                          onChange={(e) => handleConfigChange('port', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="Database username"
                          value={connectionConfig.username}
                          onChange={(e) => handleConfigChange('username', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Lock className="h-4 w-4" />
                          </div>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={connectionConfig.password}
                            onChange={(e) => handleConfigChange('password', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div>
                  <Label htmlFor="database">Database Name</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <ServerCog className="h-4 w-4" />
                    </div>
                    <Input
                      id="database"
                      placeholder="Database name"
                      className="pl-10"
                      value={connectionConfig.database}
                      onChange={(e) => handleConfigChange('database', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={testConnection}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      Test Connection
                      {connectionStatus === 'success' && (
                        <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                      )}
                      {connectionStatus === 'error' && (
                        <XCircle className="ml-2 h-4 w-4 text-destructive" />
                      )}
                    </>
                  )}
                </Button>
                <Button 
                  className="flex-1 bg-vanna hover:bg-vanna-dark"
                  onClick={connectToDatabase}
                  disabled={connectionStatus !== 'success' || isLoading}
                >
                  Connect & Explore
                  <Table className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Need help? Check our <a href="#" className="text-vanna hover:underline">documentation</a> or <a href="#" className="text-vanna hover:underline">contact support</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConnect;
