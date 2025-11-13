"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

const fetchProducts = async ({
  pageParam = 1,
}: {
  pageParam: number;
}): Promise<{ data: Product[]; total: number; page: number }> => {
  const page = pageParam ?? 1;
  const url = `/api/products?page=${page}&limit=20`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function ScrollView() {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products-infinite"],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page * 20 < lastPage.total
        ? lastPage.page + 1
        : undefined;
    },
    staleTime: 1000 * 60,
  });

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-8 text-red-600">
          Error: {(error as Error).message}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1">{p.name}</h3>
              <p className="text-sm text-indigo-600 font-medium">
                {p.category}
              </p>
              <p className="text-2xl font-bold mt-2">${p.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
