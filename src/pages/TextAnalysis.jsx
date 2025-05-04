// TextAnalysis.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "../contexts/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const planLimits = {
  Free: 20,
  Standard: 50,
  Premium: Infinity,
};

function TextAnalysis() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const analysisRef = useRef();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [tokensLeft, setTokensLeft] = useState(null);
  const [plan, setPlan] = useState("Free");

  const minTextLength = 100;

  useEffect(() => {
    const fetchUsageAndPlan = async () => {
      if (!currentUser) return;
      try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const snapshot = await getDocs(
          query(collection(db, "submissions"), where("userId", "==", currentUser.uid))
        );
        const thisMonth = snapshot.docs.filter(doc => {
          const date = doc.data().createdAt?.toDate?.();
          return date && date >= firstDayOfMonth;
        });
        const count = thisMonth.length;

        let currentPlan = "Free";
        if (count > 50) currentPlan = "Premium";
        else if (count > 20) currentPlan = "Standard";

        setPlan(currentPlan);
        const max = planLimits[currentPlan];
        setTokensLeft(max === Infinity ? "Unlimited" : max - count);
      } catch (err) {
        console.error("Error checking plan usage", err);
      }
    };

    fetchUsageAndPlan();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tokensLeft !== "Unlimited" && tokensLeft <= 0) {
      if (window.confirm("You've used all your tokens. Upgrade your plan?")) {
        return navigate("/subscription");
      }
      return;
    }

    if (text.length < minTextLength) {
      setError(`Text must be at least ${minTextLength} characters long`);
      return;
    }

    try {
      setError("");
      setAnalyzing(true);
      const result = await fakeAIAnalysis(text);

      const ref = await addDoc(collection(db, "submissions"), {
        userId: currentUser.uid,
        title: title || "Untitled Analysis",
        text,
        createdAt: serverTimestamp(),
        ...result,
      });

      setResults({ id: ref.id, ...result });
    } catch (err) {
      console.error("Error analyzing", err);
      setError("Failed to analyze text.");
    } finally {
      setAnalyzing(false);
    }
  };

  const fakeAIAnalysis = async () => {
    await new Promise((res) => setTimeout(res, 1200));
    return {
      aiInfluence: Math.floor(Math.random() * 80),
      score: 6 + Math.random() * 4,
      suggestions: [
        "Add more real-life examples.",
        "Make transitions smoother between paragraphs.",
        "Avoid overly formal constructions.",
      ],
      strengths: ["Well-structured", "Clear logic", "Concise vocabulary"],
      readability: {
        score: 70 + Math.floor(Math.random() * 20),
        level: "Intermediate",
      },
    };
  };

  const handleExportPDF = async () => {
    const canvas = await html2canvas(analysisRef.current);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save(`${title || "analysis"}-report.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Text Analysis</h1>
      <p className="mb-4 text-sm text-gray-700">Plan: <strong>{plan}</strong> — Tokens Left: <strong>{tokensLeft}</strong></p>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {!results ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <textarea
            rows={10}
            className="w-full px-4 py-2 border rounded"
            placeholder="Paste or write your text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <div className="text-sm text-gray-500">{text.length} / {minTextLength}</div>
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={analyzing || text.length < minTextLength}
              className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
            >
              {analyzing ? "Analyzing..." : "Analyze Text"}
            </button>
            <button type="button" onClick={() => setText("")} className="text-red-500">
              Clear
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div ref={analysisRef} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <p><strong>AI Influence:</strong> {results.aiInfluence}%</p>
            <p><strong>Score:</strong> {results.score.toFixed(1)} / 10</p>
            <p><strong>Readability:</strong> {results.readability.score} ({results.readability.level})</p>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">Suggestions</h3>
              <ul className="list-disc list-inside text-sm">
                {results.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">Strengths</h3>
              <ul className="list-disc list-inside text-sm">
                {results.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={() => setResults(null)} className="bg-blue-600 text-white px-5 py-2 rounded">
              New Analysis
            </button>
            <button onClick={() => navigate("/progress")} className="border px-5 py-2 rounded">
              View Progress
            </button>
            <button onClick={handleExportPDF} className="border px-5 py-2 rounded">
              Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TextAnalysis;
