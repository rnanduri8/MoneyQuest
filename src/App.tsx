import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MyWorld from "./pages/MyWorld";
import MiniGames from "./pages/MiniGames";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [gameState, setGameState] = useState({
    coins: 100,
    xp: 0,
    level: 1,
    streak: 0,
    badges: [] as string[],
    completedZones: [] as string[],
  });

  useEffect(() => {
    const coins = localStorage.getItem("gameCoins");
    const xp = localStorage.getItem("gameXp");
    const level = localStorage.getItem("gameLevel");
    const streak = localStorage.getItem("gameStreak");
    const completedZones = localStorage.getItem("completedZones");
    
    setGameState({
      coins: coins ? parseInt(coins) : 100,
      xp: xp ? parseInt(xp) : 0,
      level: level ? parseInt(level) : 1,
      streak: streak ? parseInt(streak) : 0,
      badges: [],
      completedZones: completedZones ? JSON.parse(completedZones) : [],
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/my-world" element={<MyWorld {...gameState} />} />
            <Route path="/mini-games" element={<MiniGames />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
