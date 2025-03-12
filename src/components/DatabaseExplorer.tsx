
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Database, 
  Table, 
  ChevronRight, 
  ChevronDown, 
  Columns, 
  MessageSquare, 
  Copy, 
  CheckCircle2,
  Code,
  BarChart3,
  RefreshCw,
  PlayCircle,
  ArrowLeft,
  LayoutGrid,
  List,
  AlertCircle,
  FileQuestion,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary: boolean;
}

interface TableInfo {
  name: string;
  columns: TableColumn[];
  rowCount: number;
}

interface DummyData {
  [key: string]: any;
}

interface ConnectionConfig {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  isConnected: boolean;
  timestamp: string;
}

// Mock API functions for database operations
const fetchDatabaseTables = async (): Promise<TableInfo[]> => {
  const connectionString = localStorage.getItem('databaseConnection');
  
  if (!connectionString) {
    throw new Error('No database connection found');
  }
  
  const connection = JSON.parse(connectionString) as ConnectionConfig;
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // For demo purposes, we'll return different mock data based on the database name
  // In a real app, this would query the actual database
  if (connection.database.toLowerCase().includes('sales')) {
    return [
      {
        name: 'customers',
        columns: [
          { name: 'customer_id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'name', type: 'varchar(100)', nullable: false, isPrimary: false },
          { name: 'email', type: 'varchar(100)', nullable: true, isPrimary: false },
          { name: 'phone', type: 'varchar(15)', nullable: true, isPrimary: false },
          { name: 'address', type: 'text', nullable: true, isPrimary: false },
          { name: 'created_at', type: 'timestamp', nullable: false, isPrimary: false },
        ],
        rowCount: 1243
      },
      {
        name: 'orders',
        columns: [
          { name: 'order_id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'customer_id', type: 'integer', nullable: false, isPrimary: false },
          { name: 'order_date', type: 'date', nullable: false, isPrimary: false },
          { name: 'total_amount', type: 'decimal(10,2)', nullable: false, isPrimary: false },
          { name: 'status', type: 'varchar(20)', nullable: false, isPrimary: false },
        ],
        rowCount: 5210
      },
      {
        name: 'products',
        columns: [
          { name: 'product_id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'name', type: 'varchar(100)', nullable: false, isPrimary: false },
          { name: 'description', type: 'text', nullable: true, isPrimary: false },
          { name: 'price', type: 'decimal(10,2)', nullable: false, isPrimary: false },
          { name: 'stock', type: 'integer', nullable: false, isPrimary: false },
          { name: 'category', type: 'varchar(50)', nullable: true, isPrimary: false },
        ],
        rowCount: 487
      },
    ];
  } else if (connection.database.toLowerCase().includes('hr')) {
    return [
      {
        name: 'employees',
        columns: [
          { name: 'employee_id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'first_name', type: 'varchar(50)', nullable: false, isPrimary: false },
          { name: 'last_name', type: 'varchar(50)', nullable: false, isPrimary: false },
          { name: 'email', type: 'varchar(100)', nullable: false, isPrimary: false },
          { name: 'hire_date', type: 'date', nullable: false, isPrimary: false },
          { name: 'position', type: 'varchar(50)', nullable: false, isPrimary: false },
          { name: 'salary', type: 'decimal(10,2)', nullable: false, isPrimary: false },
        ],
        rowCount: 42
      },
      {
        name: 'departments',
        columns: [
          { name: 'department_id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'name', type: 'varchar(50)', nullable: false, isPrimary: false },
          { name: 'location', type: 'varchar(100)', nullable: true, isPrimary: false },
          { name: 'budget', type: 'decimal(12,2)', nullable: false, isPrimary: false },
        ],
        rowCount: 12
      }
    ];
  } else {
    // Default tables
    return [
      {
        name: 'customers',
        columns: [
          { name: 'customer_id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'name', type: 'varchar(100)', nullable: false, isPrimary: false },
          { name: 'email', type: 'varchar(100)', nullable: true, isPrimary: false },
          { name: 'phone', type: 'varchar(15)', nullable: true, isPrimary: false },
          { name: 'address', type: 'text', nullable: true, isPrimary: false },
          { name: 'created_at', type: 'timestamp', nullable: false, isPrimary: false },
        ],
        rowCount: 1243
      },
      {
        name: 'orders',
        columns: [
          { name: 'order_id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'customer_id', type: 'integer', nullable: false, isPrimary: false },
          { name: 'order_date', type: 'date', nullable: false, isPrimary: false },
          { name: 'total_amount', type: 'decimal(10,2)', nullable: false, isPrimary: false },
          { name: 'status', type: 'varchar(20)', nullable: false, isPrimary: false },
        ],
        rowCount: 5210
      },
      {
        name: 'products',
        columns: [
          { name: 'product_id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'name', type: 'varchar(100)', nullable: false, isPrimary: false },
          { name: 'description', type: 'text', nullable: true, isPrimary: false },
          { name: 'price', type: 'decimal(10,2)', nullable: false, isPrimary: false },
          { name: 'stock', type: 'integer', nullable: false, isPrimary: false },
          { name: 'category', type: 'varchar(50)', nullable: true, isPrimary: false },
        ],
        rowCount: 487
      },
      {
        name: 'order_items',
        columns: [
          { name: 'item_id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'order_id', type: 'integer', nullable: false, isPrimary: false },
          { name: 'product_id', type: 'integer', nullable: false, isPrimary: false },
          { name: 'quantity', type: 'integer', nullable: false, isPrimary: false },
          { name: 'unit_price', type: 'decimal(10,2)', nullable: false, isPrimary: false },
        ],
        rowCount: 18652
      },
      {
        name: 'employees',
        columns: [
          { name: 'employee_id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'first_name', type: 'varchar(50)', nullable: false, isPrimary: false },
          { name: 'last_name', type: 'varchar(50)', nullable: false, isPrimary: false },
          { name: 'email', type: 'varchar(100)', nullable: false, isPrimary: false },
          { name: 'hire_date', type: 'date', nullable: false, isPrimary: false },
          { name: 'position', type: 'varchar(50)', nullable: false, isPrimary: false },
          { name: 'salary', type: 'decimal(10,2)', nullable: false, isPrimary: false },
        ],
        rowCount: 42
      },
    ];
  }
};

// Mock function to fetch table data
const fetchTableData = async (tableName: string): Promise<DummyData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Different mock data based on table name
  switch (tableName) {
    case 'customers':
      return [
        { customer_id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St', created_at: '2023-01-15 09:30:00' },
        { customer_id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', address: '456 Oak Ave', created_at: '2023-01-16 14:20:00' },
        { customer_id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-9012', address: '789 Pine Rd', created_at: '2023-01-17 11:45:00' },
        { customer_id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '555-3456', address: '101 Elm St', created_at: '2023-01-18 16:10:00' },
        { customer_id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '555-7890', address: '202 Maple Dr', created_at: '2023-01-19 10:05:00' },
      ];
    case 'orders':
      return [
        { order_id: 1001, customer_id: 1, order_date: '2023-03-10', total_amount: 157.32, status: 'completed' },
        { order_id: 1002, customer_id: 3, order_date: '2023-03-11', total_amount: 42.50, status: 'completed' },
        { order_id: 1003, customer_id: 2, order_date: '2023-03-12', total_amount: 295.99, status: 'shipped' },
        { order_id: 1004, customer_id: 5, order_date: '2023-03-13', total_amount: 68.75, status: 'processing' },
        { order_id: 1005, customer_id: 4, order_date: '2023-03-14', total_amount: 412.00, status: 'completed' },
      ];
    case 'products':
      return [
        { product_id: 101, name: 'Wireless Headphones', description: 'Premium noise-cancelling headphones', price: 149.99, stock: 58, category: 'Electronics' },
        { product_id: 102, name: 'Smart Watch', description: 'Fitness and health tracking smartwatch', price: 199.99, stock: 42, category: 'Electronics' },
        { product_id: 103, name: 'Organic Coffee', description: 'Fair trade certified organic coffee beans', price: 14.99, stock: 120, category: 'Food & Beverage' },
        { product_id: 104, name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat', price: 29.99, stock: 35, category: 'Fitness' },
        { product_id: 105, name: 'Desk Lamp', description: 'Adjustable LED desk lamp with wireless charging', price: 49.99, stock: 27, category: 'Home Office' },
      ];
    case 'employees':
      return [
        { employee_id: 1, first_name: 'Michael', last_name: 'Scott', email: 'mscott@example.com', hire_date: '2018-04-15', position: 'Regional Manager', salary: 75000.00 },
        { employee_id: 2, first_name: 'Jim', last_name: 'Halpert', email: 'jhalpert@example.com', hire_date: '2019-07-23', position: 'Sales Representative', salary: 55000.00 },
        { employee_id: 3, first_name: 'Pam', last_name: 'Beesly', email: 'pbeesly@example.com', hire_date: '2019-08-05', position: 'Receptionist', salary: 48000.00 },
        { employee_id: 4, first_name: 'Dwight', last_name: 'Schrute', email: 'dschrute@example.com', hire_date: '2018-09-12', position: 'Assistant Manager', salary: 65000.00 },
        { employee_id: 5, first_name: 'Angela', last_name: 'Martin', email: 'amartin@example.com', hire_date: '2020-01-30', position: 'Accountant', salary: 59000.00 },
      ];
    case 'departments':
      return [
        { department_id: 1, name: 'Sales', location: 'Building A, Floor 2', budget: 500000.00 },
        { department_id: 2, name: 'Marketing', location: 'Building A, Floor 3', budget: 350000.00 },
        { department_id: 3, name: 'HR', location: 'Building B, Floor 1', budget: 275000.00 },
        { department_id: 4, name: 'IT', location: 'Building C, Floor 2', budget: 425000.00 },
      ];
    case 'order_items':
      return [
        { item_id: 10001, order_id: 1001, product_id: 101, quantity: 1, unit_price: 149.99 },
        { item_id: 10002, order_id: 1001, product_id: 103, quantity: 2, unit_price: 14.99 },
        { item_id: 10003, order_id: 1002, product_id: 105, quantity: 1, unit_price: 49.99 },
        { item_id: 10004, order_id: 1003, product_id: 102, quantity: 1, unit_price: 199.99 },
        { item_id: 10005, order_id: 1003, product_id: 104, quantity: 2, unit_price: 29.99 },
      ];
    default:
      return [];
  }
};

// Mock function to execute SQL queries
const executeQuery = async (query: string): Promise<DummyData[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, we'll return different data based on keywords in the query
  if (query.toLowerCase().includes('customers') && query.toLowerCase().includes('orders')) {
    return [
      { name: 'Alice Brown', total_orders: 12, total_spent: 3245.50 },
      { name: 'Charlie Wilson', total_orders: 8, total_spent: 2950.75 },
      { name: 'John Doe', total_orders: 10, total_spent: 2780.30 },
      { name: 'Bob Johnson', total_orders: 7, total_spent: 1875.20 },
      { name: 'Jane Smith', total_orders: 6, total_spent: 1340.90 },
    ];
  } else if (query.toLowerCase().includes('products') && query.toLowerCase().includes('stock')) {
    return [
      { name: 'Organic Coffee', stock: 120, category: 'Food & Beverage' },
      { name: 'Wireless Headphones', stock: 58, category: 'Electronics' },
      { name: 'Smart Watch', stock: 42, category: 'Electronics' },
      { name: 'Yoga Mat', stock: 35, category: 'Fitness' },
      { name: 'Desk Lamp', stock: 27, category: 'Home Office' },
    ];
  } else if (query.toLowerCase().includes('employees') && query.toLowerCase().includes('salary')) {
    return [
      { first_name: 'Michael', last_name: 'Scott', position: 'Regional Manager', salary: 75000.00 },
      { first_name: 'Dwight', last_name: 'Schrute', position: 'Assistant Manager', salary: 65000.00 },
      { first_name: 'Angela', last_name: 'Martin', position: 'Accountant', salary: 59000.00 },
      { first_name: 'Jim', last_name: 'Halpert', position: 'Sales Representative', salary: 55000.00 },
      { first_name: 'Pam', last_name: 'Beesly', position: 'Receptionist', salary: 48000.00 },
    ];
  } else {
    return [
      { name: 'Default Result 1', value: 100 },
      { name: 'Default Result 2', value: 200 },
      { name: 'Default Result 3', value: 300 },
    ];
  }
};

// Mock function to process natural language to SQL
const processNaturalLanguageQuery = async (nlQuery: string): Promise<{sql: string, data: DummyData[]}> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let generatedSQL = '';
  let results: DummyData[] = [];
  
  // For demo purposes, map specific natural language patterns to SQL
  if (nlQuery.toLowerCase().includes('customer') && nlQuery.toLowerCase().includes('order')) {
    generatedSQL = "SELECT c.name, COUNT(o.order_id) as total_orders, SUM(o.total_amount) as total_spent FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name ORDER BY total_spent DESC LIMIT 5";
    results = [
      { name: 'Alice Brown', total_orders: 12, total_spent: 3245.50 },
      { name: 'Charlie Wilson', total_orders: 8, total_spent: 2950.75 },
      { name: 'John Doe', total_orders: 10, total_spent: 2780.30 },
      { name: 'Bob Johnson', total_orders: 7, total_spent: 1875.20 },
      { name: 'Jane Smith', total_orders: 6, total_spent: 1340.90 },
    ];
  } else if (nlQuery.toLowerCase().includes('product') && nlQuery.toLowerCase().includes('stock')) {
    generatedSQL = "SELECT name, stock, category FROM products ORDER BY stock DESC";
    results = [
      { name: 'Organic Coffee', stock: 120, category: 'Food & Beverage' },
      { name: 'Wireless Headphones', stock: 58, category: 'Electronics' },
      { name: 'Smart Watch', stock: 42, category: 'Electronics' },
      { name: 'Yoga Mat', stock: 35, category: 'Fitness' },
      { name: 'Desk Lamp', stock: 27, category: 'Home Office' },
    ];
  } else if (nlQuery.toLowerCase().includes('employee') && nlQuery.toLowerCase().includes('salary')) {
    generatedSQL = "SELECT first_name, last_name, position, salary FROM employees ORDER BY salary DESC";
    results = [
      { first_name: 'Michael', last_name: 'Scott', position: 'Regional Manager', salary: 75000.00 },
      { first_name: 'Dwight', last_name: 'Schrute', position: 'Assistant Manager', salary: 65000.00 },
      { first_name: 'Angela', last_name: 'Martin', position: 'Accountant', salary: 59000.00 },
      { first_name: 'Jim', last_name: 'Halpert', position: 'Sales Representative', salary: 55000.00 },
      { first_name: 'Pam', last_name: 'Beesly', position: 'Receptionist', salary: 48000.00 },
    ];
  } else {
    // Default response for other queries
    generatedSQL = "SELECT * FROM example_table WHERE condition = 'value' LIMIT 5";
    results = [
      { column1: 'Value 1', column2: 100 },
      { column1: 'Value 2', column2: 200 },
      { column1: 'Value 3', column2: 300 },
    ];
  }
  
  return { sql: generatedSQL, data: results };
};

const DatabaseExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeQueryTab, setActiveQueryTab] = useState<'natural' | 'sql'>('natural');
  const [activeResultTab, setActiveResultTab] = useState<'table' | 'chart'>('table');

  // Check connection on mount
  useEffect(() => {
    const connectionString = localStorage.getItem('databaseConnection');
    if (!connectionString) {
      toast({
        title: "No connection found",
        description: "Please connect to a database first",
        variant: "destructive",
      });
      navigate('/database');
    }
  }, [navigate]);

  // Get tables from the database
  const {
    data: tables = [],
    isLoading: isLoadingTables,
    isError: isTablesError,
    error: tablesError,
    refetch: refetchTables
  } = useQuery({
    queryKey: ['databaseTables'],
    queryFn: fetchDatabaseTables,
    retry: 1,
  });

  // Get data for the selected table
  const {
    data: tableData = [],
    isLoading: isLoadingTableData,
    isError: isTableDataError,
    refetch: refetchTableData
  } = useQuery({
    queryKey: ['tableData', selectedTable],
    queryFn: () => fetchTableData(selectedTable || ''),
    enabled: !!selectedTable,
    retry: 1,
  });

  // Mutation for executing SQL queries
  const sqlQueryMutation = useMutation({
    mutationFn: executeQuery,
    onSuccess: (data) => {
      setActiveResultTab('table');
      toast({
        title: "Query executed successfully",
        description: `Returned ${data.length} rows`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Query execution failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation for natural language queries
  const nlQueryMutation = useMutation({
    mutationFn: processNaturalLanguageQuery,
    onSuccess: (data) => {
      setGeneratedSQL(data.sql);
      setCurrentQuery(data.sql);
      setActiveResultTab('table');
      toast({
        title: "Query generated and executed",
        description: `Returned ${data.data.length} rows`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Query processing failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter tables based on search term
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle table expansion
  const toggleTableExpand = (tableName: string) => {
    setExpandedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  // Select a table to view its data
  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
  };

  // Process natural language query
  const processNaturalLanguage = async () => {
    if (!naturalLanguageQuery.trim()) return;
    nlQueryMutation.mutate(naturalLanguageQuery);
  };

  // Execute SQL query
  const executeCurrentQuery = () => {
    if (!currentQuery.trim()) return;
    sqlQueryMutation.mutate(currentQuery);
  };

  // Copy SQL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSQL);
    setCopiedSQL(true);
    
    setTimeout(() => {
      setCopiedSQL(false);
    }, 2000);
  };

  // Results to display in the table/chart
  const resultsToDisplay = nlQueryMutation.data?.data || sqlQueryMutation.data || tableData;
  const isLoadingResults = isLoadingTableData || sqlQueryMutation.isPending || nlQueryMutation.isPending;
  const queryError = sqlQueryMutation.error || nlQueryMutation.error;

  // Handle reconnect to a different database
  const handleReconnect = () => {
    localStorage.removeItem('databaseConnection');
    navigate('/database');
  };

  // Check if there's any data available for visualization
  const hasDataForChart = resultsToDisplay.length > 0 && 
    Object.values(resultsToDisplay[0]).some(value => typeof value === 'number');

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6 text-vanna" />
            Database Explorer
          </h2>
          <p className="text-muted-foreground mt-1">
            Browse your database structure and run queries
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleReconnect}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Reconnect
          </Button>
          <Button 
            variant="outline" 
            asChild 
            className="flex items-center gap-2"
          >
            <a href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </a>
          </Button>
        </div>
      </div>

      {isTablesError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Tables</AlertTitle>
          <AlertDescription>
            {tablesError instanceof Error ? tablesError.message : 'Failed to load database tables'}
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => refetchTables()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar with tables list */}
        <Card className="lg:col-span-3 glass-card">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tables..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Tables</h3>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-7 w-7 ${viewMode === 'list' ? 'bg-accent' : ''}`}
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>List view</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-7 w-7 ${viewMode === 'grid' ? 'bg-accent' : ''}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Grid view</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-320px)]">
              {isLoadingTables ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Loading tables...</p>
                </div>
              ) : filteredTables.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <FileQuestion className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No tables found</p>
                </div>
              ) : viewMode === 'list' ? (
                <div className="space-y-1">
                  {filteredTables.map((table) => (
                    <div key={table.name} className="mb-1">
                      <button
                        className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent transition-colors ${
                          selectedTable === table.name ? 'bg-accent' : ''
                        }`}
                        onClick={() => toggleTableExpand(table.name)}
                      >
                        <div className="flex items-center gap-2">
                          <Table className="h-4 w-4 text-muted-foreground" />
                          <span 
                            className="font-medium truncate"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTable(table.name);
                            }}
                          >
                            {table.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {table.rowCount} rows
                          </span>
                          {expandedTables.includes(table.name) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                      
                      {expandedTables.includes(table.name) && (
                        <div className="ml-8 mt-1 space-y-1">
                          {table.columns.map((column) => (
                            <div 
                              key={column.name}
                              className="flex items-center gap-2 px-2 py-1 text-sm"
                            >
                              <Columns className="h-3 w-3 text-muted-foreground" />
                              <span className={column.isPrimary ? 'font-semibold' : ''}>
                                {column.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {column.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {filteredTables.map((table) => (
                    <button
                      key={table.name}
                      className={`p-3 rounded-md hover:bg-accent transition-colors flex flex-col items-center justify-center text-center ${
                        selectedTable === table.name ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleSelectTable(table.name)}
                    >
                      <Table className="h-5 w-5 mb-1 text-vanna" />
                      <span className="font-medium text-sm truncate w-full">
                        {table.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {table.columns.length} columns
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main content area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Query input with tabs */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <Tabs defaultValue="natural" value={activeQueryTab} onValueChange={(val) => setActiveQueryTab(val as 'natural' | 'sql')}>
                <TabsList className="mb-4">
                  <TabsTrigger value="natural" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Natural Language
                  </TabsTrigger>
                  <TabsTrigger value="sql" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    SQL Query
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="natural" className="space-y-4">
                  <div className="relative">
                    <Input
                      placeholder="Ask a question about your data in plain English..."
                      className="pl-4 pr-16 py-6 text-base"
                      value={naturalLanguageQuery}
                      onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          processNaturalLanguage();
                        }
                      }}
                      disabled={nlQueryMutation.isPending}
                    />
                    <Button
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-vanna hover:bg-vanna-dark"
                      size="sm"
                      onClick={processNaturalLanguage}
                      disabled={nlQueryMutation.isPending || !naturalLanguageQuery.trim()}
                    >
                      {nlQueryMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <PlayCircle className="h-4 w-4" />
                      )}
                      <span className="ml-1">Submit</span>
                    </Button>
                  </div>

                  {generatedSQL && (
                    <div className="bg-muted/50 rounded-md p-4 relative">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Generated SQL</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={copyToClipboard}
                        >
                          {copiedSQL ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="ml-1">{copiedSQL ? 'Copied!' : 'Copy'}</span>
                        </Button>
                      </div>
                      <pre className="text-sm overflow-x-auto p-2 rounded bg-muted text-muted-foreground">{generatedSQL}</pre>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="sql">
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        placeholder="Enter your SQL query here..."
                        className="w-full min-h-[120px] p-4 text-sm font-mono border rounded-md resize-y"
                        value={currentQuery}
                        onChange={(e) => setCurrentQuery(e.target.value)}
                        disabled={sqlQueryMutation.isPending}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="bg-vanna hover:bg-vanna-dark"
                        onClick={executeCurrentQuery}
                        disabled={sqlQueryMutation.isPending || !currentQuery.trim()}
                      >
                        {sqlQueryMutation.isPending ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <PlayCircle className="mr-2 h-4 w-4" />
                        )}
                        Execute Query
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Results section with tabs for table view and chart */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <Tabs defaultValue="table" value={activeResultTab} onValueChange={(val) => setActiveResultTab(val as 'table' | 'chart')}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="table" className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      Table
                    </TabsTrigger>
                    <TabsTrigger value="chart" className="flex items-center gap-2" disabled={!hasDataForChart}>
                      <BarChart3 className="h-4 w-4" />
                      Chart
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="text-sm text-muted-foreground">
                    {isLoadingResults ? (
                      <span className="flex items-center">
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Loading...
                      </span>
                    ) : resultsToDisplay.length > 0 
                      ? `${resultsToDisplay.length} results` 
                      : (selectedTable ? `Showing ${selectedTable}` : '')}
                  </div>
                </div>
                
                {queryError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Query Error</AlertTitle>
                    <AlertDescription>
                      {queryError instanceof Error ? queryError.message : 'An error occurred while executing the query'}
                    </AlertDescription>
                  </Alert>
                )}
                
                <TabsContent value="table">
                  {isLoadingResults ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : resultsToDisplay.length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No data to display</p>
                      <p className="text-sm text-muted-foreground mt-1">Try selecting a table or running a query</p>
                    </div>
                  ) : (
                    <div className="rounded-md border bg-white overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/50">
                              {Object.keys(resultsToDisplay[0]).map((column) => (
                                <th 
                                  key={column} 
                                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                                >
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {resultsToDisplay.map((row, rowIndex) => (
                              <tr 
                                key={rowIndex}
                                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-muted/20'}
                              >
                                {Object.values(row).map((cell, cellIndex) => (
                                  <td 
                                    key={cellIndex} 
                                    className="px-4 py-3 text-sm border-t"
                                  >
                                    {cell !== null && cell !== undefined ? String(cell) : ''}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="chart">
                  {isLoadingResults ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : !hasDataForChart ? (
                    <div className="text-center py-12 border rounded-md">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No numerical data available for chart</p>
                      <p className="text-sm text-muted-foreground mt-1">Try a different query with numerical results</p>
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center border rounded-md bg-white p-6">
                      <div className="w-full h-full flex items-end justify-around">
                        {resultsToDisplay.map((row, index) => {
                          // Find the first string column for labels and first number column for values
                          const columns = Object.entries(row);
                          const labelColumn = columns.find(([_, val]) => typeof val === 'string')?.[0] || 'Item';
                          const valueColumn = columns.find(([_, val]) => typeof val === 'number' && val > 0)?.[0] || '';
                          
                          if (!valueColumn) return null;
                          
                          const label = String(row[labelColumn]).split(' ')[0]; // Take first word only for clarity
                          const value = Number(row[valueColumn]);
                          const maxValue = Math.max(...resultsToDisplay.map(r => Number(r[valueColumn])));
                          const height = `${Math.max(50, (value / maxValue) * 300)}px`;
                          
                          return (
                            <div key={index} className="flex flex-col items-center">
                              <div 
                                className="w-16 bg-vanna hover:bg-vanna-dark transition-all rounded-t-md" 
                                style={{ 
                                  height,
                                  opacity: 0.7 + (index * 0.05)
                                }}
                              ></div>
                              <div className="text-xs mt-2 font-medium truncate w-20 text-center">{label}</div>
                              <div className="text-xs text-muted-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatabaseExplorer;
