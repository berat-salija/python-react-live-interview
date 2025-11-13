import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TableView from "./TableView";
import ScrollView from "./ScrollView";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<TableView />} />
              <Route path="/scroll" element={<ScrollView />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
