import { useState, KeyboardEvent } from "react";

// Define the type for homophone data from API
interface HomophoneResponse {
  word: string;
  homophones: string[];
  message?: string;
}

export default function App() {
  const [word, setWord] = useState<string>("");
  const [result, setResult] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [queriedWord, setQueriedWord] = useState<string>("");

  async function searchWord(): Promise<void> {
    if (!word.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setQueriedWord(word.trim());
    try {
      const response = await fetch(`http://127.0.0.1:8000/homophone/${word.trim()}`);
      if (!response.ok) throw new Error("Server error");
      const data: HomophoneResponse = await response.json();
      setResult(data.homophones || []);
    } catch (err) {
      setError("Couldn't reach the server. Make sure your API is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") searchWord();
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start px-4 sm:px-6 py-10 sm:py-16">

      {/* Header */}
      <header className="text-center mb-12">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-400 mb-3">
          Linguistic Tool
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight mb-3">
          HOMOPHONE{" "}
          <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
            Detector
          </span>
        </h1>
        <p className="text-slate-400 text-sm italic">
          Words that sound alike, spelled apart
        </p>
      </header>

      {/* Search Card */}
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl">
        <label className="block text-xs font-medium tracking-widest uppercase text-slate-500 mb-3">
          Enter a word
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="word-input"
            value={word}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value.toLowerCase();
              setWord(val);
              if (!val.trim()) { setResult(null); setQueriedWord(""); setError(""); }
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. knight, bare, right…"
            autoComplete="off"
            spellCheck="false"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg text-slate-100 placeholder-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all caret-amber-400 lowercase"
          />
          <button
            onClick={searchWord}
            disabled={loading || !word.trim()}
            className="bg-amber-400 hover:bg-amber-300 active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-900 font-semibold text-sm px-5 py-3 sm:py-0 rounded-xl transition-all duration-150 w-full sm:w-auto"
          >
            {loading ? "Searching…" : "SEARCH"}
          </button>
        </div>

        {/* Lowercase hint */}
        {word && (
          <p className="mt-2 text-xs text-slate-600 tracking-wide">
            Input is auto-lowercased
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-950/40 border border-red-800/50 rounded-xl px-4 py-3 text-sm text-red-400 text-center">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="w-full max-w-lg">

        {/* Loading */}
        {loading && (
          <div className="flex justify-center gap-2 py-10">
            {[0, 1, 2].map((i: number) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && result === null && (
          <div className="text-center py-12 text-slate-700">
            <div className="text-4xl mb-3 opacity-40">◈</div>
            <p className="italic text-sm">Type a word above to find its homophones</p>
          </div>
        )}

        {/* No results */}
        {!loading && result !== null && result.length === 0 && (
          <div className="text-center bg-slate-900 border border-slate-800 rounded-2xl py-10 px-6">
            <p className="text-2xl font-bold text-slate-100 mb-2">"{queriedWord}"</p>
            <p className="text-slate-500 italic text-sm">No homophones found for this word</p>
          </div>
        )}

        {/* Results list */}
        {!loading && result !== null && result.length > 0 && (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-medium tracking-widest uppercase text-slate-500">
                Homophones of "{queriedWord}"
              </span>
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs font-semibold text-amber-400">
                {result.length} found
              </span>
            </div>

            <div className="space-y-2">
              {result.map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-5 py-4 transition-colors group"
                  style={{ animation: `fadeUp 0.25s ease ${index * 60}ms both` }}
                >
                  <span className="text-xs italic text-slate-700 w-5 text-right shrink-0">
                    {index + 1}
                  </span>
                  <div className="w-px h-6 bg-slate-800 shrink-0" />
                  <span className="text-xl font-semibold text-slate-100 flex-1">
                    {item}
                  </span>
                  <span className="text-xs font-medium tracking-widest uppercase text-amber-400/70 bg-amber-400/10 border border-amber-400/20 rounded-md px-2 py-1 group-hover:bg-amber-400/15 transition-colors">
                    ≈ sound
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}