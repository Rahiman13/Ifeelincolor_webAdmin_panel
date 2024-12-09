"use client"

import { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// Define the structure of a visitor entry
interface Visitor {
  id: number;
  country: string;
  flag: string;
  users: { count: number; percentage: number };
  newUsers: { count: number; percentage: number };
  sessions: { count: number; percentage: number };
  bounceRate: string;
  pagesPerSession: string;
  avgSessionDuration: string;
}

// Sample data
const visitors: Visitor[] = [
  {
    id: 1,
    country: "China",
    flag: "🇨🇳",
    users: { count: 195, percentage: 23.16 },
    newUsers: { count: 172, percentage: 24.50 },
    sessions: { count: 208, percentage: 21.67 },
    bounceRate: "68.75%",
    pagesPerSession: "1.45%",
    avgSessionDuration: "00:00:16"
  },
  // ... Add more visitor data here
];

export default function VisitorsTable() {
  const [sortColumn, setSortColumn] = useState<keyof Visitor>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;

  const handleSort = (column: keyof Visitor) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredVisitors = visitors.filter(visitor =>
    visitor.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedVisitors = [...filteredVisitors].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedVisitors = sortedVisitors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card className="w-full max-w-[85rem] mx-auto">
      <CardHeader>
        <CardTitle>Visitors</CardTitle>
        <CardDescription>Visitors overview by country.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="space-x-2">
            <Button variant="outline">View all</Button>
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Create
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('country')} className="cursor-pointer">Country</TableHead>
              <TableHead onClick={() => handleSort('users')} className="cursor-pointer">Users</TableHead>
              <TableHead onClick={() => handleSort('newUsers')} className="cursor-pointer">New Users</TableHead>
              <TableHead onClick={() => handleSort('sessions')} className="cursor-pointer">Sessions</TableHead>
              <TableHead onClick={() => handleSort('bounceRate')} className="cursor-pointer">Bounce Rate</TableHead>
              <TableHead onClick={() => handleSort('pagesPerSession')} className="cursor-pointer">Pages / Session</TableHead>
              <TableHead onClick={() => handleSort('avgSessionDuration')} className="cursor-pointer">Avg. Session Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVisitors.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{visitor.flag}</span>
                    <span>{visitor.country}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{visitor.users.count}</span>
                  <span className="text-gray-500 text-sm ml-1">({visitor.users.percentage.toFixed(2)}%)</span>
                </TableCell>
                <TableCell>
                  <span>{visitor.newUsers.count}</span>
                  <span className="text-gray-500 text-sm ml-1">({visitor.newUsers.percentage.toFixed(2)}%)</span>
                </TableCell>
                <TableCell>
                  <span>{visitor.sessions.count}</span>
                  <span className="text-gray-500 text-sm ml-1">({visitor.sessions.percentage.toFixed(2)}%)</span>
                </TableCell>
                <TableCell>{visitor.bounceRate}</TableCell>
                <TableCell>{visitor.pagesPerSession}</TableCell>
                <TableCell>{visitor.avgSessionDuration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">{filteredVisitors.length}</span> results
          </p>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredVisitors.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(filteredVisitors.length / itemsPerPage)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}