import React, { useState, useEffect, useRef } from "react";
import { auth, db, googleProvider } from "../firebase";
import { signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier, User, signOut, ConfirmationResult } from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { VideoProject } from "../types";
import { UserCircle, LogOut, Cloud, Save, Download, Smartphone, Mail, Loader2, CheckCircle2 } from "lucide-react";

interface MeScreenProps {
  onBack: () => void;
  savedProjects: VideoProject[];
  onRestoreProjects: (projects: VideoProject[]) => void;
}

export const MeScreen: React.FC<MeScreenProps> = ({ onBack, savedProjects, onRestoreProjects }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [authError, setAuthError] = useState("");
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Backup state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupStatus, setBackupStatus] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setAuthError("");
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Failed to login with Google");
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier && recaptchaContainerRef.current) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: 'invisible'
      });
    }
  };

  const handleSendOtp = async () => {
    try {
      setAuthError("");
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Failed to send OTP");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return;
    try {
      setAuthError("");
      await confirmationResult.confirm(otp);
      setShowOtpInput(false);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Invalid OTP");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setPhoneNumber("");
    setOtp("");
    setShowOtpInput(false);
  };

  const handleBackup = async () => {
    if (!user || savedProjects.length === 0) return;
    setIsBackingUp(true);
    setBackupStatus("");
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { lastBackup: Date.now() }, { merge: true });
      
      for (const project of savedProjects) {
        await setDoc(doc(db, `users/${user.uid}/projects`, project.id), project);
      }
      setBackupStatus(`Successfully backed up ${savedProjects.length} projects!`);
    } catch (err) {
      console.error(err);
      setBackupStatus("Failed to backup projects.");
    }
    setIsBackingUp(false);
    setTimeout(() => setBackupStatus(""), 3000);
  };

  const handleRestore = async () => {
    if (!user) return;
    setIsRestoring(true);
    setBackupStatus("");
    try {
      const projectsSnapshot = await getDocs(collection(db, `users/${user.uid}/projects`));
      const projects: VideoProject[] = [];
      projectsSnapshot.forEach((doc) => {
        projects.push(doc.data() as VideoProject);
      });
      if (projects.length > 0) {
        onRestoreProjects(projects);
        setBackupStatus(`Successfully restored ${projects.length} projects!`);
      } else {
        setBackupStatus("No backed up projects found.");
      }
    } catch (err) {
      console.error(err);
      setBackupStatus("Failed to restore projects.");
    }
    setIsRestoring(false);
    setTimeout(() => setBackupStatus(""), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#0D1017] text-white items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CE5E7]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0D1017] text-white font-sans">
      <header className="px-5 py-4 shrink-0 border-b border-white/5">
        <h1 className="text-[24px] font-bold tracking-tight">Me</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-5 pb-24 space-y-6">
        {!user ? (
          <div className="flex flex-col items-center justify-center space-y-8 mt-10">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <UserCircle className="w-12 h-12 text-[#4CE5E7]" />
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">Login or Sign up</h2>
              <p className="text-sm text-white/60">Backup your projects securely to the cloud and access them anytime.</p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-3.5 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/40 text-xs">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {!showOtpInput ? (
                <div className="space-y-3">
                  <div className="flex items-center bg-[#1A1D24] rounded-xl border border-white/5 focus-within:border-[#4CE5E7] transition-colors">
                    <Smartphone className="w-5 h-5 text-white/40 ml-4" />
                    <input 
                      type="tel" 
                      placeholder="+1 234 567 8900"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-transparent outline-none p-4 text-sm font-medium"
                    />
                  </div>
                  <button 
                    onClick={handleSendOtp}
                    disabled={!phoneNumber.trim()}
                    className="w-full py-3.5 bg-[#4CE5E7] text-[#0A0C11] font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send OTP
                  </button>
                  <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-[#1A1D24] border border-white/5 focus:border-[#4CE5E7] outline-none rounded-xl p-4 text-center tracking-[0.5em] text-lg font-bold transition-colors"
                    maxLength={6}
                  />
                  <button 
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6}
                    className="w-full py-3.5 bg-[#4CE5E7] text-[#0A0C11] font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Verify Code
                  </button>
                  <button 
                    onClick={() => setShowOtpInput(false)}
                    className="w-full py-2 text-white/60 text-sm font-medium hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {authError && (
                <p className="text-red-400 text-sm text-center font-medium mt-2">{authError}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[20px] border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#4CE5E7] to-[#78AEFF] rounded-full flex items-center justify-center text-[#0A0C11] text-2xl font-bold uppercase shrink-0">
                {user.displayName?.[0] || user.email?.[0] || user.phoneNumber?.[0] || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <h2 className="text-lg font-bold truncate">{user.displayName || "Video Editor User"}</h2>
                <p className="text-sm text-white/60 truncate">{user.email || user.phoneNumber || "No email"}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 bg-white/10 hover:bg-[#FF453A]/20 hover:text-[#FF453A] rounded-full flex items-center justify-center transition-colors shrink-0"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider px-1">Cloud Backup & Sync</h3>
              
              <div className="bg-[#1A1D24] rounded-[20px] p-5 border border-white/5 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-[14px] flex items-center justify-center shrink-0">
                    <Cloud className="w-6 h-6 text-[#4CE5E7]" />
                  </div>
                  <div>
                    <h4 className="font-bold">Project Cloud Storage</h4>
                    <p className="text-xs text-white/50 mt-1">Safely backup your timeline edits, filters, and media links.</p>
                  </div>
                </div>

                {backupStatus && (
                  <div className="bg-[#4CE5E7]/10 border border-[#4CE5E7]/30 text-[#4CE5E7] text-sm px-4 py-2 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{backupStatus}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={handleBackup}
                    disabled={isBackingUp || savedProjects.length === 0}
                    className="bg-[#2A2D35] hover:bg-[#343842] py-3 rounded-[14px] flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isBackingUp ? (
                      <Loader2 className="w-5 h-5 text-[#4CE5E7] animate-spin" />
                    ) : (
                      <Save className="w-5 h-5 text-[#4CE5E7]" />
                    )}
                    <span className="text-xs font-bold">Backup Projects</span>
                  </button>
                  <button 
                    onClick={handleRestore}
                    disabled={isRestoring}
                    className="bg-[#2A2D35] hover:bg-[#343842] py-3 rounded-[14px] flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isRestoring ? (
                      <Loader2 className="w-5 h-5 text-[#4CE5E7] animate-spin" />
                    ) : (
                      <Download className="w-5 h-5 text-[#4CE5E7]" />
                    )}
                    <span className="text-xs font-bold">Restore Projects</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
