import React, { useState } from "react";
import { ColorGrading, FilterType, VideoProject } from "../../types";
import { X, Sparkles, Bot, Send, Loader2, ArrowRight } from "lucide-react";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
  onApplyRecipe: (grading: Partial<ColorGrading>, filter: FilterType) => void;
}

export const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  onClose,
  project,
  onApplyRecipe,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<
    { role: "user" | "assistant"; text: string; recipe?: { filter: FilterType; grading: Partial<ColorGrading> } }[]
  >([
    {
      role: "assistant",
      text: `Hello! I'm your AI Director for "${project.title}". Ask me for editing pacing advice, cinematic lighting advice, color recipes, or custom caption ideas.`,
    },
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: "Cyberpunk Neo Recipe",
      recipe: {
        filter: "Night" as FilterType,
        grading: { exposure: 0.1, contrast: 1.35, saturation: 1.25, temperature: -15, tint: 12, vignette: 0.4 },
      },
    },
    {
      label: "35mm Film Noir",
      recipe: {
        filter: "Black & White" as FilterType,
        grading: { contrast: 1.4, shadows: -0.2, highlights: 0.1, sharpen: 0.3, fade: 0.15, vignette: 0.5 },
      },
    },
    {
      label: "Golden Hour Warmth",
      recipe: {
        filter: "Warm" as FilterType,
        grading: { temperature: 28, tint: 6, saturation: 1.2, highlights: -0.1, vibrance: 1.25, vignette: 0.25 },
      },
    },
    {
      label: "Hollywood Blockbuster",
      recipe: {
        filter: "Teal & Orange" as FilterType,
        grading: { contrast: 1.3, saturation: 1.3, temperature: 10, tint: -8, vignette: 0.3 },
      },
    },
  ];

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = textToSend;
    setConversation((prev) => [...prev, { role: "user", text: userMsg }]);
    setPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: userMsg,
          projectInfo: {
            title: project.title,
            duration: project.duration,
            clipsCount: project.clips.length,
            aspectRatio: project.aspectRatio,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestions) {
          const joinedText = Array.isArray(data.suggestions)
            ? data.suggestions.join("\n\n")
            : data.suggestions;
          setConversation((prev) => [
            ...prev,
            { role: "assistant", text: joinedText },
          ]);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("AI modal error:", e);
    }

    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `For "${project.title}", I recommend setting your cuts to 1.8s - 2.5s intervals to keep mobile viewer retention high. Use a 0.3s Flash or Zoom transition on beat drops. Apply the 'Teal & Orange' or 'Hollywood' preset below for optimal contrast and skin tones.`,
          recipe: {
            filter: "Teal & Orange",
            grading: { contrast: 1.28, saturation: 1.2, temperature: 14, vignette: 0.3 },
          },
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
      <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl w-full max-w-lg h-[540px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between bg-[#0A0A0A] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFB347] flex items-center justify-center text-[#0A0A0A] font-bold shadow-sm shadow-[#FFB347]/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E0E0E0] flex items-center gap-1.5">
                <span>AI Director Copilot</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFB347] text-[#0A0A0A] font-bold">
                  GEMINI
                </span>
              </h3>
              <p className="text-[10px] text-[#888]">Intelligent video editing assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#888] hover:text-[#E0E0E0] hover:bg-[#161618] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="px-4 py-2.5 border-b border-[#1A1A1A] bg-[#0A0A0A] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => {
                onApplyRecipe(qp.recipe.grading, qp.recipe.filter);
                onClose();
              }}
              className="px-3 py-1 rounded-lg bg-[#161618] hover:bg-[#202024] text-[11px] font-medium text-[#FFB347] border border-[#222] whitespace-nowrap active:scale-95 transition-all"
            >
              + {qp.label}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-[#FFB347] text-[#0A0A0A] font-medium rounded-br-none"
                    : "bg-[#161618] border border-[#222] text-[#E0E0E0] rounded-bl-none space-y-2"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                {msg.recipe && (
                  <button
                    onClick={() => {
                      onApplyRecipe(msg.recipe!.grading, msg.recipe!.filter);
                      onClose();
                    }}
                    className="mt-2 w-full py-1.5 rounded-lg bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/40 font-semibold text-xs flex items-center justify-center gap-1 hover:bg-[#FFB347]/25 active:scale-95 transition-all"
                  >
                    <span>Apply This Recipe ({msg.recipe.filter})</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-[#888]">
              <Loader2 className="w-4 h-4 animate-spin text-[#FFB347]" />
              <span>Director is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-[#1A1A1A] bg-[#0A0A0A] flex items-center gap-2 shrink-0">
          <input
            id="input-ai-prompt"
            type="text"
            placeholder="Ask AI Director about pacing, lighting, or ideas..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(prompt)}
            className="flex-1 bg-[#161618] border border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none focus:border-[#FFB347]"
          />
          <button
            id="btn-send-ai-prompt"
            onClick={() => handleSendPrompt(prompt)}
            disabled={!prompt.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#FFB347] text-[#0A0A0A] font-bold hover:bg-[#FFA327] disabled:opacity-40 transition-colors active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
