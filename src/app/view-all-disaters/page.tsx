"use client";

import { DisasterTable } from "@/components/ui/dashboard/disaster-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Disaster } from "@/types/typesData";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns: ColumnDef<Disaster>[] = [
    {
      accessorKey: "url",
      header: "Source",
      cell: ({ row }) => {
        // Only parse URL on client-side
        if (!isMounted) {
          return row.original.url;
        }
        
        try {
          const hostname = new URL(row.original.url).hostname;
          return (
            <a href={row.original.url} target="_blank" rel="noopener noreferrer">
              {hostname}
            </a>
          );
        } catch (e) {
          return row.original.url;
        }
      },
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      accessorKey: "disaster",
      header: "Disaster Type",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "people_affected",
      header: "People Affected",
      cell: ({ row }) => {
        // Only format numbers on client-side to avoid hydration mismatch
        if (!isMounted) {
          return String(row.original.people_affected);
        }
        return row.original.people_affected.toLocaleString();
      },
    },
    {
      accessorKey: "people_supported",
      header: "People Supported",
      cell: ({ row }) => {
        if (!isMounted) {
          return String(row.original.people_supported);
        }
        return row.original.people_supported.toLocaleString();
      },
    },
    {
      accessorKey: "organizations",
      header: "Organizations",
      cell: ({ row }) => {
        const orgs = row.original.organizations;
        return Array.isArray(orgs) ? orgs.join(", ") : orgs;
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DisasterTable columns={columns} />
    </div>
  );
}