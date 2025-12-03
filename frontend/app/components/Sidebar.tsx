"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { History, Plus, MessageSquare } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string; // This holds the report
  created_at: string;
}

interface SidebarProps {
  onSelect: (project: Project) => void;
  onNewChat: () => void;
  refreshTrigger: number; // Simple way to force refresh list
}

export default function Sidebar({ onSelect, onNewChat, refreshTrigger }: SidebarProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Fetch History from Backend
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:8000/projects/?limit=20");
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    fetchProjects();
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  return (
    <div className="w-80 h-screen bg-black border-r border-zinc-800 flex flex-col p-4 fixed left-0 top-0 overflow-hidden">
      
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <span className="font-bold text-white">N</span>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Nexus AI</span>
      </div>

      {/* NEW MISSION BUTTON */}
      <button 
        onClick={onNewChat}
        className="flex items-center gap-3 w-full bg-zinc-900 hover:bg-zinc-800 text-white p-3 rounded-xl border border-zinc-700 transition-all mb-6 group"
      >
        <div className="p-1 bg-zinc-800 rounded-md group-hover:bg-zinc-700">
          <Plus className="w-4 h-4" />
        </div>
        <span className="font-medium text-sm">New Mission</span>
      </button>

      {/* HISTORY LIST */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        <div className="text-xs font-semibold text-zinc-500 mb-3 px-2 uppercase tracking-wider">
          Mission Archives
        </div>
        
        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => onSelect(proj)}
            className="w-full text-left p-3 rounded-lg hover:bg-zinc-900/50 text-zinc-400 hover:text-white transition-all flex items-start gap-3 group border border-transparent hover:border-zinc-800/50"
          >
            <MessageSquare className="w-4 h-4 mt-1 text-zinc-600 group-hover:text-purple-400 transition-colors" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{proj.name.replace("Mission: ", "")}</p>
              <p className="text-xs text-zinc-600 truncate mt-0.5">
                {new Date(proj.created_at).toLocaleDateString()}
              </p>
            </div>
          </button>
        ))}
      </div>
      
      {/* FOOTER */}
      <div className="pt-4 border-t border-zinc-900 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
          <div className="text-xs">
            <p className="text-white font-medium">Devarsh Patel</p>
            <p className="text-zinc-600">Admin Workspace</p>
          </div>
        </div>
      </div>
    </div>
  );
}