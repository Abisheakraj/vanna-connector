
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, MessageCircle, Code, Database } from 'lucide-react';
import { generateSQLFromText, getMockSQLResponse } from '@/services/openai';
import { ConnectionConfig, executeSQLQuery } from '@/services/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NaturalLanguageQueryProps {
  connectionConfig: ConnectionConfig;
  tables: Array<{ name: string, columns: Array<{ name: string, type: string }> }>;
  onQueryResult: (result: { columns: string[], rows: any[] }) => void;
}

const NaturalLanguageQuery: React.FC<NaturalLanguageQueryProps> = ({ 
  connectionConfig, 
  tables,
  onQueryResult 
}) => {
  const [query, setQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState('natural');

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleSqlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSqlQuery(e.target.value);
  };

  const generateSQL = async () => {
    if (!query.trim()) {
      toast({
        title: "Query is empty",
        description: "Please enter a natural language query",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // In a real app, you'd use OpenAI. For demo, we'll use getMockSQLResponse
      // Comment out the mock and uncomment the real call if you have an OpenAI key
      // const sql = await generateSQLFromText(query, connectionConfig.type, tables);
      const sql = getMockSQLResponse(query);
      
      setSqlQuery(sql);
      setActiveTab('sql');
      
      toast({
        title: "SQL generated",
        description: "Your natural language query has been converted to SQL",
      });
    } catch (error) {
      console.error('Error generating SQL:', error);
      toast({
        title: "Error generating SQL",
        description: "Could not convert your query to SQL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({
        title: "SQL query is empty",
        description: "Please generate or write an SQL query",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    try {
      const result = await executeSQLQuery(connectionConfig, sqlQuery);
      
      onQueryResult(result);
      
      toast({
        title: "Query executed",
        description: "Your SQL query has been executed successfully",
      });
    } catch (error) {
      console.error('Error executing SQL:', error);
      toast({
        title: "Error executing query",
        description: "Could not execute your SQL query. Please check your syntax.",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const generateAndExecute = async () => {
    if (!query.trim()) {
      toast({
        title: "Query is empty",
        description: "Please enter a natural language query",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate SQL
      const sql = getMockSQLResponse(query);
      setSqlQuery(sql);
      
      // Then execute it
      setIsExecuting(true);
      setIsGenerating(false);
      
      const result = await executeSQLQuery(connectionConfig, sql);
      onQueryResult(result);
      
      toast({
        title: "Query completed",
        description: "Your query has been converted to SQL and executed",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error processing query",
        description: "An error occurred while processing your query",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-vanna" />
          Query Your Database
        </CardTitle>
        <CardDescription>
          Ask questions in natural language or write SQL directly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="natural">Natural Language</TabsTrigger>
            <TabsTrigger value="sql">SQL Query</TabsTrigger>
          </TabsList>
          
          <TabsContent value="natural" className="space-y-4">
            <Textarea
              placeholder="Ask a question about your data (e.g., 'Show me all users' or 'Count total orders')"
              value={query}
              onChange={handleQueryChange}
              className="min-h-32 font-mono"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-vanna hover:bg-vanna-dark"
                onClick={generateSQL}
                disabled={isGenerating || !query.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Code className="mr-2 h-4 w-4" />
                    Generate SQL
                  </>
                )}
              </Button>
              <Button
                className="bg-vanna hover:bg-vanna-dark"
                onClick={generateAndExecute}
                disabled={(isGenerating || isExecuting) || !query.trim()}
              >
                {isGenerating || isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Generate & Execute
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="sql" className="space-y-4">
            <Textarea
              placeholder="Write or edit your SQL query here"
              value={sqlQuery}
              onChange={handleSqlChange}
              className="min-h-32 font-mono"
            />
            <Button
              className="bg-vanna hover:bg-vanna-dark"
              onClick={executeQuery}
              disabled={isExecuting || !sqlQuery.trim()}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Execute Query
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NaturalLanguageQuery;
