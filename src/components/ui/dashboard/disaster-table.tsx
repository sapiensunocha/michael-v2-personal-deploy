"use client";

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Disaster } from "@/types/typesData";

interface DisasterTableProps {
  columns: ColumnDef<Disaster>[]
}

// Update the API base URL constant to match your project
const NEXT_DASHBOARD_URL = "/api/disaster-data";

export function DisasterTable({ columns }: DisasterTableProps) {
  const [data, setData] = useState<Disaster[]>([]);
  const [isLoading, setLoading] = useState(true); // Start with true to show loading state immediately
  const [error, setError] = useState<string | null>(null);
  const [isCrawling, setIsCrawling] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Add this effect to handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchData = async () => {
    if (!isMounted) return; // Don't fetch on server-side

    setLoading(true);
    setError(null);

    try {
      // Fetch events
      const eventsResponse = await fetch(`${NEXT_DASHBOARD_URL}/events`);
      if (!eventsResponse.ok) {
        throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
      }
      const eventsData = await eventsResponse.json();
      setData(eventsData);

      // Check crawl status
      const statusResponse = await fetch(`${NEXT_DASHBOARD_URL}/status`);
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setIsCrawling(statusData.is_crawling);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted) {
      fetchData();
    }
  }, [isMounted]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Only render the full table after client-side hydration
  if (!isMounted) return <div>Loading...</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}