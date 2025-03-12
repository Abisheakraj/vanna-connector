
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronDown, Database, Table as TableIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SchemaExplorerProps {
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      type: string;
    }>;
  }>;
}

const SchemaExplorer: React.FC<SchemaExplorerProps> = ({ tables }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-vanna" />
          Database Schema
        </CardTitle>
        <CardDescription>
          Explore tables and columns
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tables.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tables found or database not connected
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {tables.map((table, index) => (
              <AccordionItem value={table.name} key={index}>
                <AccordionTrigger className="flex items-center">
                  <div className="flex items-center">
                    <TableIcon className="h-4 w-4 mr-2 text-vanna" />
                    <span>{table.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {table.columns.length} columns
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="rounded border overflow-hidden mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column Name</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {table.columns.map((column, colIndex) => (
                          <TableRow key={colIndex}>
                            <TableCell className="font-medium">{column.name}</TableCell>
                            <TableCell>{column.type}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default SchemaExplorer;
