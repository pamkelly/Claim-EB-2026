import React, { useState } from "react";
import { 
  Search, Shield, Check, FileText, ArrowRight, ArrowLeft, Upload, 
  Camera, FileDown, CreditCard, Banknote, Mail, AlertCircle, Info,
  Fingerprint, Smartphone, Lock, CheckCircle2, Trash2, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InsuranceCard, ClaimRequest, TreatmentType, ReceiveMethod } from "../types";

interface ClaimWizardProps {
  cards: InsuranceCard[];
  onBack: () => void;
  onSubmitSuccess: (newClaim: ClaimRequest) => void;
}

export default function ClaimWizard({ cards, onBack, onSubmitSuccess }: ClaimWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showTermsSheet, setShowTermsSheet] = useState(false);
  const [showVerificationOverlay, setShowVerificationOverlay] = useState(false);
  
  // STEP 1: Select Insured Person
  const [searchName, setSearchName] = useState("");
  const [selectedCardId, setSelectedCardId] = useState("");

  // STEP 2: Event Info
  const [hospital, setHospital] = useState("");
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [treatmentType, setTreatmentType] = useState<TreatmentType>("NgoaiTru");
  const [cause, setCause] = useState("Ốm bệnh");
  const [amountStr, setAmountStr] = useState("");
  const [hasOtherInsurance, setHasOtherInsurance] = useState<boolean>(false);
  const [eventError, setEventError] = useState("");

  // STEP 3: Compensation Info
  const [receiveMethod, setReceiveMethod] = useState<ReceiveMethod>("ChuyenKhoan");
  const [bankName, setBankName] = useState("Vietcombank (VCB)");
  const [bankAccount, setBankAccount] = useState("101889922233");
  const [bankOwner, setBankOwner] = useState("NGUYEN VAN AN");
  const [email, setEmail] = useState("htthien20101996@gmail.com");
  const [infoError, setInfoError] = useState("");

  // STEP 4: Document Attachments & Terms
  const [medicalDocs, setMedicalDocs] = useState<{ name: string; size: string; type: string }[]>([]);
  const [paymentDocs, setPaymentDocs] = useState<{ name: string; size: string; type: string }[]>([]);
  const [isUploading, setIsUploading] = useState<"medical" | "payment" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [docError, setDocError] = useState("");

  // Terms & Verification (Merged into Step 4)
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"FaceID" | "OTP">("FaceID");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Filter cards based on search query
  const filteredCards = cards.filter(c => 
    c.name.toLowerCase().includes(searchName.toLowerCase()) ||
    c.cardNumber.toLowerCase().includes(searchName.toLowerCase())
  );

  const selectedCard = cards.find(c => c.id === selectedCardId);

  // Simulated preset documents for quick demo addition
  const PRESET_MED_DOCS = [
    { name: "Sổ_Khám_Bệnh_PTI.jpg", size: "340 KB", type: "image/jpeg" },
    { name: "Đơn_Thuốc_Bác_Sĩ.png", size: "210 KB", type: "image/png" },
    { name: "Kết_quả_Xét_nghiệm_Máu.pdf", size: "1.4 MB", type: "application/pdf" }
  ];

  const PRESET_PAY_DOCS = [
    { name: "Hóa_Đơn_Điện_Tử_VAT.pdf", size: "1.1 MB", type: "application/pdf" },
    { name: "Phiếu_Thu_Hồng_Ngọc.jpg", size: "450 KB", type: "image/jpeg" },
    { name: "Bảng_kê_chi_tiết_viện_phí.png", size: "620 KB", type: "image/png" }
  ];

  const triggerMockUpload = (type: "medical" | "payment") => {
    setIsUploading(type);
    setUploadProgress(0);
    setDocError("");

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(null);
            
            // Add a realistic preset file based on type
            if (type === "medical") {
              const fileToAdd = PRESET_MED_DOCS[Math.min(medicalDocs.length, PRESET_MED_DOCS.length - 1)];
              // Avoid duplicates easily
              if (!medicalDocs.some(d => d.name === fileToAdd.name)) {
                setMedicalDocs([...medicalDocs, fileToAdd]);
              } else {
                setMedicalDocs([...medicalDocs, { 
                  name: `Chứng_từ_y_tế_bổ_sung_${medicalDocs.length + 1}.png`, 
                  size: "280 KB", 
                  type: "image/png" 
                }]);
              }
            } else {
              const fileToAdd = PRESET_PAY_DOCS[Math.min(paymentDocs.length, PRESET_PAY_DOCS.length - 1)];
              if (!paymentDocs.some(d => d.name === fileToAdd.name)) {
                setPaymentDocs([...paymentDocs, fileToAdd]);
              } else {
                setPaymentDocs([...paymentDocs, { 
                  name: `Hóa_đơn_bổ_sung_${paymentDocs.length + 1}.pdf`, 
                  size: "1.5 MB", 
                  type: "application/pdf" 
                }]);
              }
            }
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  // Drag and Drop simulation handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: "medical" | "payment") => {
    e.preventDefault();
    triggerMockUpload(type);
  };

  // Navigations between steps
  const nextStep = () => {
    if (step === 1) {
      if (!selectedCardId) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setEventError("");
      if (!hospital.trim()) {
        setEventError("Vui lòng nhập cơ sở y tế điều trị.");
        return;
      }
      if (!cause.trim()) {
        setEventError("Vui lòng nhập nguyên nhân rủi ro / lý do khám.");
        return;
      }
      if (!amountStr || isNaN(Number(amountStr.replace(/\./g, "")))) {
        setEventError("Vui lòng nhập tổng số tiền yêu cầu bồi thường hợp lệ.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setInfoError("");
      if (receiveMethod === "ChuyenKhoan") {
        if (!bankName.trim() || !bankAccount.trim() || !bankOwner.trim()) {
          setInfoError("Vui lòng điền đầy đủ thông tin tài khoản ngân hàng nhận bồi thường.");
          return;
        }
      }
      if (!email.trim() || !email.includes("@")) {
        setInfoError("Vui lòng nhập email hợp lệ để nhận thông báo giải quyết.");
        return;
      }
      setStep(4);
    }
  };

  const prevStep = () => {
    if (step > 1 && step < 5) {
      setStep((step - 1) as any);
    }
  };

  // Handle Biometric/OTP Verification and final Submission
  const handleVerifyAndSubmit = () => {
    setDocError("");
    if (medicalDocs.length === 0) {
      setDocError("Vui lòng đính kèm ít nhất một chứng từ y tế (sổ khám, đơn thuốc...).");
      return;
    }
    if (paymentDocs.length === 0) {
      setDocError("Vui lòng đính kèm ít nhất một hóa đơn / phiếu thu thanh toán.");
      return;
    }
    if (!agreeTerms) {
      setShowTermsSheet(true);
      return;
    }

    setShowVerificationOverlay(true);
    setIsVerifying(true);
    setVerificationSuccess(false);

    if (verificationMethod === "FaceID") {
      setTimeout(() => {
        setIsVerifying(false);
        setVerificationSuccess(true);
        
        setTimeout(() => {
          executeFinalSubmission();
        }, 1000);
      }, 1800);
    } else {
      setIsVerifying(false);
    }
  };

  const executeFinalSubmission = () => {
    // Construct new Claim Request
    const newClaim: ClaimRequest = {
      id: `PTI-${Math.floor(1000 + Math.random() * 9000)}`,
      cardId: selectedCardId,
      insuredName: selectedCard?.name || "Khách hàng PTI",
      cardNumber: selectedCard?.cardNumber || "",
      hospital,
      treatmentType,
      cause,
      amount: Number(amountStr.replace(/\./g, "")),
      hasOtherInsurance,
      receiveMethod,
      bankName: receiveMethod === "ChuyenKhoan" ? bankName : undefined,
      bankAccount: receiveMethod === "ChuyenKhoan" ? bankAccount : undefined,
      bankOwner: receiveMethod === "ChuyenKhoan" ? bankOwner : undefined,
      email,
      medicalDocs,
      paymentDocs,
      status: "ChoDuyet",
      date: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})
    };

    onSubmitSuccess(newClaim);
    setShowVerificationOverlay(false);
    setStep(5); // Success screen (now step 5)
  };

  const formatCurrencyInput = (val: string) => {
    // Remove dots
    const clean = val.replace(/\D/g, "");
    if (!clean) return "";
    return Number(clean).toLocaleString("vi-VN");
  };

  return (
    <div className="flex-grow flex flex-col justify-between overflow-hidden relative">
      {/* Header and Step Indicator */}
      <div className="bg-white/40 border-b border-slate-100/50 px-5 py-3 flex items-center justify-between z-10">
        <button 
          onClick={step === 5 ? onBack : prevStep} 
          disabled={step === 1}
          className="p-1.5 rounded-full hover:bg-slate-100/50 text-slate-500 disabled:opacity-20 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-800 font-display">Tạo Yêu Cầu Quyền Lợi</h3>
        </div>
        <div className="w-8 h-8" /> {/* Balance */}
      </div>

      {/* Progressive Step Indicator matching the user's uploaded image */}
      {step < 5 && (
        <div className="bg-white/55 backdrop-blur-md py-4 px-6 border-b border-slate-100/60 relative">
          <div className="max-w-[280px] mx-auto">
            <div className="relative flex items-center justify-between">
              {/* Background connector line */}
              <div className="absolute left-3 right-3 top-[11px] h-[2px] bg-slate-100 -z-0" />
              
              {/* Active connector lines */}
              <div className="absolute left-3 right-3 top-[11px] h-[2px] bg-slate-100 -z-0 w-full">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300" 
                  style={{ 
                    width: step === 1 ? "0%" : 
                           step === 2 ? "33.3%" : 
                           step === 3 ? "66.6%" : "100%" 
                  }}
                />
              </div>

              {/* Steps */}
              {[1, 2, 3, 4].map((s) => {
                const isActive = step === s;
                const isCompleted = step > s;
                
                // Define relevant elegant icons for each step
                const getStepIcon = (num: number) => {
                  switch (num) {
                    case 1: return <Shield size={11} className="stroke-[2.5]" />;
                    case 2: return <FileText size={11} className="stroke-[2.5]" />;
                    case 3: return <Banknote size={11} className="stroke-[2.5]" />;
                    case 4: return <Upload size={11} className="stroke-[2.5]" />;
                    default: return <Check size={11} className="stroke-[2.5]" />;
                  }
                };

                return (
                  <div key={s} className="relative z-10 flex flex-col items-center">
                    {isActive ? (
                      /* Active Step: Larger blue circle with icon inside */
                      <motion.div 
                        layoutId="activeStepIndicator"
                        className="w-6.5 h-6.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/40 scale-110"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        {getStepIcon(s)}
                      </motion.div>
                    ) : isCompleted ? (
                      /* Completed Step: Small solid blue dot */
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm transition-all duration-300" />
                    ) : (
                      /* Upcoming Step: Small light-grey dot */
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200 transition-all duration-300" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Labels underneath */}
            <div className="flex justify-between mt-2 px-1 text-[9px] font-bold select-none text-center">
              <span className={step === 1 ? "text-blue-600 font-extrabold" : "text-slate-500"}>Chọn người</span>
              <span className={step === 2 ? "text-blue-600 font-extrabold" : "text-slate-400"}>Khai báo</span>
              <span className={step === 3 ? "text-blue-600 font-extrabold" : "text-slate-400"}>Nhận tiền</span>
              <span className={step === 4 ? "text-blue-600 font-extrabold" : "text-slate-400"}>Đính kèm & Ký</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SELECT INSURED PERSON */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-blue-50/50 border border-blue-100/30 p-3.5 rounded-2xl flex items-start gap-3">
                <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Vui lòng chọn thẻ bảo hiểm điện tử của người được bảo hiểm cần yêu cầu bồi thường dưới đây.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                  placeholder="Tìm kiếm người được bảo lãnh hoặc số thẻ..."
                />
              </div>

              {/* Cards Grid */}
              <div className="space-y-3 pt-1">
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => {
                    const isSelected = selectedCardId === card.id;
                    const isExpired = card.status === "HetHan";
                    
                    return (
                      <div
                        key={card.id}
                        onClick={() => !isExpired && setSelectedCardId(card.id)}
                        className={`relative rounded-2xl p-4 border transition-all cursor-pointer ${
                          isExpired 
                            ? "opacity-50 border-slate-200 bg-slate-50 cursor-not-allowed" 
                            : isSelected
                            ? "border-blue-500 bg-blue-50/20 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30"
                            : "border-slate-100 bg-white/60 hover:bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {card.relationship}
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 tracking-tight font-display mt-1.5">
                              {card.name}
                            </h4>
                            <p className="text-[11px] font-mono text-slate-500">{card.cardNumber}</p>
                          </div>
                          
                          {isExpired ? (
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                              Hết hạn
                            </span>
                          ) : isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300 bg-white" />
                          )}
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-medium">
                          <span>Ngày sinh: {card.birthday}</span>
                          <span>Hạn dùng: {card.expiryDate}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs font-medium">
                    Không tìm thấy thẻ phù hợp.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: INSURANCE EVENT INFO */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Thẻ đang chọn:</span>
                  <span className="font-mono font-bold text-blue-600">{selectedCard?.cardNumber}</span>
                </div>

                {eventError && (
                  <div className="flex gap-2 items-start text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{eventError}</span>
                  </div>
                )}

                {/* Hospital / Healthcare */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Cơ sở y tế điều trị *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={hospital}
                      onChange={(e) => {
                        setHospital(e.target.value);
                        setShowHospitalDropdown(true);
                      }}
                      onFocus={() => setShowHospitalDropdown(true)}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                      placeholder="Tìm kiếm hoặc tự nhập tên bệnh viện..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowHospitalDropdown(!showHospitalDropdown)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1 hover:text-slate-600 cursor-pointer flex items-center justify-center"
                    >
                      <ChevronDown size={16} className={`transform transition-transform duration-200 ${showHospitalDropdown ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {/* Hospital Search Dropdown */}
                  {showHospitalDropdown && (
                    <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white/95 backdrop-blur-md border border-slate-150 rounded-xl shadow-xl z-50 py-1 scrollbar-none">
                      {(() => {
                        const defaultHospitals = [
                          "Bệnh viện Nhi Trung Ương",
                          "Bệnh viện Đa Khoa Hồng Ngọc",
                          "Bệnh viện Bạch Mai",
                          "Bệnh viện Đa khoa Tâm Anh",
                          "Bệnh viện Việt Đức",
                          "Bệnh viện Trung ương Quân đội 108",
                          "Bệnh viện Phụ sản Trung ương",
                          "Bệnh viện Chợ Rẫy",
                          "Bệnh viện Vinmec",
                          "Bệnh viện Đại học Y Dược TP.HCM",
                          "Bệnh viện Pháp Việt (FV)"
                        ];
                        const filtered = defaultHospitals.filter(h => 
                          h.toLowerCase().includes(hospital.toLowerCase())
                        );

                        return filtered.length > 0 ? (
                          filtered.map((h, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setHospital(h);
                                setShowHospitalDropdown(false);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 font-medium transition-colors border-b border-slate-50 last:border-none flex items-center justify-between cursor-pointer"
                            >
                              <span>{h}</span>
                              {hospital === h && <Check size={12} className="text-blue-500 stroke-[2.5]" />}
                            </button>
                          ))
                        ) : (
                          <div className="px-3.5 py-2.5 text-xs text-slate-400 font-medium flex flex-col gap-1 text-center">
                            <span>Không thấy bệnh viện trùng khớp</span>
                            <button
                              type="button"
                              onClick={() => setShowHospitalDropdown(false)}
                              className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer"
                            >
                              Dùng tên vừa nhập: "{hospital}"
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {/* Backdrop clicking helper layer */}
                  {showHospitalDropdown && (
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setShowHospitalDropdown(false)}
                    />
                  )}
                </div>

                {/* Treatment Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Hình thức điều trị *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "NgoaiTru", label: "Ngoại trú", description: "Khám đi về trong ngày" },
                      { id: "NoiTru", label: "Nội trú", description: "Điều trị nội trú qua đêm" }
                    ].map((type) => {
                      const isSelected = treatmentType === type.id;
                      return (
                        <label
                          key={type.id}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/20 text-blue-600 shadow-sm shadow-blue-500/5"
                              : "border-slate-100 bg-white/40 text-slate-500 hover:bg-white"
                          }`}
                        >
                          <div className="text-left space-y-0.5 select-none">
                            <p className="text-xs font-bold">{type.label}</p>
                            <p className="text-[9px] opacity-75 font-medium leading-tight">{type.description}</p>
                          </div>
                          <div className="relative flex items-center justify-center shrink-0 ml-2">
                            <input
                              type="radio"
                              name="treatmentTypeRadio"
                              checked={isSelected}
                              onChange={() => setTreatmentType(type.id as TreatmentType)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white"
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Cause of risk */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Nguyên nhân rủi ro *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "OmBenh", label: "Ốm bệnh", description: "Bệnh lý thông thường, cảm sốt..." },
                      { id: "TaiNan", label: "Tai nạn", description: "Tai nạn sinh hoạt, giao thông..." }
                    ].map((type) => {
                      const isSelected = cause === type.label;
                      return (
                        <label
                          key={type.id}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/20 text-blue-600 shadow-sm shadow-blue-500/5"
                              : "border-slate-100 bg-white/40 text-slate-500 hover:bg-white"
                          }`}
                        >
                          <div className="text-left space-y-0.5 select-none">
                            <p className="text-xs font-bold">{type.label}</p>
                            <p className="text-[9px] opacity-75 font-medium leading-tight">{type.description}</p>
                          </div>
                          <div className="relative flex items-center justify-center shrink-0 ml-2">
                            <input
                              type="radio"
                              name="causeRadio"
                              checked={isSelected}
                              onChange={() => setCause(type.label)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white"
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Total Claim Amount */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Tổng số tiền yêu cầu bồi thường (VNĐ) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amountStr}
                      onChange={(e) => setAmountStr(formatCurrencyInput(e.target.value))}
                      className="w-full pl-3.5 pr-12 py-2.5 rounded-xl text-xs font-bold text-slate-800 glass-input text-right"
                      placeholder="0"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                      VND
                    </span>
                  </div>
                </div>

                {/* Has other insurance */}
                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-600">
                      Có hợp đồng BH khác bảo vệ cho sự kiện này?
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium">Bảo hiểm của công ty khác cùng chi trả</p>
                  </div>
                  <div className="flex gap-1 bg-slate-100/60 p-1 rounded-xl border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setHasOtherInsurance(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        hasOtherInsurance 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Có
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasOtherInsurance(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        !hasOtherInsurance 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Không
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: COMPENSATION PAYMENT INFO */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-700 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                  <CreditCard size={15} className="text-blue-500" /> Thông tin nhận tiền & thông báo
                </h4>

                {infoError && (
                  <div className="flex gap-2 items-start text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{infoError}</span>
                  </div>
                )}

                {/* Receive Method */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 ml-1">
                    Hình thức nhận tiền bồi thường *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setReceiveMethod("ChuyenKhoan")}
                      className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer ${
                        receiveMethod === "ChuyenKhoan"
                          ? "border-blue-500 bg-blue-50/20 text-blue-600 font-semibold shadow-sm"
                          : "border-slate-100 bg-white/40 text-slate-500"
                      }`}
                    >
                      <CreditCard size={18} />
                      <div className="text-left">
                        <p className="text-xs font-bold">Chuyển khoản</p>
                        <p className="text-[9px] opacity-75">Tài khoản ngân hàng</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReceiveMethod("TienMat")}
                      className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer ${
                        receiveMethod === "TienMat"
                          ? "border-blue-500 bg-blue-50/20 text-blue-600 font-semibold shadow-sm"
                          : "border-slate-100 bg-white/40 text-slate-500"
                      }`}
                    >
                      <Banknote size={18} />
                      <div className="text-left">
                        <p className="text-xs font-bold">Tiền mặt</p>
                        <p className="text-[9px] opacity-75">Tại bưu cục VNPost</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bank account details */}
                {receiveMethod === "ChuyenKhoan" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3.5 pt-2 border-t border-slate-50"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">
                        Tên Ngân hàng thụ hưởng
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 glass-input"
                        placeholder="Nhập tên ngân hàng (ví dụ: VCB, BIDV, TCB...)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">
                        Số tài khoản nhận tiền
                      </label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 glass-input font-mono"
                        placeholder="Nhập số tài khoản ngân hàng"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">
                        Tên chủ tài khoản (Viết hoa không dấu)
                      </label>
                      <input
                        type="text"
                        value={bankOwner}
                        onChange={(e) => setBankOwner(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 glass-input font-mono"
                        placeholder="NGUYEN VAN AN"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Notification Email */}
                <div className="pt-2 border-t border-slate-50">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Email nhận thông báo kết quả *
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                      placeholder="example@gmail.com"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 ml-1">
                    PTI sẽ gửi hỏa tốc quyết định bồi thường và sao kê chi tiết qua thư điện tử này.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DOCUMENT UPLOADS */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {docError && (
                <div className="flex gap-2 items-start text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{docError}</span>
                </div>
              )}

              {/* 1. Medical Documents Box */}
              <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>1. Chứng từ y tế *</span>
                    <span className="text-[10px] font-medium text-slate-400">(Sổ y bạ, phiếu khám, đơn thuốc...)</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Yêu cầu chụp rõ nét, không bị lóa mờ hoặc rách góc</p>
                </div>

                {/* Upload Zone */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "medical")}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all"
                  onClick={() => triggerMockUpload("medical")}
                >
                  {isUploading === "medical" ? (
                    <div className="space-y-2 py-2">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mx-auto animate-pulse">
                        <Upload size={18} />
                      </div>
                      <p className="text-xs font-bold text-blue-600">Đang tải tài liệu lên ({uploadProgress}%)</p>
                      <div className="w-40 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-center gap-3 text-slate-400">
                        <Camera size={20} className="hover:text-blue-500" />
                        <Upload size={20} className="hover:text-blue-500" />
                        <FileDown size={20} className="hover:text-blue-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-600">Bấm để Chụp ảnh / Tải ảnh, PDF</p>
                      <p className="text-[9px] text-slate-400">Hoặc kéo thả file trực tiếp vào đây</p>
                    </div>
                  )}
                </div>

                {/* File list */}
                {medicalDocs.length > 0 && (
                  <div className="space-y-1.5">
                    {medicalDocs.map((doc, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-100/60 rounded-xl px-3 py-2 text-[10px] border border-slate-200/50">
                        <div className="flex items-center gap-2 overflow-hidden mr-2">
                          <FileText size={14} className="text-blue-500 shrink-0" />
                          <span className="font-semibold text-slate-700 truncate">{doc.name}</span>
                          <span className="text-slate-400 shrink-0">({doc.size})</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setMedicalDocs(medicalDocs.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Payment Documents Box */}
              <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>2. Chứng từ thanh toán *</span>
                    <span className="text-[10px] font-medium text-slate-400">(Hóa đơn tài chính, phiếu thu, bảng kê...)</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Hóa đơn điện tử VAT có mã CQ thuế hoặc hóa đơn chuyển đổi hợp lệ</p>
                </div>

                {/* Upload Zone */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "payment")}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all"
                  onClick={() => triggerMockUpload("payment")}
                >
                  {isUploading === "payment" ? (
                    <div className="space-y-2 py-2">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mx-auto animate-pulse">
                        <Upload size={18} />
                      </div>
                      <p className="text-xs font-bold text-blue-600">Đang tải hóa đơn lên ({uploadProgress}%)</p>
                      <div className="w-40 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-center gap-3 text-slate-400">
                        <Camera size={20} className="hover:text-blue-500" />
                        <Upload size={20} className="hover:text-blue-500" />
                        <FileDown size={20} className="hover:text-blue-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-600">Bấm để Chụp hóa đơn / Đính kèm PDF</p>
                      <p className="text-[9px] text-slate-400">Hoặc kéo thả file trực tiếp vào đây</p>
                    </div>
                  )}
                </div>

                {/* File list */}
                {paymentDocs.length > 0 && (
                  <div className="space-y-1.5">
                    {paymentDocs.map((doc, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-100/60 rounded-xl px-3 py-2 text-[10px] border border-slate-200/50">
                        <div className="flex items-center gap-2 overflow-hidden mr-2">
                          <FileText size={14} className="text-blue-500 shrink-0" />
                          <span className="font-semibold text-slate-700 truncate">{doc.name}</span>
                          <span className="text-slate-400 shrink-0">({doc.size})</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setPaymentDocs(paymentDocs.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Condensed Terms and Conditions Section */}
              <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-100 h-4.5 w-4.5 shrink-0"
                  />
                  <span className="text-[10px] text-slate-500 font-medium leading-normal">
                    Tôi đồng ý hoàn toàn với các{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsSheet(true)}
                      className="text-blue-600 font-bold hover:underline cursor-pointer inline-block"
                    >
                      Điều khoản và điều kiện
                    </button>{" "}
                    cam kết giải quyết quyền lợi bảo hiểm điện tử của PTI CARE.
                  </span>
                </label>

                {/* Secure Authentication Segmented Control */}
                <div className="border-t border-slate-100/60 pt-3.5 space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-slate-600">Phương thức xác thực ký số</span>
                    <span className="text-[9px] text-slate-400 font-mono">SECURE PAY</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setVerificationMethod("FaceID")}
                      className={`py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        verificationMethod === "FaceID"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Fingerprint size={13} />
                      <span>Quét Face ID</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationMethod("OTP")}
                      className={`py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        verificationMethod === "OTP"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Smartphone size={13} />
                      <span>Mã OTP SMS</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUBMISSION SUCCESS SCREEN */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 px-4 space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mx-auto shadow-xl shadow-green-100/30">
                <CheckCircle2 size={44} className="stroke-[2]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-display font-bold text-slate-800">Nộp hồ sơ thành công!</h2>
                <p className="text-[11px] leading-relaxed text-slate-500 max-w-[280px] mx-auto font-medium">
                  Yêu cầu giải quyết bồi thường mã <span className="font-bold text-blue-600">#PTI-{Math.floor(1000 + Math.random() * 8999)}</span> đã được hệ thống tiếp nhận và chuyển về trạng thái <span className="font-bold text-amber-500">Chờ duyệt</span>.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-4 border border-slate-100 text-left text-xs space-y-2.5">
                <h4 className="font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-1.5">
                  <Info size={14} className="text-blue-500" /> Hành trình giải quyết hồ sơ:
                </h4>
                <ul className="space-y-2 text-[10px] text-slate-500 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span><strong>Ban Giám định PTI</strong> tiếp nhận hồ sơ y tế & kiểm tra hóa đơn thanh toán (Thời gian tối đa 24-48 giờ làm việc).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Trường hợp thiếu giấy tờ, PTI sẽ gửi thông báo yêu cầu bổ sung chứng từ trực tiếp qua app & hỏa tốc qua Email.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Khi hồ sơ được phê duyệt duyệt, số tiền bồi thường sẽ tự động chuyển khoản về tài khoản ngân hàng của bạn ngay lập tức.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full glass-btn-blue py-3.5 rounded-2xl text-xs font-semibold cursor-pointer"
                >
                  Quay lại Trang chủ
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation Buttons (Footer) */}
      {step < 5 && (
        <div className="p-4 border-t border-slate-100/50 bg-white/50 backdrop-blur-md flex gap-3 z-10">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 border border-slate-200 hover:border-slate-300 text-slate-600 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer"
            >
              Quay lại
            </button>
          )}
          
          <button
            type="button"
            onClick={step === 4 ? handleVerifyAndSubmit : nextStep}
            disabled={step === 1 && !selectedCardId}
            className={`py-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              step === 1 && !selectedCardId
                ? "bg-slate-200 text-slate-400 cursor-not-allowed flex-1"
                : "glass-btn-blue flex-1"
            }`}
          >
            {step === 4 ? (
              agreeTerms ? "Ký số & Nộp yêu cầu" : "Cam kết & Nộp yêu cầu"
            ) : (
              <>
                Tiếp tục <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      )}

      {/* Terms Bottom Sheet */}
      <AnimatePresence>
        {showTermsSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTermsSheet(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer"
            />
            {/* Sliding Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 max-h-[75%] bg-white rounded-t-[32px] shadow-2xl z-50 flex flex-col overflow-hidden pb-6 border-t border-slate-100"
            >
              {/* iOS Grab bar */}
              <div className="w-full flex justify-center py-3">
                <div className="w-10 h-1 bg-slate-300 rounded-full" />
              </div>
              
              {/* Title */}
              <div className="px-6 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 font-display text-center flex items-center justify-center gap-1.5">
                  <Shield size={16} className="text-blue-500" /> Cam Kết & Điều Khoản Sử Dụng
                </h3>
              </div>

              {/* Contents */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 text-[11px] leading-relaxed text-slate-500 font-medium">
                <p className="font-bold text-slate-700">Người yêu cầu giải quyết bồi thường cam kết:</p>
                <p>
                  1. Tôi xin cam đoan các thông tin khai báo sự kiện bảo hiểm, số tiền yêu cầu bồi thường và các hình ảnh chứng từ đính kèm trên đây là hoàn toàn đúng sự thật, hợp pháp và hợp lệ.
                </p>
                <p>
                  2. Tôi đồng ý ủy quyền cho Tổng Công ty Cổ phần Bảo hiểm Bưu điện (PTI) liên hệ với các bệnh viện, cơ sở y tế và cơ quan chức năng có liên quan để thu thập, kiểm tra, xác minh thông tin hồ sơ bệnh án hoặc các chứng từ có liên quan nếu cần thiết để phục vụ công tác giải quyết bồi thường.
                </p>
                <p>
                  3. Nếu phát hiện bất kỳ sự gian lận, cố ý làm sai lệch thông tin hay cung cấp chứng từ không hợp pháp nào, tôi xin chịu hoàn toàn trách nhiệm trước pháp luật Việt Nam, bao gồm việc bồi hoàn toàn bộ số tiền bảo hiểm đã nhận và chịu các chế tài xử lý theo quy định của Bộ luật Hình sự.
                </p>
                <p>
                  4. Bảo hiểm PTI cam kết bảo mật tuyệt đối thông tin dữ liệu cá nhân của quý khách hàng và chỉ sử dụng cho mục đích thẩm định bồi thường theo đúng quy định của pháp luật và cam kết chất lượng dịch vụ bảo lãnh quốc tế.
                </p>
              </div>

              {/* Action Button */}
              <div className="px-6 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAgreeTerms(true);
                    setShowTermsSheet(false);
                  }}
                  className="w-full glass-btn-blue py-3 rounded-2xl text-xs font-bold"
                >
                  Tôi đồng ý và cam kết
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Security Verification Overlay */}
      <AnimatePresence>
        {showVerificationOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6 text-white"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[280px] bg-slate-900/85 border border-white/15 rounded-3xl p-6 text-center space-y-4 shadow-2xl"
            >
              {isVerifying ? (
                <div className="space-y-4">
                  {verificationMethod === "FaceID" ? (
                    <div className="relative w-16 h-16 mx-auto rounded-full border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden">
                      {/* Face Scanner animation */}
                      <motion.div 
                        className="absolute left-0 w-full h-0.5 bg-blue-400 shadow-md shadow-blue-400/50"
                        animate={{ top: ["5%", "95%", "5%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      />
                      <Fingerprint size={32} className="text-blue-400 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-blue-400 animate-spin mx-auto" />
                  )}
                  
                  <p className="text-xs font-bold text-white tracking-tight">
                    {verificationMethod === "FaceID" ? "Đang quét Face ID bảo mật..." : "Gửi mã OTP xác thực SMS..."}
                  </p>
                  <p className="text-[10px] text-white/50 font-medium">Vui lòng giữ nguyên điện thoại của bạn</p>
                </div>
              ) : verificationSuccess ? (
                <div className="space-y-3 py-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/15">
                    <CheckCircle2 size={30} className="stroke-[2.5]" />
                  </div>
                  <p className="text-xs font-bold text-emerald-400">Xác thực Ký số thành công!</p>
                  <p className="text-[10px] text-white/50 font-medium">Hồ sơ bồi thường đang được khởi tạo...</p>
                </div>
              ) : (
                /* OTP Entry UI */
                <div className="space-y-4 text-left">
                  <div className="text-center space-y-1">
                    <h4 className="text-xs font-bold text-white flex items-center justify-center gap-1.5 font-display">
                      <Smartphone size={16} className="text-blue-400" /> Nhập Mã Xác Thực OTP
                    </h4>
                    <p className="text-[9px] text-white/50 font-medium">Mã OTP đã được gửi đến số điện thoại của bạn</p>
                  </div>

                  <div className="flex justify-center gap-2 py-2">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={otpCode[idx]}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          const newOtp = [...otpCode];
                          newOtp[idx] = val;
                          setOtpCode(newOtp);
                          
                          if (val && idx < 5) {
                            document.getElementById(`otp-input-${idx + 1}`)?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otpCode[idx] && idx > 0) {
                            document.getElementById(`otp-input-${idx - 1}`)?.focus();
                          }
                        }}
                        className="w-8 h-10 rounded-xl bg-white/10 border border-white/20 text-center text-white font-bold text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                      />
                    ))}
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowVerificationOverlay(false)}
                      className="flex-1 bg-white/5 border border-white/10 text-white/80 py-2 rounded-xl text-[10px] font-bold cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (otpCode.join("").length < 6) {
                          alert("Vui lòng nhập đầy đủ 6 chữ số OTP.");
                          return;
                        }
                        setIsVerifying(true);
                        setTimeout(() => {
                          setIsVerifying(false);
                          setVerificationSuccess(true);
                          setTimeout(() => {
                            executeFinalSubmission();
                          }, 1000);
                        }, 1200);
                      }}
                      className="flex-1 glass-btn-blue py-2 rounded-xl text-[10px] font-bold"
                    >
                      Xác thực
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
