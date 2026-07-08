import React, { useState } from "react";
import { 
  Search, Shield, Check, FileText, ArrowRight, ArrowLeft, Upload, 
  Camera, FileDown, CreditCard, Banknote, Mail, AlertCircle, Info,
  Fingerprint, Smartphone, Lock, CheckCircle2, Trash2, ChevronDown, FileUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InsuranceCard, ClaimRequest, TreatmentType, ReceiveMethod } from "../types";

// Re-define SAMPLE_ROSTER inside wizard to allow searching & picking of corporate employees
const WIZARD_ROSTER = [
  { id: "1", name: "Nguyễn Văn An", relationship: "Bản thân (Chính)", cardNumber: "FPT-08877", bankName: "Vietcombank (VCB)", bankAccount: "101889922233", bankOwner: "NGUYEN VAN AN", email: "hoang.pt@fsoft.com.vn", employeeCode: "FPT-08877", isDependent: false },
  { id: "2", name: "Nguyễn Minh Khang", relationship: "Con (Phụ thuộc)", cardNumber: "FPT-08877-01", bankName: "Vietcombank (VCB)", bankAccount: "101889922233", bankOwner: "NGUYEN VAN AN", email: "hoang.pt@fsoft.com.vn", employeeCode: "FPT-08877", isDependent: true, dependentOf: "Nguyễn Văn An" },
  { id: "3", name: "Lê Văn Công", relationship: "Bản thân (Chính)", cardNumber: "FPT-00812", bankName: "Techcombank (TCB)", bankAccount: "190333444555", bankOwner: "LE VAN CONG", email: "cong.lv@fsoft.com.vn", employeeCode: "FPT-00812", isDependent: false },
  { id: "4", name: "Lê Minh Khôi", relationship: "Con (Phụ thuộc)", cardNumber: "FPT-00812-01", bankName: "Techcombank (TCB)", bankAccount: "190333444555", bankOwner: "LE VAN CONG", email: "cong.lv@fsoft.com.vn", employeeCode: "FPT-00812", isDependent: true, dependentOf: "Lê Văn Công" },
  { id: "5", name: "Trần Thị Hồng", relationship: "Vợ (Phụ thuộc)", cardNumber: "FPT-00812-02", bankName: "Techcombank (TCB)", bankAccount: "190333444555", bankOwner: "LE VAN CONG", email: "cong.lv@fsoft.com.vn", employeeCode: "FPT-00812", isDependent: true, dependentOf: "Lê Văn Công" },
  { id: "6", name: "Phạm Hồng Minh", relationship: "Bản thân (Chính)", cardNumber: "FPT-01122", bankName: "VietinBank", bankAccount: "101000888999", bankOwner: "PHAM HONG MINH", email: "minh.ph@fsoft.com.vn", employeeCode: "FPT-01122", isDependent: false },
  { id: "7", name: "Hoàng Thu Thảo", relationship: "Bản thân (Chính)", cardNumber: "FPT-09900", bankName: "MB Bank", bankAccount: "0990011223344", bankOwner: "HOANG THU THAO", email: "thao.ht@fsoft.com.vn", employeeCode: "FPT-09900", isDependent: false, status: "HetHan" }
];

interface ClaimWizardProps {
  cards: InsuranceCard[];
  onBack: () => void;
  onSubmitSuccess: (newClaim: ClaimRequest) => void;
  isCorporateMode?: boolean;
  corporateEmployee?: {
    id: string;
    name: string;
    relationship: string;
    cardNumber: string;
    bankName: string;
    bankAccount: string;
    bankOwner: string;
    email: string;
    isDependent: boolean;
  };
}

export default function ClaimWizard({ cards, onBack, onSubmitSuccess, isCorporateMode = false, corporateEmployee }: ClaimWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(() => {
    if (isCorporateMode && corporateEmployee) {
      return 2;
    }
    return 1;
  });
  const [showTermsSheet, setShowTermsSheet] = useState(false);
  const [showVerificationOverlay, setShowVerificationOverlay] = useState(false);
  
  // STEP 1: Select Insured Person
  const [searchName, setSearchName] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string>(() => {
    if (isCorporateMode) {
      return corporateEmployee ? corporateEmployee.id : "1"; // Nguyễn Văn An default or corporateEmployee id
    }
    return cards.length > 0 ? cards[0].id : "";
  });

  // Derived selected person / employee
  const currentEmployee = isCorporateMode 
    ? (WIZARD_ROSTER.find(r => r.id === selectedCardId) || WIZARD_ROSTER[0])
    : null;

  const selectedCard = isCorporateMode && currentEmployee
    ? { 
        id: currentEmployee.id, 
        name: currentEmployee.name, 
        cardNumber: currentEmployee.cardNumber, 
        relationship: currentEmployee.relationship,
        isDependent: currentEmployee.isDependent,
        dependentOf: (currentEmployee as any).dependentOf,
        bankName: currentEmployee.bankName,
        bankAccount: currentEmployee.bankAccount,
        bankOwner: currentEmployee.bankOwner,
        email: currentEmployee.email
      }
    : cards.find(c => c.id === selectedCardId);

  // STEP 2: Event Info
  const [hospital, setHospital] = useState("");
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [treatmentType, setTreatmentType] = useState<TreatmentType>("NgoaiTru");
  const [cause, setCause] = useState("Ốm bệnh");
  const [amountStr, setAmountStr] = useState("");
  const [hasOtherInsurance, setHasOtherInsurance] = useState<boolean>(false);
  const [eventError, setEventError] = useState("");

  // STEP 3: Compensation Info
  const [receiveMethod, setReceiveMethod] = useState<ReceiveMethod>("ChuyenKhoan");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankOwner, setBankOwner] = useState("");
  const [email, setEmail] = useState("");
  const [infoError, setInfoError] = useState("");

  // Auto populate bank info whenever selected card changes
  React.useEffect(() => {
    if (selectedCard) {
      if (isCorporateMode && currentEmployee) {
        setBankName(currentEmployee.bankName);
        setBankAccount(currentEmployee.bankAccount);
        setBankOwner(currentEmployee.bankOwner);
        setEmail(currentEmployee.email);
      } else {
        const matchingCard = cards.find(c => c.id === selectedCardId);
        if (matchingCard) {
          setBankName("Vietcombank (VCB)");
          setBankAccount("101889922233");
          setBankOwner(matchingCard.name.toUpperCase());
          setEmail("khachhang.care@gmail.com");
        }
      }
    }
  }, [selectedCardId, isCorporateMode, currentEmployee, cards]);

  // STEP 4: Document Attachments & Terms
  const [medicalDocs, setMedicalDocs] = useState<{ name: string; size: string; type: string }[]>([]);
  const [paymentDocs, setPaymentDocs] = useState<{ name: string; size: string; type: string }[]>([]);
  const [authDocs, setAuthDocs] = useState<{ name: string; size: string; type: string }[]>([]);
  const [accidentDocs, setAccidentDocs] = useState<{ name: string; size: string; type: string }[]>([]);
  const [hospitalReleaseDocs, setHospitalReleaseDocs] = useState<{ name: string; size: string; type: string }[]>([]);

  const [isUploading, setIsUploading] = useState<"medical" | "payment" | "auth" | "accident" | "release" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [docError, setDocError] = useState("");

  // Terms & Verification (Merged into Step 4)
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"FaceID" | "OTP">("FaceID");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Filter list of employees based on search query
  const filteredRoster = WIZARD_ROSTER.filter(emp => 
    emp.name.toLowerCase().includes(searchName.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(searchName.toLowerCase()) ||
    emp.cardNumber.toLowerCase().includes(searchName.toLowerCase())
  );

  const filteredCards = cards.filter(c => 
    c.name.toLowerCase().includes(searchName.toLowerCase()) ||
    c.cardNumber.toLowerCase().includes(searchName.toLowerCase())
  );

  // Simulated preset documents for quick demo addition
  const PRESET_MED_DOCS = [
    { name: "So_Kham_Benh_PTI.jpg", size: "340 KB", type: "image/jpeg" },
    { name: "Don_Thuoc_Bac_Si.png", size: "210 KB", type: "image/png" },
    { name: "Ket_qua_Xet_nghiem_Mau.pdf", size: "1.4 MB", type: "application/pdf" }
  ];

  const PRESET_PAY_DOCS = [
    { name: "Hoa_Don_Dien_Tu_VAT.pdf", size: "1.1 MB", type: "application/pdf" },
    { name: "Phieu_Thu_Hong_Ngoc.jpg", size: "450 KB", type: "image/jpeg" },
    { name: "Bang_ke_chi_tiet_vien_phi.png", size: "620 KB", type: "image/png" }
  ];

  const triggerMockUpload = (type: "medical" | "payment" | "auth" | "accident" | "release") => {
    setIsUploading(type);
    setUploadProgress(0);
    setDocError("");

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(null);
            
            if (type === "medical") {
              const fileToAdd = PRESET_MED_DOCS[Math.min(medicalDocs.length, PRESET_MED_DOCS.length - 1)];
              if (!medicalDocs.some(d => d.name === fileToAdd.name)) {
                setMedicalDocs([...medicalDocs, fileToAdd]);
              } else {
                setMedicalDocs([...medicalDocs, { 
                  name: `Chung_tu_y_te_bo_sung_${medicalDocs.length + 1}.png`, 
                  size: "280 KB", 
                  type: "image/png" 
                }]);
              }
            } else if (type === "auth") {
              setAuthDocs([{ name: "Giay_Uy_Quyen_Khai_Ho_PTI.pdf", size: "145 KB", type: "application/pdf" }]);
            } else if (type === "accident") {
              setAccidentDocs([{ name: "Bien_Ban_Xac_Nhan_Tai_Nan_Giao_Thong.pdf", size: "310 KB", type: "application/pdf" }]);
            } else if (type === "release") {
              setHospitalReleaseDocs([{ name: "Giay_Ra_Vien_Tom_Tat_Benh_An.png", size: "780 KB", type: "image/png" }]);
            } else {
              const fileToAdd = PRESET_PAY_DOCS[Math.min(paymentDocs.length, PRESET_PAY_DOCS.length - 1)];
              if (!paymentDocs.some(d => d.name === fileToAdd.name)) {
                setPaymentDocs([...paymentDocs, fileToAdd]);
              } else {
                setPaymentDocs([...paymentDocs, { 
                  name: `Hoa_don_bo_sung_${paymentDocs.length + 1}.pdf`, 
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
    }, 120);
  };

  // Drag and Drop simulation handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: "medical" | "payment" | "auth" | "accident" | "release") => {
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
        setEventError("Vui lòng nhập hoặc chọn cơ sở y tế điều trị.");
        return;
      }
      if (!cause.trim()) {
        setEventError("Vui lòng chọn nguyên nhân rủi ro.");
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

    // 1. Basic document requirements
    if (medicalDocs.length === 0) {
      setDocError("Vui lòng đính kèm ít nhất một chứng từ y tế (sổ khám, đơn thuốc...).");
      return;
    }
    if (paymentDocs.length === 0) {
      setDocError("Vui lòng đính kèm ít nhất một hóa đơn / phiếu thu thanh toán.");
      return;
    }
    
    // 2. Strict Conditional Document Requirements
    // Rule A: Accident (Tai nạn) -> Requires accident report
    if (cause === "Tai nạn" && accidentDocs.length === 0) {
      setDocError("Bắt buộc tải lên 'Biên bản xác nhận tai nạn' khi nguyên nhân là Tai nạn.");
      return;
    }

    // Rule B: Inpatient treatment (Nội trú) -> Requires release papers
    if (treatmentType === "NoiTru" && hospitalReleaseDocs.length === 0) {
      setDocError("Bắt buộc tải lên 'Giấy ra viện & tóm tắt bệnh án' khi hình thức là Điều trị Nội trú.");
      return;
    }

    // Rule C: Dependent (Người phụ thuộc) -> Requires power of attorney
    const isCurrentDependent = isCorporateMode 
      ? currentEmployee?.isDependent 
      : selectedCard?.relationship !== "Bản thân";

    if (isCurrentDependent && authDocs.length === 0) {
      setDocError("Bắt buộc đính kèm 'Giấy ủy quyền bồi thường hộ' từ Người được bảo hiểm chính.");
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
    const clean = val.replace(/\D/g, "");
    if (!clean) return "";
    return Number(clean).toLocaleString("vi-VN");
  };

  return (
    <div className="flex-grow flex flex-col justify-between overflow-hidden relative">
      {/* Header and Step Indicator */}
      <div className="bg-white/40 border-b border-slate-100/50 px-5 py-3 flex items-center justify-between z-10">
        <button 
          onClick={step === 1 || step === 5 ? onBack : prevStep} 
          className="p-1.5 rounded-full hover:bg-slate-100/50 text-slate-500 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-800 font-display">
            {isCorporateMode ? "Cổng EB - Tạo hộ yêu cầu" : "Tạo Yêu Cầu Quyền Lợi"}
          </h3>
        </div>
        <div className="w-8 h-8" />
      </div>

      {/* Progressive Step Indicator matching the design */}
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
                      <motion.div 
                        layoutId="activeStepIndicator"
                        className="w-6.5 h-6.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/40 scale-110"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        {getStepIcon(s)}
                      </motion.div>
                    ) : isCompleted ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm transition-all duration-300" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200 transition-all duration-300" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-2 px-1 text-[9px] font-bold select-none text-center">
              <span className={step === 1 ? "text-blue-600 font-extrabold" : "text-slate-500"}>Chọn người</span>
              <span className={step === 2 ? "text-blue-600 font-extrabold" : "text-slate-400"}>Khai báo</span>
              <span className={step === 3 ? "text-blue-600 font-extrabold" : "text-slate-400"}>Nhận tiền</span>
              <span className={step === 4 ? "text-blue-600 font-extrabold" : "text-slate-400"}>Đính kèm</span>
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
              {isCorporateMode ? (
                <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-2xl flex items-start gap-3 shadow-sm">
                  <CheckCircle2 size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">
                      CỔNG DOANH NGHIỆP - TẠO HỘ
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                      Hãy chọn một nhân sự hoặc người phụ thuộc từ danh sách dưới đây để tạo hộ yêu cầu bồi thường bảo hiểm nhóm EB.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50/50 border border-blue-100/30 p-3.5 rounded-2xl flex items-start gap-3">
                  <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Vui lòng chọn thẻ bảo hiểm điện tử của người được bảo hiểm cần yêu cầu bồi thường dưới đây.
                  </p>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                  placeholder={isCorporateMode ? "Tìm theo tên hoặc mã nhân viên (ví dụ: FPT-00812)..." : "Tìm kiếm người được bảo hiểm..."}
                />
              </div>

              {/* Cards Roster Listing */}
              <div className="space-y-3 pt-1">
                {isCorporateMode ? (
                  filteredRoster.length > 0 ? (
                    filteredRoster.map((emp) => {
                      const isSelected = selectedCardId === emp.id;
                      const isExpired = emp.status === "HetHan";
                      
                      return (
                        <div
                          key={emp.id}
                          onClick={() => !isExpired && setSelectedCardId(emp.id)}
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
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                  emp.isDependent 
                                    ? "bg-amber-100 text-amber-800 border border-amber-200/50" 
                                    : "bg-blue-100 text-blue-800 border border-blue-200/50"
                                }`}>
                                  {emp.relationship}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                  {emp.employeeCode}
                                </span>
                              </div>
                              
                              <h4 className="text-xs font-black text-slate-800 tracking-tight pt-1">
                                {emp.name}
                              </h4>
                              <p className="text-[10px] font-mono text-slate-500">Số thẻ: {emp.cardNumber}</p>
                              {emp.isDependent && (
                                <p className="text-[9px] text-slate-400 font-semibold">Phụ thuộc của: <strong className="text-slate-600">{emp.dependentOf}</strong></p>
                              )}
                            </div>
                            
                            {isExpired ? (
                              <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Hết hạn</span>
                            ) : isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                <Check size={12} className="stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-slate-300 bg-white" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs font-medium">
                      Không tìm thấy nhân viên nào phù hợp với mã số hoặc tên đã nhập.
                    </div>
                  )
                ) : (
                  filteredCards.length > 0 ? (
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
                  )
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
                  <span className="font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{selectedCard?.name} ({selectedCard?.cardNumber})</span>
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
                          "Bệnh viện Đa khoa Quốc tế Thu Cúc",
                          "Bệnh viện Hồng Ngọc",
                          "Bệnh viện Việt Pháp Hà Nội",
                          "Bệnh viện Nhi Trung Ương",
                          "Bệnh viện Bạch Mai",
                          "Bệnh viện Đa khoa Tâm Anh",
                          "Bệnh viện Vinmec",
                          "Bệnh viện Đại học Y Dược TP.HCM"
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
                  {showHospitalDropdown && (
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowHospitalDropdown(false)} />
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

                {/* Cause of risk with 3 options: Ốm bệnh, Tai nạn, Phẫu thuật */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Nguyên nhân rủi ro *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Ốm bệnh", color: "blue" },
                      { label: "Tai nạn", color: "red" },
                      { label: "Phẫu thuật", color: "emerald" }
                    ].map((type, idx) => {
                      const isSelected = cause === type.label;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCause(type.label)}
                          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-1.5 ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/20 text-blue-600 font-extrabold shadow-sm"
                              : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                          }`}
                        >
                          <span className="text-xs">{type.label}</span>
                        </button>
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
                      Có hợp đồng BH khác cùng chi trả?
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium">Bảo hiểm của hãng khác cùng bảo vệ</p>
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

          {/* STEP 3: COMPENSATION PAYMENT INFO - READ ONLY FOR HR / ROLE LOCKED */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {isCorporateMode && (
                <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-2xl flex items-start gap-3.5 text-amber-900 shadow-md">
                  <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600" />
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                      CẢNH BÁO PHÂN QUYỀN CHẶT CHẼ (ROLE CONSTRAINT)
                    </p>
                    <p className="text-[11px] leading-relaxed font-bold text-slate-600">
                      Để bảo vệ minh bạch tài chính của nhân sự: <strong className="text-red-600 uppercase font-black">HR KHÔNG CÓ QUYỀN</strong> sửa đổi thông tin ngân hàng hoặc nhận tiền bồi thường thay cho nhân sự của công ty.
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Các trường thông tin tài khoản ngân hàng thụ hưởng dưới đây bị <strong className="text-blue-600">Khóa Chỉ Xem (Read-only)</strong>. PTI sẽ chuyển bồi thường trực tiếp về tài khoản cá nhân của Người được bảo hiểm chính.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-700 border-b border-slate-100 pb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                  <CreditCard size={15} className="text-blue-500" /> Tài khoản nhận bồi thường trực tiếp
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
                    Hình thức nhận bồi thường
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={isCorporateMode}
                      className="p-3.5 rounded-xl border text-left flex items-center gap-2.5 bg-blue-50/20 border-blue-500 text-blue-600 font-bold shadow-sm"
                    >
                      <CreditCard size={18} />
                      <div>
                        <p className="text-xs font-bold">Chuyển khoản</p>
                        <p className="text-[9px] opacity-75">Tài khoản cá nhân</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      disabled={true}
                      className="p-3.5 rounded-xl border text-left flex items-center gap-2.5 opacity-40 border-slate-150 bg-slate-50 text-slate-400"
                    >
                      <Banknote size={18} />
                      <div>
                        <p className="text-xs font-bold">Tiền mặt</p>
                        <p className="text-[9px] opacity-75">Tại quầy giao dịch</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Locked Bank account details */}
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 flex items-center gap-1">
                      <span>Ngân hàng thụ hưởng</span>
                      {isCorporateMode && <Lock size={10} className="text-slate-400" />}
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      value={bankName}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 flex items-center gap-1">
                      <span>Số tài khoản nhận bồi thường</span>
                      {isCorporateMode && <Lock size={10} className="text-slate-400" />}
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      value={bankAccount}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 flex items-center gap-1">
                      <span>Chủ tài khoản thụ hưởng (NĐBH chính)</span>
                      {isCorporateMode && <Lock size={10} className="text-slate-400" />}
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      value={bankOwner}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200"
                    />
                  </div>
                </div>

                {/* Email Notification */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Email nhận sao kê chi tiết quyết định *
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 glass-input"
                      placeholder="example@fsoft.com.vn"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 ml-1 font-medium">
                    PTI Care sẽ cc thư gửi sao kê bồi thường điện tử tới email này ngay khi duyệt.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DOCUMENT UPLOADS WITH CONDITIONAL RULES */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {docError && (
                <div className="flex gap-2 items-start text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{docError}</span>
                </div>
              )}

              {/* 1. Medical Documents Box */}
              <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                <div>
                  <h4 className="text-xs font-black text-slate-700 flex items-center justify-between">
                    <span>1. Chứng từ y tế *</span>
                    <span className="text-[10px] font-medium text-slate-400">(Sổ y bạ, phiếu khám, đơn thuốc...)</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Yêu cầu chụp rõ nét toàn bộ trang sổ và chỉ định điều trị</p>
                </div>

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
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-center gap-3 text-slate-400">
                        <Camera size={20} />
                        <Upload size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-600">Bấm để Chụp / Đính kèm tài liệu y tế</p>
                      <p className="text-[9px] text-slate-400">Hỗ trợ JPG, PNG, PDF tối đa 10MB</p>
                    </div>
                  )}
                </div>

                {/* File list */}
                {medicalDocs.length > 0 && (
                  <div className="space-y-1.5">
                    {medicalDocs.map((doc, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-100/60 rounded-xl px-3 py-2 text-[10px] border border-slate-200/50">
                        <div className="flex items-center gap-2 mr-2 overflow-hidden">
                          <FileText size={14} className="text-blue-500 shrink-0" />
                          <span className="font-bold text-slate-700 truncate">{doc.name}</span>
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
                  <h4 className="text-xs font-black text-slate-700 flex items-center justify-between">
                    <span>2. Chứng từ thanh toán *</span>
                    <span className="text-[10px] font-medium text-slate-400">(Hóa đơn chuyển đổi, phiếu thu...)</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Bao gồm hóa đơn GTGT điện tử (VAT) hoặc hóa đơn hợp lệ bệnh viện</p>
                </div>

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
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-center gap-3 text-slate-400">
                        <Camera size={20} />
                        <Upload size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-600">Bấm để Chụp / Đính kèm chứng từ thanh toán</p>
                    </div>
                  )}
                </div>

                {paymentDocs.length > 0 && (
                  <div className="space-y-1.5">
                    {paymentDocs.map((doc, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-100/60 rounded-xl px-3 py-2 text-[10px] border border-slate-200/50">
                        <div className="flex items-center gap-2 mr-2 overflow-hidden">
                          <FileText size={14} className="text-blue-500 shrink-0" />
                          <span className="font-bold text-slate-700 truncate">{doc.name}</span>
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

              {/* 3. Conditional: Accident Box (Bắt buộc nếu cause === Tai nạn) */}
              {cause === "Tai nạn" && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <div>
                    <h4 className="text-xs font-black text-red-900 flex items-center justify-between">
                      <span>3. Biên bản xác nhận tai nạn * (Bắt buộc)</span>
                      <span className="text-[9px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Tai nạn</span>
                    </h4>
                    <p className="text-[9px] text-red-800 mt-0.5">Yêu cầu Biên bản tai nạn sinh hoạt hoặc tai nạn giao thông có xác nhận của đơn vị công tác/cơ quan công an.</p>
                  </div>

                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "accident")}
                    className="border-2 border-dashed border-red-300 hover:border-red-500 rounded-xl p-4 text-center cursor-pointer bg-white transition-all"
                    onClick={() => triggerMockUpload("accident")}
                  >
                    {isUploading === "accident" ? (
                      <div className="space-y-2 py-2">
                        <p className="text-xs font-bold text-red-700 animate-pulse">Đang tải biên bản tai nạn ({uploadProgress}%)</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-red-700">
                        <div className="flex justify-center gap-3">
                          <Camera size={18} />
                          <Upload size={18} />
                        </div>
                        <p className="text-xs font-bold">Chụp ảnh / Tải lên Biên bản xác nhận tai nạn</p>
                      </div>
                    )}
                  </div>

                  {accidentDocs.length > 0 && (
                    <div className="space-y-1.5">
                      {accidentDocs.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white rounded-xl px-3 py-2 text-[10px] border border-red-200">
                          <div className="flex items-center gap-2 overflow-hidden mr-2">
                            <FileText size={14} className="text-red-600 shrink-0" />
                            <span className="font-bold text-red-950 truncate">{doc.name}</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setAccidentDocs([])}
                            className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Conditional: Inpatient (Bắt buộc nếu treatmentType === NoiTru) */}
              {treatmentType === "NoiTru" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <div>
                    <h4 className="text-xs font-black text-emerald-950 flex items-center justify-between">
                      <span>4. Giấy ra viện + tóm tắt bệnh án * (Bắt buộc)</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Nội trú</span>
                    </h4>
                    <p className="text-[9px] text-emerald-800 mt-0.5">Yêu cầu đính kèm Giấy ra viện có mộc của bệnh viện điều trị và Bảng kê tóm tắt bệnh án phẫu thuật/điều trị nội trú.</p>
                  </div>

                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "release")}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer bg-white transition-all"
                    onClick={() => triggerMockUpload("release")}
                  >
                    {isUploading === "release" ? (
                      <div className="space-y-2 py-2">
                        <p className="text-xs font-bold text-emerald-700 animate-pulse">Đang tải hồ sơ ra viện ({uploadProgress}%)</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-emerald-700">
                        <div className="flex justify-center gap-3">
                          <Camera size={18} />
                          <Upload size={18} />
                        </div>
                        <p className="text-xs font-bold">Chụp ảnh / Tải Giấy ra viện + Tóm tắt bệnh án</p>
                      </div>
                    )}
                  </div>

                  {hospitalReleaseDocs.length > 0 && (
                    <div className="space-y-1.5">
                      {hospitalReleaseDocs.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white rounded-xl px-3 py-2 text-[10px] border border-emerald-200">
                          <div className="flex items-center gap-2 overflow-hidden mr-2">
                            <FileText size={14} className="text-emerald-600 shrink-0" />
                            <span className="font-bold text-emerald-950 truncate">{doc.name}</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setHospitalReleaseDocs([])}
                            className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Conditional: Dependent Authorization (Bắt buộc nếu đối tượng được khai hộ là Người phụ thuộc) */}
              {(isCorporateMode ? currentEmployee?.isDependent : selectedCard?.relationship !== "Bản thân") && (
                <div className="bg-amber-50 border border-amber-250 rounded-2xl p-4 shadow-sm space-y-3">
                  <div>
                    <h4 className="text-xs font-black text-amber-900 flex items-center justify-between">
                      <span>5. Giấy ủy quyền bồi thường hộ * (Bắt buộc)</span>
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Người phụ thuộc</span>
                    </h4>
                    <p className="text-[9px] text-amber-800 mt-0.5">Để đảm bảo tính pháp lý, bạn cần tải lên bản Chụp Giấy ủy quyền bồi thường có chữ ký xác nhận của nhân viên chính ({(selectedCard as any)?.bankOwner}).</p>
                  </div>

                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "auth")}
                    className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer bg-white transition-all"
                    onClick={() => triggerMockUpload("auth")}
                  >
                    {isUploading === "auth" ? (
                      <div className="space-y-2 py-2">
                        <p className="text-xs font-bold text-amber-800 animate-pulse">Đang tải giấy ủy quyền ({uploadProgress}%)</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-amber-800">
                        <div className="flex justify-center gap-3">
                          <Camera size={18} />
                          <Upload size={18} />
                        </div>
                        <p className="text-xs font-bold">Chụp ảnh / Tải lên Giấy ủy quyền bồi thường hộ</p>
                      </div>
                    )}
                  </div>

                  {authDocs.length > 0 && (
                    <div className="space-y-1.5">
                      {authDocs.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white rounded-xl px-3 py-2 text-[10px] border border-amber-200">
                          <div className="flex items-center gap-2 overflow-hidden mr-2">
                            <FileText size={14} className="text-amber-600 shrink-0" />
                            <span className="font-bold text-amber-950 truncate">{doc.name}</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setAuthDocs([])}
                            className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Commit checkbox and Digital Signature Methods */}
              <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-100 h-4.5 w-4.5 shrink-0"
                  />
                  <span className="text-[10px] text-slate-500 font-bold leading-normal">
                    Tôi (Đại diện phòng HR Doanh nghiệp) cam kết dữ liệu định danh, chứng từ cung cấp trên đây là hoàn toàn đúng sự thật & đồng ý với các{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsSheet(true)}
                      className="text-blue-600 font-extrabold hover:underline cursor-pointer inline-block"
                    >
                      Điều khoản cam kết của PTI CARE
                    </button>.
                  </span>
                </label>

                {/* Secure Authentication selection */}
                <div className="border-t border-slate-100/60 pt-3.5 space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Phương thức xác thực ký số</span>
                    <span className="text-[9px] text-slate-400 font-mono">SECURE SIGN</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setVerificationMethod("FaceID")}
                      className={`py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        verificationMethod === "FaceID"
                          ? "bg-white text-blue-600 shadow-sm animate-none"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Fingerprint size={13} />
                      <span>Xác thực FaceID HR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationMethod("OTP")}
                      className={`py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        verificationMethod === "OTP"
                          ? "bg-white text-blue-600 shadow-sm animate-none"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Smartphone size={13} />
                      <span>Xác thực OTP HR</span>
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
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto shadow-xl shadow-emerald-100/30">
                <CheckCircle2 size={44} className="stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">Khai hộ bồi thường thành công!</h2>
                <p className="text-[11px] leading-relaxed text-slate-500 max-w-[320px] mx-auto font-medium">
                  Hồ sơ bồi thường khai hộ của nhân sự <strong className="text-blue-600 font-bold">{selectedCard?.name}</strong> đã được lưu trữ thành công & chuyển trạng thái <strong className="text-amber-600 font-bold">Chờ duyệt</strong>. Hệ thống đã gửi SMS & Thư điện tử kèm mã tra cứu tới nhân viên hỏa tốc.
                </p>
              </div>

              {/* Bank payout auto warning inside success info too */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-left text-[10px] space-y-2 font-semibold text-blue-900">
                <h5 className="font-extrabold text-blue-950 uppercase tracking-wide flex items-center gap-1">
                  <Shield size={12} className="text-blue-600" /> Lưu ý thanh toán bồi thường:
                </h5>
                <p>
                  Tiền bồi thường được chuyển khoản trực tiếp của phòng bồi thường PTI CARE về tài khoản cá nhân của người thụ hưởng đăng ký bên dưới. HR của công ty không có quyền can thiệp dòng tiền chi trả này.
                </p>
                <div className="mt-1 pt-1.5 border-t border-blue-200/50 flex justify-between font-mono text-[9px]">
                  <span>Người nhận: {(selectedCard as any)?.bankOwner}</span>
                  <span>Ngân hàng: {(selectedCard as any)?.bankName}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Quay lại Cổng Doanh nghiệp
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation Footer buttons */}
      {step < 5 && (
        <div className="p-4 border-t border-slate-100/50 bg-white/50 backdrop-blur-md flex gap-3 z-10">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 border border-slate-200 hover:border-slate-300 text-slate-600 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              Quay lại
            </button>
          )}
          
          <button
            type="button"
            onClick={step === 4 ? handleVerifyAndSubmit : nextStep}
            disabled={step === 1 && !selectedCardId}
            className={`py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              step === 1 && !selectedCardId
                ? "bg-slate-200 text-slate-400 cursor-not-allowed flex-1"
                : "bg-blue-600 hover:bg-blue-700 text-white flex-1 shadow-md shadow-blue-500/10"
            }`}
          >
            {step === 4 ? (
              agreeTerms ? "Xác thực Ký số & Gửi hồ sơ" : "Cam kết & Nộp hồ sơ"
            ) : (
              <>
                Tiếp tục <ArrowRight size={14} className="stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Terms Sheet overlay popup */}
      <AnimatePresence>
        {showTermsSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTermsSheet(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 max-h-[75%] bg-white rounded-t-[32px] shadow-2xl z-50 flex flex-col overflow-hidden pb-6 border-t border-slate-100"
            >
              <div className="w-full flex justify-center py-3">
                <div className="w-10 h-1 bg-slate-300 rounded-full" />
              </div>
              
              <div className="px-6 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 font-display text-center flex items-center justify-center gap-1.5 uppercase">
                  <Shield size={16} className="text-blue-500" /> Cam Kết & Quy Tắc Khai Hộ EB
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 text-[11px] leading-relaxed text-slate-500 font-medium">
                <p className="font-bold text-slate-700">Đại diện bộ phận HR doanh nghiệp xác nhận:</p>
                <p>
                  1. Mọi thông tin kê khai bồi thường bao gồm sự kiện bảo hiểm, số tiền yêu cầu thanh toán bồi thường và hóa đơn chứng từ đính kèm đều khớp với hồ sơ gốc đã xác nhận tại doanh nghiệp.
                </p>
                <p>
                  2. Có đầy đủ sự đồng thuận bằng văn bản / ủy quyền bồi thường từ nhân viên thụ hưởng chính cho phép HR thao tác khởi tạo bồi thường trên cổng điện tử PTI CARE.
                </p>
                <p>
                  3. Nghiêm cấm mọi hành vi chỉnh sửa hoặc nhập số tài khoản cá nhân khác (bao gồm cả tài khoản HR) vào thông tin thụ hưởng bồi thường nhằm mục đích chiếm đoạt tài chính của nhân sự. PTI sẽ tự động khóa thẻ bảo hiểm và chuyển thông tin cho thanh tra nếu phát hiện sai lệch thông tin ngân hàng của nhân viên.
                </p>
              </div>

              <div className="px-6 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAgreeTerms(true);
                    setShowTermsSheet(false);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl text-xs font-bold"
                >
                  Tôi đồng ý và cam kết
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Security Verification Overlay for Face ID and OTP SMS */}
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
                    {verificationMethod === "FaceID" ? "Đang quét khuôn mặt HR..." : "Đang gửi mã xác thực SMS..."}
                  </p>
                  <p className="text-[10px] text-white/50 font-medium">Xác thực chứng thư số HR Admin FPT</p>
                </div>
              ) : verificationSuccess ? (
                <div className="space-y-3 py-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/15">
                    <CheckCircle2 size={30} className="stroke-[2.5]" />
                  </div>
                  <p className="text-xs font-bold text-emerald-400">Xác thực Ký số thành công!</p>
                  <p className="text-[10px] text-white/50 font-medium">Yêu cầu bồi thường đang được khởi tạo...</p>
                </div>
              ) : (
                /* OTP Verification form */
                <div className="space-y-4 text-left">
                  <div className="text-center space-y-1">
                    <h4 className="text-xs font-bold text-white flex items-center justify-center gap-1.5 font-display">
                      <Smartphone size={16} className="text-blue-400" /> Nhập Mã Xác Thực OTP
                    </h4>
                    <p className="text-[9px] text-white/50 font-medium">Mã OTP bảo mật được gửi đến SĐT của HR Admin (090***888)</p>
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
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-[10px] font-bold"
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
