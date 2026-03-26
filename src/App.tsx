/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  auth, db, googleProvider, signInWithPopup, onAuthStateChanged, User, 
  handleFirestoreError, OperationType, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
} from './firebase';
import { 
  doc, getDoc, setDoc, updateDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { 
  BookOpen, Calendar, CheckCircle, Clock, LayoutDashboard, LogOut, 
  MessageSquare, Play, Plus, Settings, User as UserIcon, Zap, 
  Award, Brain, Coffee, Moon, Sun, Target, TrendingUp, X,
  ChevronRight, ArrowLeft, RefreshCw, Sparkles, Volume2, Accessibility, Users, Info, Timer, AlertTriangle, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, Schedule, ScheduleBlock, StudySession, QuizResult, ExamQuestion } from './types';
import { generateTimetable, getBuddyMessage, generateQuiz } from './services/geminiService';
import { PRACTICE_QUESTIONS } from './data/practiceQuestions';

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon: Icon }: any) => {
  const variants: any = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    secondary: 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-sm',
    ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-100',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    accent: 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', id }: any) => (
  <div id={id} className={`bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'emerald' }: any) => {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    zinc: 'bg-zinc-50 text-zinc-700 border-zinc-100',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[color]}`}>
      {children}
    </span>
  );
};

const Quiz = ({ subject, educationLevel, targetExams, cachedQuestions, onCacheQuestions, onComplete, onCancel }: any) => {
  const [questions, setQuestions] = useState<any[]>(cachedQuestions || []);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(!cachedQuestions);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (cachedQuestions) return;
    
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const q = await generateQuiz(subject, educationLevel, targetExams);
        setQuestions(q);
        onCacheQuestions(q);
      } catch (error) {
        console.error("Quiz generation failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [subject, educationLevel, targetExams, cachedQuestions]);

  const handleAnswer = (idx: number) => {
    if (idx === questions[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-2">
            <div className="h-2 w-24 bg-zinc-100 rounded-full animate-pulse" />
            <div className="h-6 w-48 bg-zinc-100 rounded-lg animate-pulse" />
          </div>
          <div className="w-10 h-10 bg-zinc-50 rounded-full animate-pulse" />
        </div>
        
        <div className="flex-1 max-w-2xl mx-auto w-full space-y-8">
          <div className="space-y-4">
            <div className="h-8 w-full bg-zinc-100 rounded-xl animate-pulse" />
            <div className="h-8 w-3/4 bg-zinc-100 rounded-xl animate-pulse" />
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 w-full bg-zinc-50 rounded-2xl border border-zinc-100 animate-pulse" />
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} 
            className="mb-4"
          >
            <RefreshCw className="text-emerald-600 opacity-20" size={48} />
          </motion.div>
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Ace is crafting your quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center text-zinc-300 mb-6">
          <BookOpen size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
        <p className="text-zinc-500 mb-8">Ace couldn't generate questions for this subject right now.</p>
        <Button variant="secondary" onClick={onCancel}>Go Back</Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-6">
          <Award size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-zinc-500 mb-8">You scored {score} out of {questions.length}</p>
        <div className="flex gap-3 w-full max-w-xs">
          <Button className="flex-1" onClick={() => onComplete(score, questions.length)}>Finish</Button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col p-6">
      <div className="flex justify-between items-center mb-12">
        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Question {currentQuestion + 1} of {questions.length}</p>
          <h3 className="text-lg font-bold">{subject} Practice</h3>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-zinc-100 rounded-full transition-colors flex items-center gap-2 text-zinc-500 font-bold text-xs">
          <X size={20} /> Quit Quiz
        </button>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full">
        <h4 className="text-2xl font-bold mb-8 leading-tight">{q.question}</h4>
        <div className="space-y-3">
          {q.options.map((opt: string, idx: number) => (
            <button 
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full p-5 text-left rounded-2xl border border-zinc-100 hover:border-emerald-600 hover:bg-emerald-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="font-medium">{opt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const EditBuddyModal = ({ profile, onSave, onCancel }: any) => {
  const [data, setData] = useState({
    buddyType: profile.buddyType,
    buddyName: profile.buddyName,
    buddyRating: profile.buddyRating || 5,
    buddyAlwaysPicksCalls: profile.buddyAlwaysPicksCalls ?? true,
    buddyCaresAboutStudies: profile.buddyCaresAboutStudies ?? true,
  });

  return (
    <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Edit Buddy</h3>
          <button onClick={onCancel}><X size={20} /></button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Buddy Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'AI', label: 'AI', icon: Brain },
                { id: 'Contact', label: 'Friend', icon: MessageSquare },
                { id: 'Guardian', label: 'Guardian', icon: UserIcon },
                { id: 'AppUser', label: 'App User', icon: Sparkles }
              ].map(type => (
                <button 
                  key={type.id}
                  onClick={() => setData({ ...data, buddyType: type.id as any })}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${data.buddyType === type.id ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold' : 'border-zinc-100 bg-white'}`}
                >
                  <type.icon size={16} />
                  <span className="text-[8px]">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {data.buddyType !== 'AI' && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Buddy Name</label>
                <input 
                  type="text" 
                  value={data.buddyName}
                  onChange={(e) => setData({ ...data, buddyName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-zinc-100 text-sm"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Listening Rate (1-5)</label>
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num}
                        onClick={() => setData({ ...data, buddyRating: num })}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${data.buddyRating === num ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-zinc-400 border-zinc-100'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">Always pick calls?</span>
                  <div className="flex gap-2">
                    <button onClick={() => setData({ ...data, buddyAlwaysPicksCalls: true })} className={`px-3 py-1 rounded-lg text-[10px] border ${data.buddyAlwaysPicksCalls ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-400'}`}>Yes</button>
                    <button onClick={() => setData({ ...data, buddyAlwaysPicksCalls: false })} className={`px-3 py-1 rounded-lg text-[10px] border ${!data.buddyAlwaysPicksCalls ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-400'}`}>No</button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">Cares about studies?</span>
                  <div className="flex gap-2">
                    <button onClick={() => setData({ ...data, buddyCaresAboutStudies: true })} className={`px-3 py-1 rounded-lg text-[10px] border ${data.buddyCaresAboutStudies ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-400'}`}>Yes</button>
                    <button onClick={() => setData({ ...data, buddyCaresAboutStudies: false })} className={`px-3 py-1 rounded-lg text-[10px] border ${!data.buddyCaresAboutStudies ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-400'}`}>No</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

          <div className="mt-8 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
            <Button className="flex-1" onClick={() => onSave(data)}>Save Changes</Button>
          </div>
        </motion.div>
      </div>
    );
  };

const ExamPractice = ({ onCancel, onComplete }: { onCancel: () => void, onComplete: (score: number, total: number, subject: string, examType: string) => void }) => {
  const [selectedExamType, setSelectedExamType] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const examTypes = Array.from(new Set(PRACTICE_QUESTIONS.map(q => q.examType)));
  const subjects = Array.from(new Set(PRACTICE_QUESTIONS.filter(q => !selectedExamType || q.examType === selectedExamType).map(q => q.subject)));
  const years = Array.from(new Set(PRACTICE_QUESTIONS.filter(q => (!selectedExamType || q.examType === selectedExamType) && (!selectedSubject || q.subject === selectedSubject)).map(q => q.year))).filter(y => y !== undefined).sort((a, b) => (b as number) - (a as number));

  const startPractice = () => {
    let filtered = PRACTICE_QUESTIONS;
    if (selectedExamType) filtered = filtered.filter(q => q.examType === selectedExamType);
    if (selectedSubject) filtered = filtered.filter(q => q.subject === selectedSubject);
    if (selectedYear) filtered = filtered.filter(q => q.year === selectedYear);
    
    if (filtered.length === 0) {
      alert("No questions found for this selection.");
      return;
    }

    // Shuffle and pick 10 questions
    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 10);

    setQuestions(shuffled);
    setUserAnswers(new Array(shuffled.length).fill(null));
    setCurrentIdx(0);
    setShowExplanation(false);
    setFinished(false);
  };

  const handleAnswer = (optionIdx: number) => {
    if (finished) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = optionIdx;
    setUserAnswers(newAnswers);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(userAnswers[currentIdx + 1] !== null);
    } else {
      setFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setShowExplanation(true);
    }
  };

  const score = userAnswers.reduce((acc, ans, idx) => {
    return ans === questions[idx]?.correctAnswer ? acc + 1 : acc;
  }, 0);

  if (questions.length > 0 && !finished) {
    const q = questions[currentIdx];
    const hasAnswered = userAnswers[currentIdx] !== null;

    return (
      <div className="fixed inset-0 bg-white z-[110] flex flex-col p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Badge color="violet">{q.examType} Practice</Badge>
            <h3 className="text-lg font-bold mt-1">{q.subject} {q.year ? `(${q.year})` : ''}</h3>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-zinc-100 rounded-full transition-colors flex items-center gap-2 text-zinc-500 font-bold text-xs">
            <X size={20} /> Quit
          </button>
        </div>

        <div className="flex-1 max-w-2xl mx-auto w-full pb-24">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</p>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Score: {score}</p>
          </div>

          <h4 className="text-xl font-bold mb-8 leading-tight">{q.question}</h4>
          
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let style = "border-zinc-100";
              if (hasAnswered) {
                if (idx === q.correctAnswer) style = "border-emerald-500 bg-emerald-50 text-emerald-700";
                else if (idx === userAnswers[currentIdx]) style = "border-red-500 bg-red-50 text-red-700";
                else style = "opacity-50";
              }

              return (
                <button 
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 text-left rounded-2xl border transition-all flex items-center gap-4 ${style} ${!hasAnswered ? 'hover:border-emerald-600 hover:bg-emerald-50' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${hasAnswered && idx === q.correctAnswer ? 'bg-emerald-600 text-white' : 'bg-zinc-50 text-zinc-400'}`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Explanation</p>
              <p className="text-sm text-zinc-600 leading-relaxed">{q.explanation}</p>
            </motion.div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-zinc-100 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={prevQuestion} disabled={currentIdx === 0} icon={ArrowLeft}>Back</Button>
          <Button className="flex-1" onClick={nextQuestion} icon={ChevronRight}>
            {currentIdx === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="fixed inset-0 bg-white z-[110] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-6">
          <Award size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Practice Complete!</h2>
        <p className="text-zinc-500 mb-8">You scored {score} out of {questions.length}</p>
        <div className="flex gap-3 w-full max-w-xs">
          <Button className="flex-1" onClick={() => { setQuestions([]); setFinished(false); }}>Retry</Button>
          <Button variant="secondary" className="flex-1" onClick={() => onComplete(score, questions.length, questions[0].subject, questions[0].examType)}>Finish</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[110] flex flex-col p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {(selectedExamType || selectedSubject) && (
            <button 
              onClick={() => {
                if (selectedSubject) setSelectedSubject(null);
                else if (selectedExamType) setSelectedExamType(null);
              }}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-2xl font-bold tracking-tight">Exam Practice</h2>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-8 max-w-md mx-auto w-full pb-12">
        {!selectedExamType ? (
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Select Exam Type</label>
            <div className="grid grid-cols-1 gap-2">
              {examTypes.map(type => (
                <button 
                  key={type}
                  onClick={() => setSelectedExamType(type)}
                  className="p-4 rounded-2xl border border-zinc-100 text-left hover:border-emerald-600 hover:bg-emerald-50 transition-all flex justify-between items-center"
                >
                  <span className="font-bold">{type}</span>
                  <ChevronRight size={18} className="text-zinc-400" />
                </button>
              ))}
            </div>
          </div>
        ) : !selectedSubject ? (
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Select Subject for {selectedExamType}</label>
            <div className="grid grid-cols-1 gap-2">
              {subjects.map(s => (
                <button 
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  className="p-4 rounded-2xl border border-zinc-100 text-left hover:border-emerald-600 hover:bg-emerald-50 transition-all flex justify-between items-center"
                >
                  <span className="font-bold">{s}</span>
                  <ChevronRight size={18} className="text-zinc-400" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Select Year (Optional)</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedYear(null)}
                  className={`px-4 py-2 rounded-xl border text-sm transition-all ${selectedYear === null ? 'border-emerald-600 bg-emerald-50 font-bold' : 'border-zinc-100'}`}
                >
                  All Years
                </button>
                {years.map(y => (
                  <button 
                    key={y}
                    onClick={() => setSelectedYear(y as number)}
                    className={`px-4 py-2 rounded-xl border text-sm transition-all ${selectedYear === y ? 'border-emerald-600 bg-emerald-50 font-bold' : 'border-zinc-100'}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2">Ready to start?</h4>
              <p className="text-sm text-emerald-700 mb-4">You'll be practicing {selectedSubject} for {selectedExamType}. Ace will pick 10 questions for you.</p>
              <Button className="w-full py-4 text-lg" onClick={startPractice} icon={Play}>
                Start Practice Session
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAbout, setShowAbout] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
  const [buddyMessage, setBuddyMessage] = useState<string>('Hey there! Ready to start our study session?');
  const [isBuddyLoading, setIsBuddyLoading] = useState(false);
  const [notifiedBlocks, setNotifiedBlocks] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [showGoalModal, setShowGoalModal] = useState<string | null>(null);
  const [goalData, setGoalData] = useState({ targetQuizzes: 5, targetScore: 80 });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    voiceAssistance: false
  });
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timer, setTimer] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [quizCache, setQuizCache] = useState<{ [key: string]: any[] }>({});
  const [showExamPractice, setShowExamPractice] = useState(false);
  const [showBuddyEdit, setShowBuddyEdit] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // --- Auth & Profile ---

  useEffect(() => {
    console.log('App State:', { user: user?.uid, profile: !!profile, showOnboarding, loading, isAuthReady });
  }, [user, profile, showOnboarding, loading, isAuthReady]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      console.log('Auth State Changed:', u?.uid);
      setUser(u);
      setIsAuthReady(true);
      if (u) {
        try {
          console.log('Fetching profile for:', u.uid);
          const profileDoc = await getDoc(doc(db, 'users', u.uid));
          if (profileDoc.exists()) {
            console.log('Profile found');
            setProfile(profileDoc.data() as UserProfile);
            setShowOnboarding(false);
          } else {
            console.log('No profile found, showing onboarding');
            setShowOnboarding(true);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          handleFirestoreError(error, OperationType.GET, `users/${u.uid}`);
        }
      } else {
        console.log('User logged out');
        setProfile(null);
        setShowOnboarding(false);
      }
      setLoading(false);
    });

    // Safety timeout: if auth doesn't respond in 10s, stop loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth state timeout reached');
        setLoading(false);
        setIsAuthReady(true);
      }
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Login failed:', error);
      setAuthError(error.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error('Email auth failed:', error);
      setAuthError(error.message);
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  // --- Real-time Listeners ---

  useEffect(() => {
    if (!user || !isAuthReady) return;

    const today = new Date().toISOString().split('T')[0];
    const q = query(collection(db, 'schedules'), where('userId', '==', user.uid), where('date', '==', today));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setCurrentSchedule({ id: doc.id, ...doc.data() } as Schedule);
      } else {
        setCurrentSchedule(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'schedules');
    });

    return unsubscribe;
  }, [user, isAuthReady]);

  // --- AI Logic ---

  const handleGenerateSchedule = async () => {
    if (!profile || !user) return;
    setLoading(true);
    try {
      const blocks = await generateTimetable(profile);
      const today = new Date().toISOString().split('T')[0];
      const scheduleData: Schedule = {
        userId: user.uid,
        date: today,
        blocks
      };
      
      if (currentSchedule?.id) {
        await setDoc(doc(db, 'schedules', currentSchedule.id), scheduleData);
      } else {
        await addDoc(collection(db, 'schedules'), scheduleData);
      }
    } catch (error) {
      console.error('Failed to generate schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuddyMessage = useCallback(async (mood: string) => {
    if (!profile) return;
    setIsBuddyLoading(true);
    
    // Calculate progress context
    let progressContext = "";
    if (profile.practiceGoals && profile.practiceGoals.length > 0) {
      const topGoal = profile.practiceGoals[0];
      const progress = getSubjectProgress(topGoal.subject);
      progressContext = `The student has a goal for ${topGoal.subject}: ${progress.quizzes}/${topGoal.targetQuizzes} quizzes done, average score ${progress.score}%.`;
    }

    try {
      const msg = await getBuddyMessage(profile, mood, progressContext);
      setBuddyMessage(msg);
    } catch (error) {
      console.error("Error fetching buddy message:", error);
    } finally {
      setIsBuddyLoading(false);
    }
  }, [profile, quizResults]);

  useEffect(() => {
    if (profile && !buddyMessage) {
      fetchBuddyMessage('motivated');
    }
  }, [profile, buddyMessage, fetchBuddyMessage]);

  // --- Focus Timer ---

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      // Handle session completion
      if (activeSession) {
        completeSession();
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startSession = async (subject: string) => {
    if (!user) return;
    const session: StudySession = {
      userId: user.uid,
      subject,
      durationMinutes: 25,
      startTime: new Date().toISOString(),
      buddyId: profile?.buddyId
    };
    setActiveSession(session);
    setIsTimerRunning(true);
    setIsFocusMode(true);
  };

  const completeSession = async () => {
    if (!activeSession || !user) return;
    try {
      await addDoc(collection(db, 'studySessions'), {
        ...activeSession,
        endTime: new Date().toISOString()
      });
      setActiveSession(null);
      setTimer(25 * 60);
      setIsFocusMode(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'studySessions');
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject || !profile || !user) return;
    const subjects = profile.subjects || [];
    if (subjects.includes(newSubject)) {
      setToast({ title: 'Subject exists', message: 'This subject is already in your list.', type: 'warning' });
      return;
    }
    
    setIsAddingSubject(true);
    const updatedSubjects = [...subjects, newSubject];
    try {
      await updateDoc(doc(db, 'users', user.uid), { subjects: updatedSubjects });
      setProfile({ ...profile, subjects: updatedSubjects });
      setNewSubject('');
      setToast({ title: 'Subject added', message: `${newSubject} has been added to your profile.`, type: 'success' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsAddingSubject(false);
    }
  };

  const handleRemoveSubject = async (subject: string) => {
    if (!profile || !user) return;
    const subjects = profile.subjects || [];
    const updatedSubjects = subjects.filter(s => s !== subject);
    try {
      await updateDoc(doc(db, 'users', user.uid), { subjects: updatedSubjects });
      setProfile({ ...profile, subjects: updatedSubjects });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  // --- Reminders ---
  useEffect(() => {
    if (!profile || !currentSchedule) return;

    const checkReminders = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
      
      if (currentSchedule.date !== currentDay) return;

      currentSchedule.blocks.forEach((block, index) => {
        if (block.type !== 'Study' || block.completed) return;

        const [hours, minutes] = block.startTime.split(':').map(Number);
        const blockStartTime = new Date(now);
        blockStartTime.setHours(hours, minutes, 0, 0);

        const diffMinutes = (blockStartTime.getTime() - now.getTime()) / (1000 * 60);
        const blockId = `${currentSchedule.date}-${index}`;

        // Notify 15 minutes before
        if (diffMinutes > 14 && diffMinutes <= 15 && !notifiedBlocks.includes(`${blockId}-15`)) {
          sendNotification(`Upcoming Study Session`, `Your ${block.subject} session starts in 15 minutes!`);
          setNotifiedBlocks(prev => [...prev, `${blockId}-15`]);
        }

        // Notify at start time
        if (diffMinutes > -1 && diffMinutes <= 0 && !notifiedBlocks.includes(`${blockId}-start`)) {
          sendNotification(`Study Session Starting`, `It's time for your ${block.subject} session!`);
          setNotifiedBlocks(prev => [...prev, `${blockId}-start`]);
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [profile, currentSchedule, notifiedBlocks]);

  const sendNotification = (title: string, body: string) => {
    // Browser Notification
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
    
    // In-app Notification (Toast-like)
    // For now, we'll just use an alert or a custom state if we had a toast system
    // Let's add a simple toast state
    setToast({ title, message: body, type: 'info' });
  };

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const [toast, setToast] = useState<{ title: string; message: string; type: string } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  // --- Accessibility Root Effects ---
  useEffect(() => {
    const root = document.documentElement;
    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (accessibilitySettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [accessibilitySettings.highContrast, accessibilitySettings.largeText]);

  const [isListening, setIsListening] = useState(false);

  // --- Voice Assistance Logic ---

  useEffect(() => {
    if (accessibilitySettings.voiceAssistance && activeTab) {
      const tabName = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
      const utterance = new SpeechSynthesisUtterance(`Navigated to ${tabName} tab`);
      window.speechSynthesis.speak(utterance);
    }
  }, [activeTab, accessibilitySettings.voiceAssistance]);

  useEffect(() => {
    if (accessibilitySettings.voiceAssistance && buddyMessage && !isBuddyLoading) {
      const utterance = new SpeechSynthesisUtterance(`Ace says: ${buddyMessage}`);
      window.speechSynthesis.speak(utterance);
    }
  }, [buddyMessage, isBuddyLoading, accessibilitySettings.voiceAssistance]);

  const handleReadBuddyMessage = () => {
    if (!buddyMessage) return;
    const utterance = new SpeechSynthesisUtterance(buddyMessage);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToast({ title: 'Not supported', message: 'Voice commands are not supported in this browser.', type: 'warning' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setToast({ title: 'Listening...', message: 'Say a command like "Go to Schedule" or "Start Session"', type: 'info' });
    };

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log('Voice Command:', command);

      if (command.includes('home') || command.includes('dashboard')) {
        setActiveTab('dashboard');
      } else if (command.includes('schedule')) {
        setActiveTab('schedule');
      } else if (command.includes('practice')) {
        setActiveTab('practice');
      } else if (command.includes('buddy')) {
        setActiveTab('buddy');
      } else if (command.includes('award') || command.includes('achievement')) {
        setActiveTab('achievements');
      } else if (command.includes('setting')) {
        setActiveTab('settings');
      } else if (command.includes('start session') || command.includes('focus')) {
        if (profile?.subjects?.[0]) {
          startSession(profile.subjects[0]);
        } else {
          setToast({ title: 'No subjects', message: 'Add a subject first to start a session.', type: 'warning' });
        }
      } else if (command.includes('stop') || command.includes('pause')) {
        setIsTimerRunning(false);
      } else if (command.includes('resume') || command.includes('play')) {
        setIsTimerRunning(true);
      } else {
        setToast({ title: 'Command not recognized', message: `You said: "${command}". Try "Go to Schedule".`, type: 'warning' });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleInviteFriend = async () => {
    if (!('contacts' in navigator && 'select' in (navigator as any).contacts)) {
      setToast({ title: 'Not supported', message: 'Contact Picker API is not supported on this device.', type: 'warning' });
      return;
    }

    try {
      const props = ['name', 'email', 'tel'];
      const opts = { multiple: true };
      const contacts = await (navigator as any).contacts.select(props, opts);
      
      if (contacts.length > 0) {
        const names = contacts.map((c: any) => c.name[0]).join(', ');
        
        // If navigator.share is available, use it to send the invite
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Join Study Buddy!',
              text: `Hey! I'm using Study Buddy to ace my exams. Join me!`,
              url: window.location.origin
            });
            setToast({ title: 'Invitation Sent', message: `Shared with ${contacts.length} friends!`, type: 'success' });
          } catch (shareErr) {
            // User might have cancelled share
            console.log('Share cancelled or failed', shareErr);
            setToast({ title: 'Contacts Selected', message: `Selected ${contacts.length} friends: ${names}`, type: 'info' });
          }
        } else {
          setToast({ title: 'Contacts Selected', message: `Selected ${contacts.length} friends: ${names}. You can now send them a link!`, type: 'success' });
        }
      }
    } catch (err) {
      console.error('Contact selection failed:', err);
    }
  };

  const handleAddBuddyFromContacts = async () => {
    if (!('contacts' in navigator && 'select' in (navigator as any).contacts)) {
      setToast({ title: 'Not supported', message: 'Contact Picker API is not supported on this device.', type: 'warning' });
      return;
    }

    try {
      const props = ['name', 'tel'];
      const opts = { multiple: false };
      const contacts = await (navigator as any).contacts.select(props, opts);
      if (contacts.length > 0) {
        const contact = contacts[0];
        const newBuddy = {
          buddyName: contact.name[0],
          buddyType: 'Friend',
          buddyRating: 5,
          buddyAlwaysPicksCalls: true,
          buddyCaresAboutStudies: true
        };
        await handleUpdateBuddy(newBuddy);
        setToast({ title: 'Buddy Added', message: `${contact.name[0]} is now your study buddy!`, type: 'success' });
      }
    } catch (err) {
      console.error('Contact selection failed:', err);
    }
  };

  const handleSetGoal = async () => {
    if (!profile || !user || !showGoalModal) return;
    const currentGoals = profile.practiceGoals || [];
    const otherGoals = currentGoals.filter(g => g.subject !== showGoalModal);
    const updatedGoals = [...otherGoals, { subject: showGoalModal, ...goalData }];
    
    try {
      await updateDoc(doc(db, 'users', user.uid), { practiceGoals: updatedGoals });
      setProfile({ ...profile, practiceGoals: updatedGoals });
      setShowGoalModal(null);
      setToast({ title: 'Goal Set', message: `Goal updated for ${showGoalModal}`, type: 'success' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const getSubjectProgress = (subject: string) => {
    const goal = profile?.practiceGoals?.find(g => g.subject === subject);
    if (!goal) return { quizzes: 0, score: 0, percent: 0 };
    
    const results = quizResults.filter(r => r.subject === subject);
    const quizzesDone = results.length;
    const avgScore = results.length > 0 
      ? (results.reduce((acc, r) => acc + (r.score / r.totalQuestions), 0) / results.length) * 100 
      : 0;
    
    const quizProgress = Math.min((quizzesDone / goal.targetQuizzes) * 100, 100);
    const scoreProgress = goal.targetScore > 0 ? Math.min((avgScore / goal.targetScore) * 100, 100) : 0;
    
    return {
      quizzes: quizzesDone,
      score: Math.round(avgScore),
      percent: Math.round((quizProgress + scoreProgress) / 2)
    };
  };
  const handleUpdateBuddy = async (buddyData: any) => {
    if (!profile || !user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), buddyData);
      setProfile({ ...profile, ...buddyData });
      setShowBuddyEdit(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleStartQuiz = async (subject: string) => {
    setActiveQuiz({ subject });
    if (!quizCache[subject]) {
      // Prefetching logic could go here, but for now we just mark it as active
      // and the Quiz component will handle the fetch if not in cache.
    }
  };

  const handleQuizComplete = async (score: number, total: number, subject?: string, examType?: string) => {
    if (!user) return;
    
    const quizSubject = subject || activeQuiz?.subject;
    if (!quizSubject) return;

    const result: QuizResult = {
      userId: user.uid,
      subject: quizSubject,
      examType: examType || 'General',
      score,
      totalQuestions: total,
      date: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'quizResults'), result);
      setQuizResults(prev => [...prev, result]);
      setActiveQuiz(null);
      setShowExamPractice(false);
      setToast({ title: 'Quiz Saved', message: `You scored ${score}/${total} in ${quizSubject}!`, type: 'success' });
      
      // Smart Integration: Adjust timetable based on performance
      adjustTimetableBasedOnPerformance(quizSubject, score, total);

      // Clear cache for this subject to get fresh questions next time if desired
      setQuizCache(prev => {
        const newCache = { ...prev };
        delete newCache[quizSubject];
        return newCache;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'quizResults');
    }
  };

  const adjustTimetableBasedOnPerformance = async (subject: string, score: number, total: number) => {
    if (!user || !profile || !currentSchedule) return;

    const percentage = (score / total) * 100;
    let adjustmentMessage = '';

    // Simple logic: 
    // < 50% -> Increase study time (Poor performance)
    // > 80% -> Decrease study time slightly (Strong performance)
    
    if (percentage < 50) {
      adjustmentMessage = `Ace noticed you're struggling with ${subject}. I've increased its study time in your next schedule.`;
      // In a real app, we'd update the profile's weaknesses or a specific weight for the AI generator
      const newWeaknesses = Array.from(new Set([...(profile.weaknesses || []), subject]));
      await updateDoc(doc(db, 'users', user.uid), { weaknesses: newWeaknesses });
    } else if (percentage > 85) {
      adjustmentMessage = `Great job in ${subject}! You're mastering this. I'll focus more on other subjects for now.`;
      const newStrengths = Array.from(new Set([...(profile.strengths || []), subject]));
      const newWeaknesses = (profile.weaknesses || []).filter(w => w !== subject);
      await updateDoc(doc(db, 'users', user.uid), { strengths: newStrengths, weaknesses: newWeaknesses });
    }

    if (adjustmentMessage) {
      setToast({ title: 'Ace Recommendation', message: adjustmentMessage, type: 'info' });
      // Trigger a schedule regeneration to reflect changes
      handleGenerateSchedule();
    }
  };

  const getPerformanceInsights = () => {
    if (quizResults.length === 0) return null;

    const subjectStats: { [key: string]: { total: number, score: number, count: number } } = {};
    
    quizResults.forEach(res => {
      if (!subjectStats[res.subject]) {
        subjectStats[res.subject] = { total: 0, score: 0, count: 0 };
      }
      subjectStats[res.subject].total += res.totalQuestions;
      subjectStats[res.subject].score += res.score;
      subjectStats[res.subject].count += 1;
    });

    const insights = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      avgScore: (stats.score / stats.total) * 100,
      count: stats.count
    }));

    const weak = insights.filter(i => i.avgScore < 60).sort((a, b) => a.avgScore - b.avgScore);
    const strong = insights.filter(i => i.avgScore >= 80).sort((a, b) => b.avgScore - a.avgScore);

    return { weak, strong };
  };

  // --- Prefetching ---
  useEffect(() => {
    if (activeTab === 'practice' && profile?.subjects) {
      profile.subjects.forEach(subject => {
        if (!quizCache[subject]) {
          // Prefetch in background
          generateQuiz(subject, profile.educationLevel, profile.targetExams)
            .then(qs => {
              if (qs && qs.length > 0) {
                setQuizCache(prev => ({ ...prev, [subject]: qs }));
              }
            })
            .catch(err => console.error(`Prefetch failed for ${subject}:`, err));
        }
      });
    }
  }, [activeTab, profile, quizCache]);

  // --- Views ---

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="mb-6"
        >
          <RefreshCw className="text-emerald-600" size={48} />
        </motion.div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Loading Study Buddy...</h2>
        <p className="text-zinc-500 text-center max-w-xs">
          {!isAuthReady ? "Initializing authentication..." : "Fetching your profile..."}
        </p>
        <div className="mt-8 text-xs text-zinc-400">
          Status: {JSON.stringify({ isAuthReady, hasUser: !!user, hasProfile: !!profile })}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200">
            <Sparkles className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Study Buddy</h1>
          <p className="text-zinc-600 mb-10 text-lg">
            Your intelligent companion for academic excellence and balanced well-being.
          </p>
          
          <Card className="p-6 mb-6 text-left">
            <h2 className="text-xl font-bold mb-4">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3 rounded-xl border border-zinc-100 text-sm focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 rounded-xl border border-zinc-100 text-sm focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
              {authError && (
                <p className="text-xs text-red-500 font-medium">{authError}</p>
              )}
              <Button type="submit" className="w-full py-3" disabled={loading}>
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Button>
            </form>
            
            <div className="mt-6 flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-zinc-400">Or continue with</span></div>
              </div>
              
              <Button variant="secondary" onClick={handleLogin} className="w-full py-3" icon={Zap}>
                Google Account
              </Button>
            </div>
          </Card>

          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-emerald-600 font-bold hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>

          <p className="mt-8 text-xs text-zinc-400 uppercase tracking-widest font-bold">
            Designed for African Students
          </p>
        </motion.div>
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding profile={profile} onComplete={(p: any) => { setProfile(p); setShowOnboarding(false); }} user={user} />;
  }

  return (
    <div className={`min-h-screen bg-zinc-50 pb-32 lg:pb-0 lg:pl-64 pt-20 ${accessibilitySettings.highContrast ? 'contrast-125' : ''} ${accessibilitySettings.largeText ? 'text-lg' : ''}`}>
      {/* Top Bar / Quick Menu */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-zinc-100 z-40 lg:left-64 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-2 lg:hidden">
          <Sparkles className="text-emerald-600" size={20} />
          <span className="font-bold text-lg">Study Buddy</span>
        </div>
        <div className="hidden lg:block" />
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              if (!isFocusMode) {
                setTimer(25 * 60);
                setIsFocusMode(true);
                setIsTimerRunning(true);
                setActiveSession({
                  userId: user?.uid || '',
                  subject: 'General Study',
                  durationMinutes: 25,
                  startTime: new Date().toISOString()
                });
              } else {
                setIsFocusMode(true);
              }
            }}
            className="p-2 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            title="Quick Focus Timer"
          >
            <Timer size={20} />
          </button>
          <button 
            onClick={() => setShowAbout(true)}
            className="p-2 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            title="About App"
          >
            <Info size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className="p-2 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-100 px-4 py-2 flex justify-around items-center z-50 lg:top-0 lg:bottom-0 lg:left-0 lg:w-64 lg:flex-col lg:border-r lg:border-t-0 lg:py-10 lg:px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="hidden lg:flex items-center gap-3 mb-12 px-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">Study Buddy</span>
        </div>

        <div className="flex lg:flex-col gap-1 w-full">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} label="Home" />
          <NavButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={Calendar} label="Schedule" />
          <NavButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} icon={BookOpen} label="Practice" />
          <NavButton active={activeTab === 'buddy'} onClick={() => setActiveTab('buddy')} icon={MessageSquare} label="Buddy" />
          <NavButton active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} icon={Award} label="Awards" />
          <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Settings" />
          <button 
            onClick={handleVoiceCommand}
            className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-3 px-2 sm:px-4 py-3 rounded-xl transition-all w-full ${isListening ? 'text-emerald-600 bg-emerald-50' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'}`}
            aria-label="Voice Command"
          >
            <Volume2 size={20} className={isListening ? 'animate-pulse' : ''} />
            <span className="text-[10px] lg:text-sm font-bold lg:font-medium uppercase lg:capitalize tracking-widest lg:tracking-normal">Voice</span>
          </button>
        </div>

        <div className="hidden lg:flex flex-col gap-4 w-full mt-auto px-4">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                {user.displayName?.[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.displayName}</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Free Plan</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-xs text-red-500 font-bold flex items-center gap-2 hover:text-red-600 transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[100] w-full max-w-sm px-4"
          >
            <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3 border border-zinc-800" aria-live="polite">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{toast.title}</p>
                <p className="text-xs text-zinc-400">{toast.message}</p>
              </div>
              <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Content */}
      <main className="p-6 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Header */}
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Good morning, {user.displayName?.split(' ')[0]}!</h2>
                  <p className="text-zinc-500 mt-1">Ready to crush your goals today?</p>
                </div>
                <div className="hidden sm:flex gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Streak</p>
                    <p className="text-xl font-bold text-emerald-600 flex items-center justify-end gap-1">
                      <Zap size={20} fill="currentColor" /> 12 Days
                    </p>
                  </div>
                </div>
              </header>

              {/* AI Buddy Message */}
              <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-none relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Brain size={20} />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Ace (AI Buddy)</p>
                      <button 
                        onClick={handleReadBuddyMessage}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                        title="Read Aloud"
                        aria-label="Read Ace's message aloud"
                      >
                        <Volume2 size={14} className="text-emerald-100" />
                      </button>
                    </div>
                      <p className="text-lg font-medium leading-tight" aria-live="polite">
                        {isBuddyLoading ? (
                          <span className="flex items-center gap-2 opacity-70 italic">
                            <RefreshCw size={14} className="animate-spin" /> Ace is thinking...
                          </span>
                        ) : (
                          `"${buddyMessage}"`
                        )}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs py-1.5" 
                        onClick={() => fetchBuddyMessage('tired')}
                        disabled={isBuddyLoading}
                      >
                        I'm tired
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs py-1.5" 
                        onClick={() => fetchBuddyMessage('excited')}
                        disabled={isBuddyLoading}
                      >
                        I'm ready!
                      </Button>
                    </div>
                  </div>
                <Sparkles className="absolute -right-4 -bottom-4 text-white/10" size={120} />
              </Card>

              {/* Next Session & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <Badge color="amber">Next Session</Badge>
                      <Clock size={18} className="text-zinc-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Mathematics: Calculus</h3>
                    <p className="text-zinc-500 mb-6">Scheduled for 10:00 AM — 11:00 AM</p>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1" icon={Play} onClick={() => startSession('Mathematics')}>
                      Start Focus Session
                    </Button>
                    <Button variant="secondary" icon={ChevronRight} onClick={() => setActiveTab('schedule')}>
                      View Schedule
                    </Button>
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Study Hours</p>
                      <p className="text-2xl font-bold">24.5h</p>
                    </div>
                  </Card>
                  <Card className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Quiz Score</p>
                      <p className="text-2xl font-bold">88%</p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Wellness Integration */}
              <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sun size={20} className="text-amber-500" /> Wellness & Habits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <WellnessCard icon={Coffee} title="Hydration Break" desc="Drink 250ml of water now." time="In 15 mins" />
                  <WellnessCard icon={Moon} title="Sleep Reminder" desc="Wind down by 10:00 PM." time="Tonight" />
                  <WellnessCard icon={Zap} title="Stretch" desc="Stand up and stretch for 2 mins." time="Now" />
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div 
              key="schedule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Daily Schedule</h2>
                <Button variant="secondary" icon={RefreshCw} onClick={handleGenerateSchedule} disabled={loading}>
                  {loading ? 'Generating...' : 'Regenerate with AI'}
                </Button>
              </div>

              {!currentSchedule || !currentSchedule.blocks || currentSchedule.blocks.length === 0 ? (
                <Card className="text-center py-12">
                  <Calendar className="mx-auto text-zinc-200 mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">No schedule for today</h3>
                  <p className="text-zinc-500 mb-6">Let Ace generate a personalized plan for you.</p>
                  <Button onClick={handleGenerateSchedule} icon={Sparkles}>
                    Generate AI Schedule
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {currentSchedule.blocks.map((block, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border ${block.type === 'Study' ? 'bg-white border-zinc-100' : 'bg-zinc-50 border-transparent opacity-70'}`}>
                      <div className="w-20 text-sm font-bold text-zinc-400">{block.startTime}</div>
                      <div className={`w-1 h-10 rounded-full ${block.type === 'Study' ? 'bg-emerald-500' : block.type === 'Break' ? 'bg-amber-500' : 'bg-violet-500'}`} />
                      <div className="flex-1">
                        <p className="font-bold">{block.subject}</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{block.type}</p>
                      </div>
                      {block.type === 'Study' && (
                        <button className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-300 hover:border-emerald-500 hover:text-emerald-500 transition-colors">
                          <CheckCircle size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'practice' && (
            <motion.div 
              key="practice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Practice Center</h2>
                  <p className="text-zinc-500">Master your subjects with exam-specific quizzes.</p>
                </div>
                {profile?.targetExams && profile.targetExams.length > 0 && (
                  <div className="flex gap-2">
                    {profile.targetExams.map(exam => (
                      <Badge key={exam} color="violet">{exam}</Badge>
                    ))}
                  </div>
                )}
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                {/* Exam Practice Card */}
                <Card className="col-span-full bg-violet-600 text-white border-none p-8 relative overflow-hidden group cursor-pointer" onClick={() => setShowExamPractice(true)}>
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-xl">
                        <Award size={32} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold tracking-tight">Exam Practice Hub</h3>
                        <p className="text-violet-100 text-sm mt-2 max-w-md">Practice for JAMB, WAEC, and more with original syllabus-based questions.</p>
                      </div>
                      <div className="flex gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-violet-200" />
                          <span className="text-xs font-medium text-violet-100">JAMB & WAEC</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-violet-200" />
                          <span className="text-xs font-medium text-violet-100">Performance Tracking</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" className="bg-white text-violet-600 border-none hover:bg-violet-50 px-8 py-4 text-lg font-bold shadow-lg" icon={Play}>
                      Start Practice
                    </Button>
                  </div>
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-violet-400/20 rounded-full blur-2xl" />
                </Card>

                {/* Performance Insights */}
                {getPerformanceInsights() && (
                  <Card className="col-span-full bg-zinc-50 border-zinc-100">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <TrendingUp size={16} /> Performance Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider">Strong Subjects</p>
                        <div className="space-y-2">
                          {getPerformanceInsights()?.strong.length ? getPerformanceInsights()?.strong.map(i => (
                            <div key={i.subject} className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-100">
                              <span className="text-sm font-bold">{i.subject}</span>
                              <Badge color="emerald">{Math.round(i.avgScore)}%</Badge>
                            </div>
                          )) : <p className="text-xs text-zinc-400 italic">Keep practicing to see insights!</p>}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider">Focus Needed</p>
                        <div className="space-y-2">
                          {getPerformanceInsights()?.weak.length ? getPerformanceInsights()?.weak.map(i => (
                            <div key={i.subject} className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-100">
                              <span className="text-sm font-bold">{i.subject}</span>
                              <Badge color="amber">{Math.round(i.avgScore)}%</Badge>
                            </div>
                          )) : <p className="text-xs text-zinc-400 italic">You're doing great across all subjects!</p>}
                        </div>
                      </div>
                    </div>
                    {getPerformanceInsights()?.weak.length ? (
                      <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                        <Sparkles className="text-amber-600" size={20} />
                        <p className="text-xs text-amber-800 font-medium">
                          Ace suggests: You should focus more on <span className="font-bold">{getPerformanceInsights()?.weak[0].subject}</span> this week to improve your score.
                        </p>
                      </div>
                    ) : null}
                  </Card>
                )}

                {/* Resources Section */}
                <Card className="col-span-full">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ExternalLink size={16} /> External Resources
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'JAMB Official Portal', url: 'https://www.jamb.gov.ng/', desc: 'Registration and official updates.' },
                      { name: 'WAEC e-Learning', url: 'https://www.waeconline.org.ng/elearning', desc: 'Past questions and chief examiner reports.' },
                      { name: 'MySchool JAMB CBT', url: 'https://myschool.ng/cbt', desc: 'Online practice tests and news.' }
                    ].map(res => (
                      <a 
                        key={res.name} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl border border-zinc-100 hover:border-emerald-600 hover:bg-emerald-50 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm group-hover:text-emerald-700">{res.name}</h4>
                          <ExternalLink size={14} className="text-zinc-400 group-hover:text-emerald-600" />
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">{res.desc}</p>
                      </a>
                    ))}
                  </div>
                </Card>

                {profile?.subjects?.map((subject) => {
                  const progress = getSubjectProgress(subject);
                  const goal = profile.practiceGoals?.find(g => g.subject === subject);
                  
                  return (
                    <Card key={subject} className="group hover:border-emerald-200 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <BookOpen size={24} />
                        </div>
                        <button 
                          onClick={() => {
                            setShowGoalModal(subject);
                            if (goal) setGoalData({ targetQuizzes: goal.targetQuizzes, targetScore: goal.targetScore });
                          }}
                          className="text-[10px] font-bold text-emerald-600 hover:underline uppercase tracking-wider"
                        >
                          {goal ? 'Edit Goal' : 'Set Goal'}
                        </button>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{subject}</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Overall Progress</span>
                        <span className="text-[10px] font-bold text-emerald-600">{progress.percent}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.percent}%` }}
                          className="h-full bg-emerald-500" 
                        />
                      </div>
                      
                      {goal && (
                        <div className="grid grid-cols-2 gap-4 mb-6 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                          <div>
                            <p className="text-[8px] text-zinc-400 font-bold uppercase mb-1">Quizzes</p>
                            <p className="text-xs font-bold">{progress.quizzes} / {goal.targetQuizzes}</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-zinc-400 font-bold uppercase mb-1">Avg Score</p>
                            <p className="text-xs font-bold">{progress.score}% / {goal.targetScore}%</p>
                          </div>
                        </div>
                      )}

                      <Button variant="secondary" className="w-full text-xs py-2" icon={Play} onClick={() => handleStartQuiz(subject)}>
                        Start Practice
                      </Button>
                    </Card>
                  );
                })}
                {(!profile?.subjects || profile.subjects.length === 0) && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-zinc-500">Add subjects in settings to start practicing.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'buddy' && (
            <motion.div 
              key="buddy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header>
                <h2 className="text-2xl font-bold tracking-tight">Buddy Hub</h2>
                <p className="text-zinc-500">Manage your study companion and accountability partners.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-zinc-900 text-white border-none p-8 relative overflow-hidden">
                  <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-900/20">
                        {profile?.buddyType === 'AI' ? <Brain size={32} /> : profile?.buddyType === 'Guardian' ? <UserIcon size={32} /> : <MessageSquare size={32} />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{profile?.buddyName || 'My Buddy'}</h3>
                        <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">{profile?.buddyType} Buddy</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleAddBuddyFromContacts}
                        className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                        title="Add from Contacts"
                      >
                        <Users size={18} />
                      </button>
                      <button onClick={() => setShowBuddyEdit(true)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                        <Settings size={18} />
                      </button>
                    </div>
                  </div>
                    
                    <div className="space-y-6 mb-8">
                      <div className="bg-white/5 rounded-2xl p-4">
                        <p className="text-zinc-300 italic text-sm">
                          {isBuddyLoading ? "Ace is thinking..." : `"${buddyMessage}"`}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 text-xs py-2" 
                          variant="secondary" 
                          icon={MessageSquare}
                          onClick={() => fetchBuddyMessage('motivated')}
                          disabled={isBuddyLoading}
                        >
                          Check-in
                        </Button>
                        <Button 
                          className="flex-1 text-xs py-2" 
                          icon={RefreshCw}
                          onClick={() => fetchBuddyMessage('tired')}
                          disabled={isBuddyLoading}
                        >
                          Get Advice
                        </Button>
                      </div>

                      {profile?.buddyType !== 'AI' && (
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-400">Listening Rate</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(n => (
                                <div key={n} className={`w-2 h-2 rounded-full ${n <= (profile?.buddyRating || 0) ? 'bg-emerald-500' : 'bg-white/10'}`} />
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-400">Picks Calls</span>
                            <span className={profile?.buddyAlwaysPicksCalls ? 'text-emerald-400' : 'text-red-400'}>{profile?.buddyAlwaysPicksCalls ? 'Always' : 'Sometimes'}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-400">Cares about studies</span>
                            <span className={profile?.buddyCaresAboutStudies ? 'text-emerald-400' : 'text-red-400'}>{profile?.buddyCaresAboutStudies ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 border-none" 
                      icon={MessageSquare}
                      onClick={() => alert(profile?.buddyType === 'AI' ? "Ace: I'm ready when you are! Let's keep studying." : `Contacting ${profile?.buddyName}...`)}
                    >
                      {profile?.buddyType === 'AI' ? 'Chat with Ace' : `Contact ${profile?.buddyName}`}
                    </Button>
                  </div>
                  <Sparkles className="absolute -right-8 -bottom-8 text-white/5" size={160} />
                </Card>

                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Study Group</h4>
                  <div className="space-y-3">
                    <FriendCard name="Chidi" status="Focusing: Physics" online onInvite={handleInviteFriend} />
                    <FriendCard name="Amaka" status="Offline" onInvite={handleInviteFriend} />
                    <FriendCard name="Tunde" status="Focusing: Math" online onInvite={handleInviteFriend} />
                  </div>
                  <Button variant="secondary" className="w-full" icon={Plus} onClick={handleInviteFriend}>
                    Invite Friend
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div 
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header>
                <h2 className="text-2xl font-bold tracking-tight">Achievements</h2>
                <p className="text-zinc-500">Your milestones and academic progress.</p>
              </header>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Early Bird', desc: 'Study before 8 AM', icon: Sun, color: 'amber', earned: true },
                  { title: 'Focus Master', desc: '2h deep work session', icon: Target, color: 'violet', earned: true },
                  { title: 'Quiz King', desc: '100% on any quiz', icon: Award, color: 'emerald', earned: false },
                  { title: 'Streak 7', desc: '7 day study streak', icon: Zap, color: 'amber', earned: true },
                  { title: 'Night Owl', desc: 'Study after 10 PM', icon: Moon, color: 'zinc', earned: false },
                  { title: 'Subject Pro', desc: 'Master 3 subjects', icon: BookOpen, color: 'emerald', earned: false },
                ].map((ach, idx) => (
                  <Card key={idx} className={`flex flex-col items-center text-center p-6 ${!ach.earned && 'opacity-50 grayscale'}`}>
                    <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${
                      ach.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                      ach.color === 'violet' ? 'bg-violet-50 text-violet-600' :
                      ach.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-600'
                    }`}>
                      <ach.icon size={24} />
                    </div>
                    <h4 className="font-bold text-sm mb-1">{ach.title}</h4>
                    <p className="text-[10px] text-zinc-500">{ach.desc}</p>
                    {ach.earned && <div className="mt-3 text-[8px] font-black text-emerald-600 uppercase tracking-widest">Unlocked</div>}
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-zinc-500">Manage your account and study preferences.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">My Subjects</h3>
                    <Card className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {profile?.subjects?.map(s => (
                          <div key={s} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                            {s}
                            <button onClick={() => handleRemoveSubject(s)} className="hover:text-emerald-900"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="New subject..."
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-zinc-100 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                        />
                        <Button 
                          variant="secondary" 
                          className="py-1.5 px-3 text-xs" 
                          onClick={handleAddSubject}
                          disabled={isAddingSubject || !newSubject}
                        >
                          {isAddingSubject ? 'Adding...' : 'Add'}
                        </Button>
                      </div>
                    </Card>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Notifications</h3>
                    <Card className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">Study Reminders</p>
                        <p className="text-xs text-zinc-500">Get notified 15 minutes before study blocks</p>
                      </div>
                      <Button 
                        variant={notificationPermission === 'granted' ? 'ghost' : 'secondary'} 
                        className="text-xs py-1.5"
                        onClick={requestNotificationPermission}
                        disabled={notificationPermission === 'granted'}
                      >
                        {notificationPermission === 'granted' ? 'Enabled' : 'Enable'}
                      </Button>
                    </Card>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Study Window</h3>
                    <Card className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Start Time</p>
                        <input 
                          type="time" 
                          value={profile?.studyStartTime || '08:00'}
                          onChange={async (e) => {
                            const val = e.target.value;
                            if (user && profile) {
                              await updateDoc(doc(db, 'users', user.uid), { studyStartTime: val });
                              setProfile({ ...profile, studyStartTime: val });
                            }
                          }}
                          className="w-full bg-transparent font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">End Time</p>
                        <input 
                          type="time" 
                          value={profile?.studyEndTime || '20:00'}
                          onChange={async (e) => {
                            const val = e.target.value;
                            if (user && profile) {
                              await updateDoc(doc(db, 'users', user.uid), { studyEndTime: val });
                              setProfile({ ...profile, studyEndTime: val });
                            }
                          }}
                          className="w-full bg-transparent font-bold focus:outline-none"
                        />
                      </div>
                    </Card>
                  </section>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Accessibility size={16} /> Accessibility (PWD Support)
                    </h3>
                    <Card className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold">High Contrast</p>
                          <p className="text-[10px] text-zinc-500">Increase visual clarity</p>
                        </div>
                        <button 
                          onClick={() => setAccessibilitySettings(prev => ({ ...prev, highContrast: !prev.highContrast }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${accessibilitySettings.highContrast ? 'bg-emerald-600' : 'bg-zinc-200'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${accessibilitySettings.highContrast ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold">Large Text</p>
                          <p className="text-[10px] text-zinc-500">Make everything easier to read</p>
                        </div>
                        <button 
                          onClick={() => setAccessibilitySettings(prev => ({ ...prev, largeText: !prev.largeText }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${accessibilitySettings.largeText ? 'bg-emerald-600' : 'bg-zinc-200'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${accessibilitySettings.largeText ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold">Voice Assistance</p>
                          <p className="text-[10px] text-zinc-500">Enable screen reader features</p>
                        </div>
                        <button 
                          onClick={() => setAccessibilitySettings(prev => ({ ...prev, voiceAssistance: !prev.voiceAssistance }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${accessibilitySettings.voiceAssistance ? 'bg-emerald-600' : 'bg-zinc-200'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${accessibilitySettings.voiceAssistance ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    </Card>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Account</h3>
                    <Card className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold">Email Notifications</p>
                          <p className="text-[10px] text-zinc-500">Daily reminders and buddy alerts</p>
                        </div>
                        <div className="w-10 h-5 bg-emerald-600 rounded-full relative">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold">Public Profile</p>
                          <p className="text-[10px] text-zinc-500">Allow friends to find you</p>
                        </div>
                        <div className="w-10 h-5 bg-zinc-200 rounded-full relative">
                          <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    </Card>
                  </section>
                  
                  <Button variant="danger" className="w-full" onClick={handleLogout}>
                    Sign Out of Account
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {activeQuiz && (
          <Quiz 
            subject={activeQuiz.subject} 
            educationLevel={profile?.educationLevel || 'Secondary'} 
            targetExams={profile?.targetExams || []}
            cachedQuestions={quizCache[activeQuiz.subject]}
            onCacheQuestions={(qs: any[]) => setQuizCache(prev => ({ ...prev, [activeQuiz.subject]: qs }))}
            onComplete={handleQuizComplete} 
            onCancel={() => setActiveQuiz(null)} 
          />
        )}
        {showExamPractice && (
          <ExamPractice 
            onCancel={() => setShowExamPractice(false)} 
            onComplete={handleQuizComplete}
          />
        )}
        {showBuddyEdit && profile && (
          <EditBuddyModal 
            profile={profile} 
            onSave={handleUpdateBuddy} 
            onCancel={() => setShowBuddyEdit(false)} 
          />
        )}
        {showAbout && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6"
          >
            <Card className="max-w-md w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">About Study Buddy</h3>
                <button onClick={() => setShowAbout(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4 text-zinc-600">
                <p>Study Buddy is your AI-powered academic companion designed to help you stay focused, organized, and balanced.</p>
                <p>Features include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>AI-generated study schedules</li>
                  <li>Focus timer with deep work tracking</li>
                  <li>Wellness reminders and habit tracking</li>
                  <li>Practice quizzes for your subjects</li>
                  <li>Accessibility support for all students</li>
                </ul>
                <p className="text-sm pt-4 border-t border-zinc-100">Version 1.0.0 • Designed for African Students</p>
              </div>
              <Button className="w-full mt-8" onClick={() => setShowAbout(false)}>Close</Button>
            </Card>
          </motion.div>
        )}
        {showGoalModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6"
          >
            <Card className="max-w-sm w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Set Goal: {showGoalModal}</h3>
                <button onClick={() => setShowGoalModal(null)} className="text-zinc-400 hover:text-zinc-600">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Target Quizzes</label>
                  <input 
                    type="number" 
                    value={goalData.targetQuizzes}
                    onChange={(e) => setGoalData({ ...goalData, targetQuizzes: parseInt(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-zinc-100 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Target Score (%)</label>
                  <input 
                    type="number" 
                    value={goalData.targetScore}
                    onChange={(e) => setGoalData({ ...goalData, targetScore: parseInt(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-zinc-100 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" className="flex-1" onClick={() => setShowGoalModal(null)}>Cancel</Button>
                  <Button className="flex-1" onClick={handleSetGoal}>Save Goal</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900 z-[100] flex flex-col items-center justify-center p-6 text-white"
          >
            <div className="absolute top-6 sm:top-10 left-6 sm:left-10 flex items-center gap-3">
              <Sparkles className="text-emerald-400 sm:w-6 sm:h-6" size={16} />
              <span className="font-bold tracking-tight text-xs sm:text-base">Focusing on {activeSession?.subject}</span>
            </div>
            
            <button 
              onClick={() => { setIsFocusMode(false); setIsTimerRunning(false); }}
              className="absolute top-6 sm:top-10 right-6 sm:right-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={16} className="sm:w-5 sm:h-5" />
            </button>

            <div className="text-center px-4 w-full max-w-sm">
              <motion.div 
                animate={{ scale: isTimerRunning ? [1, 1.02, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-[64px] sm:text-[120px] font-bold tracking-tighter tabular-nums leading-none mb-2 sm:mb-4"
              >
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
              </motion.div>
              <p className="text-zinc-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-[8px] sm:text-sm mb-6 sm:mb-12">Deep Work Session</p>
              
              <div className="flex flex-col gap-3 w-full">
                <Button 
                  className="w-full py-3 sm:py-4 bg-white text-zinc-900 hover:bg-zinc-100 text-sm sm:text-base" 
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? 'Pause' : 'Resume'}
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full py-3 sm:py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm sm:text-base"
                  onClick={completeSession}
                >
                  Stop & Save
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full py-3 sm:py-4 text-zinc-400 hover:text-white text-sm sm:text-base"
                  onClick={() => { setIsFocusMode(false); setIsTimerRunning(false); }}
                >
                  Cancel Session
                </Button>
              </div>
            </div>

            <div className="absolute bottom-10 text-center text-zinc-500 text-xs max-w-xs">
              "The secret of getting ahead is getting started." — Mark Twain
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-components ---

function NavButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-3 px-2 sm:px-4 py-3 rounded-xl transition-all w-full ${active ? 'text-emerald-600 bg-emerald-50 lg:bg-emerald-50' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'}`}
    >
      <Icon size={20} />
      <span className="text-[10px] lg:text-sm font-bold lg:font-medium uppercase lg:capitalize tracking-widest lg:tracking-normal">{label}</span>
      {active && <motion.div layoutId="nav-active" className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600" />}
    </button>
  );
}

function FriendCard({ name, status, online, onInvite }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-2xl">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold">
          {name[0]}
        </div>
        {online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm">{name}</p>
        <p className="text-xs text-zinc-500">{status}</p>
      </div>
      {online ? (
        <button className="text-emerald-600 hover:text-emerald-700 transition-colors">
          <Zap size={18} />
        </button>
      ) : (
        <button onClick={onInvite} className="text-zinc-400 hover:text-emerald-600 transition-colors" title="Invite Friend">
          <Plus size={18} />
        </button>
      )}
    </div>
  );
}

function WellnessCard({ icon: Icon, title, desc, time }: any) {
  return (
    <Card className="flex items-start gap-4 p-4">
      <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
        <Icon size={20} />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-bold text-sm">{title}</h4>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
      </div>
    </Card>
  );
}

function Onboarding({ profile, onComplete, user }: any) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<UserProfile>>({
    educationLevel: 'Secondary',
    targetExams: [],
    strengths: [],
    weaknesses: [],
    availableHours: 4,
    buddyType: 'AI',
    subjects: [],
    achievements: [],
    buddyRating: 5,
    buddyAlwaysPicksCalls: true,
    buddyCaresAboutStudies: true,
    studyStartTime: '08:00',
    studyEndTime: '20:00'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    console.log('Completing onboarding for user:', user.uid);

    const fullProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || 'Student',
      email: user.email || '',
      educationLevel: data.educationLevel as any,
      targetExams: data.targetExams || [],
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      availableHours: data.availableHours || 4,
      buddyType: data.buddyType as any,
      buddyName: data.buddyName || (data.buddyType === 'AI' ? 'Ace' : ''),
      buddyRating: data.buddyRating,
      buddyAlwaysPicksCalls: data.buddyAlwaysPicksCalls,
      buddyCaresAboutStudies: data.buddyCaresAboutStudies,
      subjects: data.subjects || [],
      studyStartTime: data.studyStartTime,
      studyEndTime: data.studyEndTime,
      achievements: [],
      createdAt: new Date().toISOString(),
    };

    try {
      console.log('Saving profile to Firestore...');
      await setDoc(doc(db, 'users', user.uid), fullProfile);
      console.log('Profile saved successfully!');
      onComplete(fullProfile);
    } catch (err: any) {
      console.error('Error in handleComplete:', err);
      setError('Failed to save your profile. Please check your internet connection and try again.');
      try {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto">
      <Card className="max-w-md w-full p-6 sm:p-8 my-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className={`h-1 w-6 rounded-full ${step >= s ? 'bg-emerald-600' : 'bg-zinc-100'}`} />
            ))}
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Step {step} of 5</span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Study Details</h2>
            <p className="text-sm text-zinc-500 mb-8">Tell us about your current academic focus.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Education Level</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setData({ ...data, educationLevel: 'Secondary' })}
                    className={`p-3 sm:p-4 rounded-2xl border text-sm text-center transition-all ${data.educationLevel === 'Secondary' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold' : 'border-zinc-100 bg-white'}`}
                  >
                    Secondary
                  </button>
                  <button 
                    onClick={() => setData({ ...data, educationLevel: 'University' })}
                    className={`p-3 sm:p-4 rounded-2xl border text-sm text-center transition-all ${data.educationLevel === 'University' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold' : 'border-zinc-100 bg-white'}`}
                  >
                    University
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Target Exams</label>
                <div className="flex flex-wrap gap-2">
                  {['JAMB', 'WAEC', 'NECO', 'Post-UTME', 'Finals', 'SAT', 'IELTS'].map(exam => (
                    <button 
                      key={exam}
                      onClick={() => {
                        const exams = data.targetExams || [];
                        setData({ ...data, targetExams: exams.includes(exam) ? exams.filter(e => e !== exam) : [...exams, exam] });
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs transition-all ${data.targetExams?.includes(exam) ? 'border-emerald-600 bg-emerald-600 text-white font-bold' : 'border-zinc-100 bg-white'}`}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Your Subjects</h2>
            <p className="text-sm text-zinc-500 mb-8">Select the subjects you are currently offering.</p>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'Literature', 'Commerce', 'Accounts'].map(subject => (
                  <button 
                    key={subject}
                    onClick={() => {
                      const subs = data.subjects || [];
                      setData({ ...data, subjects: subs.includes(subject) ? subs.filter(s => s !== subject) : [...subs, subject] });
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs transition-all ${data.subjects?.includes(subject) ? 'border-emerald-600 bg-emerald-600 text-white font-bold' : 'border-zinc-100 bg-white'}`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-400 italic">You can add more subjects later in settings.</p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Strengths & Weaknesses</h2>
            <p className="text-sm text-zinc-500 mb-8">We'll allocate more time to subjects you find challenging.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">I'm good at...</label>
                <input 
                  type="text" 
                  placeholder="e.g., Mathematics, Physics"
                  className="w-full p-3 sm:p-4 rounded-2xl border border-zinc-100 focus:outline-none focus:border-emerald-600 text-sm"
                  onBlur={(e) => setData({ ...data, strengths: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">I struggle with...</label>
                <input 
                  type="text" 
                  placeholder="e.g., Chemistry, Biology"
                  className="w-full p-3 sm:p-4 rounded-2xl border border-zinc-100 focus:outline-none focus:border-emerald-600 text-sm"
                  onBlur={(e) => setData({ ...data, weaknesses: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Choose Your Buddy</h2>
            <p className="text-sm text-zinc-500 mb-8">Who will help keep you accountable?</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'AI', label: 'AI Buddy', icon: Brain },
                  { id: 'Contact', label: 'Friend', icon: MessageSquare },
                  { id: 'AppUser', label: 'App User', icon: Sparkles },
                  { id: 'Guardian', label: 'Guardian', icon: UserIcon }
                ].map(type => (
                  <button 
                    key={type.id}
                    onClick={() => setData({ ...data, buddyType: type.id as any })}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${data.buddyType === type.id ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold' : 'border-zinc-100 bg-white'}`}
                  >
                    <type.icon size={20} />
                    <span className="text-[10px]">{type.label}</span>
                  </button>
                ))}
              </div>

              {data.buddyType !== 'AI' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Buddy Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter name"
                      className="w-full p-3 rounded-xl border border-zinc-100 text-sm"
                      onChange={(e) => setData({ ...data, buddyName: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">How much do you listen to them? (1-5)</label>
                      <div className="flex justify-between px-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button 
                            key={num}
                            onClick={() => setData({ ...data, buddyRating: num })}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${data.buddyRating === num ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-zinc-400 border-zinc-100'}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-600">Always pick their calls?</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setData({ ...data, buddyAlwaysPicksCalls: true })}
                          className={`px-3 py-1 rounded-lg text-[10px] border ${data.buddyAlwaysPicksCalls ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-400'}`}
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setData({ ...data, buddyAlwaysPicksCalls: false })}
                          className={`px-3 py-1 rounded-lg text-[10px] border ${!data.buddyAlwaysPicksCalls ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-400'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-600">Do they care about your studies?</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setData({ ...data, buddyCaresAboutStudies: true })}
                          className={`px-3 py-1 rounded-lg text-[10px] border ${data.buddyCaresAboutStudies ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-400'}`}
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setData({ ...data, buddyCaresAboutStudies: false })}
                          className={`px-3 py-1 rounded-lg text-[10px] border ${!data.buddyCaresAboutStudies ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-400'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Study Schedule</h2>
            <p className="text-sm text-zinc-500 mb-8">Set your daily study window and commitment.</p>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Start Time</label>
                  <input 
                    type="time" 
                    value={data.studyStartTime}
                    onChange={(e) => setData({ ...data, studyStartTime: e.target.value })}
                    className="w-full p-3 rounded-xl border border-zinc-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">End Time</label>
                  <input 
                    type="time" 
                    value={data.studyEndTime}
                    onChange={(e) => setData({ ...data, studyEndTime: e.target.value })}
                    className="w-full p-3 rounded-xl border border-zinc-100 text-sm"
                  />
                </div>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Daily Hours</p>
                <span className="text-5xl font-bold text-emerald-600">{data.availableHours}</span>
                <span className="text-lg font-bold text-zinc-400 ml-2">hours</span>
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  value={data.availableHours}
                  onChange={(e) => setData({ ...data, availableHours: parseInt(e.target.value) })}
                  className="w-full mt-6 accent-emerald-600"
                />
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                  <Sparkles size={20} />
                </div>
                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  Ace will automatically include 15-minute breaks for every hour of study to keep your mind fresh.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-10 flex gap-3">
          {step > 1 && (
            <Button variant="secondary" className="flex-1" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button 
            className="flex-1" 
            onClick={() => step < 5 ? setStep(step + 1) : handleComplete()}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              step === 5 ? 'Finish Setup' : 'Continue'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
