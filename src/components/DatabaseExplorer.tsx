
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
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

// Mock table data
const mockTables: TableInfo[] = [
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

// Mock data for table preview
const mockCustomerData: DummyData[] = [
  { customer_id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St', created_at: '2023-01-15 09:30:00' },
  { customer_id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', address: '456 Oak Ave', created_at: '2023-01-16 14:20:00' },
  { customer_id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-9012', address: '789 Pine Rd', created_at: '2023-01-17 11:45:00' },
  { customer_id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '555-3456', address: '101 Elm St', created_at: '2023-01-18 16:10:00' },
  { customer_id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '555-7890', address: '202 Maple Dr', created_at: '2023-01-19 10:05:00' },
];

// Sample query results for the query view
const sampleQueryData = {
  query: "SELECT c.name, COUNT(o.order_id) as total_orders, SUM(o.total_amount) as total_spent FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.name ORDER BY total_spent DESC LIMIT 5",
  results: [
    { name: 'Alice Brown', total_orders: 12, total_spent: 3245.50 },
    { name: 'Charlie Wilson', total_orders: 8, total_spent: 2950.75 },
    { name: 'John Doe', total_orders: 10, total_spent: 2780.30 },
    { name: 'Bob Johnson', total_orders: 7, total_spent: 1875.20 },
    { name: 'Jane Smith', total_orders: 6, total_spent: 1340.90 },
  ]
};

const DatabaseExplorer: React.FC = () => {
  const [tables, setTables] = useState<TableInfo[]>(mockTables);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<DummyData[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [queryResults, setQueryResults] = useState<DummyData[]>([]);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Fetch connection details on component mount
  useEffect(() => {
    const connectionString = localStorage.getItem('databaseConnection');
    if (!connectionString) {
      // In a real app, you might redirect to the connection page
      console.error('No database connection found');
      return;
    }
    
    // In a real implementation, you would fetch the actual tables from the database
    // This is a mock implementation
    
    // Set the first table as selected by default
    if (tables.length > 0) {
      setSelectedTable(tables[0].name);
      setTableData(mockCustomerData);
    }
  }, []);

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
    
    // In a real app, you would fetch the data for this table
    // For this example, we'll just use the mock customer data for any table
    setTableData(mockCustomerData);
  };

  // Process natural language query
  const processNaturalLanguageQuery = async () => {
    if (!naturalLanguageQuery.trim()) return;
    
    setIsQueryLoading(true);
    
    try {
      // In a real app, you would send this to an API that processes natural language
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For this demo, we'll just use the sample query
      setGeneratedSQL(sampleQueryData.query);
      setCurrentQuery(sampleQueryData.query);
      setQueryResults(sampleQueryData.results);
    } finally {
      setIsQueryLoading(false);
    }
  };

  // Execute SQL query
  const executeQuery = () => {
    if (!currentQuery.trim()) return;
    
    setIsQueryLoading(true);
    
    setTimeout(() => {
      // In a real app, you would send this query to your database
      // For this demo, we'll just use the sample results
      setQueryResults(sampleQueryData.results);
      setIsQueryLoading(false);
    }, 1000);
  };

  // Copy SQL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSQL);
    setCopiedSQL(true);
    
    setTimeout(() => {
      setCopiedSQL(false);
    }, 2000);
  };

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
        <Button 
          variant="outline" 
          asChild 
          className="flex items-center gap-2"
        >
          <a href="/database">
            <ArrowLeft className="h-4 w-4" />
            Back to Connection
          </a>
        </Button>
      </div>

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
              {viewMode === 'list' ? (
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
              <Tabs defaultValue="natural">
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
                          processNaturalLanguageQuery();
                        }
                      }}
                    />
                    <Button
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-vanna hover:bg-vanna-dark"
                      size="sm"
                      onClick={processNaturalLanguageQuery}
                      disabled={isQueryLoading || !naturalLanguageQuery.trim()}
                    >
                      {isQueryLoading ? (
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
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="bg-vanna hover:bg-vanna-dark"
                        onClick={executeQuery}
                        disabled={isQueryLoading || !currentQuery.trim()}
                      >
                        {isQueryLoading ? (
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
              <Tabs defaultValue="table">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="table" className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      Table
                    </TabsTrigger>
                    <TabsTrigger value="chart" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Chart
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="text-sm text-muted-foreground">
                    {queryResults.length > 0 
                      ? `${queryResults.length} results` 
                      : (selectedTable ? `Showing ${selectedTable}` : '')}
                  </div>
                </div>
                
                <TabsContent value="table">
                  <div className="rounded-md border bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            {(queryResults.length > 0 
                              ? Object.keys(queryResults[0]) 
                              : selectedTable && tableData.length > 0 
                                ? Object.keys(tableData[0]) 
                                : []
                            ).map((column) => (
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
                          {(queryResults.length > 0 
                            ? queryResults 
                            : selectedTable ? tableData : []
                          ).map((row, rowIndex) => (
                            <tr 
                              key={rowIndex}
                              className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-muted/20'}
                            >
                              {Object.values(row).map((cell, cellIndex) => (
                                <td 
                                  key={cellIndex} 
                                  className="px-4 py-3 text-sm border-t"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="chart">
                  <div className="h-[400px] flex items-center justify-center border rounded-md bg-white p-6">
                    {queryResults.length > 0 ? (
                      <div className="w-full h-full flex items-end justify-around">
                        {queryResults.map((row, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="w-16 bg-vanna hover:bg-vanna-dark transition-all rounded-t-md" 
                              style={{ 
                                height: `${Math.max(50, (row.total_spent / 3500) * 300)}px`,
                                opacity: 0.7 + (index * 0.05)
                              }}
                            ></div>
                            <div className="text-xs mt-2 font-medium">{row.name.split(' ')[0]}</div>
                            <div className="text-xs text-muted-foreground">${row.total_spent}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Run a query to generate a chart</p>
                      </div>
                    )}
                  </div>
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
