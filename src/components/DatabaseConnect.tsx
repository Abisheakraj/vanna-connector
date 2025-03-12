
import React, { useState } from 'react';
import { 
  Database, 
  ServerCog, 
  Table, 
  Lock, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery, useMutation } from '@tanstack/react-query';

interface ConnectionConfig {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

// This function would normally call your backend API
const testDatabaseConnection = async (config: ConnectionConfig): Promise<boolean> => {
  // Simulate an API call with some basic validation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!config.host || !config.username || !config.database) {
    throw new Error("Missing required fields");
  }
  
  // For demo purposes, we'll check some common errors
  if (config.host === 'localhost' && config.port === '1234') {
    throw new Error("Connection refused: invalid port");
  }
  
  return true;
};

// This function would connect to the database and return tables
const connectToDatabase = async (config: ConnectionConfig): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!config.host || !config.username || !config.database) {
    throw new Error("Missing required fields");
  }
  
  return;
};

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
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConfigChange = (field: keyof ConnectionConfig, value: string) => {
    setConnectionConfig(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset connection status when config changes
    if (connectionStatus !== 'idle') {
      setConnectionStatus('idle');
      setConnectionError(null);
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
      case 'oracle':
        return '1521';
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
  
  // Testing connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: testDatabaseConnection,
    onSuccess: () => {
      setConnectionStatus('success');
      setConnectionError(null);
      toast({
        title: "Connection successful",
        description: `Successfully connected to ${connectionConfig.database} on ${connectionConfig.host}`,
      });
    },
    onError: (error: Error) => {
      setConnectionStatus('error');
      setConnectionError(error.message);
      toast({
        title: "Connection failed",
        description: error.message || "Could not connect to the database",
        variant: "destructive",
      });
    }
  });
  
  // Connect to database mutation
  const connectDatabaseMutation = useMutation({
    mutationFn: connectToDatabase,
    onSuccess: () => {
      // Store connection details
      localStorage.setItem('databaseConnection', JSON.stringify({
        ...connectionConfig,
        isConnected: true,
        timestamp: new Date().toISOString()
      }));
      
      // Navigate to explorer
      navigate('/database/explore');
      
      toast({
        title: "Database connected",
        description: `You're now connected to ${connectionConfig.database}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Connection failed",
        description: error.message || "Could not connect to the database",
        variant: "destructive",
      });
    }
  });

  const testConnection = () => {
    testConnectionMutation.mutate(connectionConfig);
  };

  const handleConnectToDatabase = () => {
    if (connectionStatus !== 'success') {
      toast({
        title: "Test connection first",
        description: "Please test your connection before proceeding",
        variant: "destructive",
      });
      return;
    }

    connectDatabaseMutation.mutate(connectionConfig);
  };
  
  const isLoading = testConnectionMutation.isPending || connectDatabaseMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto">
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
            {connectionError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>
                  {connectionError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="database-type">Database Type</Label>
                <Select 
                  value={connectionConfig.type}
                  onValueChange={(value) => handleDatabaseTypeChange(value)}
                  disabled={isLoading}
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
                          disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                          disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={testConnection}
            disabled={isLoading}
          >
            {testConnectionMutation.isPending ? (
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
            onClick={handleConnectToDatabase}
            disabled={connectionStatus !== 'success' || isLoading}
          >
            {connectDatabaseMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect & Explore
                <Table className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Need help? Check our <a href="#" className="text-vanna hover:underline">documentation</a> or <a href="#" className="text-vanna hover:underline">contact support</a>.</p>
      </div>
    </div>
  );
};

export default DatabaseConnect;
