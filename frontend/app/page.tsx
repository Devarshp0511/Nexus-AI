"use client";

import { useState } from "react";
import MissionControl from "./components/MissionControl";
import Sidebar from "./components/Sidebar";

export default function Home() {
  // State to manage which project is active
  const [selectedProject, setSelectedProject] = useState<any>(null);
  // State to force sidebar to refresh when a new mission is created
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-purple-500/30">
      
      {/* 1. SIDEBAR (Fixed Left) */}
      <Sidebar 
        onSelect={(project) => setSelectedProject(project)}
        onNewChat={() => setSelectedProject(null)}
        refreshTrigger={refreshTrigger}
      />

      {/* 2. MAIN CONTENT (Offset by 80 chars for sidebar) */}
      <main className="flex-1 ml-80 p-12 relative">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            NEXUS AI
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">Autonomous Multi-Agent Orchestration System</p>
        </div>

        {/* The Dashboard */}
        <MissionControl 
          initialData={selectedProject} 
          onRunComplete={() => setRefreshTrigger(prev => prev + 1)} 
        />

        {/* Background Glow */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
        </div>
      </main>
    </div>
  );
}