"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ArrowRight, Loader2, Terminal, CheckCircle2, Sparkles, Copy, Download, FileText } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";

interface Props {
  onRunComplete?: () => void;
  initialData?: any;
}

export default function MissionControl({ onRunComplete, initialData }: Props) {
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Ref for the PDF generator
  const reportRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setResult({
        plan: [],
        final_report: initialData.description
      });
      setMission(initialData.name.replace("Mission: ", ""));
    } else {
      setResult(null);
      setMission("");
    }
  }, [initialData]);

  const startMission = async () => {
    if (!mission) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:8000/agent/run", {
        mission: mission,
      });
      setResult(response.data);
      if (onRunComplete) onRunComplete();
      toast.success("Mission Accomplished! Report generated.");
    } catch (error) {
      console.error("Agent failed:", error);
      toast.error("Connection failed. Is the Backend running?");
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---
  const handleCopy = () => {
    if (!result?.final_report) return;
    navigator.clipboard.writeText(result.final_report);
    toast.success("Report copied to clipboard");
  };

const handleDownloadPDF = useReactToPrint({
    contentRef: reportRef, // <--- NEW: Pass the ref directly, not a function
    documentTitle: `Nexus_Report_${mission.replace(/\s+/g, '_')}`,
    onAfterPrint: () => toast.success("PDF Downloaded successfully"),
  });

  const hoverBubbleStyle = "hover:bg-purple-500/15 hover:text-white p-3 -mx-3 rounded-2xl transition-all duration-300 ease-in-out cursor-default backdrop-blur-sm";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-20 font-sans">
      
      {/* INPUT SECTION */}
      <div className="relative group z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-zinc-900 rounded-lg p-2 ring-1 ring-zinc-800">
          <Terminal className="text-zinc-400 ml-3 w-6 h-6" />
          <input
            type="text"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startMission()}
            placeholder="Initialize Agent Mission..."
            className="w-full bg-transparent border-none focus:ring-0 text-white px-4 py-3 outline-none placeholder:text-zinc-600"
          />
          <button
            onClick={startMission}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* RESULTS AREA */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* PLAN CARD */}
          {result.plan && result.plan.length > 0 && (
            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-blue-400 font-semibold mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
                <CheckCircle2 className="w-4 h-4" /> Execution Plan
              </h3>
              <div className="space-y-4">
                {result.plan.map((step: string, i: number) => (
                  <div key={i} className="flex gap-4 text-zinc-300 items-start group hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors duration-200">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-mono border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      {i + 1}
                    </div>
                    <p className="leading-relaxed text-sm group-hover:text-white transition-colors">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORT CARD */}
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10" />
            
            {/* ACTION TOOLBAR */}
            <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
              <h3 className="text-purple-400 font-semibold flex items-center gap-2 uppercase tracking-wider text-sm">
                <Sparkles className="w-4 h-4" /> Final Output
              </h3>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Copy to Clipboard">
                  <Copy className="w-4 h-4" />
                </button>
                {/* We bind the print trigger here */}
                <button onClick={handleDownloadPDF} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Download PDF">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* PRINTABLE AREA (Ref attached here) */}
            <div ref={reportRef} className="prose prose-invert max-w-none print:text-black print:bg-white print:p-8">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className={`text-3xl font-bold tracking-tight text-white print:text-black mt-10 mb-6 ${hoverBubbleStyle}`} {...props} />,
                  h2: ({node, ...props}) => <h2 className={`text-2xl font-semibold tracking-tight text-white print:text-black mt-12 mb-4 border-b border-zinc-800 print:border-black pb-2 ${hoverBubbleStyle}`} {...props} />,
                  h3: ({node, ...props}) => <h3 className={`text-xl font-medium text-white print:text-black mt-8 mb-3 ${hoverBubbleStyle}`} {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 mb-6 text-zinc-300 print:text-black" {...props} />,
                  li: ({node, ...props}) => <li className={`pl-2 py-1 ${hoverBubbleStyle}`} {...props} />,
                  p: ({node, ...props}) => <p className={`text-zinc-300 print:text-black leading-7 mb-6 font-normal ${hoverBubbleStyle}`} {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-purple-200 print:text-purple-700" {...props} />,
                }}
              >
                {result.final_report}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}