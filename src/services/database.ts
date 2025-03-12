
import { supabase } from '../App';

export interface DatabaseTable {
  name: string;
  columns: Array<{
    name: string;
    type: string;
  }>;
}

export interface ConnectionConfig {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

// Store connection in Supabase
export const saveConnectionConfig = async (config: ConnectionConfig) => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error("User not authenticated");
  }
  
  const { error } = await supabase
    .from('database_connections')
    .upsert({
      user_id: userData.user.id,
      connection_config: config,
      created_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
  if (error) {
    throw error;
  }
  
  // Also store in localStorage for easy access
  localStorage.setItem('databaseConnection', JSON.stringify({
    ...config,
    isConnected: true,
    timestamp: new Date().toISOString()
  }));
  
  return true;
};

// Fetch connection from Supabase
export const getConnectionConfig = async (): Promise<ConnectionConfig | null> => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('database_connections')
    .select('connection_config')
    .eq('user_id', userData.user.id)
    .single();
    
  if (error || !data) {
    return null;
  }
  
  return data.connection_config as ConnectionConfig;
};

// Get database tables - this would normally call your backend
// For now, we'll simulate it with example tables
export const getDatabaseTables = async (config: ConnectionConfig): Promise<DatabaseTable[]> => {
  // Simulate an API call with some delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock tables based on database type
  switch (config.type) {
    case 'postgresql':
      return [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'serial primary key' },
            { name: 'email', type: 'varchar(255)' },
            { name: 'name', type: 'varchar(100)' },
            { name: 'created_at', type: 'timestamp' }
          ]
        },
        {
          name: 'products',
          columns: [
            { name: 'id', type: 'serial primary key' },
            { name: 'name', type: 'varchar(255)' },
            { name: 'price', type: 'decimal(10,2)' },
            { name: 'inventory_count', type: 'integer' }
          ]
        },
        {
          name: 'orders',
          columns: [
            { name: 'id', type: 'serial primary key' },
            { name: 'user_id', type: 'integer' },
            { name: 'amount', type: 'decimal(10,2)' },
            { name: 'status', type: 'varchar(50)' },
            { name: 'created_at', type: 'timestamp' }
          ]
        }
      ];
    case 'mysql':
      return [
        {
          name: 'customers',
          columns: [
            { name: 'id', type: 'int auto_increment primary key' },
            { name: 'email', type: 'varchar(255)' },
            { name: 'first_name', type: 'varchar(100)' },
            { name: 'last_name', type: 'varchar(100)' },
            { name: 'joined_date', type: 'datetime' }
          ]
        },
        {
          name: 'items',
          columns: [
            { name: 'id', type: 'int auto_increment primary key' },
            { name: 'name', type: 'varchar(255)' },
            { name: 'category', type: 'varchar(100)' },
            { name: 'price', type: 'decimal(10,2)' },
            { name: 'stock', type: 'int' }
          ]
        },
        {
          name: 'sales',
          columns: [
            { name: 'id', type: 'int auto_increment primary key' },
            { name: 'customer_id', type: 'int' },
            { name: 'item_id', type: 'int' },
            { name: 'quantity', type: 'int' },
            { name: 'sale_date', type: 'datetime' }
          ]
        }
      ];
    default:
      return [
        {
          name: 'sample_table',
          columns: [
            { name: 'id', type: 'primary key' },
            { name: 'name', type: 'text' },
            { name: 'value', type: 'integer' }
          ]
        }
      ];
  }
};

// Execute SQL query - this would normally call your backend
export const executeSQLQuery = async (
  config: ConnectionConfig,
  query: string
): Promise<{ columns: string[]; rows: any[] }> => {
  // Simulate an API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, return mock data
  if (query.toLowerCase().includes('select * from users')) {
    return {
      columns: ['id', 'email', 'name', 'created_at'],
      rows: [
        { id: 1, email: 'user1@example.com', name: 'John Doe', created_at: '2023-01-15T08:30:00' },
        { id: 2, email: 'user2@example.com', name: 'Jane Smith', created_at: '2023-02-20T14:45:00' },
        { id: 3, email: 'user3@example.com', name: 'Bob Johnson', created_at: '2023-03-10T11:15:00' }
      ]
    };
  }
  
  if (query.toLowerCase().includes('count')) {
    return {
      columns: ['count'],
      rows: [{ count: 42 }]
    };
  }
  
  if (query.toLowerCase().includes('products')) {
    return {
      columns: ['id', 'name', 'price', 'inventory_count'],
      rows: [
        { id: 1, name: 'Laptop', price: 1299.99, inventory_count: 15 },
        { id: 2, name: 'Smartphone', price: 899.99, inventory_count: 25 },
        { id: 3, name: 'Headphones', price: 199.99, inventory_count: 50 }
      ]
    };
  }
  
  if (query.toLowerCase().includes('orders')) {
    return {
      columns: ['id', 'user_id', 'amount', 'status', 'created_at'],
      rows: [
        { id: 1, user_id: 1, amount: 1299.99, status: 'completed', created_at: '2023-04-05T09:20:00' },
        { id: 2, user_id: 2, amount: 899.99, status: 'pending', created_at: '2023-04-10T16:30:00' },
        { id: 3, user_id: 1, amount: 199.99, status: 'completed', created_at: '2023-04-15T13:45:00' }
      ]
    };
  }
  
  // Default response
  return {
    columns: ['message'],
    rows: [{ message: 'Query executed successfully' }]
  };
};

// Test connection function
export const testDatabaseConnection = async (config: ConnectionConfig): Promise<boolean> => {
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
