import React, { useState, useEffect, useRef } from "react";
import { 
  Home, User as UserIcon, MessageSquare, Bell, Newspaper, Sparkles, 
  CreditCard, Shield, Settings, Info, Search, HelpCircle, LogOut, 
  ArrowUpRight, Check, AlertCircle, FileText, ChevronRight, X, Clock, 
  PlusCircle, RefreshCw, CheckCircle2, ChevronDown, CheckCircle,
  ChevronLeft, Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import PhoneFrame from "./components/PhoneFrame";
import LoginScreen from "./components/LoginScreen";
import ClaimWizard from "./components/ClaimWizard";
import ChatTab from "./components/ChatTab";
import QuickActionsTab, { CardDetailModal } from "./components/QuickActionsTab";
import CorporateDashboard from "./components/CorporateDashboard";

import { InsuranceCard, ClaimRequest, NotificationItem, NewsItem } from "./types";
import { 
  SAMPLE_CARDS, SAMPLE_NEWS, SAMPLE_NOTIFICATIONS, MOCK_HISTORIC_CLAIMS 
} from "./data";

export default function App() {
  // USER STATES
  const [user, setUser] = useState<{
    name: string;
    cccd: string;
    isCorporate?: boolean;
    companyCode?: string;
    hrAccount?: string;
  } | null>(null);

  const [corporateEmployeeSelectedForWizard, setCorporateEmployeeSelectedForWizard] = useState<any | null>(null);

  // BASE COLLECTIONS (Persist claims in LocalStorage for dynamic state tracking)
  const [cards, setCards] = useState<InsuranceCard[]>(SAMPLE_CARDS);
  const [news, setNews] = useState<NewsItem[]>(SAMPLE_NEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);
  const [claims, setClaims] = useState<ClaimRequest[]>([]);

  // NAVIGATION & PORTAL STATES
  const [activeTab, setActiveTab] = useState<"home" | "roster" | "account" | "news" | "notif" | "chat">("home");
  const [currentWizard, setCurrentWizard] = useState(false);
  const [currentQuickAction, setCurrentQuickAction] = useState<"payment" | "profile" | null>(null);

  // MODAL & EXPAND STATES
  const [selectedCardForModal, setSelectedCardForModal] = useState<InsuranceCard | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRequest | null>(null);

  // MOCK CAROUSEL INDEX
  const [cardIndex, setCardIndex] = useState(0);
  const [homeClaimFilter, setHomeClaimFilter] = useState<"Tất cả" | "Nháp" | "Chờ duyệt" | "Bổ sung chứng từ" | "Đã thanh toán" | "Bị từ chối">("Tất cả");
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const width = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: width * index,
        behavior: "smooth"
      });
      setCardIndex(index);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      setCardIndex(newIndex);
    }
  };

  // SUPPLEMENTAL DOCUMENTS WORK STATE
  const [supplementingDocType, setSupplementingDocType] = useState<"medical" | "payment" | null>(null);
  const [supplementingProgress, setSupplementingProgress] = useState(0);
  const [addedDocs, setAddedDocs] = useState<{ name: string; size: string; type: string }[]>([]);

  // Load claims from local storage or set defaults
  useEffect(() => {
    const saved = localStorage.getItem("pti_claims_v1");
    if (saved) {
      try {
        setClaims(JSON.parse(saved));
      } catch (e) {
        setClaims(MOCK_HISTORIC_CLAIMS);
      }
    } else {
      setClaims(MOCK_HISTORIC_CLAIMS);
      localStorage.setItem("pti_claims_v1", JSON.stringify(MOCK_HISTORIC_CLAIMS));
    }
  }, []);

  const saveClaims = (updatedClaims: ClaimRequest[]) => {
    setClaims(updatedClaims);
    localStorage.setItem("pti_claims_v1", JSON.stringify(updatedClaims));
  };

  const handleLoginSuccess = (name: string, cccd: string, isCorporate?: boolean, companyCode?: string, hrAccount?: string) => {
    setUser({ name, cccd, isCorporate, companyCode, hrAccount });
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("home");
    setCurrentWizard(false);
    setCurrentQuickAction(null);
  };

  // Create a new claim request from Wizard callback
  const handleAddNewClaim = (newClaim: ClaimRequest) => {
    const updated = [newClaim, ...claims];
    saveClaims(updated);

    // Create a new notification hỏa tốc
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Yêu cầu bồi thường mới đã nộp 📄",
      content: `Hồ sơ bảo hiểm mã #${newClaim.id} cho ${newClaim.insuredName} điều trị tại ${newClaim.hospital} đã được nộp và chuyển sang trạng thái 'Chờ duyệt'.`,
      date: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", {hour: "2-digit", minute: "2-digit"}),
      read: false,
      claimId: newClaim.id
    };
    setNotifications([newNotif, ...notifications]);
  };

  // ADMIN SIMULATOR - Allows reviewer to change newly submitted claim statuses to show different feedback
  const handleSimulateClaimStatus = (claimId: string, targetStatus: "ChoDuyet" | "YeuCauBoSung" | "DaDuyet" | "TuChoi" | "Nhap") => {
    let supplementNotes = undefined;
    if (targetStatus === "YeuCauBoSung") {
      supplementNotes = "Ban giám định PTI cần bạn bổ sung thêm: 'Giấy ra viện có mộc tròn' và 'Đơn thuốc gốc có chữ ký của bác sĩ điều trị'.";
    }

    const updated = claims.map(c => {
      if (c.id === claimId) {
        return { 
          ...c, 
          status: targetStatus, 
          supplementNotes,
          // If approved, mock fill a transaction payout date
          date: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", {hour: "2-digit", minute: "2-digit"})
        };
      }
      return c;
    });

    saveClaims(updated);
    if (selectedClaim && selectedClaim.id === claimId) {
      setSelectedClaim({ ...selectedClaim, status: targetStatus, supplementNotes });
    }

    // Push notification matching the status
    let title = "";
    let content = "";
    if (targetStatus === "DaDuyet") {
      title = "Hồ sơ bồi thường đã ĐƯỢC DUYỆT CHI TRẢ ✅";
      content = `Yêu cầu #${claimId} đã được PTI duyệt chi trả thành công. Số tiền đã chuyển về tài khoản ngân hàng thụ hưởng của bạn.`;
    } else if (targetStatus === "YeuCauBoSung") {
      title = "YÊU CẦU BỔ SUNG CHỨNG TỪ BỒI THƯỜNG ⚠️";
      content = `Hồ sơ #${claimId} đang bị thiếu thông tin. Vui lòng nhấn vào thông báo để bổ sung thêm chứng từ y tế còn thiếu.`;
    } else if (targetStatus === "TuChoi") {
      title = "Hồ sơ bồi thường bị TỪ CHỐI CHI TRẢ ❌";
      content = `Yêu cầu #${claimId} bị từ chối do rủi ro phát sinh ngoài phạm vi thời hạn hợp đồng bảo hiểm.`;
    } else {
      title = "Cập nhật hồ sơ bồi thường 🔄";
      content = `Hồ sơ #${claimId} đã được đưa về trạng thái chờ thẩm định duyệt.`;
    }

    const newNotif: NotificationItem = {
      id: `notif-sim-${Date.now()}`,
      title,
      content,
      date: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", {hour: "2-digit", minute: "2-digit"}),
      read: false,
      claimId
    };

    setNotifications([newNotif, ...notifications]);
  };

  // Submit supplementary documents inside the claim details drawer
  const triggerSupplementUpload = () => {
    setSupplementingDocType("medical");
    setSupplementingProgress(0);

    const interval = setInterval(() => {
      setSupplementingProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setSupplementingDocType(null);
            const extraDoc = {
              name: `GiayRaVien_DauTron_BoSung_${Date.now().toString().slice(-4)}.png`,
              size: "420 KB",
              type: "image/png"
            };
            setAddedDocs([...addedDocs, extraDoc]);
          }, 300);
          return 100;
        }
        return p + 20;
      });
    }, 100);
  };

  const handleApplySupplementAndSubmit = (claimId: string) => {
    if (addedDocs.length === 0) return;

    const updated = claims.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: "ChoDuyet" as const, // goes back to pending
          medicalDocs: [...c.medicalDocs, ...addedDocs],
          supplementNotes: undefined
        };
      }
      return c;
    });

    saveClaims(updated);
    setAddedDocs([]);
    if (selectedClaim && selectedClaim.id === claimId) {
      setSelectedClaim(null); // Close detail drawer
    }

    // Add alert notification
    const newNotif: NotificationItem = {
      id: `notif-supp-${Date.now()}`,
      title: "Đã nộp bổ sung chứng từ thành công 📄",
      content: `Yêu cầu #${claimId} đã nhận chứng từ bổ sung và chuyển lại sang trạng thái 'Chờ duyệt'.`,
      date: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", {hour: "2-digit", minute: "2-digit"}),
      read: false,
      claimId
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <PhoneFrame>
      {!user ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
          
          {/* ==========================================
              OVERLAYS: WIZARD & QUICK ACTIONS
          ========================================== */}
          <AnimatePresence>
            {currentWizard && (
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="absolute inset-0 bg-[#FFFDF9] z-40 flex flex-col"
              >
                <ClaimWizard 
                  cards={cards}
                  isCorporateMode={user.isCorporate}
                  corporateEmployee={corporateEmployeeSelectedForWizard}
                  onBack={() => {
                    setCurrentWizard(false);
                    setCorporateEmployeeSelectedForWizard(null);
                  }}
                  onSubmitSuccess={(newClaim) => {
                    handleAddNewClaim(newClaim);
                    setCurrentWizard(false);
                    setCorporateEmployeeSelectedForWizard(null);
                    if (user.isCorporate) {
                      setActiveTab("home");
                    } else {
                      setActiveTab("account");
                    }
                  }}
                />
              </motion.div>
            )}

            {currentQuickAction && (
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="absolute inset-0 bg-[#FFFDF9] z-40 flex flex-col"
              >
                <QuickActionsTab 
                  actionType={currentQuickAction}
                  primaryCccd={user.cccd}
                  onBack={() => setCurrentQuickAction(null)}
                />
              </motion.div>
            )}

            {selectedCardForModal && (
              <CardDetailModal 
                card={selectedCardForModal}
                onClose={() => setSelectedCardForModal(null)}
              />
            )}
          </AnimatePresence>

          {/* ==========================================
              MAIN VIEWS ACCORDING TO ACTIVE TAB
          ========================================== */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: HOME PAGE */}
              {activeTab === "home" && (
                user.isCorporate ? (
                  <motion.div
                    key="corporate-home-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-grow flex flex-col overflow-hidden"
                  >
                    {/* Top Welcome Bar for HR */}
                    <div className="flex justify-between items-center px-5 pt-4 pb-2 shrink-0">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CỔNG DOANH NGHIỆP,</p>
                        <h2 className="text-base font-display font-black text-slate-800 flex items-center gap-1.5 uppercase">
                          PTI Enterprise <Sparkles size={15} className="text-blue-500 fill-blue-500 animate-pulse" />
                        </h2>
                      </div>
                      
                      <button 
                        onClick={handleLogout}
                        title="Đăng xuất"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                      >
                        <LogOut size={14} />
                      </button>
                    </div>

                    <CorporateDashboard 
                      hrName={user.name}
                      companyCode={user.companyCode || "PTI-EB-FPT"}
                      hrAccount={user.hrAccount || "fpt_hr_admin"}
                      claims={claims}
                      hideRoster={true}
                      onGoToRosterTab={() => setActiveTab("roster")}
                      onStartCreateWizardDirectly={() => setCurrentWizard(true)}
                      onCreateOnBehalf={(emp) => {
                        setCorporateEmployeeSelectedForWizard({
                          id: emp.id,
                          name: emp.name,
                          relationship: emp.relationship,
                          cardNumber: emp.cardNumber,
                          bankName: emp.bankName,
                          bankAccount: emp.bankAccount,
                          bankOwner: emp.bankOwner,
                          email: emp.email,
                          isDependent: emp.isDependent
                        });
                        setCurrentWizard(true);
                      }}
                      onSelectClaim={(claim) => setSelectedClaim(claim)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="home-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-grow flex flex-col overflow-y-auto px-5 pt-2 pb-6 space-y-5"
                  >
                    {/* Top Welcome Bar */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chào mừng trở lại,</p>
                        <h2 className="text-lg font-display font-bold text-slate-800 flex items-center gap-1.5">
                          {user.name} <Sparkles size={16} className="text-blue-500 fill-blue-500" />
                        </h2>
                      </div>
                      
                      <button 
                        onClick={handleLogout}
                        title="Đăng xuất"
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                      >
                        <LogOut size={15} />
                      </button>
                    </div>


                  {/* Dynamic Interactive Insurance Card (e-card) */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-end px-1">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thẻ bảo hiểm điện tử (e-Card)</h3>
                      <span className="text-[10px] text-slate-400 font-semibold">Tài khoản: {cards.length} thẻ</span>
                    </div>

                    {/* Flipping / Swiping iOS-Style e-Card Layout */}
                    <div className="relative px-0.5">
                      {/* Left arrow */}
                      {cardIndex > 0 && (
                        <button 
                          onClick={() => scrollToIndex(cardIndex - 1)}
                          className="absolute -left-2.5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/95 hover:bg-white text-blue-600 shadow-md border border-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                        >
                          <ChevronLeft size={15} className="stroke-[2.5]" />
                        </button>
                      )}

                      {/* Right arrow */}
                      {cardIndex < cards.length - 1 && (
                        <button 
                          onClick={() => scrollToIndex(cardIndex + 1)}
                          className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/95 hover:bg-white text-blue-600 shadow-md border border-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                        >
                          <ChevronRight size={15} className="stroke-[2.5]" />
                        </button>
                      )}

                      <div 
                        ref={carouselRef}
                        onScroll={handleScroll}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-none px-0.5"
                      >
                        {cards.map((card, idx) => (
                          <div 
                            key={card.id}
                            onClick={() => setSelectedCardForModal(card)}
                            className="snap-center shrink-0 w-full bg-gradient-to-br from-blue-600/85 to-indigo-700/85 backdrop-blur-xl border border-white/25 rounded-[28px] p-5 text-white flex flex-col justify-between h-[190px] shadow-lg shadow-blue-600/15 cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-blue-500/20 active:scale-[0.99]"
                          >
                            {/* Premium Apple card light glare overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

                            {/* Header: Bảo hiểm bưu điện PTI */}
                            <div className="flex justify-between items-start border-b border-white/10 pb-2.5">
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-white/15 rounded-lg border border-white/25">
                                  <Shield size={16} className="text-white fill-white/10" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-sky-200">Bảo hiểm bưu điện</span>
                                  <span className="text-xs font-display font-black tracking-widest text-white">PTI INSURANCE</span>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold tracking-widest text-blue-100 uppercase bg-white/15 px-2 py-0.5 rounded-full border border-white/10">
                                e-Card
                              </span>
                            </div>

                            {/* Body: Người được bảo lãnh */}
                            <div className="space-y-1 my-2">
                              <p className="text-[9px] text-blue-200 font-extrabold uppercase tracking-wider">Người được bảo lãnh</p>
                              <div className="flex items-center gap-2">
                                <h4 className="font-display font-extrabold text-base tracking-wide uppercase text-white">
                                  {card.name}
                                </h4>
                                <span className="text-[8px] font-bold text-white uppercase tracking-wider bg-sky-500/30 border border-sky-400/30 px-1.5 py-0.5 rounded">
                                  {card.relationship}
                                </span>
                              </div>
                            </div>

                            {/* Footer: Mã thẻ */}
                            <div className="flex justify-between items-end border-t border-white/10 pt-2.5">
                              <div className="space-y-1">
                                <p className="text-[9px] text-blue-200 font-extrabold uppercase tracking-wider">Mã số thẻ</p>
                                <p className="text-xs font-mono font-bold tracking-widest bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 inline-block">{card.cardNumber}</p>
                              </div>

                              {/* Scanning QR visual trigger */}
                              <div className="bg-white/95 backdrop-blur-sm p-1.5 rounded-xl shadow-md flex items-center justify-center shrink-0 border border-white/20 hover:scale-105 active:scale-95 transition-all">
                                <svg className="w-6 h-6 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                                  <path d="M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z M45,45 h10 v10 h-10 z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center gap-1.5">
                      {cards.map((_, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => scrollToIndex(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${cardIndex === idx ? "w-5 bg-blue-600" : "w-1.5 bg-slate-300"}`} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Core Quick Actions Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setCurrentQuickAction("payment")}
                      className="glass-panel hover:bg-white border border-white/60 p-3.5 rounded-3xl text-center shadow-sm hover:shadow transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-105 transition-transform">
                        <CreditCard size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">Đóng phí bảo hiểm</span>
                    </button>

                    <button
                      onClick={() => setCurrentQuickAction("profile")}
                      className="glass-panel hover:bg-white border border-white/60 p-3.5 rounded-3xl text-center shadow-sm hover:shadow transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm group-hover:scale-105 transition-transform">
                        <Settings size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">Điều chỉnh thông tin</span>
                    </button>

                    <button
                      onClick={() => setCurrentWizard(true)}
                      className="glass-panel hover:bg-white border border-white/60 p-3.5 rounded-3xl text-center shadow-sm hover:shadow transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-105 transition-transform">
                        <PlusCircle size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">Tạo Yêu cầu quyền lợi</span>
                    </button>
                  </div>



                  {/* COMPREHENSIVE CLAIM LIST ON THE HOME SCREEN */}
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center px-1">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Danh sách yêu cầu bồi thường</h3>
                      <span className="text-[10px] text-slate-400 font-bold">{claims.length} hồ sơ</span>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                      {(["Tất cả", "Nháp", "Chờ duyệt", "Bổ sung chứng từ", "Đã thanh toán", "Bị từ chối"] as const).map((filter) => {
                        const isSelected = homeClaimFilter === filter;
                        // Count matching claims
                        const count = claims.filter(c => {
                          if (filter === "Tất cả") return true;
                          if (filter === "Nháp") return c.status === "Nhap";
                          if (filter === "Chờ duyệt") return c.status === "ChoDuyet";
                          if (filter === "Bổ sung chứng từ") return c.status === "YeuCauBoSung";
                          if (filter === "Đã thanh toán") return c.status === "DaDuyet";
                          if (filter === "Bị từ chối") return c.status === "TuChoi";
                          return false;
                        }).length;

                        return (
                          <button
                            key={filter}
                            onClick={() => setHomeClaimFilter(filter)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10"
                                : "bg-white/60 text-slate-500 hover:bg-white border border-slate-100/80"
                            }`}
                          >
                            <span>{filter}</span>
                            <span className={`px-1 py-0.2 rounded-full text-[8px] font-extrabold ${
                              isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* List of Filtered Claims */}
                    <div className="space-y-3">
                      {(() => {
                        const filteredClaims = claims.filter(c => {
                          if (homeClaimFilter === "Tất cả") return true;
                          if (homeClaimFilter === "Nháp") return c.status === "Nhap";
                          if (homeClaimFilter === "Chờ duyệt") return c.status === "ChoDuyet";
                          if (homeClaimFilter === "Bổ sung chứng từ") return c.status === "YeuCauBoSung";
                          if (homeClaimFilter === "Đã thanh toán") return c.status === "DaDuyet";
                          if (homeClaimFilter === "Bị từ chối") return c.status === "TuChoi";
                          return false;
                        });

                        if (filteredClaims.length === 0) {
                          return (
                            <div className="glass-panel rounded-2xl p-6 text-center border border-slate-100/60 bg-white/30">
                              <p className="text-xs text-slate-400 font-medium">Không có yêu cầu bồi thường nào ở trạng thái này.</p>
                            </div>
                          );
                        }

                        return filteredClaims.map((claim) => {
                          let statusColor = "";
                          let statusText = "";
                          
                          if (claim.status === "ChoDuyet") {
                            statusColor = "bg-amber-50 text-amber-600 border-amber-100";
                            statusText = "Chờ duyệt";
                          } else if (claim.status === "YeuCauBoSung") {
                            statusColor = "bg-orange-50 text-orange-600 border-orange-100 animate-pulse";
                            statusText = "Yêu cầu bổ sung";
                          } else if (claim.status === "DaDuyet") {
                            statusColor = "bg-green-50 text-green-600 border-green-100";
                            statusText = "Đã chi trả";
                          } else if (claim.status === "TuChoi") {
                            statusColor = "bg-red-50 text-red-600 border-red-100";
                            statusText = "Từ chối";
                          } else {
                            statusColor = "bg-slate-100 text-slate-500 border-slate-200";
                            statusText = "Bản nháp";
                          }

                          let treatmentTypeText = "";
                          if (claim.treatmentType === "NoiTru") {
                            treatmentTypeText = "Nội trú";
                          } else if (claim.treatmentType === "NgoaiTru") {
                            treatmentTypeText = "Ngoại trú";
                          } else {
                            treatmentTypeText = "Nha khoa";
                          }

                          return (
                            <div
                              key={claim.id}
                              onClick={() => setSelectedClaim(claim)}
                              className="bg-white/80 hover:bg-white rounded-2xl p-4 border border-slate-100/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                            >
                              {/* Soft side gradient accent based on status */}
                              <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                                claim.status === "DaDuyet" ? "bg-green-500" :
                                claim.status === "YeuCauBoSung" ? "bg-orange-500" :
                                claim.status === "ChoDuyet" ? "bg-amber-500" :
                                claim.status === "TuChoi" ? "bg-red-500" : "bg-slate-400"
                              }`} />

                              <div className="flex justify-between items-start pl-1">
                                <div className="space-y-1 max-w-[65%]">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[10px] font-bold font-mono text-slate-400">#{claim.id}</span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                                      {statusText}
                                    </span>
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-blue-100 bg-blue-50/50 text-blue-600">
                                      {treatmentTypeText}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-800 font-display mt-1.5 leading-tight group-hover:text-blue-600 transition-colors">
                                    {claim.cause || "Không rõ nguyên nhân"}
                                  </h4>
                                  <p className="text-[10px] font-bold text-slate-500 mt-1 flex items-center gap-1">
                                    👤 {claim.insuredName}
                                  </p>
                                  <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                    🏢 {claim.hospital || "Chưa chọn cơ sở y tế"}
                                  </p>
                                  <p className="text-[9px] text-slate-400 font-mono">💳 Số thẻ: {claim.cardNumber || "N/A"}</p>
                                </div>

                                <div className="text-right flex flex-col justify-between items-end h-full">
                                  <div>
                                    <p className="text-xs font-extrabold text-blue-600">
                                      {claim.amount ? claim.amount.toLocaleString("vi-VN") : "0"}đ
                                    </p>
                                    <p className="text-[9px] text-slate-400 mt-1 font-medium">{claim.date.split(" ")[0]}</p>
                                  </div>

                                  {claim.status === "Nhap" && (
                                    <span className="text-[8px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200/50 px-1.5 py-0.5 rounded-lg mt-3 flex items-center gap-1">
                                      ✏️ Nhấn để tiếp tục
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Interactive alert prompt inside card for supplement action */}
                              {claim.status === "YeuCauBoSung" && (
                                <div className="mt-2.5 pt-2 border-t border-orange-100/50 flex items-center justify-between text-[9px] text-orange-600 font-bold pl-1 animate-pulse">
                                  <span className="flex items-center gap-1">
                                    <AlertCircle size={10} /> Chạm để bổ sung chứng từ ngay
                                  </span>
                                  <ChevronRight size={12} />
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                </motion.div>
              )
              )}

              {/* TAB: ROSTER (CORPORATE MODE ONLY) */}
              {activeTab === "roster" && user?.isCorporate && (
                <motion.div
                  key="corporate-roster-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-grow flex flex-col overflow-hidden"
                >
                  {/* Top Welcome Bar for HR */}
                  <div className="flex justify-between items-center px-5 pt-4 pb-2 shrink-0">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CỔNG DOANH NGHIỆP,</p>
                      <h2 className="text-base font-display font-black text-slate-800 flex items-center gap-1.5 uppercase">
                        Nhân sự & Người phụ thuộc
                      </h2>
                    </div>
                    
                    <button 
                      onClick={handleLogout}
                      title="Đăng xuất"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>

                  <CorporateDashboard 
                    hrName={user.name}
                    companyCode={user.companyCode || "PTI-EB-FPT"}
                    hrAccount={user.hrAccount || "fpt_hr_admin"}
                    claims={claims}
                    showOnlyRoster={true}
                    onCreateOnBehalf={(emp) => {
                      setCorporateEmployeeSelectedForWizard({
                        id: emp.id,
                        name: emp.name,
                        relationship: emp.relationship,
                        cardNumber: emp.cardNumber,
                        bankName: emp.bankName,
                        bankAccount: emp.bankAccount,
                        bankOwner: emp.bankOwner,
                        email: emp.email,
                        isDependent: emp.isDependent
                      });
                      setCurrentWizard(true);
                    }}
                    onSelectClaim={(claim) => setSelectedClaim(claim)}
                  />
                </motion.div>
              )}

              {/* TAB 2: ACCOUNT & CLAIMS TRACKING */}
              {activeTab === "account" && (
                <motion.div
                  key="account-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-grow flex flex-col overflow-y-auto px-5 pt-3 pb-6 space-y-4"
                >
                  {/* Profile Summary Card */}
                  <div className="glass-panel rounded-3xl p-4 border border-white/60 shadow-sm flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-display font-extrabold text-lg shadow-md shadow-blue-500/10">
                      AN
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-slate-800">{user.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">CCCD: {user.cccd}</p>
                      <p className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">Hội viên Vàng PTI</p>
                    </div>
                  </div>

                  {/* Claims List Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lịch sử yêu cầu quyền lợi</h3>
                      <span className="text-[10px] text-slate-400 font-semibold">{claims.length} hồ sơ</span>
                    </div>

                    <div className="space-y-3">
                      {claims.map((claim) => {
                        let statusColor = "";
                        let statusText = "";
                        
                        if (claim.status === "ChoDuyet") {
                          statusColor = "bg-amber-50 text-amber-600 border-amber-100";
                          statusText = "Chờ duyệt";
                        } else if (claim.status === "YeuCauBoSung") {
                          statusColor = "bg-orange-50 text-orange-600 border-orange-100 animate-pulse";
                          statusText = "Yêu cầu bổ sung";
                        } else if (claim.status === "DaDuyet") {
                          statusColor = "bg-green-50 text-green-600 border-green-100";
                          statusText = "Đã chi trả";
                        } else {
                          statusColor = "bg-red-50 text-red-600 border-red-100";
                          statusText = "Từ chối";
                        }

                        return (
                          <div
                            key={claim.id}
                            onClick={() => setSelectedClaim(claim)}
                            className="bg-white/60 hover:bg-white rounded-2xl p-4 border border-slate-100 shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold font-mono text-slate-400">#{claim.id}</span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                                    {statusText}
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-800 font-display mt-1">
                                  {claim.insuredName}
                                </h4>
                                <p className="text-[10px] font-medium text-slate-500 truncate max-w-[220px]">
                                  {claim.hospital}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-xs font-extrabold text-blue-600">
                                  {claim.amount.toLocaleString("vi-VN")}đ
                                </p>
                                <p className="text-[9px] text-slate-400 mt-0.5">{claim.date.split(" ")[0]}</p>
                              </div>
                            </div>

                            {/* Extra warning message inside card for quick supplement action */}
                            {claim.status === "YeuCauBoSung" && (
                              <div className="mt-2.5 pt-2 border-t border-orange-100/50 flex items-center justify-between text-[9px] text-orange-600 font-bold">
                                <span className="flex items-center gap-1">
                                  <AlertCircle size={10} /> Ấn để nộp bổ sung ngay
                                </span>
                                <ChevronRight size={12} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* TAB 3: NEWS FEED */}
              {activeTab === "news" && (
                <motion.div
                  key="news-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-grow flex flex-col overflow-y-auto px-5 pt-3 pb-6 space-y-4"
                >
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Tin tức & Đặc quyền PTI</h3>

                  <div className="space-y-4">
                    {news.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedNews(item)}
                        className="bg-white/60 hover:bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer transition-all flex flex-col"
                      >
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                            <span>{item.category}</span>
                            <span className="text-slate-400">{item.date}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 leading-snug font-display">
                            {item.title}
                          </h4>
                          <p className="text-[10px] leading-relaxed text-slate-500 font-medium line-clamp-2">
                            {item.summary}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: NOTIFICATIONS */}
              {activeTab === "notif" && (
                <motion.div
                  key="notif-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-grow flex flex-col overflow-y-auto px-5 pt-3 pb-6 space-y-3"
                >
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hộp thư thông báo</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
                      >
                        Đọc tất cả
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          // Mark as read
                          setNotifications(notifications.map(n => n.id === notif.id ? {...n, read: true} : n));
                          if (notif.claimId) {
                            const foundClaim = claims.find(c => c.id === notif.claimId);
                            if (foundClaim) setSelectedClaim(foundClaim);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                          notif.read 
                            ? "bg-white/40 border-slate-100 text-slate-600" 
                            : "bg-blue-50/20 border-blue-100 text-slate-800 shadow-sm"
                        }`}
                      >
                        {!notif.read && (
                          <div className="absolute top-3.5 left-2 w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <div className="space-y-1 pl-2">
                          <h4 className="text-xs font-bold leading-snug font-display pr-4">
                            {notif.title}
                          </h4>
                          <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                            {notif.content}
                          </p>
                          <span className="block text-[8px] text-slate-400 font-semibold">{notif.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 5: AI VIRTUAL CHATBOT */}
              {activeTab === "chat" && (
                <ChatTab initialUserName={user.name} />
              )}

            </AnimatePresence>
          </div>

          {/* ==========================================
              BOTTOM NAVIGATION BAR (IOS GLASSMORPHIC FOOTER)
          ========================================== */}
          <div className="h-20 bg-white/60 backdrop-blur-md border-t border-slate-100/40 px-3 py-1 flex items-center justify-around z-10 shrink-0">
            {(user.isCorporate ? [
              { id: "home", label: "Cổng HR", icon: Home },
              { id: "roster", label: "Nhân sự", icon: Users },
              { id: "news", label: "Tin tức", icon: Newspaper },
              { id: "chat", label: "Hỗ trợ AI", icon: MessageSquare, highlight: true }
            ] : [
              { id: "home", label: "Trang chủ", icon: Home },
              { id: "account", label: "Tài khoản", icon: UserIcon },
              { id: "news", label: "Tin tức", icon: Newspaper },
              { 
                id: "notif", 
                label: "Thông báo", 
                icon: Bell, 
                badge: unreadCount > 0 ? unreadCount : undefined 
              },
              { id: "chat", label: "Chat với AI", icon: MessageSquare, highlight: true }
            ]).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    // Close detail views
                    setSelectedNews(null);
                    setSelectedClaim(null);
                  }}
                  className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? tab.highlight 
                        ? "text-blue-600 bg-blue-50/50 scale-105" 
                        : "text-blue-600 scale-105" 
                      : tab.highlight
                      ? "text-blue-500 bg-blue-50/20"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Icon size={18} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                  <span className="text-[8px] font-bold mt-1.5 font-display tracking-tight leading-none">
                    {tab.label}
                  </span>
                  
                  {tab.badge && (
                    <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ==========================================
              SUB-VIEWS DETAILS: NEWS MODAL
          ========================================== */}
          <AnimatePresence>
            {selectedNews && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-[#FFFDF9] z-30 flex flex-col overflow-y-auto"
              >
                <div className="relative h-44 shrink-0">
                  <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover brightness-75" />
                  <button 
                    onClick={() => setSelectedNews(null)}
                    className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full backdrop-blur-sm cursor-pointer hover:bg-black/60"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-3 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    <span>{selectedNews.category}</span>
                    <span className="text-slate-400">{selectedNews.date}</span>
                  </div>
                  <h1 className="text-lg font-display font-bold text-slate-800 leading-snug">
                    {selectedNews.title}
                  </h1>
                  <div className="h-0.5 bg-slate-100" />
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {selectedNews.content}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ==========================================
                SUB-VIEWS DETAILS: CLAIM SPECIFIC DRAWER
            ========================================== */}
            {selectedClaim && (
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="absolute inset-x-0 bottom-0 top-11 bg-white/95 backdrop-blur-lg rounded-t-[36px] border-t border-slate-200/50 shadow-[0_-15px_40px_rgba(0,0,0,0.1)] z-30 flex flex-col"
              >
                {/* Drag Handle Bar */}
                <div className="h-6 w-full flex justify-center items-center shrink-0">
                  <div className="w-12 h-1 bg-slate-200 rounded-full" />
                </div>

                <div className="px-5 pb-3 flex justify-between items-center border-b border-slate-50 shrink-0">
                  <h3 className="font-display font-extrabold text-sm text-slate-800">Chi Tiết Hồ Sơ Bồi Thường</h3>
                  <button 
                    onClick={() => {
                      setSelectedClaim(null);
                      setAddedDocs([]);
                    }}
                    className="p-1.5 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-5 space-y-4">
                  {/* Status header card */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Mã yêu cầu</p>
                      <h4 className="font-mono font-bold text-slate-700 text-sm">#{selectedClaim.id}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái hồ sơ</p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md inline-block ${
                        selectedClaim.status === "ChoDuyet" ? "bg-amber-100 text-amber-700 font-bold" :
                        selectedClaim.status === "YeuCauBoSung" ? "bg-orange-100 text-orange-700 font-bold animate-pulse" :
                        selectedClaim.status === "DaDuyet" ? "bg-green-100 text-green-700 font-bold" :
                        selectedClaim.status === "Nhap" ? "bg-slate-100 text-slate-700 font-bold" :
                        "bg-red-100 text-red-700 font-bold"
                      }`}>
                        {selectedClaim.status === "ChoDuyet" ? "Chờ duyệt" :
                         selectedClaim.status === "YeuCauBoSung" ? "Yêu cầu bổ sung" :
                         selectedClaim.status === "DaDuyet" ? "Đã chi trả" : 
                         selectedClaim.status === "Nhap" ? "Bản nháp" : "Từ chối"}
                      </span>
                    </div>
                  </div>

                  {/* Supplemental Documents instruction box */}
                  {selectedClaim.status === "YeuCauBoSung" && (
                    <div className="bg-orange-50 border border-orange-200/50 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-orange-700 flex items-center gap-1.5">
                        <AlertCircle size={15} /> THÔNG BÁO BỔ SUNG CHỨNG TỪ HỎA TỐC
                      </h4>
                      <p className="text-[10px] leading-relaxed text-orange-800 font-medium">
                        {selectedClaim.supplementNotes || "Ban giám định cần bổ sung chứng từ y tế/thanh toán để tiếp tục quy trình chi trả."}
                      </p>

                      <div className="pt-2 border-t border-orange-100 space-y-3">
                        <span className="block text-[10px] font-bold text-orange-700">TẢI LÊN CHỨNG TỪ BỔ SUNG:</span>
                        
                        <div 
                          onClick={triggerSupplementUpload}
                          className="border border-dashed border-orange-300 bg-white hover:bg-orange-50/30 rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1"
                        >
                          {supplementingDocType ? (
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-orange-700">Đang tải lên ({supplementingProgress}%)</span>
                              <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500" style={{width: `${supplementingProgress}%`}} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <PlusCircle size={18} className="text-orange-500" />
                              <span className="text-[9px] font-bold text-slate-600">Ấn để chụp hoặc đính kèm Giấy tờ bổ sung</span>
                            </>
                          )}
                        </div>

                        {/* List added supplemental docs */}
                        {addedDocs.length > 0 && (
                          <div className="space-y-1">
                            {addedDocs.map((doc, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-white/80 rounded-xl px-2.5 py-1.5 text-[9px] border border-orange-200/40">
                                <span className="font-semibold text-slate-700 truncate max-w-[180px]">{doc.name}</span>
                                <button 
                                  onClick={() => setAddedDocs([])}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  Xóa
                                </button>
                              </div>
                            ))}
                            
                            <button
                              onClick={() => handleApplySupplementAndSubmit(selectedClaim.id)}
                              className="w-full glass-btn-blue font-bold text-[10px] py-2.5 rounded-xl mt-1 cursor-pointer"
                            >
                              Nộp chứng từ bổ sung hỏa tốc
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payout approved visual confirmation */}
                  {selectedClaim.status === "DaDuyet" && (
                    <div className="bg-green-50 border border-green-200/50 rounded-2xl p-4 text-center space-y-2">
                      <div className="w-9 h-9 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={18} />
                      </div>
                      <h4 className="text-xs font-bold text-green-700">ĐÃ HOÀN TẤT CHI TRẢ</h4>
                      <p className="text-[10px] leading-relaxed text-green-800 font-medium">
                        Quyết định duyệt chi trả số tiền <strong className="font-extrabold">{selectedClaim.amount.toLocaleString("vi-VN")} VNĐ</strong> đã được ngân hàng đối tác thực hiện hỏa tốc. Vui lòng kiểm tra tài khoản hoặc sao kê Email.
                      </p>
                    </div>
                  )}

                  {/* Draft claim call to action */}
                  {selectedClaim.status === "Nhap" && (
                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-center space-y-3">
                      <div className="w-9 h-9 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto">
                        <FileText size={18} />
                      </div>
                      <h4 className="text-xs font-display font-extrabold text-slate-700">HỒ SƠ ĐANG LÀ BẢN NHÁP</h4>
                      <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                        Bạn chưa nộp hồ sơ yêu cầu bồi thường này. Nhấn nút dưới đây để tiếp tục khai báo và hoàn thành thủ tục bồi thường trực tuyến hỏa tốc.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedClaim(null);
                          setCurrentWizard(true);
                        }}
                        className="w-full glass-btn-blue text-white font-extrabold text-[10px] py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        Tiếp tục nộp hồ sơ này 🚀
                      </button>
                    </div>
                  )}

                  {/* Core details list */}
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400 font-semibold">Người được bảo hiểm:</span>
                      <span className="font-bold text-slate-700">{selectedClaim.insuredName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400 font-semibold">Cơ sở điều trị:</span>
                      <span className="font-bold text-slate-700 text-right max-w-[180px]">{selectedClaim.hospital}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400 font-semibold">Lý do khám / Chẩn đoán:</span>
                      <span className="font-bold text-slate-700 text-right max-w-[180px]">{selectedClaim.cause}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400 font-semibold">Hình thức điều trị:</span>
                      <span className="font-bold text-slate-700">
                        {selectedClaim.treatmentType === "NoiTru" ? "Nội trú" :
                         selectedClaim.treatmentType === "NgoaiTru" ? "Ngoại trú" : "Nha khoa"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400 font-semibold">Tổng tiền yêu cầu:</span>
                      <span className="font-extrabold text-blue-600 text-sm">
                        {selectedClaim.amount.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400 font-semibold">Nhận tiền bồi thường qua:</span>
                      <span className="font-bold text-slate-700">
                        {selectedClaim.receiveMethod === "ChuyenKhoan" ? "Chuyển khoản NH" : "Tiền mặt bưu cục"}
                      </span>
                    </div>
                    
                    {selectedClaim.receiveMethod === "ChuyenKhoan" && selectedClaim.bankAccount && (
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-[10px] space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Ngân hàng:</span>
                          <span className="font-bold text-slate-700">{selectedClaim.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Số tài khoản:</span>
                          <span className="font-bold text-slate-700 font-mono">{selectedClaim.bankAccount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Chủ tài khoản:</span>
                          <span className="font-bold text-slate-700 font-mono">{selectedClaim.bankOwner}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Documents section */}
                  <div className="space-y-2.5 pt-2">
                    <span className="block text-xs font-bold text-slate-700">Chứng từ đính kèm ({selectedClaim.medicalDocs.length + selectedClaim.paymentDocs.length} files)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Chứng từ Y tế</span>
                        <p className="text-xs font-bold text-blue-600">{selectedClaim.medicalDocs.length} tài liệu</p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Chứng từ thanh toán</span>
                        <p className="text-xs font-bold text-blue-600">{selectedClaim.paymentDocs.length} hóa đơn</p>
                      </div>
                    </div>
                  </div>

                  {/* PTI ADMIN SIMULATOR TOOLBOX - ONLY DISPLAYED FOR EXPERIMENTAL DEMO WORK */}
                  <div className="mt-6 pt-4 border-t border-dashed border-slate-200 space-y-3">
                    <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full inline-block">
                      <Settings size={12} className="text-slate-500 animate-spin" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Trình mô phỏng kiểm duyệt (PTI Admin)</span>
                    </div>
                    <p className="text-[9px] leading-relaxed text-slate-400 font-medium">
                      Nhấp vào một trong các nút dưới đây để giả lập phản hồi của Ban giám định bảo hiểm PTI đối với hồ sơ bồi thường này:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSimulateClaimStatus(selectedClaim.id, "ChoDuyet")}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          selectedClaim.status === "ChoDuyet" ? "bg-amber-100 border-amber-300 text-amber-800" : "bg-white hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        Đặt về: Chờ Duyệt
                      </button>
                      <button
                        onClick={() => handleSimulateClaimStatus(selectedClaim.id, "YeuCauBoSung")}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          selectedClaim.status === "YeuCauBoSung" ? "bg-orange-100 border-orange-300 text-orange-800" : "bg-white hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        Báo lỗi: Thiếu giấy tờ
                      </button>
                      <button
                        onClick={() => handleSimulateClaimStatus(selectedClaim.id, "DaDuyet")}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          selectedClaim.status === "DaDuyet" ? "bg-green-100 border-green-300 text-green-800" : "bg-white hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        Duyệt: Hoàn tất chi trả
                      </button>
                      <button
                        onClick={() => handleSimulateClaimStatus(selectedClaim.id, "TuChoi")}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          selectedClaim.status === "TuChoi" ? "bg-red-100 border-red-300 text-red-800" : "bg-white hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        Từ chối chi trả
                      </button>
                      <button
                        onClick={() => handleSimulateClaimStatus(selectedClaim.id, "Nhap")}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer col-span-2 ${
                          selectedClaim.status === "Nhap" ? "bg-slate-100 border-slate-300 text-slate-700" : "bg-white hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        Đặt về: Bản nháp (Nháp)
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </PhoneFrame>
  );
}
