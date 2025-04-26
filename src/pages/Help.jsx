
// File: src/pages/Help.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Help() {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const faqItems = [
    {
      id: 1,
      question: 'What does AIWriteCheck do?',
      answer: 'AIWriteCheck analyzes your text to detect patterns commonly associated with AI-generated content. It helps you improve your writing by identifying areas that may appear too "AI-like" and provides suggestions to make your content more authentic and human-sounding.'
    },
    {
      id: 2,
      question: 'How accurate is the AI detection?',
      answer: 'Our AI detection algorithm has been trained on thousands of text samples and achieves approximately 85-90% accuracy in identifying AI-generated content. However, no detection system is perfect, and results should be used as a guide rather than absolute truth.'
    },
    {
      id: 3,
      question: 'What is the "AI Influence" score?',
      answer: 'The AI Influence score represents the percentage of your text that exhibits patterns commonly found in AI-generated content. A lower score indicates more authentic, human-like writing, while a higher score suggests more AI-like patterns in your writing.'
    },
    {
      id: 4,
      question: 'How can I improve my writing based on the analysis?',
      answer: 'Focus on the specific suggestions provided in your analysis results. In general, aim to vary your sentence structures, use more personal anecdotes, incorporate unique perspectives, and avoid overly formulaic writing patterns. Regular practice and reviewing your work will help you develop a more authentic writing style.'
    },
    {
      id: 5,
      question: 'Can I check my writing multiple times?',
      answer: 'Yes! You can submit as many texts as you want for analysis. In fact, we encourage you to check your writing regularly to track your improvement over time.'
    },
    {
      id: 6,
      question: 'Is my writing data kept private?',
      answer: 'Absolutely. We take privacy seriously. Your submitted texts are stored securely and are only accessible to you. We do not share or sell your data to third parties. You can review our privacy policy for more details.'
    }
  ];
  
  const contactMethods = [
    {
      icon: 'fas fa-envelope',
      title: 'Email Support',
      description: 'Send us an email for direct assistance',
      contact: 'support@aiwritecheck.com',
      action: 'mailto:support@aiwritecheck.com'
    },
    {
      icon: 'fas fa-comments',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available Monday-Friday, 9am-5pm EST',
      action: '#chat'
    },
    {
      icon: 'fas fa-phone-alt',
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      contact: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    }
  ];
  
  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with AIWriteCheck',
      description: 'Learn the basics of using our platform to analyze your writing',
      link: '#tutorial-1'
    },
    {
      id: 2,
      title: 'Understanding Your Analysis Results',
      description: 'How to interpret your scores and recommendations',
      link: '#tutorial-2'
    },
    {
      id: 3,
      title: 'Tips for Reducing AI Influence in Your Writing',
      description: 'Practical strategies to make your writing more authentic',
      link: '#tutorial-3'
    },
    {
      id: 4,
      title: 'Tracking Your Progress Over Time',
      description: 'How to use our progress tracking features effectively',
      link: '#tutorial-4'
    }
  ];
  
  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Help Center</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'faq' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('faq')}
          >
            <i className="fas fa-question-circle mr-2"></i> FAQ
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'contact' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('contact')}
          >
            <i className="fas fa-headset mr-2"></i> Contact Support
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'tutorials' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tutorials')}
          >
            <i className="fas fa-book-open mr-2"></i> Tutorials
          </button>
        </div>
        
        <div className="p-6">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                      onClick={() => toggleFaq(item.id)}
                    >
                      <span className="font-medium text-gray-800">{item.question}</span>
                      <i className={`fas ${expandedFaq === item.id ? 'fa-minus' : 'fa-plus'} text-blue-600`}></i>
                    </button>
                    
                    {expandedFaq === item.id && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  <i className="fas fa-info-circle mr-2"></i> Can't find what you're looking for? Feel free to <button onClick={() => setActiveTab('contact')} className="text-blue-600 underline">contact our support team</button>.
                </p>
              </div>
            </div>
          )}
          
          {/* Contact Support Tab */}
          {activeTab === 'contact' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Contact Support</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.action}
                    className="block bg-gray-50 border border-gray-200 rounded-lg p-6 hover:bg-gray-100 transition"
                  >
                    <div className="text-center">
                      <i className={`${method.icon} text-3xl text-blue-600 mb-3`}></i>
                      <h3 className="font-medium text-gray-800 mb-2">{method.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                      <p className="text-blue-600 font-medium">{method.contact}</p>
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-gray-800 mb-3">Send Us a Message</h3>
                
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="subject">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="What is your message regarding?"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="5"
                      placeholder="Please describe your issue or question in detail"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {/* Tutorials Tab */}
          {activeTab === 'tutorials' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Video Tutorials</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorials.map((tutorial) => (
                  <a
                    key={tutorial.id}
                    href={tutorial.link}
                    className="block bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    <div className="bg-gray-200 h-40 flex items-center justify-center">
                      <i className="fas fa-play-circle text-5xl text-gray-400"></i>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 mb-2">{tutorial.title}</h3>
                      <p className="text-sm text-gray-600">{tutorial.description}</p>
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-gray-800 mb-3">Helpful Guides</h3>
                
                <ul className="space-y-3">
                  <li>
                    <a href="#guide-1" className="flex items-center text-blue-600 hover:text-blue-700">
                      <i className="fas fa-file-pdf mr-3 text-red-500"></i>
                      <span>Complete User Guide (PDF)</span>
                    </a>
                  </li>
                  <li>
                    // File: src/pages/Help.js (continued from where it cut off)
                    <a href="#guide-2" className="flex items-center text-blue-600 hover:text-blue-700">
                      <i className="fas fa-file-alt mr-3 text-blue-500"></i>
                      <span>Quick Start Guide</span>
                    </a>
                  </li>
                  <li>
                    <a href="#guide-3" className="flex items-center text-blue-600 hover:text-blue-700">
                      <i className="fas fa-book mr-3 text-green-500"></i>
                      <span>Writing Improvement Techniques</span>
                    </a>
                  </li>
                  <li>
                    <a href="#guide-4" className="flex items-center text-blue-600 hover:text-blue-700">
                      <i className="fas fa-graduation-cap mr-3 text-purple-500"></i>
                      <span>Advanced Analysis Features</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Popular Topics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/dashboard" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium text-gray-800 mb-1">Getting Started</h3>
            <p className="text-sm text-gray-600">Learn how to use the dashboard</p>
          </Link>
          
          <Link to="/analysis" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium text-gray-800 mb-1">Text Analysis</h3>
            <p className="text-sm text-gray-600">How our analysis works</p>
          </Link>
          
          <Link to="/progress" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium text-gray-800 mb-1">Tracking Progress</h3>
            <p className="text-sm text-gray-600">Monitor your improvement</p>
          </Link>
          
          <Link to="/settings" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium text-gray-800 mb-1">Account Settings</h3>
            <p className="text-sm text-gray-600">Manage your preferences</p>
          </Link>
          
          <a href="#privacy" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium text-gray-800 mb-1">Privacy Policy</h3>
            <p className="text-sm text-gray-600">How we protect your data</p>
          </a>
          
          <a href="#terms" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <h3 className="font-medium text-gray-800 mb-1">Terms of Service</h3>
            <p className="text-sm text-gray-600">Our terms and conditions</p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Help;





