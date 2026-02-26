"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Player } from "@/lib/types";

export type SortKey = "name" | "wpm" | "accuracy" | "wordsCompleted";
export type SortDir = "asc" | "desc";


//THIS FUNCTION WAS AI GENERATED
export function useTableSort(players: Player[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [sortKey, setSortKey] = useState<SortKey>(
    (searchParams.get("sort") as SortKey) || "wpm"
  );
  const [sortDir, setSortDir] = useState<SortDir>(
    (searchParams.get("dir") as SortDir) || "desc"
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortKey);
    params.set("dir", sortDir);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [sortKey, sortDir, router, pathname, searchParams]);

  const toggleSort = useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("desc");
      }
      setPage(0);
    },
    [sortKey]
  );

  const sorted = [...players].sort((a, b) => {
    let aVal: string | number = a[sortKey];
    let bVal: string | number = b[sortKey];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
      return sortDir === "asc"
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }

    return sortDir === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return {
    sorted: paginated,
    sortKey,
    sortDir,
    toggleSort,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
  };
}