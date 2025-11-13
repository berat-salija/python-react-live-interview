"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => (
      <div className="font-medium">{info.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (info) => `$${(info.getValue() as number).toFixed(2)}`,
  },
];

const fetchProducts = async ({
  page,
  search,
}: {
  page: number;
  search: string;
}) => {
  const limit = 10;
  const url = `/api/products?page=${page}&limit=${limit}${
    search ? `&search=${encodeURIComponent(search)}` : ""
  }`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json() as Promise<{
    data: Product[];
    total: number;
    page: number;
  }>;
};

export default function TableView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page, search],
    queryFn: () => fetchProducts({ page, search }),
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount: data ? Math.ceil(data.total / 20) : 0,
    state: { pagination: { pageIndex: page - 1, pageSize: 20 } },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize: 20 })
          : updater;
      setPage(newState.pageIndex + 1);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // we control page via queryKey
  });

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Loading / Error */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      )}
      {isError && (
        <p className="text-center text-red-600">
          Failed to load products. Please try again.
        </p>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ──────────────────────  PAGINATION  ────────────────────── */}
          <div className="mt-6 flex items-center justify-between">
            {/* Buttons + page numbers */}
            <div className="flex items-center gap-1">
              {/* ← Previous */}
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 rounded bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* First page */}
              <button
                onClick={() => table.setPageIndex(0)}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                1
              </button>

              {/* Left ellipsis (only when needed) */}
              {page > 4 && <span className="px-2">…</span>}

              {/* Visible page numbers (max 5, centered on current page) */}
              {(() => {
                const totalPages = table.getPageCount();
                const delta = 2; // pages before/after current
                const start = Math.max(2, page - delta);
                const end = Math.min(totalPages - 1, page + delta);

                return Array.from(
                  { length: end - start + 1 },
                  (_, i) => start + i
                ).map((num) => (
                  <button
                    key={num}
                    onClick={() => table.setPageIndex(num - 1)}
                    className={`px-3 py-1 rounded ${
                      num === page
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {num}
                  </button>
                ));
              })()}

              {/* Right ellipsis (only when needed) */}
              {page < table.getPageCount() - 3 && (
                <span className="px-2">…</span>
              )}

              {/* Last page (only if >1) */}
              {table.getPageCount() > 1 && (
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  className={`px-3 py-1 rounded ${
                    page === table.getPageCount()
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {table.getPageCount()}
                </button>
              )}

              {/* Next → */}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 rounded bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            {/* Summary */}
            <span className="text-sm text-gray-600">
              Page {page} of {table.getPageCount()} ({data?.total ?? 0} total)
            </span>
          </div>
        </>
      )}
    </div>
  );
}
