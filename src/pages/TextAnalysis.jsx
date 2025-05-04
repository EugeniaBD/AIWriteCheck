import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getTokenUsage } from "../utils/tokenUtils"; // Import token calculation
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../contexts/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function TextAnalysis() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const analysisRef = useRef();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [canSubmit, setCanSubmit] = useState(true);
  const [tokensLeft, setTokensLeft] = useState(null);

  const minTextLength = 100;

  useEffect(() => {
    const checkTokenUsage = async () => {
      const { canSubmit, tokensLeft } = await getTokenUsage(currentUser.uid);
      setCanSubmit(canSubmit);
      setTokensLeft(tokensLeft);
    };

    checkTokenUsage();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      const confirm = window.confirm("You've used all your tokens. Would you like to upgrade your plan?");
      if (confirm) navigate("/subscription");
      return;
    }

    if (text.length < minTextLength) {
      setError(`Text must be at least ${minTextLength} characters long`);
      return;
    }

    try {
      setError("");
      setAnalyzing(true);
      const response = await fakeAIAnalysis(text);

      const submissionRef = await addDoc(collection(db, "submissions"), {
        userId: currentUser.uid,
        title: title || "Untitled Analysis",
        text,
        createdAt: serverTimestamp(),
        ...response,
      });

      setResults({
        id: submissionRef.id,
        ...response,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to analyze text.");
    } finally {
      setAnalyzing(false);
    }
  };

  const fakeAIAnalysis = async (text) => {
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
    const input = analysisRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${title || "text-analysis"}-${new Date().toISOString()}.pdf`);
  };

  const handleNew = () => {
    setTitle("");
    setText("");
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Text Analysis</h1>

      {tokensLeft !== null && (
        <div className="mb-4 text-sm text-gray-700">
          Tokens left this month: <strong>{tokensLeft}</strong>
        </div>
      )}

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {!results ? (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md p-6 space-y-4">
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            required
            className="w-full px-4 py-2 border rounded"
            placeholder="Paste or write your text..."
          ></textarea>
          <div className="text-sm text-gray-500">{text.length} / {minTextLength} characters</div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={analyzing || text.length < minTextLength}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {analyzing ? "Analyzing..." : "Analyze Text"}
            </button>
            <button type="button" onClick={() => setText("")} className="text-red-600">
              Clear
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div ref={analysisRef} className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6">
              <div>
                <p className="text-sm text-gray-500">AI Influence</p>
                <p className="text-2xl font-bold">{results.aiInfluence}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {results.score.toFixed(1)} / 10
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Readability</p>
                <p className="text-2xl font-bold text-green-600">
                  {results.readability.score}
                </p>
                <p className="text-sm text-gray-500">{results.readability.level}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Suggestions</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {results.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Strengths</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {results.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleNew} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
              New Analysis
            </button>
            <button
              onClick={() => navigate("/progress")}
              className="border px-5 py-2 rounded hover:bg-gray-50"
            >
              View Progress
            </button>
            <button
              onClick={handleExportPDF}
              className="border px-5 py-2 rounded hover:bg-gray-50"
            >
              Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TextAnalysis;
