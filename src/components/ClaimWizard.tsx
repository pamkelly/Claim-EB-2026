import React, { useState } from "react";
import { 
  Search, Shield, Check, FileText, ArrowRight, ArrowLeft, Upload, 
  Camera, FileDown, CreditCard, Banknote, Mail, AlertCircle, Info,
  Fingerprint, Smartphone, Lock, CheckCircle2, Trash2, ChevronDown, FileUp,
  Sparkles, RefreshCw, Calendar, X, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InsuranceCard, ClaimRequest, TreatmentType, ReceiveMethod } from "../types";

// Re-define SAMPLE_ROSTER inside wizard to allow searching & picking of corporate employees
const WIZARD_ROSTER = [
  {
    id: "emp-1",
    name: "Lê Văn Công",
    relationship: "Nhân viên chính",
    cardNumber: "PTI-FPT-00812",
    status: "ConHieuLuc",
    isDependent: false,
    email: "levancong@fpt.com.vn",
    bankName: "Vietcombank (VCB)",
    bankAccount: "101299933344",
    bankOwner: "LE VAN CONG",
    employeeCode: "FPT-00812",
    remainingNoiTruLimit: 42500000,
    totalNoiTruLimit: 60000000,
    remainingNgoaiTruLimit: 3200000,
    totalNgoaiTruLimit: 15000000,
    remainingPhauThuatLimit: 80000000,
    totalPhauThuatLimit: 80000000
  },
  {
    id: "emp-2",
    name: "Lê Minh Khôi",
    relationship: "Con ruột",
    cardNumber: "PTI-FPT-00812-D1",
    status: "ConHieuLuc",
    isDependent: true,
    dependentOf: "Lê Văn Công",
    email: "levancong@fpt.com.vn",
    bankName: "Vietcombank (VCB)",
    bankAccount: "101299933344",
    bankOwner: "LE VAN CONG",
    employeeCode: "FPT-00812",
    remainingNoiTruLimit: 15600000,
    totalNoiTruLimit: 40000000,
    remainingNgoaiTruLimit: 800000,
    totalNgoaiTruLimit: 10000000,
    remainingPhauThuatLimit: 50000000,
    totalPhauThuatLimit: 50000000
  },
  {
    id: "emp-3",
    name: "Trần Thị Lan",
    relationship: "Nhân viên chính",
    cardNumber: "PTI-FPT-00945",
    status: "ConHieuLuc",
    isDependent: false,
    email: "tranthilan@fpt.com.vn",
    bankName: "Techcombank (TCB)",
    bankAccount: "1903444222115",
    bankOwner: "TRAN THI LAN",
    employeeCode: "FPT-00945",
    remainingNoiTruLimit: 60000000,
    totalNoiTruLimit: 60000000,
    remainingNgoaiTruLimit: 12000000,
    totalNgoaiTruLimit: 15000000,
    remainingPhauThuatLimit: 80000000,
    totalPhauThuatLimit: 80000000
  },
  {
    id: "emp-4",
    name: "Nguyễn Văn Bình",
    relationship: "Chồng / Phối ngẫu",
    cardNumber: "PTI-FPT-00945-D1",
    status: "ConHieuLuc",
    isDependent: true,
    dependentOf: "Trần Thị Lan",
    email: "tranthilan@fpt.com.vn",
    bankName: "Techcombank (TCB)",
    bankAccount: "1903444222115",
    bankOwner: "TRAN THI LAN",
    employeeCode: "FPT-00945",
    remainingNoiTruLimit: 38000000,
    totalNoiTruLimit: 40000000,
    remainingNgoaiTruLimit: 4500000,
    totalNgoaiTruLimit: 10000000,
    remainingPhauThuatLimit: 50000000,
    totalPhauThuatLimit: 50000000
  },
  {
    id: "emp-6",
    name: "Nguyễn Văn An",
    relationship: "Nhân viên chính",
    cardNumber: "PTI-FPT-08877",
    status: "ConHieuLuc",
    isDependent: false,
    email: "nguyenvanan@fpt.com.vn",
    bankName: "Vietcombank",
    bankAccount: "88770001222",
    bankOwner: "NGUYEN VAN AN",
    employeeCode: "FPT-08877",
    remainingNoiTruLimit: 21000000,
    totalNoiTruLimit: 60000000,
    remainingNgoaiTruLimit: 1800000,
    totalNgoaiTruLimit: 15000000,
    remainingPhauThuatLimit: 80000000,
    totalPhauThuatLimit: 80000000
  },
  {
    id: "emp-7",
    name: "Nguyễn Minh Khang",
    relationship: "Con ruột",
    cardNumber: "PTI-FPT-08877-D1",
    status: "ConHieuLuc",
    isDependent: true,
    dependentOf: "Nguyễn Văn An",
    email: "nguyenvanan@fpt.com.vn",
    bankName: "Vietcombank",
    bankAccount: "88770001222",
    bankOwner: "NGUYEN VAN AN (giám hộ)",
    employeeCode: "FPT-08877",
    remainingNoiTruLimit: 40000000,
    totalNoiTruLimit: 40000000,
    remainingNgoaiTruLimit: 9000000,
    totalNgoaiTruLimit: 10000000,
    remainingPhauThuatLimit: 50000000,
    totalPhauThuatLimit: 50000000
  },
  {
    id: "emp-5",
    name: "Phạm Hồng Minh",
    relationship: "Nhân viên chính",
    cardNumber: "PTI-FPT-01055",
    status: "HetHan",
    isDependent: false,
    email: "phamhongminh@fpt.com.vn",
    bankName: "BIDV",
    bankAccount: "5801000999888",
    bankOwner: "PHAM HONG MINH",
    employeeCode: "FPT-01055",
    remainingNoiTruLimit: 0,
    totalNoiTruLimit: 60000000,
    remainingNgoaiTruLimit: 0,
    totalNgoaiTruLimit: 15000000,
    remainingPhauThuatLimit: 0,
    totalPhauThuatLimit: 80000000
  }
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
  draftClaim?: ClaimRequest;
  selectedCardFromEcard?: InsuranceCard;
  bankAccounts?: {
    defaultBank: string;
    defaultAccount: string;
    extra1Bank: string;
    extra1Account: string;
    extra2Bank: string;
    extra2Account: string;
  };
}

export default function ClaimWizard({ cards, onBack, onSubmitSuccess, isCorporateMode = false, corporateEmployee, draftClaim, selectedCardFromEcard, bankAccounts }: ClaimWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(() => {
    if (draftClaim) {
      return 2; // Jump directly to event info if resuming / recreating
    }
    if (isCorporateMode && corporateEmployee) {
      return 2;
    }
    if (selectedCardFromEcard) {
      return 2;
    }
    return 1;
  });
  const [showTermsSheet, setShowTermsSheet] = useState(false);
  const [showVerificationOverlay, setShowVerificationOverlay] = useState(false);
  // STEP 1: Select Insured Person
  const [searchName, setSearchName] = useState("");
  const [wizardContractSubTab, setWizardContractSubTab] = useState<'my-contract' | 'relatives-contract'>('my-contract');
  const [selectedCardId, setSelectedCardId] = useState<string>(() => {
    if (draftClaim) {
      return draftClaim.cardId;
    }
    if (isCorporateMode) {
      return corporateEmployee ? corporateEmployee.id : "emp-6"; // Nguyễn Văn An default (emp-6)
    }
    if (selectedCardFromEcard) {
      return selectedCardFromEcard.id;
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
        email: currentEmployee.email,
        expiryDate: "31/12/2026"
      }
    : cards.find(c => c.id === selectedCardId);

  // STEP 2: Event Info
  const [hospital, setHospital] = useState(() => draftClaim ? draftClaim.hospital : "");
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [treatmentType, setTreatmentType] = useState<TreatmentType>(() => draftClaim ? draftClaim.treatmentType : "NgoaiTru");
  const [cause, setCause] = useState(() => draftClaim ? draftClaim.cause : "Ốm bệnh");
  // Conditional fields based on selected cause (Ốm bệnh, Tai nạn, Thai sản)
  const [accidentDate, setAccidentDate] = useState("2026-07-14");
  const [accidentPlace, setAccidentPlace] = useState("");
  const [accidentDesc, setAccidentDesc] = useState("");
  const [symptomName, setSymptomName] = useState("");
  const [hasPastHistory, setHasPastHistory] = useState(false);
  const [expectedBirthDate, setExpectedBirthDate] = useState("");
  const [birthMethod, setBirthMethod] = useState("SinhThuong");
  
  const [treatmentDate, setTreatmentDate] = useState("2026-07-14");
  const [amountStr, setAmountStr] = useState(() => draftClaim ? (draftClaim.amount ? draftClaim.amount.toLocaleString("vi-VN") : "") : "");
  const [selectedLinkedInvoices, setSelectedLinkedInvoices] = useState<number[]>([]);
  const [previewDoc, setPreviewDoc] = useState<{ name: string; size: string; type: string; category: string } | null>(null);
  const [confirmedDocs, setConfirmedDocs] = useState<string[]>([]);
  const [hasOtherInsurance, setHasOtherInsurance] = useState<boolean>(false);
  const [eventError, setEventError] = useState("");
  const [isManualReview, setIsManualReview] = useState(false);
  const [scannedReceipts, setScannedReceipts] = useState<{ name: string; amount: number }[]>([]);
  const [showGycPreview, setShowGycPreview] = useState(false);
  const [isBankEditing, setIsBankEditing] = useState(false);
  const [showBankSelectModal, setShowBankSelectModal] = useState(false);
  const [localBankSelectIndex, setLocalBankSelectIndex] = useState(0);


  const getContractInfoForCard = (card: InsuranceCard) => {
    if (card.id === "card-1") {
      return { contractName: "PTI Care Sức khỏe Vàng", contractCode: "PTI-CON-9912" };
    } else if (card.id === "card-2") {
      return { contractName: "PTI Family Care Toàn Diện", contractCode: "PTI-FAM-3322" };
    } else if (card.id === "card-3") {
      return { contractName: "PTI Care An Gia", contractCode: "PTI-FAM-3323" };
    } else if (card.id === "card-4") {
      return { contractName: "PTI Care Sức khỏe Hưu Trí", contractCode: "PTI-FAM-3321" };
    }
    return { contractName: "PTI Care Linh Hoạt", contractCode: `PTI-CON-${card.id.slice(-4).toUpperCase()}` };
  };

  const getHospitalInvoices = (hospitalName: string) => {
    if (!hospitalName) return [];
    const short = hospitalName.split(" ").map(w => w[0]).join("").toUpperCase() || "PTI";
    return [
      { id: 1, code: `${short}-eInv-9981`, desc: "Phí khám bệnh & Xét nghiệm máu", amount: 1250000, date: "14/07/2026" },
      { id: 2, code: `${short}-eInv-9982`, desc: "Thuốc điều trị & Vật tư y tế", amount: 680000, date: "14/07/2026" },
      { id: 3, code: `${short}-eInv-9983`, desc: "Chụp X-Quang & Siêu âm ổ bụng", amount: 850000, date: "14/07/2026" }
    ];
  };

  const getDocumentAnalysis = (docName: string, category: string, declaredAmount: number) => {
    if (category === "payment") {
      let ocrAmount = declaredAmount;
      let isBlurry = false;
      let blurScore = 96;
      let text = "Rõ nét";
      let status = "Khớp hoàn toàn";
      let msg = "✓ Số tiền trích xuất trùng khớp hoàn toàn với số tiền yêu cầu bồi thường.";
      
      if (docName.includes("Hong_Ngoc") || docName.includes("hong_ngoc")) {
        ocrAmount = 450000;
      } else if (docName.includes("VAT") || docName.includes("vat")) {
        ocrAmount = 1450000;
      } else if (docName.includes("bo_sung") || docName.includes("bo_sung")) {
        ocrAmount = 300000;
      } else if (docName.includes("9981")) {
        ocrAmount = 1250000;
      } else if (docName.includes("9982")) {
        ocrAmount = 680000;
      } else if (docName.includes("9983")) {
        ocrAmount = 850000;
      }
      
      if (docName.endsWith(".jpg") || docName.includes("Hong_Ngoc")) {
        isBlurry = true;
        blurScore = 52;
        text = "Hơi mờ (Cảnh báo)";
      }
      
      const diff = Math.abs(ocrAmount - declaredAmount);
      if (diff > 0) {
        status = "Lệch số tiền";
        msg = `⚠️ Lệch số tiền: Trích xuất OCR là ${ocrAmount.toLocaleString("vi-VN")} đ nhưng khai báo là ${declaredAmount.toLocaleString("vi-VN")} đ. Bạn có muốn cập nhật số tiền yêu cầu bồi thường khớp với hóa đơn này không?`;
      }
      
      return {
        ocrAmount,
        isBlurry,
        blurScore,
        text,
        status,
        msg,
        needRetake: isBlurry && blurScore < 60
      };
    } else {
      let isBlurry = false;
      let blurScore = 98;
      let text = "Cực kỳ rõ nét";
      if (docName.includes("Don_thuoc") || docName.includes("2")) {
        isBlurry = true;
        blurScore = 41;
        text = "Bị mờ nặng (Không đạt)";
      }
      return {
        isBlurry,
        blurScore,
        text,
        needRetake: isBlurry && blurScore < 50,
        msg: isBlurry ? "⚠️ Tài liệu bị mờ góc dưới bên phải, chữ viết tay bác sĩ khó đọc. Khuyến nghị chụp lại." : "✓ Tài liệu rõ nét, đầy đủ thông tin chuẩn đoán và mộc dấu tròn."
      };
    }
  };

  // OCR Scan Simulation States
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [ocrLog, setOcrLog] = useState("");

  // STEP 3: Compensation Info
  const [receiveMethod, setReceiveMethod] = useState<ReceiveMethod>(() => draftClaim ? draftClaim.receiveMethod : "ChuyenKhoan");
  const [bankName, setBankName] = useState(() => draftClaim ? (draftClaim.bankName || "") : "");
  const [bankAccount, setBankAccount] = useState(() => draftClaim ? (draftClaim.bankAccount || "") : "");
  const [bankOwner, setBankOwner] = useState(() => draftClaim ? (draftClaim.bankOwner || "") : "");
  const [email, setEmail] = useState(() => draftClaim ? (draftClaim.email || "") : "");
  const [infoError, setInfoError] = useState("");

  const bankOptions = [
    {
      label: "Tài khoản mặc định",
      bankName: bankAccounts?.defaultBank || "Vietcombank (VCB)",
      bankAccount: bankAccounts?.defaultAccount || "101889922233",
    },
    {
      label: "Tài khoản nhận tiền khác 1",
      bankName: bankAccounts?.extra1Bank || "Techcombank (TCB)",
      bankAccount: bankAccounts?.extra1Account || "1903444222115",
    },
    {
      label: "Tài khoản nhận tiền khác 2",
      bankName: bankAccounts?.extra2Bank || "BIDV",
      bankAccount: bankAccounts?.extra2Account || "5801000999888",
    }
  ];

  React.useEffect(() => {
    if (showBankSelectModal) {
      const idx = bankOptions.findIndex(opt => opt.bankAccount === bankAccount);
      setLocalBankSelectIndex(idx >= 0 ? idx : 0);
    }
  }, [showBankSelectModal, bankAccount]);

  // Auto populate bank info whenever selected card changes
  React.useEffect(() => {
    if (draftClaim) {
      // Keep draft values on first load
      return;
    }
    if (selectedCard) {
      if (isCorporateMode && currentEmployee) {
        setBankName(currentEmployee.bankName);
        setBankAccount(currentEmployee.bankAccount);
        setBankOwner(currentEmployee.bankOwner);
        setEmail(currentEmployee.email);
      } else {
        const matchingCard = cards.find(c => c.id === selectedCardId);
        if (matchingCard) {
          setBankName(bankAccounts?.defaultBank || "Vietcombank (VCB)");
          setBankAccount(bankAccounts?.defaultAccount || "101889922233");
          setBankOwner(matchingCard.name.toUpperCase());
          setEmail(matchingCard.relationship === "Bản thân" ? "khachhang.care@gmail.com" : "nhanvienchinh.fpt@gmail.com");
        }
      }
    }
  }, [selectedCardId, isCorporateMode, currentEmployee, cards, bankAccounts]);

  const handleOcrScan = (amountVal: number, invoiceName: string) => {
    setIsScanningOcr(true);
    setOcrSuccess(false);
    setIsManualReview(false);
    setOcrLog("PTI Care Smart OCR: Đang kết nối tệp tin & tải chứng từ thanh toán...");
    
    setTimeout(() => {
      setOcrLog("PTI Care Smart OCR: Đang phân tích cấu trúc chữ viết tay & mộc dấu...");
    }, 800);

    setTimeout(() => {
      setOcrLog(`Bóc tách thành công từ tệp: ${invoiceName}. Đang tích lũy giá trị vào yêu cầu bồi thường...`);
    }, 1600);

    setTimeout(() => {
      setIsScanningOcr(false);
      setOcrSuccess(true);
      setOcrLog(`Trích xuất thành công: +${amountVal.toLocaleString("vi-VN")} VNĐ từ ${invoiceName}`);
      
      setScannedReceipts(prev => {
        const updated = [...prev, { name: invoiceName, amount: amountVal }];
        const sum = updated.reduce((acc, curr) => acc + curr.amount, 0);
        setAmountStr(sum.toLocaleString("vi-VN"));
        return updated;
      });

      // Automatically add to paymentDocs so user doesn't have to upload again in Step 3!
      setPaymentDocs(prev => {
        if (!prev.some(d => d.name === `${invoiceName}.pdf`)) {
          return [...prev, { name: `${invoiceName}.pdf`, size: "450 KB", type: "application/pdf" }];
        }
        return prev;
      });
    }, 2400);
  };

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
  const [hasReadGyc, setHasReadGyc] = useState(false);
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
      
      // Date Picker Validation & Contract Expiry range validation
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!treatmentDate || !datePattern.test(treatmentDate)) {
        setEventError("Vui lòng chọn ngày điều trị hợp lệ.");
        return;
      }
      if (selectedCard && selectedCard.expiryDate) {
        const parts = selectedCard.expiryDate.split("/");
        if (parts.length === 3) {
          const expDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
          const treatDate = new Date(treatmentDate);
          if (treatDate > expDate) {
            setEventError(`Sự kiện bảo hiểm bị từ chối: Ngày điều trị (${treatDate.toLocaleDateString("vi-VN")}) vượt quá thời hạn hiệu lực của hợp đồng bảo hiểm (${selectedCard.expiryDate}).`);
            return;
          }
        }
      }

      // Pre-attach invoices/documents selected in Step 2:
      const invoices = getHospitalInvoices(hospital).filter(inv => selectedLinkedInvoices.includes(inv.id));
      const preAttachedPaymentDocs = invoices.map(inv => ({
        name: `${inv.code}.pdf`,
        size: "350 KB",
        type: "application/pdf"
      }));

      setPaymentDocs(prev => {
        const existingNames = prev.map(d => d.name);
        const filteredNew = preAttachedPaymentDocs.filter(d => !existingNames.includes(d.name));
        return [...prev, ...filteredNew];
      });

      // Automatically pre-attach an official electronic medical record so Step 3 validation is streamlined
      setMedicalDocs(prev => {
        if (prev.length === 0) {
          return [{
            name: `So_Kham_Benh_Dien_Tu_${hospital.replace(/\s+/g, "_")}.pdf`,
            size: "520 KB",
            type: "application/pdf"
          }];
        }
        return prev;
      });

      // Step 3 is now Document Uploads
      setStep(3);
    } else if (step === 3) {
      setDocError("");
      
      // Basic document validation in Step 3
      if (medicalDocs.length === 0) {
        setDocError("Bắt buộc: Đính kèm ít nhất một chứng từ y tế (sổ khám, đơn thuốc, chỉ định...).");
        return;
      }
      if (paymentDocs.length === 0) {
        setDocError("Bắt buộc: Đính kèm ít nhất một chứng từ thanh toán (hóa đơn, phiếu thu...).");
        return;
      }
      
      // Conditional document validation in Step 3
      if (cause === "Tai nạn" && accidentDocs.length === 0) {
        setDocError("Bắt buộc: Tải lên 'Biên bản xác nhận tai nạn' khi nguyên nhân là Tai nạn.");
        return;
      }
      if (treatmentType === "NoiTru" && hospitalReleaseDocs.length === 0) {
        setDocError("Bắt buộc: Tải lên 'Giấy ra viện & tóm tắt bệnh án' khi điều trị Nội trú.");
        return;
      }
      
      const isCurrentDependent = isCorporateMode 
        ? currentEmployee?.isDependent 
        : selectedCard?.relationship !== "Bản thân";
      if (isCurrentDependent && authDocs.length === 0) {
        setDocError("Bắt buộc: Đính kèm 'Giấy ủy quyền bồi thường hộ' từ Người được bảo hiểm chính.");
        return;
      }
      
      // Step 4 is now COMPENSATION PAYMENT INFO & SIGNING
      setStep(4);
    }
  };

  const prevStep = () => {
    if (step > 1 && step < 5) {
      setStep((step - 1) as any);
    }
  };

  // Handle Biometric/OTP Verification and final Submission in Step 4
  const handleVerifyAndSubmit = () => {
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
      id: (draftClaim && draftClaim.status !== "TuChoi") ? draftClaim.id : `PTI-${Math.floor(1000 + Math.random() * 9000)}`,
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
                    case 3: return <Upload size={11} className="stroke-[2.5]" />;
                    case 4: return <Banknote size={11} className="stroke-[2.5]" />;
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
              <span className={step === 1 ? "text-blue-600 font-extrabold" : "text-slate-500"}>Chọn HĐBH</span>
              <span className={step === 2 ? "text-blue-600 font-extrabold" : "text-slate-400"}>Khai báo</span>
              <span className={step === 3 ? "text-blue-600 font-extrabold" : "text-slate-400"}>Đính kèm</span>
              <span className={step === 4 ? "text-blue-600 font-extrabold" : "text-slate-400"}>Nhận tiền & Ký</span>
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
                    Vui lòng chọn hợp đồng bảo hiểm cần yêu cầu bồi thường dưới đây.
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
                  placeholder={isCorporateMode ? "Tìm theo tên hoặc mã nhân viên (ví dụ: FPT-00812)..." : "Tìm tên hợp đồng, mã HĐ hoặc tên người được bảo hiểm..."}
                />
              </div>

              {/* Sub-tabs for Individual Contracts */}
              {!isCorporateMode && (
                <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setWizardContractSubTab("my-contract")}
                    className={`py-2 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-all ${
                      wizardContractSubTab === "my-contract"
                        ? "bg-white text-slate-800 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Hợp đồng của tôi
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardContractSubTab("relatives-contract")}
                    className={`py-2 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-all ${
                      wizardContractSubTab === "relatives-contract"
                        ? "bg-white text-slate-800 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Hợp đồng người thân
                  </button>
                </div>
              )}

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
                  (() => {
                    const filteredContracts = cards.filter((card) => {
                      // Sub-tab filter
                      const isSelf = card.relationship === "Bản thân";
                      if (wizardContractSubTab === "my-contract" && !isSelf) return false;
                      if (wizardContractSubTab === "relatives-contract" && isSelf) return false;

                      // Search filter
                      const contractInfo = getContractInfoForCard(card);
                      const q = searchName.toLowerCase();
                      return (
                        card.name.toLowerCase().includes(q) ||
                        card.cardNumber.toLowerCase().includes(q) ||
                        contractInfo.contractName.toLowerCase().includes(q) ||
                        contractInfo.contractCode.toLowerCase().includes(q)
                      );
                    });

                    if (filteredContracts.length === 0) {
                      return (
                        <div className="text-center py-8 text-slate-400 text-xs font-medium bg-white/50 border border-slate-100 rounded-2xl">
                          Không tìm thấy hợp đồng bảo hiểm nào phù hợp.
                        </div>
                      );
                    }

                    return filteredContracts.map((card) => {
                      const isSelected = selectedCardId === card.id;
                      const isExpired = card.status === "HetHan";
                      const contractInfo = getContractInfoForCard(card);

                      return (
                        <div
                          key={card.id}
                          onClick={() => !isExpired && setSelectedCardId(card.id)}
                          className={`relative rounded-2xl p-4 border transition-all cursor-pointer text-left ${
                            isExpired
                              ? "opacity-50 border-slate-200 bg-slate-50 cursor-not-allowed"
                              : isSelected
                              ? "border-blue-500 bg-blue-50/20 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30"
                              : "border-slate-100 bg-white hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                                card.relationship === "Bản thân"
                                  ? "bg-blue-50 text-blue-600 border-blue-100"
                                  : "bg-amber-50 text-amber-600 border-amber-100"
                              }`}>
                                {card.relationship === "Bản thân" ? "Hợp đồng chính" : `Thành viên - ${card.relationship}`}
                              </span>
                              
                              <h4 className="text-xs font-black text-slate-800 tracking-tight pt-1.5 uppercase font-display">
                                {contractInfo.contractName}
                              </h4>
                              <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                👤 Người ĐB: {card.name}
                              </p>
                              <p className="text-[10px] font-mono text-slate-400">Số hợp đồng: {contractInfo.contractCode} • Thẻ: {card.cardNumber}</p>
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

                          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[9px] text-slate-400 font-semibold">
                            <span>Ngày sinh: {card.birthday}</span>
                            <span>Hạn bảo hiểm: {card.expiryDate}</span>
                          </div>
                        </div>
                      );
                    });
                  })()
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

                {/* Real-time remaining limits */}
                {(() => {
                  const emp = WIZARD_ROSTER.find(e => e.id === selectedCardId || e.cardNumber === selectedCard?.cardNumber);
                  if (!emp) return null;
                  return (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-3 border border-slate-150/40 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Hạn mức bảo lãnh khả dụng (PTI Care)</span>
                        <span className="text-[8px] font-black text-slate-400">Đồng bộ Live</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {/* Nội trú */}
                        <div className="bg-white rounded-xl p-2 border border-slate-100/60 space-y-1">
                          <p className="text-[8px] font-bold text-slate-500">Nội trú</p>
                          <p className="text-[10px] font-black text-blue-600 font-mono">
                            {emp.remainingNoiTruLimit !== undefined ? (emp.remainingNoiTruLimit).toLocaleString("vi-VN") : "-"} đ
                          </p>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${emp.remainingNoiTruLimit && emp.totalNoiTruLimit ? (emp.remainingNoiTruLimit / emp.totalNoiTruLimit) * 100 : 0}%` }} 
                            />
                          </div>
                          <p className="text-[7px] text-slate-400 font-semibold font-mono text-right">
                            Hạn mức: {(emp.totalNoiTruLimit || 0).toLocaleString("vi-VN")} đ
                          </p>
                        </div>

                        {/* Ngoại trú */}
                        <div className="bg-white rounded-xl p-2 border border-slate-100/60 space-y-1">
                          <p className="text-[8px] font-bold text-slate-500">Ngoại trú</p>
                          <p className="text-[10px] font-black text-emerald-600 font-mono">
                            {emp.remainingNgoaiTruLimit !== undefined ? (emp.remainingNgoaiTruLimit).toLocaleString("vi-VN") : "-"} đ
                          </p>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full" 
                              style={{ width: `${emp.remainingNgoaiTruLimit && emp.totalNgoaiTruLimit ? (emp.remainingNgoaiTruLimit / emp.totalNgoaiTruLimit) * 100 : 0}%` }} 
                            />
                          </div>
                          <p className="text-[7px] text-slate-400 font-semibold font-mono text-right">
                            Hạn mức: {(emp.totalNgoaiTruLimit || 0).toLocaleString("vi-VN")} đ
                          </p>
                        </div>

                        {/* Phẫu thuật */}
                        <div className="bg-white rounded-xl p-2 border border-slate-100/60 space-y-1">
                          <p className="text-[8px] font-bold text-slate-500">Phẫu thuật</p>
                          <p className="text-[10px] font-black text-indigo-600 font-mono">
                            {emp.remainingPhauThuatLimit !== undefined ? (emp.remainingPhauThuatLimit).toLocaleString("vi-VN") : "-"} đ
                          </p>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full" 
                              style={{ width: `${emp.remainingPhauThuatLimit && emp.totalPhauThuatLimit ? (emp.remainingPhauThuatLimit / emp.totalPhauThuatLimit) * 100 : 0}%` }} 
                            />
                          </div>
                          <p className="text-[7px] text-slate-400 font-semibold font-mono text-right">
                            Hạn mức: {(emp.totalPhauThuatLimit || 0).toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {eventError && (
                  <div className="flex gap-2 items-start text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{eventError}</span>
                  </div>
                )}

                {/* Treatment Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 flex items-center gap-1">
                    <Calendar size={13} className="text-blue-500" />
                    <span>Ngày điều trị *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={treatmentDate}
                      onChange={(e) => setTreatmentDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 glass-input"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 ml-1 font-semibold leading-relaxed">
                    Hệ thống sẽ đối chiếu ngày này với thời hạn hợp đồng bảo hiểm ({selectedCard?.expiryDate || "N/A"}) để xác định hiệu lực sự kiện.
                  </p>
                </div>

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

                {/* 🤝 Linked hospital invoices suggestion */}
                <AnimatePresence>
                  {hospital && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-3 overflow-hidden shadow-sm text-left"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                          </span>
                          <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                            Đồng bộ hóa đơn điện tử (OCR Link)
                          </span>
                        </div>
                        <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Live Connect</span>
                      </div>
                      
                      <p className="text-[10px] leading-relaxed text-slate-600 font-medium">
                        Cổng dữ liệu PTI Care phát hiện <strong>{getHospitalInvoices(hospital).length} hóa đơn điện tử trùng khớp</strong> của bệnh nhân <strong>{selectedCard?.name}</strong> tại <strong>{hospital}</strong> ngày 14/07/2026. Chọn hóa đơn cần thanh toán:
                      </p>

                      <div className="space-y-2">
                        {getHospitalInvoices(hospital).map((inv) => {
                          const isSelected = selectedLinkedInvoices.includes(inv.id);
                          return (
                            <button
                              key={inv.id}
                              type="button"
                              onClick={() => {
                                let newSelected: number[];
                                if (isSelected) {
                                  newSelected = selectedLinkedInvoices.filter(id => id !== inv.id);
                                } else {
                                  newSelected = [...selectedLinkedInvoices, inv.id];
                                }
                                setSelectedLinkedInvoices(newSelected);
                                
                                // Calculate total and update amountStr
                                const allInvs = getHospitalInvoices(hospital);
                                const sum = allInvs
                                  .filter(item => newSelected.includes(item.id))
                                  .reduce((acc, curr) => acc + curr.amount, 0);
                                
                                setAmountStr(sum > 0 ? sum.toLocaleString("vi-VN") : "");
                                
                                // Sync selected invoices to scannedReceipts so that they are also carried over to Step 3
                                setScannedReceipts(prev => {
                                  const manualOnly = prev.filter(r => !r.name.includes("-eInv-"));
                                  const linkedOnly = allInvs
                                    .filter(item => newSelected.includes(item.id))
                                    .map(item => ({ name: item.code, amount: item.amount }));
                                  return [...manualOnly, ...linkedOnly];
                                });
                              }}
                              className={`w-full text-left p-3 rounded-xl border text-[10px] flex justify-between items-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/15"
                                  : "bg-white border-slate-100 text-slate-600 hover:border-blue-200"
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-mono font-bold text-[8px] px-1.5 py-0.5 rounded uppercase ${isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"}`}>
                                    {inv.code}
                                  </span>
                                  <span className="font-bold truncate max-w-[170px]">{inv.desc}</span>
                                </div>
                                <p className={`text-[8px] font-semibold ${isSelected ? "text-blue-100" : "text-slate-400"}`}>Ngày xuất: {inv.date} • Khách hàng: {selectedCard?.name}</p>
                              </div>
                              <span className={`font-mono font-extrabold text-xs shrink-0 pl-2 ${isSelected ? "text-white" : "text-blue-600"}`}>
                                {inv.amount.toLocaleString("vi-VN")} đ
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Treatment Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Hình thức điều trị *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "NgoaiTru", label: "Ngoại trú", description: "Điều trị trong ngày" },
                      { id: "NoiTru", label: "Nội trú", description: "Nằm viện qua đêm" },
                      { id: "PhauThuat", label: "Phẫu thuật", description: "Phẫu thuật y khoa" }
                    ].map((type) => {
                      const isSelected = treatmentType === type.id;
                      return (
                        <label
                          key={type.id}
                          className={`flex flex-col justify-between p-2.5 rounded-2xl border transition-all cursor-pointer text-center ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/25 text-blue-600 shadow-sm shadow-blue-500/5"
                              : "border-slate-100 bg-white/40 text-slate-500 hover:bg-white"
                          }`}
                        >
                          <div className="space-y-0.5 select-none">
                            <p className="text-[11px] font-black">{type.label}</p>
                            <p className="text-[8px] opacity-75 font-semibold leading-tight">{type.description}</p>
                          </div>
                          <div className="relative flex items-center justify-center shrink-0 mt-2.5">
                            <input
                              type="radio"
                              name="treatmentTypeRadio"
                              checked={isSelected}
                              onChange={() => setTreatmentType(type.id as TreatmentType)}
                              className="sr-only"
                            />
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
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

                {/* Cause of risk with 3 options: Ốm bệnh, Tai nạn, Thai sản */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Quyền lợi bảo hiểm *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Ốm bệnh", color: "blue" },
                      { label: "Tai nạn", color: "red" },
                      { label: "Thai sản", color: "emerald" }
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

                {/* Conditional fields based on selected cause */}
                <AnimatePresence mode="wait">
                  {cause === "Ốm bệnh" && (
                    <motion.div
                      key="cause-ombenh"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 bg-slate-50/40 p-3 rounded-2xl border border-slate-100 overflow-hidden"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Tên bệnh / Triệu chứng chính *</label>
                        <input
                          type="text"
                          value={symptomName}
                          onChange={(e) => setSymptomName(e.target.value)}
                          placeholder="Ví dụ: Viêm phế quản, sốt xuất huyết..."
                          className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-800 glass-input"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Tiền sử bệnh trước đây?</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setHasPastHistory(false)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-all border ${
                              !hasPastHistory
                                ? "bg-white border-blue-500 text-blue-600 shadow-sm"
                                : "bg-transparent border-slate-100 text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            Mới bị lần đầu
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasPastHistory(true)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-all border ${
                              hasPastHistory
                                ? "bg-white border-blue-500 text-blue-600 shadow-sm"
                                : "bg-transparent border-slate-100 text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            Đã từng điều trị
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {cause === "Tai nạn" && (
                    <motion.div
                      key="cause-tainan"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 bg-red-50/10 p-3 rounded-2xl border border-red-100/30 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Ngày xảy ra tai nạn *</label>
                          <input
                            type="date"
                            value={accidentDate}
                            onChange={(e) => setAccidentDate(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Địa điểm xảy ra *</label>
                          <input
                            type="text"
                            value={accidentPlace}
                            onChange={(e) => setAccidentPlace(e.target.value)}
                            placeholder="Ví dụ: Cơ quan, ngoài đường..."
                            className="w-full px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Mô tả tóm tắt sự việc *</label>
                        <textarea
                          rows={2}
                          value={accidentDesc}
                          onChange={(e) => setAccidentDesc(e.target.value)}
                          placeholder="Mô tả diễn biến vụ tai nạn..."
                          className="w-full px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                        />
                      </div>
                    </motion.div>
                  )}

                  {cause === "Thai sản" && (
                    <motion.div
                      key="cause-thaisan"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 bg-emerald-50/10 p-3 rounded-2xl border border-emerald-100/30 overflow-hidden"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Ngày sinh (hoặc Ngày sinh dự kiến) *</label>
                        <input
                          type="date"
                          value={expectedBirthDate}
                          onChange={(e) => setExpectedBirthDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-800 glass-input"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Phương pháp sinh con *</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setBirthMethod("SinhThuong")}
                            className={`py-1.5 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-all border ${
                              birthMethod === "SinhThuong"
                                ? "bg-white border-emerald-500 text-emerald-600 shadow-sm"
                                : "bg-transparent border-slate-100 text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            Sinh thường (Âm đạo)
                          </button>
                          <button
                            type="button"
                            onClick={() => setBirthMethod("SinhMo")}
                            className={`py-1.5 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-all border ${
                              birthMethod === "SinhMo"
                                ? "bg-white border-emerald-500 text-emerald-600 shadow-sm"
                                : "bg-transparent border-slate-100 text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            Sinh mổ (Phẫu thuật)
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>



                {/* Accumulated Scanned Receipts list */}
                {scannedReceipts.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-100 shadow-inner">
                    <div className="flex justify-between items-center text-[9px] font-extrabold text-slate-500 uppercase tracking-wider px-1">
                      <span>Tích lũy hóa đơn đã quét ({scannedReceipts.length})</span>
                      <button
                        type="button"
                        onClick={() => {
                          setScannedReceipts([]);
                          setAmountStr("");
                          setPaymentDocs([]);
                        }}
                        className="text-red-500 hover:underline cursor-pointer font-bold"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {scannedReceipts.map((rec, rIdx) => (
                        <div key={rIdx} className="flex justify-between items-center bg-white border border-slate-150 px-3 py-2 rounded-xl text-[10px] shadow-xs">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <FileText size={11} className="text-slate-400 shrink-0" />
                            <span className="font-bold text-slate-700 truncate max-w-[150px]">{rec.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-blue-600 font-bold">{rec.amount.toLocaleString("vi-VN")} đ</span>
                            <button
                              type="button"
                              onClick={() => {
                                setScannedReceipts(prev => {
                                  const updated = prev.filter((_, idx) => idx !== rIdx);
                                  const sum = updated.reduce((acc, curr) => acc + curr.amount, 0);
                                  setAmountStr(sum > 0 ? sum.toLocaleString("vi-VN") : "");
                                  return updated;
                                });
                                setPaymentDocs(prev => prev.filter(d => d.name !== `${rec.name}.pdf`));
                              }}
                              className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

          {/* STEP 3: DOCUMENT UPLOADS WITH CONDITIONAL RULES */}
          {step === 3 && (
            <motion.div
              key="step-3"
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

              {/* 💵 Editable Total Claim Amount inside Step 3 */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/20 border border-blue-100 rounded-2xl p-4 flex justify-between items-center shadow-xs text-left">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-wider">Tổng số tiền khai báo bồi thường</p>
                  <p className="text-[9px] text-slate-500 font-medium">Bạn có thể điều chỉnh số tiền trực tiếp tại đây để khớp với chứng từ</p>
                </div>
                <div className="relative max-w-[150px]">
                  <input
                    type="text"
                    value={amountStr}
                    onChange={(e) => setAmountStr(formatCurrencyInput(e.target.value))}
                    className="w-full pl-3 pr-10 py-1.5 rounded-xl text-xs font-mono font-extrabold text-blue-700 bg-white border border-blue-200 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">đ</span>
                </div>
              </div>

              {/* 1. Medical Documents Box */}
              <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                <div>
                  <h4 className="text-xs font-black text-slate-700 flex items-center justify-between">
                    <span>1. Chứng từ y tế *</span>
                    <span className="text-[10px] font-medium text-slate-400">(Sổ y bạ, phiếu khám, đơn thuốc...)</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 text-left">Yêu cầu chụp rõ nét toàn bộ trang sổ và chỉ định điều trị</p>
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
                  <div className="space-y-3">
                    {medicalDocs.map((doc, idx) => {
                      const isConfirmed = confirmedDocs.includes(doc.name);
                      return (
                        <div key={idx} className="space-y-1.5 border border-slate-100 p-2.5 rounded-xl bg-white/40">
                          <div className={`flex justify-between items-center rounded-xl px-3 py-2 text-[10px] border transition-colors ${
                            isConfirmed 
                              ? "bg-emerald-50/50 border-emerald-200" 
                              : "bg-slate-100/60 border-slate-200/50 hover:bg-slate-100"
                          }`}>
                            <div 
                              onClick={() => setPreviewDoc({ ...doc, category: "medical" })}
                              className="flex items-center gap-2 mr-2 overflow-hidden cursor-pointer flex-grow"
                            >
                              <FileText size={14} className={isConfirmed ? "text-emerald-500 shrink-0" : "text-blue-500 shrink-0"} />
                              <div className="flex flex-col overflow-hidden text-left">
                                <span className="font-bold text-slate-700 truncate">{doc.name}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-400 shrink-0">({doc.size})</span>
                                  {isConfirmed && <span className="text-[8px] font-black text-emerald-600 uppercase">● Đã xác nhận</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({ ...doc, category: "medical" })}
                                className="text-blue-600 hover:text-blue-700 font-bold px-1.5 py-1 rounded hover:bg-blue-50 cursor-pointer text-[10px]"
                              >
                                Xem
                              </button>
                              <button 
                                type="button"
                                onClick={() => setMedicalDocs(medicalDocs.filter((_, i) => i !== idx))}
                                className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* AI Quality Check for Medical Documents */}
                          {(() => {
                            const analysis = getDocumentAnalysis(doc.name, "medical", Number((amountStr || "0").replace(/\D/g, "")));
                            return (
                              <div className="ml-1 bg-slate-50/60 rounded-xl p-3 border border-slate-100 space-y-2 text-[10px] text-left">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                  <span className="font-bold text-slate-500 flex items-center gap-1">
                                    <Sparkles size={11} className="text-blue-500" />
                                    Kiểm tra thông minh & Độ rõ nét
                                  </span>
                                  <span className={`font-bold px-1.5 py-0.5 rounded text-[8px] uppercase ${analysis.needRetake ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                                    {analysis.needRetake ? "⚠️ Cần chụp lại" : "✓ Đạt yêu cầu"}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-[9px]">
                                  <div>
                                    <span className="text-slate-400">Độ rõ nét: </span>
                                    <strong className={analysis.needRetake ? "text-red-600" : "text-emerald-600"}>{analysis.blurScore}% ({analysis.text})</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Bị mờ / lóa: </span>
                                    <strong className={analysis.needRetake ? "text-red-500" : "text-emerald-500"}>{analysis.needRetake ? "Phát hiện vết lóa" : "Không"}</strong>
                                  </div>
                                </div>
                                
                                <p className="text-[9px] text-slate-500 font-medium leading-relaxed bg-white/50 p-1.5 rounded border border-slate-50">
                                  {analysis.msg}
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}
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
                  <div className="space-y-3">
                    {paymentDocs.map((doc, idx) => {
                      const isConfirmed = confirmedDocs.includes(doc.name);
                      return (
                        <div key={idx} className="space-y-1.5 border border-slate-100 p-2.5 rounded-xl bg-white/40">
                          <div className={`flex justify-between items-center rounded-xl px-3 py-2 text-[10px] border transition-colors ${
                            isConfirmed 
                              ? "bg-emerald-50/50 border-emerald-200" 
                              : "bg-slate-100/60 border-slate-200/50 hover:bg-slate-100"
                          }`}>
                            <div 
                              onClick={() => setPreviewDoc({ ...doc, category: "payment" })}
                              className="flex items-center gap-2 mr-2 overflow-hidden cursor-pointer flex-grow"
                            >
                              <FileText size={14} className={isConfirmed ? "text-emerald-500 shrink-0" : "text-blue-500 shrink-0"} />
                              <div className="flex flex-col overflow-hidden text-left">
                                <span className="font-bold text-slate-700 truncate">{doc.name}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-400 shrink-0">({doc.size})</span>
                                  {isConfirmed && <span className="text-[8px] font-black text-emerald-600 uppercase">● Đã xác nhận</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({ ...doc, category: "payment" })}
                                className="text-blue-600 hover:text-blue-700 font-bold px-1.5 py-1 rounded hover:bg-blue-50 cursor-pointer text-[10px]"
                              >
                                Xem
                              </button>
                              <button 
                                type="button"
                                onClick={() => setPaymentDocs(paymentDocs.filter((_, i) => i !== idx))}
                                className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* AI Quality Check for Payment Documents */}
                          {(() => {
                            const declaredNum = Number((amountStr || "0").replace(/\D/g, ""));
                            
                            // Get the specific OCR amount for this individual document
                            let currentDocOcrAmount = declaredNum; // default
                            if (doc.name.includes("Hong_Ngoc") || doc.name.includes("hong_ngoc")) currentDocOcrAmount = 450000;
                            else if (doc.name.includes("VAT") || doc.name.includes("vat")) currentDocOcrAmount = 1450000;
                            else if (doc.name.includes("bo_sung")) currentDocOcrAmount = 300000;
                            else if (doc.name.includes("9981")) currentDocOcrAmount = 1250000;
                            else if (doc.name.includes("9982")) currentDocOcrAmount = 680000;
                            else if (doc.name.includes("9983")) currentDocOcrAmount = 850000;

                            // Calculate the total sum of all attached payment documents
                            const totalOcrSum = paymentDocs.reduce((acc, d) => {
                              let ocr = declaredNum; // default
                              if (d.name.includes("Hong_Ngoc") || d.name.includes("hong_ngoc")) ocr = 450000;
                              else if (d.name.includes("VAT") || d.name.includes("vat")) ocr = 1450000;
                              else if (d.name.includes("bo_sung")) ocr = 300000;
                              else if (d.name.includes("9981")) ocr = 1250000;
                              else if (d.name.includes("9982")) ocr = 680000;
                              else if (d.name.includes("9983")) ocr = 850000;
                              return acc + ocr;
                            }, 0);

                            const analysis = getDocumentAnalysis(doc.name, "payment", declaredNum);
                            const isMismatch = totalOcrSum !== declaredNum;

                            return (
                              <div className="ml-1 bg-slate-50/60 rounded-xl p-3 border border-slate-100 space-y-2 text-[10px] text-left">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                  <span className="font-bold text-slate-500 flex items-center gap-1">
                                    <Sparkles size={11} className="text-blue-500" />
                                    Đối chiếu hóa đơn (OCR Smart Match)
                                  </span>
                                  <span className={`font-bold px-1.5 py-0.5 rounded text-[8px] uppercase ${analysis.needRetake ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                                    {analysis.needRetake ? "⚠️ Hơi mờ" : "✓ Đạt yêu cầu"}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-[9px] border-b border-slate-100/60 pb-1.5">
                                  <div>
                                    <span className="text-slate-400">Độ rõ nét: </span>
                                    <strong className={analysis.needRetake ? "text-amber-600" : "text-emerald-600"}>{analysis.blurScore}% ({analysis.text})</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Số hóa đơn VAT: </span>
                                    <strong className="text-slate-700 font-mono">0081239</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Hóa đơn thực tế: </span>
                                    <strong className="text-blue-600 font-mono font-extrabold">{currentDocOcrAmount.toLocaleString("vi-VN")} đ</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Số tiền khai báo: </span>
                                    <strong className="text-slate-600 font-mono font-extrabold">{declaredNum.toLocaleString("vi-VN")} đ</strong>
                                  </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                  {isMismatch ? (
                                    <>
                                      <p className="text-[9px] font-medium leading-relaxed p-1.5 rounded border bg-red-50/50 border-red-100 text-red-700">
                                        ⚠️ Lệch số tiền: Tổng số tiền trích xuất trên {paymentDocs.length} hóa đơn là <strong>{totalOcrSum.toLocaleString("vi-VN")} đ</strong> nhưng bạn đang khai báo là <strong>{declaredNum.toLocaleString("vi-VN")} đ</strong>.
                                      </p>
                                      <button
                                        key={`btn-${doc.name}`}
                                        type="button"
                                        onClick={() => setAmountStr(totalOcrSum.toLocaleString("vi-VN"))}
                                        className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm active:scale-95"
                                      >
                                        ⚡ Cập nhật tổng khai báo thành {totalOcrSum.toLocaleString("vi-VN")} đ
                                      </button>
                                    </>
                                  ) : (
                                    <p className="text-[9px] font-medium leading-relaxed p-1.5 rounded border bg-emerald-50/30 border-emerald-100 text-emerald-700">
                                      ✓ Số tiền khai báo trùng khớp hoàn toàn với tổng giá trị hóa đơn điện tử ({totalOcrSum.toLocaleString("vi-VN")} đ).
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}
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
                      {accidentDocs.map((doc, idx) => {
                        const isConfirmed = confirmedDocs.includes(doc.name);
                        return (
                          <div key={idx} className={`flex justify-between items-center rounded-xl px-3 py-2 text-[10px] border transition-colors ${
                            isConfirmed 
                              ? "bg-emerald-50 border-emerald-200" 
                              : "bg-white border-red-200 hover:bg-slate-50"
                          }`}>
                            <div 
                              onClick={() => setPreviewDoc({ ...doc, category: "accident" })}
                              className="flex items-center gap-2 mr-2 cursor-pointer flex-grow"
                            >
                              <FileText size={14} className={isConfirmed ? "text-emerald-500 shrink-0" : "text-red-600 shrink-0"} />
                              <div className="flex flex-col overflow-hidden">
                                <span className="font-bold text-red-950 truncate">{doc.name}</span>
                                {isConfirmed && <span className="text-[8px] font-black text-emerald-600 uppercase">● Đã xác nhận</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({ ...doc, category: "accident" })}
                                className="text-blue-600 hover:text-blue-700 font-bold px-1.5 py-1 rounded hover:bg-blue-50 cursor-pointer text-[10px]"
                              >
                                Xem
                              </button>
                              <button 
                                type="button"
                                onClick={() => setAccidentDocs([])}
                                className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
                      {hospitalReleaseDocs.map((doc, idx) => {
                        const isConfirmed = confirmedDocs.includes(doc.name);
                        return (
                          <div key={idx} className={`flex justify-between items-center rounded-xl px-3 py-2 text-[10px] border transition-colors ${
                            isConfirmed 
                              ? "bg-emerald-50 border-emerald-200" 
                              : "bg-white border-emerald-200 hover:bg-slate-50"
                          }`}>
                            <div 
                              onClick={() => setPreviewDoc({ ...doc, category: "release" })}
                              className="flex items-center gap-2 mr-2 cursor-pointer flex-grow"
                            >
                              <FileText size={14} className={isConfirmed ? "text-emerald-500 shrink-0" : "text-emerald-600 shrink-0"} />
                              <div className="flex flex-col overflow-hidden">
                                <span className="font-bold text-emerald-950 truncate">{doc.name}</span>
                                {isConfirmed && <span className="text-[8px] font-black text-emerald-600 uppercase">● Đã xác nhận</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({ ...doc, category: "release" })}
                                className="text-blue-600 hover:text-blue-700 font-bold px-1.5 py-1 rounded hover:bg-blue-50 cursor-pointer text-[10px]"
                              >
                                Xem
                              </button>
                              <button 
                                type="button"
                                onClick={() => setHospitalReleaseDocs([])}
                                className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
                    <p className="text-[9px] text-amber-800 mt-0.5">Để đảm bảo tính pháp lý, bạn cần tải lên bản Chụp Giấy ủy quyền bồi thường có chữ ký xác nhận của nhân viên chính ({(selectedCard as any)?.bankOwner || "Người được bảo hiểm chính"}).</p>
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
                      {authDocs.map((doc, idx) => {
                        const isConfirmed = confirmedDocs.includes(doc.name);
                        return (
                          <div key={idx} className={`flex justify-between items-center rounded-xl px-3 py-2 text-[10px] border transition-colors ${
                            isConfirmed 
                              ? "bg-emerald-50 border-emerald-200" 
                              : "bg-white border-amber-200 hover:bg-slate-50"
                          }`}>
                            <div 
                              onClick={() => setPreviewDoc({ ...doc, category: "auth" })}
                              className="flex items-center gap-2 mr-2 cursor-pointer flex-grow"
                            >
                              <FileText size={14} className={isConfirmed ? "text-emerald-500 shrink-0" : "text-amber-600 shrink-0"} />
                              <div className="flex flex-col overflow-hidden">
                                <span className="font-bold text-amber-950 truncate">{doc.name}</span>
                                {isConfirmed && <span className="text-[8px] font-black text-emerald-600 uppercase">● Đã xác nhận</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({ ...doc, category: "auth" })}
                                className="text-blue-600 hover:text-blue-700 font-bold px-1.5 py-1 rounded hover:bg-blue-50 cursor-pointer text-[10px]"
                              >
                                Xem
                              </button>
                              <button 
                                type="button"
                                onClick={() => setAuthDocs([])}
                                className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: COMPENSATION PAYMENT INFO & DIGITAL SIGNATURE */}
          {step === 4 && (
            <motion.div
              key="step-4"
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
                <h4 className="text-xs font-black text-slate-700 border-b border-slate-100 pb-2.5 flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><CreditCard size={15} className="text-blue-500" /> Tài khoản nhận bồi thường trực tiếp</span>
                  {!isCorporateMode && (
                    <button
                      type="button"
                      onClick={() => setShowBankSelectModal(true)}
                      className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-blue-200 active:scale-95"
                    >
                      Thay đổi
                    </button>
                  )}
                </h4>

                {infoError && (
                  <div className="flex gap-2 items-start text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">
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
                      {(isCorporateMode || !isBankEditing) && <Lock size={10} className="text-slate-400" />}
                    </label>
                    <input
                      type="text"
                      disabled={isCorporateMode ? true : !isBankEditing}
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        (isCorporateMode || !isBankEditing)
                          ? "text-slate-600 bg-slate-100 border-slate-200 cursor-not-allowed"
                          : "text-slate-800 bg-white border-blue-400 focus:ring-1 focus:ring-blue-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 flex items-center gap-1">
                      <span>Số tài khoản nhận bồi thường</span>
                      {(isCorporateMode || !isBankEditing) && <Lock size={10} className="text-slate-400" />}
                    </label>
                    <input
                      type="text"
                      disabled={isCorporateMode ? true : !isBankEditing}
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                        (isCorporateMode || !isBankEditing)
                          ? "text-slate-600 bg-slate-100 border-slate-200 cursor-not-allowed"
                          : "text-slate-800 bg-white border-blue-400 focus:ring-1 focus:ring-blue-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 flex items-center gap-1">
                      <span>Chủ tài khoản thụ hưởng (NĐBH chính)</span>
                      {(isCorporateMode || !isBankEditing) && <Lock size={10} className="text-slate-400" />}
                    </label>
                    <input
                      type="text"
                      disabled={isCorporateMode ? true : !isBankEditing}
                      value={bankOwner}
                      onChange={(e) => setBankOwner(e.target.value.toUpperCase())}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                        (isCorporateMode || !isBankEditing)
                          ? "text-slate-600 bg-slate-100 border-slate-200 cursor-not-allowed"
                          : "text-slate-800 bg-white border-blue-400 focus:ring-1 focus:ring-blue-500"
                      }`}
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
                  <p className="text-[9px] text-slate-400 mt-1 ml-1 font-semibold leading-relaxed">
                    Hệ thống tự động pre-fill từ hồ sơ đăng ký nhân sự chính để hạn chế gõ sai địa chỉ nhận sao kê quyết định bồi thường điện tử.
                  </p>
                </div>
              </div>

              {/* Giấy yêu cầu bồi thường hiển thị trực tiếp trong màn hình */}
              <div className="bg-white rounded-2.5xl p-5 border border-slate-150 shadow-sm space-y-4 text-left">
                <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Giấy xác nhận yêu cầu bồi thường
                    </h4>
                    <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                      Vui lòng cuộn xem toàn bộ văn bản bồi thường dưới đây để mở khóa đồng ý & ký xác nhận.
                    </p>
                  </div>
                </div>

                {/* Inline Scrollable Contract Agreement */}
                <div 
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 45) {
                      setHasReadGyc(true);
                    }
                  }}
                  className="max-h-72 overflow-y-auto px-4 py-4 space-y-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 relative scrollbar-thin scrollbar-thumb-slate-200"
                >
                  {/* Introduction */}
                  <div className="text-center pb-2 border-b border-dashed border-slate-200">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">TỔNG CÔNG TY CỔ PHẦN BẢO HIỂM BƯU ĐIỆN (PTI)</p>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-wide mt-1">GIẤY YÊU CẦU BỒI THƯỜNG BẢO HIỂM SỨC KHỎE</p>
                    <p className="text-[8px] text-slate-400 font-mono mt-0.5">Mã hồ sơ: CLM-{(selectedCard?.cardNumber || "PTI").substring(4)}-{new Date().getFullYear()}</p>
                  </div>

                  {/* Section 1: Thẻ bảo hiểm & Người yêu cầu */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1 h-3 bg-blue-600 rounded-xs" />
                      I. THÔNG TIN KHÁCH HÀNG & THẺ BẢO HIỂM
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5 bg-white p-2.5 rounded-xl border border-slate-150 text-[9px] text-slate-600 font-semibold">
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-bold">Người được bảo hiểm</p>
                        <p className="font-extrabold text-slate-800">{selectedCard?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-bold">Số thẻ bảo hiểm (ID CARD)</p>
                        <p className="font-mono font-extrabold text-blue-700">{selectedCard?.cardNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-bold">Quan hệ với nhân viên</p>
                        <p className="text-slate-800">{selectedCard?.relationship || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-bold">Đơn vị công tác</p>
                        <p className="text-slate-800">{isCorporateMode ? "FPT SOFTWARE (Doanh nghiệp)" : "Cá nhân & Gia đình"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Chi tiết sự kiện điều trị */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1 h-3 bg-blue-600 rounded-xs" />
                      II. THÔNG TIN SỰ KIỆN BẢO HIỂM & ĐIỀU TRỊ
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5 bg-white p-2.5 rounded-xl border border-slate-150 text-[9px] text-slate-600 font-semibold">
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-bold">Cơ sở y tế điều trị</p>
                        <p className="font-extrabold text-slate-800">{hospital || "Tự điền thủ công"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-bold">Ngày bắt đầu điều trị</p>
                        <p className="font-extrabold text-slate-800">{treatmentDate || "Chưa xác định"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-bold">Hình thức điều trị y khoa</p>
                        <p className="font-extrabold text-blue-600">
                          {treatmentType === "NgoaiTru" ? "Ngoại trú (Điều trị trong ngày)" : treatmentType === "NoiTru" ? "Nội trú (Nằm viện qua đêm)" : "Phẫu thuật y khoa"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-bold">Quyền lợi bảo hiểm</p>
                        <p className="font-extrabold text-amber-600">{cause || "Chưa chọn"}</p>
                      </div>
                      <div className="col-span-2 pt-1.5 border-t border-slate-150">
                        <p className="text-[8px] text-slate-400 uppercase font-bold">Số tiền yêu cầu bồi thường bảo hiểm</p>
                        <p className="font-mono text-[11px] font-black text-red-600">{amountStr ? `${amountStr} VND` : "0 VND"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Người nhận thụ hưởng tài chính */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1 h-3 bg-blue-600 rounded-xs" />
                      III. THÔNG TIN THỤ HƯỞNG TRỰC TIẾP
                    </h4>
                    <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-slate-150 text-[8px] text-slate-600 font-semibold">
                      <div className="col-span-1">
                        <p className="text-[7px] text-slate-400 uppercase font-bold">Chủ tài khoản</p>
                        <p className="font-extrabold text-slate-800">{bankOwner || "N/A"}</p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-[7px] text-slate-400 uppercase font-bold">Số tài khoản</p>
                        <p className="font-mono font-extrabold text-slate-800">{bankAccount || "N/A"}</p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-[7px] text-slate-400 uppercase font-bold">Ngân hàng</p>
                        <p className="font-extrabold text-slate-800">{bankName || "N/A"}</p>
                      </div>
                      <div className="col-span-3 pt-1.5 border-t border-slate-150 text-[8px] text-amber-700 flex items-center gap-1 leading-normal text-left">
                        <Lock size={9} />
                        <span>PTI chi trả trực tiếp cho NĐBH. HR công ty cam kết không can thiệp dòng tiền chi trả này.</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Danh mục chứng từ điện tử */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1 h-3 bg-blue-600 rounded-xs" />
                      IV. HỒ SƠ CHỨNG TỪ SỐ ĐÃ ĐÍNH KÈM
                    </h4>
                    <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-150 text-[8px] text-slate-600 font-semibold leading-normal text-left">
                      <div className="flex justify-between">
                        <span className="text-slate-400">1. Chứng từ y tế:</span>
                        <span className="text-slate-800">{medicalDocs.length > 0 ? `${medicalDocs.length} tệp tin` : "❌ Chưa đính kèm"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">2. Chứng từ thanh toán:</span>
                        <span className="text-slate-800">{paymentDocs.length > 0 ? `${paymentDocs.length} tệp tin` : "❌ Chưa đính kèm"}</span>
                      </div>
                      {cause === "Tai nạn" && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">3. Biên bản tai nạn:</span>
                          <span className="text-slate-800">{accidentDocs.length > 0 ? "✓ Đã tải" : "❌ Thiếu biên bản bắt buộc"}</span>
                        </div>
                      )}
                      {treatmentType === "NoiTru" && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">4. Giấy ra viện + Tóm tắt:</span>
                          <span className="text-slate-800">{hospitalReleaseDocs.length > 0 ? "✓ Đã tải" : "❌ Thiếu giấy tờ ra viện"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 5: Điều khoản Cam kết chung */}
                  <div className="space-y-1.5 border-t border-slate-150 pt-3 text-left">
                    <h4 className="text-[10px] font-black text-slate-700 uppercase">V. CAM KẾT VÀ QUY TẮC KHAI BÁO</h4>
                    <p className="text-[9px] text-slate-500 leading-normal font-medium">
                      1. Tôi cam kết các thông tin khai báo trên đây và các tài liệu, hóa đơn điện tử, chứng từ đính kèm là hoàn toàn trung thực, hợp lệ và hợp pháp.
                    </p>
                    <p className="text-[9px] text-slate-500 leading-normal font-medium">
                      2. Tôi hiểu rằng việc cố ý cung cấp thông tin sai lệch hoặc hóa đơn giả mạo sẽ dẫn đến việc từ chối bồi thường và chịu trách nhiệm pháp lý theo quy định của pháp luật.
                    </p>
                    <p className="text-[9px] text-slate-500 leading-normal font-medium">
                      3. Tôi đồng ý ủy quyền cho Tổng công ty Cổ phần Bảo hiểm Bưu điện (PTI) được phép làm việc với các cơ sở y tế điều trị để xác minh các thông tin liên quan đến bệnh án và viện phí phục vụ công tác giám định.
                    </p>
                  </div>

                  {/* Signature block */}
                  <div className="border-t border-slate-150 pt-2 flex justify-between text-[8px] text-slate-400">
                    <div>
                      <p className="uppercase font-bold text-center">ĐẠI DIỆN PTI CARE</p>
                      <p className="font-mono text-center mt-3">ELECTRONIC STAMP</p>
                    </div>
                    <div>
                      <p className="uppercase font-bold text-center">KHÁCH HÀNG KÝ SỐ</p>
                      <p className="font-mono text-center text-emerald-600 mt-1 font-bold">SECURE DIGISIGN ACTIVE</p>
                      <p className="text-center font-mono mt-0.5">Xác thực: {verificationMethod || "FaceID / OTP"}</p>
                    </div>
                  </div>
                </div>

                {/* Unscrolled Warning or Scrolled confirmation */}
                {!hasReadGyc && (
                  <p className="text-[9px] text-center font-bold text-amber-600 bg-amber-50 py-1.5 rounded-lg border border-amber-100">
                    👇 Vui lòng cuộn xem hết Giấy yêu cầu bồi thường ở trên để mở khóa Xác nhận
                  </p>
                )}

                {/* Confirmation Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      disabled={!hasReadGyc}
                      onChange={(e) => {
                        if (!hasReadGyc) {
                          alert("Vui lòng cuộn đọc hết toàn bộ nội dung Giấy yêu cầu bồi thường ở phía trên để mở khóa ô chọn.");
                          return;
                        }
                        setAgreeTerms(e.target.checked);
                      }}
                      className={`mt-0.5 rounded border-slate-300 h-4.5 w-4.5 shrink-0 transition-all ${
                        hasReadGyc 
                          ? "text-blue-600 focus:ring-blue-100 cursor-pointer font-bold" 
                          : "bg-slate-100 border-slate-200 cursor-not-allowed text-slate-300"
                      }`}
                    />
                    <span className={`text-[10px] font-bold leading-normal ${hasReadGyc ? "text-slate-700" : "text-slate-400"}`}>
                      Tôi xác nhận đã đọc, hiểu rõ và đồng ý với tất cả các thông tin trong Giấy yêu cầu bồi thường.
                    </span>
                  </label>
                </div>

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

      {/* GYC Preview Document Sheet Overlay */}
      <AnimatePresence>
        {showGycPreview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGycPreview(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-55 cursor-pointer"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85%] bg-white rounded-t-[32px] shadow-2xl z-55 flex flex-col overflow-hidden pb-6 border-t border-slate-150"
            >
              <div className="w-full flex justify-center py-3">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>

              <div className="px-6 pb-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="text-left">
                  <span className="text-[9px] font-black tracking-widest text-blue-600 uppercase font-mono">TỔNG CÔNG TY CỔ PHẦN BẢO HIỂM BƯU ĐIỆN (PTI)</span>
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-tight">
                    📄 GIẤY YÊU CẦU BỒI THƯỜNG BẢO HIỂM
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGycPreview(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div 
                onScroll={(e) => {
                  const target = e.currentTarget;
                  if (target.scrollHeight - target.scrollTop <= target.clientHeight + 35) {
                    setHasReadGyc(true);
                  }
                }}
                className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
              >
                {/* Introduction */}
                <div className="text-center pb-2 border-b border-dashed border-slate-150">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">GIẤY YÊU CẦU BỒI THƯỜNG BẢO HIỂM SỨC KHỎE CON NGƯỜI</p>
                  <p className="text-[8px] text-slate-400 font-mono">Mã hồ sơ: CLM-{(selectedCard?.cardNumber || "PTI").substring(4)}-{new Date().getFullYear()}</p>
                </div>

                {/* Section 1: Thẻ bảo hiểm & Người yêu cầu */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1 h-3 bg-blue-600 rounded-xs" />
                    I. THÔNG TIN KHÁCH HÀNG & THẺ BẢO HIỂM
                  </h4>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-150/70 text-[10px] text-slate-600 font-semibold">
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Người được bảo hiểm chính</p>
                      <p className="font-extrabold text-slate-800">{selectedCard?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Số thẻ bảo hiểm (ID CARD)</p>
                      <p className="font-mono font-extrabold text-blue-700">{selectedCard?.cardNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Quan hệ với nhân viên</p>
                      <p className="text-slate-800">{selectedCard?.relationship || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Đơn vị công tác</p>
                      <p className="text-slate-800">{isCorporateMode ? "FPT SOFTWARE (Doanh nghiệp)" : "Cá nhân & Gia đình"}</p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Chi tiết sự kiện điều trị */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1 h-3 bg-blue-600 rounded-xs" />
                    II. THÔNG TIN SỰ KIỆN BẢO HIỂM & ĐIỀU TRỊ
                  </h4>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-150/70 text-[10px] text-slate-600 font-semibold">
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Cơ sở y tế / Bệnh viện điều trị</p>
                      <p className="font-extrabold text-slate-800">{hospital || "Tự điền thủ công"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Ngày bắt đầu điều trị</p>
                      <p className="font-extrabold text-slate-800">{treatmentDate || "Chưa xác định"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Hình thức điều trị y khoa</p>
                      <p className="font-extrabold text-blue-600">
                        {treatmentType === "NgoaiTru" ? "Ngoại trú (Điều trị trong ngày)" : treatmentType === "NoiTru" ? "Nội trú (Nằm viện qua đêm)" : "Phẫu thuật y khoa"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Nguyên nhân xảy ra rủi ro</p>
                      <p className="font-extrabold text-amber-600">{cause || "Chưa chọn"}</p>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-150">
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Số tiền yêu cầu bồi thường bảo hiểm</p>
                      <p className="font-mono text-xs font-black text-red-600">{amountStr ? `${amountStr} VND` : "0 VND"} <span className="text-[8px] text-slate-400 font-sans font-medium">(Đồng Việt Nam)</span></p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Người nhận thụ hưởng tài chính */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1 h-3 bg-blue-600 rounded-xs" />
                    III. THÔNG TIN NGÂN HÀNG THỤ HƯỞNG TRỰC TIẾP
                  </h4>
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150/70 text-[9px] text-slate-600 font-semibold">
                    <div className="col-span-1">
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Chủ tài khoản</p>
                      <p className="font-extrabold text-slate-800">{bankOwner || "N/A"}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Số tài khoản</p>
                      <p className="font-mono font-extrabold text-slate-800">{bankAccount || "N/A"}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Ngân hàng</p>
                      <p className="font-extrabold text-slate-800">{bankName || "N/A"}</p>
                    </div>
                    <div className="col-span-3 pt-2 border-t border-slate-150 text-[8px] text-amber-700 flex items-center gap-1">
                      <Lock size={10} />
                      <span>PTI chi trả trực tiếp cho NĐBH. HR công ty cam kết không can thiệp dòng tiền chi trả này.</span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Danh mục chứng từ điện tử */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1 h-3 bg-blue-600 rounded-xs" />
                    IV. HỒ SƠ CHỨNG TỪ SỐ ĐÃ ĐÍNH KÈM
                  </h4>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-150/70 text-[9px] text-slate-600 font-semibold">
                    <div className="flex justify-between">
                      <span className="text-slate-400">1. Chứng từ y tế:</span>
                      <span className="text-slate-800">{medicalDocs.length > 0 ? `${medicalDocs.length} tệp tin (${medicalDocs.map(d => d.name).join(", ")})` : "❌ Chưa đính kèm"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">2. Chứng từ thanh toán / Phiếu thu:</span>
                      <span className="text-slate-800">{paymentDocs.length > 0 ? `${paymentDocs.length} tệp tin (${paymentDocs.map(d => d.name).join(", ")})` : "❌ Chưa đính kèm"}</span>
                    </div>
                    {cause === "Tai nạn" && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">3. Biên bản tai nạn:</span>
                        <span className="text-slate-800">{accidentDocs.length > 0 ? "✓ Đã tải" : "❌ Thiếu biên bản bắt buộc"}</span>
                      </div>
                    )}
                    {treatmentType === "NoiTru" && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">4. Giấy ra viện + Tóm tắt bệnh án:</span>
                        <span className="text-slate-800">{hospitalReleaseDocs.length > 0 ? "✓ Đã tải" : "❌ Thiếu giấy tờ ra viện"}</span>
                      </div>
                    )}
                    {(isCorporateMode ? currentEmployee?.isDependent : selectedCard?.relationship !== "Bản thân") && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">5. Giấy ủy quyền bồi thường hộ:</span>
                        <span className="text-slate-800">{authDocs.length > 0 ? "✓ Đã tải" : "❌ Thiếu giấy ủy quyền bồi thường hộ"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Box signature */}
                <div className="border-t border-slate-100 pt-3 flex justify-between text-[10px] text-slate-500 font-bold">
                  <div>
                    <p className="text-center uppercase text-[8px] text-slate-400">ĐẠI DIỆN PTI CARE</p>
                    <p className="text-center mt-6 text-[9px] font-mono text-slate-400">ELECTRONIC STAMP</p>
                  </div>
                  <div className="text-right">
                    <p className="text-center uppercase text-[8px] text-slate-400">KHÁCH HÀNG KÝ SỐ</p>
                    <div className="mt-2 text-center">
                      <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                        SECURE DIGISIGN ACTIVE
                      </span>
                      <p className="text-[7px] text-slate-400 font-mono mt-0.5">Xác thực: {verificationMethod || "FaceID / OTP"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pt-3 border-t border-slate-100 flex flex-col gap-2">
                {!hasReadGyc && (
                  <p className="text-[10px] text-center font-bold text-amber-600 animate-pulse">
                    👇 Vui lòng cuộn tài liệu xuống dưới cùng để xác nhận đã đọc hết
                  </p>
                )}
                <button
                  type="button"
                  disabled={!hasReadGyc}
                  onClick={() => setShowGycPreview(false)}
                  className={`w-full py-3 rounded-2xl text-xs font-bold shadow-md cursor-pointer text-center transition-all ${
                    hasReadGyc 
                      ? "bg-slate-900 hover:bg-slate-800 text-white" 
                      : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  }`}
                >
                  {hasReadGyc ? "Tôi đã đọc hết & Đóng" : "Vui lòng cuộn xuống dưới cùng để xác nhận"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. MODAL: OCR DOCUMENT VERIFICATION AND PREVIEW */}
      <AnimatePresence>
        {previewDoc && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewDoc(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col border border-slate-100 max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-800">Kiểm tra & Xác nhận hồ sơ số</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">OCR AI SCANNER ACTIVE</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-5 space-y-4 overflow-y-auto flex-grow text-xs">
                {/* Meta details */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex justify-between items-center text-[10px]">
                  <div>
                    <p className="font-extrabold text-slate-700 truncate max-w-[200px]">{previewDoc.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium">Dung lượng: {previewDoc.size}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 font-bold text-[9px] px-2 py-0.5 rounded-full capitalize">
                    {previewDoc.category === "medical" ? "Chứng từ y tế" : previewDoc.category === "payment" ? "Chứng từ thanh toán" : "Giấy tờ bổ sung"}
                  </span>
                </div>

                {/* Mock image with a moving scanner bar */}
                <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 h-44 flex items-center justify-center">
                  {/* Moving glowing line to simulate OCR scan */}
                  <motion.div
                    animate={{ y: [-80, 80] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_#60a5fa] z-10"
                  />

                  {/* Visual design representing standard hospital invoice / document */}
                  <div className="absolute inset-0 opacity-20 bg-radial-gradient from-blue-500/20 to-transparent pointer-events-none" />
                  <div className="text-white space-y-2 text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-blue-400">
                      <Sparkles size={24} className="animate-pulse" />
                    </div>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400">PREVIEWING DOCUMENT IMAGE</p>
                    <p className="text-[9px] text-slate-500 font-mono">HASH: SHA256-49C3A...91D2</p>
                  </div>

                  {/* Floating OCR status badge */}
                  <div className="absolute top-3 left-3 bg-blue-500/90 text-white text-[8px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                    <Zap size={10} className="animate-bounce" />
                    <span>AI TRÍCH XUẤT</span>
                  </div>
                </div>

                {/* Simulated OCR Recognized Data */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-700 font-black">
                    <Zap size={14} className="text-blue-500" />
                    <span>Dữ liệu hóa đơn nhận dạng tự động:</span>
                  </div>

                  <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/60 space-y-1.5 text-[10px]">
                    <div className="flex justify-between py-1 border-b border-blue-100/30">
                      <span className="text-slate-500">Đơn vị phát hành:</span>
                      <span className="font-bold text-slate-800">
                        {hospital || "Bệnh viện Đa khoa Tâm Anh"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-blue-100/30">
                      <span className="text-slate-500">Mã số thuế liên kết:</span>
                      <span className="font-mono font-bold text-slate-800">0108345678-002</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-blue-100/30">
                      <span className="text-slate-500">Số hóa đơn / Hợp đồng mẫu:</span>
                      <span className="font-mono font-bold text-slate-800">E-INV-00412A</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-blue-100/30">
                      <span className="text-slate-500">Ngày hóa đơn:</span>
                      <span className="font-bold text-slate-800">{treatmentDate || "14/07/2026"}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5">
                      <span className="font-bold text-blue-900">Tổng cộng thanh toán (OCR):</span>
                      <div className="text-right">
                        <span className="font-mono font-black text-xs text-red-600 block">3.250.000 VND</span>
                        <p className="text-[8px] text-slate-400 font-medium">Bảo hiểm tạm tính: 100%</p>
                      </div>
                    </div>
                  </div>

                  {previewDoc.category === "payment" && (
                    <button
                      type="button"
                      onClick={() => {
                        setAmountStr("3250000");
                        setPreviewDoc(null);
                      }}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-blue-200 cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Áp dụng Số tiền 3.250.000đ vào Hồ sơ bồi thường</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    // Update confirmed docs list
                    if (!confirmedDocs.includes(previewDoc.name)) {
                      setConfirmedDocs([...confirmedDocs, previewDoc.name]);
                    }
                    setPreviewDoc(null);
                  }}
                  className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer text-center"
                >
                  Xác nhận hồ sơ hợp lệ & Đóng
                </button>
              </div>
            </motion.div>
          </>
        )}

        {showBankSelectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-[360px] bg-white rounded-t-3xl rounded-b-3xl p-5 space-y-4 border border-slate-100 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-blue-600" />
                  <h3 className="font-display font-bold text-sm text-slate-800">
                    Chọn tài khoản bồi bồi thường
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBankSelectModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-[10px] text-slate-500 font-medium leading-relaxed text-left">
                Vui lòng chọn 1 trong 3 tài khoản thụ hưởng bạn đã đăng ký để hệ thống cập nhật vào giấy yêu cầu bồi thường:
              </p>

              <div className="space-y-2.5">
                {bankOptions.map((opt, idx) => {
                  const isSelected = localBankSelectIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setLocalBankSelectIndex(idx)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 relative ${
                        isSelected
                          ? "bg-blue-50/50 border-blue-500 ring-1 ring-blue-500/20 shadow-sm"
                          : "bg-white border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                        isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isSelected && <Check size={10} className="stroke-[3]" />}
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                          idx === 0 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100/30" 
                            : "bg-slate-100 text-slate-500 border border-slate-200/30"
                        }`}>
                          {opt.label}
                        </span>
                        <p className="text-xs font-bold text-slate-800 font-display mt-1">{opt.bankName}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">Số TK: {opt.bankAccount}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBankSelectModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-2xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const selectedOpt = bankOptions[localBankSelectIndex];
                    setBankName(selectedOpt.bankName);
                    setBankAccount(selectedOpt.bankAccount);
                    setShowBankSelectModal(false);
                  }}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/10 transition-all cursor-pointer text-center"
                >
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

