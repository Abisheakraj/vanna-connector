
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database } from 'lucide-react';

interface QueryResultsProps {
  columns: string[];
  rows: any[];
}

const QueryResults: React.FC<QueryResultsProps> = ({ columns, rows }) => {
  if (!columns.length || !rows.length) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-vanna" />
          Query Results
        </CardTitle>
        <CardDescription>
          {rows.length} row{rows.length !== 1 ? 's' : ''} returned
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded border overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {row[column] !== undefined ? 
                        (typeof row[column] === 'object' ? 
                          JSON.stringify(row[column]) : 
                          String(row[column])
                        ) : 
                        '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueryResults;
