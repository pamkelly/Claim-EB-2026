import React, { useState } from "react";
import { Shield, Key, Eye, EyeOff, Check, AlertCircle, RefreshCw, Building, User, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoginScreenProps {
  onLoginSuccess: (name: string, cccd: string, isCorporate?: boolean, companyCode?: string, hrAccount?: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [step, setStep] = useState<"login" | "forgot_cccd" | "forgot_otp" | "forgot_setup" | "forgot_success">("login");
  const [loginPortal, setLoginPortal] = useState<"individual" | "corporate">("individual");
  
  // Login Form States (Individual)
  const [cccd, setCccd] = useState("001096012345");
  const [password, setPassword] = useState("••••••••");
  
  // Login Form States (Corporate HR)
  const [companyCode, setCompanyCode] = useState("PTI-EB-FPT");
  const [hrAccount, setHrAccount] = useState("fpt_hr_admin");
  const [corpPassword, setCorpPassword] = useState("••••••••");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recovery States
  const [recoveryCccd, setRecoveryCccd] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryMethod, setRecoveryMethod] = useState("phone"); // phone or email
  const [recoveryError, setRecoveryError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (loginPortal === "individual") {
      if (!cccd || cccd.length < 9) {
        setLoginError("Căn cước công dân phải từ 9 đến 12 chữ số.");
        return;
      }
      
      setIsSubmitting(true);
      
      // Simulate brief network delay
      setTimeout(() => {
        setIsSubmitting(false);
        // Hardcoded login mock
        if (cccd === "001096012345") {
          onLoginSuccess("Nguyễn Văn An", cccd, false);
        } else {
          // Allow any CCCD but mock a name
          onLoginSuccess("Khách hàng PTI", cccd, false);
        }
      }, 800);
    } else {
      // Corporate login
      if (!companyCode.trim()) {
        setLoginError("Vui lòng nhập mã số doanh nghiệp.");
        return;
      }
      if (!hrAccount.trim()) {
        setLoginError("Vui lòng nhập tài khoản quản trị HR.");
        return;
      }
      
      setIsSubmitting(true);
      
      setTimeout(() => {
        setIsSubmitting(false);
        // Clean mock names for the HR profile
        if (companyCode.toUpperCase() === "PTI-EB-FPT" && hrAccount.toLowerCase() === "fpt_hr_admin") {
          onLoginSuccess("FPT Software HR Manager", "", true, "PTI-EB-FPT", "fpt_hr_admin");
        } else {
          onLoginSuccess(`${companyCode.toUpperCase()} HR Specialist`, "", true, companyCode.toUpperCase(), hrAccount.toLowerCase());
        }
      }, 800);
    }
  };

  const handleRecoverySubmitCCCD = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");

    if (!recoveryCccd || recoveryCccd.length < 9) {
      setRecoveryError("Vui lòng nhập số CCCD hợp lệ (9 - 12 chữ số).");
      return;
    }

    setStep("forgot_otp");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otpCode[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    const code = otpCode.join("");
    
    if (code.length < 6) {
      setOtpError("Vui lòng nhập đầy đủ mã OTP 6 chữ số.");
      return;
    }

    // Accept any OTP but mock success
    setStep("forgot_setup");
  };

  const handleSetupNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");

    if (newPassword.length < 6) {
      setRecoveryError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setRecoveryError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setStep("forgot_success");
  };

  const handleBackToLogin = () => {
    setStep("login");
    // Clear forms
    setRecoveryCccd("");
    setOtpCode(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setRecoveryError("");
    setOtpError("");
  };

  return (
    <div className="flex-grow flex flex-col justify-between px-6 py-4 relative overflow-y-auto">
      {/* Visual background logo ornament */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
        <Shield size={320} className="text-blue-600" />
      </div>

      <AnimatePresence mode="wait">
        {step === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between mt-1"
          >
            {/* Logo and Brand Header */}
            <div className="text-center pt-2">
              <div className="inline-flex p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 text-white mb-2">
                <Shield size={28} className="stroke-[2] fill-white/10" />
              </div>
              <h1 className="text-2xl font-display font-black tracking-tight text-slate-800">
                PTI <span className="text-blue-600">Care</span>
              </h1>
              <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest mt-0.5 mb-4">
                Bảo hiểm bưu điện
              </p>
            </div>

            {/* Premium Sliding Segment Selector for individual vs corporate login */}
            <div className="flex bg-slate-200/35 backdrop-blur-md p-[3px] rounded-full mb-4 border border-white/60 shadow-[0_4px_18px_rgba(15,23,42,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.4)] relative">
              <button
                type="button"
                onClick={() => {
                  setLoginPortal("individual");
                  setLoginError("");
                }}
                className={`relative flex-1 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer z-10 ${
                  loginPortal === "individual"
                    ? "text-slate-800"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {loginPortal === "individual" && (
                  <motion.div
                    layoutId="activeLoginTab"
                    className="absolute inset-0 bg-white rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] border border-white/80 z-[-1]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <User size={12} className={loginPortal === "individual" ? "text-blue-600" : "text-slate-400"} />
                <span>Cá nhân & Gia đình</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setLoginPortal("corporate");
                  setLoginError("");
                }}
                className={`relative flex-1 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer z-10 ${
                  loginPortal === "corporate"
                    ? "text-slate-800"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {loginPortal === "corporate" && (
                  <motion.div
                    layoutId="activeLoginTab"
                    className="absolute inset-0 bg-white rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] border border-white/80 z-[-1]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Building size={12} className={loginPortal === "corporate" ? "text-blue-600" : "text-slate-400"} />
                <span>Cổng Doanh nghiệp (HR)</span>
              </button>
            </div>

            {/* Glassmorphic Login Card */}
            <div className="glass-panel rounded-3xl p-5 my-1 border border-white/50 shadow-xl shadow-blue-500/5">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Key size={15} className="text-blue-600" /> 
                {loginPortal === "individual" ? "Đăng nhập hệ thống" : "Đăng nhập Cổng HR Doanh nghiệp"}
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="flex gap-2 items-start text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {loginPortal === "individual" ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
                        Số Căn cước công dân (CCCD)
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={cccd}
                        onChange={(e) => setCccd(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-4 py-3 rounded-2xl text-sm font-medium text-slate-800 glass-input"
                        placeholder="Nhập 9 hoặc 12 số CCCD"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5 ml-1">
                        <label className="block text-xs font-semibold text-slate-500">
                          Mật khẩu khóa
                        </label>
                        <button
                          type="button"
                          onClick={() => setStep("forgot_cccd")}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Quên mật khẩu?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-4 pr-11 py-3 rounded-2xl text-sm font-medium text-slate-800 glass-input"
                          placeholder="Nhập mật khẩu của bạn"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* VNeID Alternative Login Line */}
                    <div className="pt-3.5 border-t border-slate-100/80 space-y-2">
                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-slate-150"></div>
                        <span className="flex-shrink mx-3 text-slate-400 text-[9px] font-black uppercase tracking-wider">Hoặc</span>
                        <div className="flex-grow border-t border-slate-150"></div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitting(true);
                          setLoginError("");
                          setTimeout(() => {
                            setIsSubmitting(false);
                            onLoginSuccess("Nguyễn Văn An", "001096012345", false);
                          }, 1000);
                        }}
                        className="w-full bg-rose-50/50 hover:bg-rose-100/60 border border-rose-200/50 text-rose-700 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-sm"
                      >
                        <Smartphone size={14} className="text-rose-600 shrink-0 animate-pulse" />
                        <span>Đăng nhập bằng ứng dụng VNeID</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
                        Mã số doanh nghiệp
                      </label>
                      <input
                        type="text"
                        value={companyCode}
                        onChange={(e) => setCompanyCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl text-sm font-medium text-slate-800 glass-input uppercase"
                        placeholder="Nhập Mã doanh nghiệp (Ví dụ: PTI-EB-FPT)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
                        Tài khoản HR (Email/Username)
                      </label>
                      <input
                        type="text"
                        value={hrAccount}
                        onChange={(e) => setHrAccount(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl text-sm font-medium text-slate-800 glass-input"
                        placeholder="Nhập tài khoản quản trị viên HR"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5 ml-1">
                        <label className="block text-xs font-semibold text-slate-500">
                          Mật khẩu quản trị HR
                        </label>
                        <span className="text-[10px] text-blue-500 font-semibold tracking-wider uppercase">Bảo mật mã hóa</span>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={corpPassword}
                          onChange={(e) => setCorpPassword(e.target.value)}
                          className="w-full pl-4 pr-11 py-3 rounded-2xl text-sm font-medium text-slate-800 glass-input"
                          placeholder="Nhập mật khẩu tài khoản HR"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full glass-btn-blue py-3.5 rounded-2xl text-sm font-semibold flex justify-center items-center gap-2 mt-6 cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    "Đăng nhập ngay"
                  )}
                </button>
              </form>
            </div>

            {/* Quick Demo Assist Banner */}
            <div className="text-center text-[10px] text-slate-400 px-4 mb-2 leading-relaxed">
              {loginPortal === "individual" ? (
                <>
                  <span className="font-semibold text-blue-500">Tài khoản lái mẫu:</span> CCCD{" "}
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9px]">001096012345</code> (Bấm Đăng nhập ngay)
                </>
              ) : (
                <>
                  <span className="font-semibold text-blue-500">Cổng HR mẫu:</span> Mã DN <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9px]">PTI-EB-FPT</code> & TK <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9px]">fpt_hr_admin</code>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* FORGOT PASSWORD STEP 1: ENTER CCCD */}
        {step === "forgot_cccd" && (
          <motion.div
            key="forgot_cccd"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="pt-6">
              <h1 className="text-2xl font-display font-bold tracking-tight text-slate-800">
                Khôi phục mật khẩu
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Vui lòng xác thực số CCCD đã đăng ký để cài đặt khôi phục
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6 my-6 border border-white/50 shadow-xl">
              <form onSubmit={handleRecoverySubmitCCCD} className="space-y-4">
                {recoveryError && (
                  <div className="flex gap-2 items-start text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
                    Nhập số CCCD xác minh
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={recoveryCccd}
                    onChange={(e) => setRecoveryCccd(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 rounded-2xl text-sm font-medium text-slate-800 glass-input"
                    placeholder="Nhập 9 hoặc 12 số CCCD"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 ml-1">
                    Phương thức nhận mã OTP khôi phục
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRecoveryMethod("phone")}
                      className={`p-3 rounded-2xl border text-xs font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        recoveryMethod === "phone"
                          ? "border-blue-500 bg-blue-50/50 text-blue-600"
                          : "border-slate-100 bg-white/40 text-slate-500"
                      }`}
                    >
                      <span>Số điện thoại SMS</span>
                      <span className="text-[10px] opacity-75">096****345</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecoveryMethod("email")}
                      className={`p-3 rounded-2xl border text-xs font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        recoveryMethod === "email"
                          ? "border-blue-500 bg-blue-50/50 text-blue-600"
                          : "border-slate-100 bg-white/40 text-slate-500"
                      }`}
                    >
                      <span>Thư điện tử Email</span>
                      <span className="text-[10px] opacity-75">htt****@gmail.com</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full glass-btn-blue py-3.5 rounded-2xl text-sm font-semibold mt-4 cursor-pointer"
                >
                  Gửi mã xác thực OTP
                </button>
              </form>
            </div>

            <button
              onClick={handleBackToLogin}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 text-center py-2 underline"
            >
              Quay lại Đăng nhập
            </button>
          </motion.div>
        )}

        {/* FORGOT PASSWORD STEP 2: VERIFY OTP */}
        {step === "forgot_otp" && (
          <motion.div
            key="forgot_otp"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="pt-6">
              <h1 className="text-2xl font-display font-bold tracking-tight text-slate-800">
                Xác thực mã OTP
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Một mã xác thực 6 chữ số đã được gửi qua {recoveryMethod === "phone" ? "SĐT 096****345" : "Email htt****@gmail.com"}
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6 my-6 border border-white/50 shadow-xl text-center">
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {otpError && (
                  <div className="flex gap-2 items-start text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-left">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <div className="flex justify-between gap-2 max-w-[280px] mx-auto">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-10 h-12 text-center text-lg font-bold text-slate-800 rounded-xl border border-slate-200 bg-white/50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  ))}
                </div>

                <div className="text-xs text-slate-400">
                  Không nhận được mã?{" "}
                  <button type="button" className="text-blue-600 font-semibold hover:underline">
                    Gửi lại mã (59s)
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full glass-btn-blue py-3.5 rounded-2xl text-sm font-semibold cursor-pointer"
                >
                  Xác minh OTP
                </button>
              </form>
            </div>

            <button
              onClick={handleBackToLogin}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 text-center py-2 underline"
            >
              Hủy bỏ, quay lại
            </button>
          </motion.div>
        )}

        {/* FORGOT PASSWORD STEP 3: SETUP NEW PASSWORD & RECOVERY METHOD */}
        {step === "forgot_setup" && (
          <motion.div
            key="forgot_setup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="pt-6">
              <h1 className="text-2xl font-display font-bold tracking-tight text-slate-800">
                Khôi phục mật khẩu mới
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Thiết lập mật khẩu bảo mật mới và câu hỏi khôi phục dự phòng
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-5 my-3 border border-white/50 shadow-xl overflow-y-auto max-h-[460px]">
              <form onSubmit={handleSetupNewPassword} className="space-y-4">
                {recoveryError && (
                  <div className="flex gap-2 items-start text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Mật khẩu bảo mật mới
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-800 glass-input"
                    placeholder="Mật khẩu ít nhất 6 ký tự"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-800 glass-input"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <span className="block text-xs font-bold text-slate-600 mb-2">
                    Thiết lập Khôi phục mật khẩu dự phòng
                  </span>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Câu hỏi khôi phục dự phòng
                      </label>
                      <select className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white/50 border border-slate-200 focus:outline-none focus:border-blue-500">
                        <option>Tên trường tiểu học đầu tiên của bạn là gì?</option>
                        <option>Tên thú cưng đầu tiên của bạn là gì?</option>
                        <option>Thành phố quê hương của mẹ bạn là ở đâu?</option>
                        <option>Món ăn yêu thích của bạn từ thời thơ ấu?</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Câu trả lời bảo mật
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-800 glass-input"
                        placeholder="Nhập câu trả lời bảo mật của bạn"
                        defaultValue="Trường Nguyễn Huệ"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full glass-btn-blue py-3 rounded-2xl text-sm font-semibold mt-4 cursor-pointer"
                >
                  Xác nhận thiết lập lại
                </button>
              </form>
            </div>

            <button
              onClick={handleBackToLogin}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 text-center py-2 underline"
            >
              Hủy bỏ, quay lại
            </button>
          </motion.div>
        )}

        {/* FORGOT PASSWORD STEP 4: SUCCESS */}
        {step === "forgot_success" && (
          <motion.div
            key="forgot_success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col justify-center items-center text-center px-4"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6 shadow-xl shadow-green-100/50">
              <Check size={40} className="stroke-[2.5]" />
            </div>

            <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">
              Khôi phục thành công!
            </h2>
            <p className="text-sm text-slate-500 mb-8 max-w-[280px]">
              Mật khẩu bảo mật và phương án khôi phục dự phòng của bạn đã được cập nhật thành công.
            </p>

            <button
              onClick={handleBackToLogin}
              className="w-full glass-btn-blue py-3.5 rounded-2xl text-sm font-semibold cursor-pointer"
            >
              Quay lại Đăng nhập
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
