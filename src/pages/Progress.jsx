// File: src/pages/Progress.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Progress() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const submissionsRef = collection(db, 'submissions');
        const q = query(
          submissionsRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const submissionsList = [];
        querySnapshot.forEach((doc) => {
          submissionsList.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || null
          });
        });
        
        setSubmissions(submissionsList);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setError('Failed to load your progress data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubmissions();
  }, [currentUser]);
  
  const filteredSubmissions = () => {
    if (filter === 'all') return submissions;
    if (filter === 'high-ai') return submissions.filter(sub => sub.aiInfluence > 50);
    if (filter === 'low-ai') return submissions.filter(sub => sub.aiInfluence <= 20);
    if (filter === 'high-score') return submissions.filter(sub => sub.score >= 8);
    if (filter === 'updated') return submissions.filter(sub => sub.updatedAt !== null);
    return submissions;
  };
  
  const getAverageScores = () => {
    if (submissions.length === 0) return { avgScore: 0, avgAiInfluence: 0 };
    
    const totalScore = submissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
    const totalAiInfluence = submissions.reduce((sum, sub) => sum + (sub.aiInfluence || 0), 0);
    
    return {
      avgScore: totalScore / submissions.length,
      avgAiInfluence: totalAiInfluence / submissions.length
    };
  };
  
  const { avgScore, avgAiInfluence } = getAverageScores();

  const handleViewSubmission = (submissionId) => {
    navigate(`/analysis/${submissionId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-blue-600 text-4xl mb-4"></i>
          <p className="text-gray-600">Loading your progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Writing Progress</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <i className="fas fa-exclamation-circle mr-2"></i> {error}
        </div>
      )}
      
      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <i className="fas fa-chart-line text-gray-300 text-5xl mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Data Yet</h2>
          <p className="text-gray-600 mb-6">Submit your first text analysis to start tracking your progress!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Average Quality Score</h2>
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mr-6">
                  <span className="text-3xl font-bold text-blue-600">{avgScore.toFixed(1)}</span>
                </div>
                <div>
                  <p className="text-gray-600">Your average quality score across all submissions</p>
                  <p className="mt-2 text-sm">
                    {avgScore >= 8 ? (
                      <span className="text-green-600">Excellent! Your writing shows high quality.</span>
                    ) : avgScore >= 6 ? (
                      <span className="text-blue-600">Good. Your writing is of decent quality.</span>
                    ) : (
                      <span className="text-yellow-600">There's room for improvement in your writing quality.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Average AI Influence</h2>
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mr-6">
                  <span className="text-3xl font-bold text-purple-600">{avgAiInfluence.toFixed(1)}%</span>
                </div>
                <div>
                  <p className="text-gray-600">Your average AI influence across all submissions</p>
                  <p className="mt-2 text-sm">
                    {avgAiInfluence <= 20 ? (
                      <span className="text-green-600">Excellent! Your writing shows high originality.</span>
                    ) : avgAiInfluence <= 50 ? (
                      <span className="text-blue-600">Good. Your writing shows moderate AI influence.</span>
                    ) : (
                      <span className="text-yellow-600">Your writing shows significant AI patterns.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Submission History</h2>
              <div>
                <label htmlFor="filter" className="text-sm text-gray-600 mr-2">
                  Filter:
                </label>
                <select
                  id="filter"
                  className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Submissions</option>
                  <option value="high-ai">High AI Influence</option>
                  <option value="low-ai">Low AI Influence</option>
                  <option value="high-score">High Quality (8+)</option>
                  <option value="updated">Revised Submissions</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Influence
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions().map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.title || 'Untitled'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {submission.createdAt.toLocaleDateString()}
                          {submission.updatedAt && (
                            <span className="ml-2 text-xs text-blue-500">
                              (updated: {submission.updatedAt.toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {submission.score ? submission.score.toFixed(1) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          submission.aiInfluence > 50 
                            ? 'bg-red-100 text-red-800' 
                            : submission.aiInfluence > 20 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {submission.aiInfluence ? `${submission.aiInfluence}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.updatedAt ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Revised
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Original
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewSubmission(submission.id)} 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <i className="fas fa-eye mr-1"></i> View/Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredSubmissions().length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500">No submissions match the selected filter.</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Improvement Tips</h2>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h3 className="font-medium text-blue-800">Consistency is Key</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Regular writing practice helps improve your natural writing style. Try to write a little every day.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h3 className="font-medium text-green-800">Review and Edit</h3>
                <p className="text-sm text-green-700 mt-1">
                  Always review your writing after completion. Look for patterns that might suggest AI influence.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                <h3 className="font-medium text-purple-800">Personalize Your Content</h3>
                <p className="text-sm text-purple-700 mt-1">
                  Add personal anecdotes, unique perspectives, and unconventional examples to make your writing more human.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                <h3 className="font-medium text-yellow-800">Learn from Revisions</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Revise your previous submissions to apply new skills and see how your score improves over time.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Progress;