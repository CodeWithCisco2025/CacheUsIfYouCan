import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ServersPage } from "./pages/ServersPage";
import { ServerDetail } from "./pages/ServerDetail";
import NotFound from "./pages/NotFound";
import EndpointTypeList from "./pages/EndpointTypeList";
import ServerList from "./pages/ServerList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/servers" element={<ServersPage />} />
          <Route path="/server/:serverId" element={<ServerDetail />} />
          <Route path="/endpoints" element={<EndpointTypeList />} />
          <Route path="/endpoints/:type/servers" element={<ServersPage />} />
          <Route path="/endpoints/:type/servers/:serverId" element={<ServerDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
