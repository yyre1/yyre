<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
=======
import { Scene } from './components/3d/Scene'
import { RotatingBox } from './components/3d/RotatingBox'

function App() {
  return (
    <main className="w-full h-screen relative bg-[#0a0a0a]">
      {/* HTML Overlay */}
      <div className="absolute top-0 left-0 w-full p-8 z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black tracking-tighter text-white pointer-events-auto">
            YYRE
          </h1>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <p className="text-xs font-medium text-white uppercase tracking-widest">
              3D Environment Active
            </p>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Scene>
          <RotatingBox />
        </Scene>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
        <p className="text-white/40 text-xs font-mono">
          R3F + Three.js + TypeScript
        </p>
      </div>
    </main>
  )
}

export default App
>>>>>>> 7feb5232bc6bf69f2a63a3b8eb4aded3523b4430
