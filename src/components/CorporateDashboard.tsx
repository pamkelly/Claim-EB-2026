import React, { useState } from "react";
import { 
  Building2, Users, Receipt, Clock, AlertTriangle, FileUp, 
  ArrowRight, Search, Check, AlertCircle, Sparkles, FileText, 
  HelpCircle, ShieldCheck, Mail, Send, CheckCircle2,
  Calendar, BarChart3, PlusCircle, X, ChevronRight, Download, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ClaimRequest } from "../types";

// Roster matching matrix level 1 structure
export interface EmployeeInsured {
  id: string;
  name: string;
  relationship: string;
  cardNumber: string;
  status: "ConHieuLuc" | "HetHan";
  isDependent: boolean;
  dependentOf?: string;
  email: string;
  bankName: string;
  bankAccount: string;
  bankOwner: string;
  employeeCode: string; // Mã nhân viên để tìm kiếm
  remainingNoiTruLimit?: number;
  totalNoiTruLimit?: number;
  remainingNgoaiTruLimit?: number;
  totalNgoaiTruLimit?: number;
  remainingPhauThuatLimit?: number;
  totalPhauThuatLimit?: number;
}

const SAMPLE_ROSTER: EmployeeInsured[] = [
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

interface CorporateDashboardProps {
  hrName: string;
  companyCode: string;
  hrAccount: string;
  claims: ClaimRequest[];
  onCreateOnBehalf: (employee: EmployeeInsured) => void;
  onSelectClaim: (claim: ClaimRequest) => void;
  onStartCreateWizardDirectly?: () => void; // Trigger wizard direct from dashboard button
  showOnlyRoster?: boolean;
  hideRoster?: boolean;
  onGoToRosterTab?: () => void;
}

export default function CorporateDashboard({
  hrName,
  companyCode,
  hrAccount,
  claims,
  onCreateOnBehalf,
  onSelectClaim,
  onStartCreateWizardDirectly,
  showOnlyRoster = false,
  hideRoster = false,
  onGoToRosterTab
}: CorporateDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rosterTab, setRosterTab] = useState<"all" | "primary" | "dependent">("all");
  const [claimStatusTab, setClaimStatusTab] = useState<"all" | "ChoDuyet" | "YeuCauBoSung" | "DaDuyet">("all");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDepartment, setReportDepartment] = useState<"all" | "it" | "hr" | "sales">("all");
  const [reportDateRange, setReportDateRange] = useState<"month" | "quarter" | "year">("month");
  const [showSignedNotice, setShowSignedNotice] = useState<string | null>(null);

  // Filter roster
  const filteredRoster = SAMPLE_ROSTER.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (emp.dependentOf && emp.dependentOf.toLowerCase().includes(searchTerm.toLowerCase()));
    if (rosterTab === "all") return matchesSearch;
    if (rosterTab === "primary") return matchesSearch && !emp.isDependent;
    return matchesSearch && emp.isDependent;
  });

  // Calculate statistics from mock business logic - strictly match user requests
  // "6 yêu cầu chờ duyệt và 42,4 tr VND đã chi trả tháng này"
  const pendingCount = 6;
  const totalDisbursedThisMonth = 42400000;

  // Filter historic corporate claims list
  const activeCorpClaims = claims.filter(c => c.cardId.startsWith("emp-") || c.cardNumber.startsWith("PTI-FPT-"));

  // Apply claimStatusTab filter
  const filteredCorpClaims = activeCorpClaims.filter(claim => {
    if (claimStatusTab === "all") return true;
    return claim.status === claimStatusTab;
  });

  const handleSimulateCompanySign = (claimId: string) => {
    setShowSignedNotice(claimId);
    setTimeout(() => {
      setShowSignedNotice(null);
    }, 4000);
  };

  const scrollToRoster = () => {
    const rosterSection = document.getElementById("roster-section");
    if (rosterSection) {
      rosterSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (showOnlyRoster) {
    return (
      <div className="flex-grow flex flex-col overflow-y-auto px-5 pt-3 pb-6 space-y-4">
        {/* Roster Employee Listing */}
        <div id="roster-section" className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} className="text-blue-500" /> Danh sách nhân sự & Người phụ thuộc
            </h3>
            <span className="text-[9px] font-bold text-slate-400">LỚP 1 - MA TRẬN 1</span>
          </div>

          {/* Sync Auto Banner */}
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center justify-between text-blue-900 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-blue-600" />
              <span className="text-[10px] font-bold">Liên kết dữ liệu định danh đồng bộ tự động</span>
            </div>
            <span className="text-[9px] font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase">Active</span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
              placeholder="Tìm theo tên, mã nhân viên (ví dụ: FPT-00812)..."
            />
          </div>

          {/* Segmented Controls for Roster view */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setRosterTab("all")}
              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                rosterTab === "all" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              }`}
            >
              Tất cả ({SAMPLE_ROSTER.length})
            </button>
            <button
              onClick={() => setRosterTab("primary")}
              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                rosterTab === "primary" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              }`}
            >
              Chính ({SAMPLE_ROSTER.filter(r => !r.isDependent).length})
            </button>
            <button
              onClick={() => setRosterTab("dependent")}
              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                rosterTab === "dependent" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              }`}
            >
              Phụ thuộc ({SAMPLE_ROSTER.filter(r => r.isDependent).length})
            </button>
          </div>

          {/* Roster list */}
          <div className="space-y-3 pt-1 overflow-y-auto max-h-[550px] pr-1">
            {filteredRoster.map(emp => {
              const isExpired = emp.status === "HetHan";
              return (
                <div 
                  key={emp.id}
                  className={`bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm relative transition-all ${
                    isExpired ? "opacity-60 bg-slate-50/50" : "hover:border-blue-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
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
                        {emp.isDependent && (
                          <span className="text-[9px] text-slate-400 font-semibold">
                            Phụ thuộc: <strong className="text-slate-600">{emp.dependentOf}</strong>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-slate-800 tracking-tight pt-1">
                        {emp.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-500">Mã thẻ: {emp.cardNumber}</p>
                    </div>

                    {isExpired ? (
                      <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                        Hết hiệu lực
                      </span>
                    ) : (
                      <button
                        onClick={() => onCreateOnBehalf(emp)}
                        className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-[10px] font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Tạo hộ</span>
                        <ArrowRight size={11} className="stroke-[2.5]" />
                      </button>
                    )}
                  </div>

                  {/* Subinfo bank auto details info */}
                  <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-slate-400 font-semibold">
                    <div>Ngân hàng thụ hưởng: <span className="text-slate-600 font-bold">{emp.bankName}</span></div>
                    <div>Chủ TK nhận tiền: <span className="text-slate-600 font-bold">{emp.bankOwner}</span></div>
                  </div>

                  {/* Hạn mức quyền lợi còn lại */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Hạn mức quyền lợi còn lại (PTI Care):</p>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Nội trú */}
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/50 space-y-1">
                        <div className="flex justify-between text-[8px] font-bold text-slate-500">
                          <span>Nội trú</span>
                          <span className="font-mono text-slate-800">
                            {emp.remainingNoiTruLimit !== undefined ? (emp.remainingNoiTruLimit / 1000000).toFixed(1) : "-"}M
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${emp.remainingNoiTruLimit && emp.totalNoiTruLimit ? (emp.remainingNoiTruLimit / emp.totalNoiTruLimit) * 100 : 0}%` }} 
                          />
                        </div>
                        <p className="text-[7px] text-slate-400 font-bold text-right font-mono">
                          / {emp.totalNoiTruLimit !== undefined ? (emp.totalNoiTruLimit / 1000000).toFixed(0) : "-"}M đ
                        </p>
                      </div>

                      {/* Ngoại trú */}
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/50 space-y-1">
                        <div className="flex justify-between text-[8px] font-bold text-slate-500">
                          <span>Ngoại trú</span>
                          <span className="font-mono text-slate-800">
                            {emp.remainingNgoaiTruLimit !== undefined ? (emp.remainingNgoaiTruLimit / 1000000).toFixed(1) : "-"}M
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${emp.remainingNgoaiTruLimit && emp.totalNgoaiTruLimit ? (emp.remainingNgoaiTruLimit / emp.totalNgoaiTruLimit) * 100 : 0}%` }} 
                          />
                        </div>
                        <p className="text-[7px] text-slate-400 font-bold text-right font-mono">
                          / {emp.totalNgoaiTruLimit !== undefined ? (emp.totalNgoaiTruLimit / 1000000).toFixed(0) : "-"}M đ
                        </p>
                      </div>

                      {/* Phẫu thuật */}
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/50 space-y-1">
                        <div className="flex justify-between text-[8px] font-bold text-slate-500">
                          <span>Phẫu thuật</span>
                          <span className="font-mono text-slate-800">
                            {emp.remainingPhauThuatLimit !== undefined ? (emp.remainingPhauThuatLimit / 1000000).toFixed(1) : "-"}M
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${emp.remainingPhauThuatLimit && emp.totalPhauThuatLimit ? (emp.remainingPhauThuatLimit / emp.totalPhauThuatLimit) * 100 : 0}%` }} 
                          />
                        </div>
                        <p className="text-[7px] text-slate-400 font-bold text-right font-mono">
                          / {emp.totalPhauThuatLimit !== undefined ? (emp.totalPhauThuatLimit / 1000000).toFixed(0) : "-"}M đ
                        </p>
                      </div>
                    </div>
                  </div>

                  {emp.isDependent && (
                    <div className="mt-2 bg-amber-50/60 p-2 rounded-lg text-[9px] text-amber-800 font-bold border border-amber-100 flex items-center gap-1.5">
                      <FileUp size={11} className="shrink-0 text-amber-600" />
                      <span>Yêu cầu đính kèm giấy ủy quyền bồi thường khi nộp hộ.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col overflow-y-auto px-5 pt-3 pb-6 space-y-5">
      
      {/* 1. Header Banner & Identity - EB Group Insurance Information (Apple iOS Glass Style) */}
      <div className="glass-card-blue rounded-3xl p-5 relative overflow-hidden shadow-[0_12px_40px_rgba(2,132,199,0.18)] border border-white/25">
        {/* Glossy reflection & lighting */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative space-y-4">
          {/* Badge & Top Icon */}
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/10 shadow-sm">
              HỢP ĐỒNG BẢO HIỂM NHÓM EB
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
              <Building2 size={16} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
            </div>
          </div>

          {/* Redesigned Info Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
            {/* Tên công ty */}
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-blue-100/70 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-sky-300" /> Tên công ty
              </span>
              <h2 className="text-sm font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                FPT Software
              </h2>
            </div>

            {/* Mã số hợp đồng */}
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-blue-100/70 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-sky-300" /> Mã số hợp đồng
              </span>
              <p className="text-[11px] font-mono font-black text-white tracking-wide bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/15 w-fit">
                PTI-EB-FPT-2026
              </p>
            </div>

            {/* Frosty horizontal separator */}
            <div className="col-span-2 border-t border-white/15 my-1" />

            {/* Số lượng nhân viên */}
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-blue-100/70 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-sky-300" /> Số lượng nhân viên
              </span>
              <p className="text-xs font-black text-white flex items-center gap-1.5">
                <Users size={13} className="text-sky-200" />
                <span>1,240 nhân viên</span>
              </p>
            </div>

            {/* Ngày hiệu lực */}
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-blue-100/70 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-sky-300" /> Ngày hiệu lực
              </span>
              <p className="text-xs font-black text-white flex items-center gap-1.5 font-mono">
                <Calendar size={13} className="text-sky-200" />
                <span>01/01/2026 - 31/12/2026</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Statistics Bento Grid - Exact "6 chờ duyệt, 42.4 tr chi trả tháng này" */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white/90 rounded-2.5xl p-4.5 border border-slate-100 shadow-sm space-y-2 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Yêu cầu chờ duyệt</span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
              <Clock size={13} className="animate-pulse" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-display font-black text-slate-800">{pendingCount} yêu cầu</h3>
            <p className="text-[9px] text-amber-600 font-bold">Cần HR ký xác nhận</p>
          </div>
        </div>

        <div className="bg-white/90 rounded-2.5xl p-4.5 border border-slate-100 shadow-sm space-y-2 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Đã chi trả tháng này</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Receipt size={13} />
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-display font-black text-slate-800">
              {(totalDisbursedThisMonth / 1000000).toLocaleString("vi-VN")} tr VND
            </h3>
            <p className="text-[9px] text-emerald-600 font-bold">{(totalDisbursedThisMonth).toLocaleString("vi-VN")} đ</p>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Buttons - 3 buttons below stats: "Tạo hộ yêu cầu", "Danh sách nhân viên", "Báo cáo Claim" */}
      <div className="space-y-2.5">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-1">Thao tác nhanh HR</p>
        <div className="grid grid-cols-3 gap-2.5">
          {/* Action 1: Tạo hộ yêu cầu */}
          <button
            onClick={onStartCreateWizardDirectly || scrollToRoster}
            className="bg-gradient-to-br from-blue-600 to-sky-500 text-white rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all gap-1.5 cursor-pointer border border-blue-400/20"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <PlusCircle size={16} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-extrabold leading-tight">Tạo hộ<br />yêu cầu</span>
          </button>

          {/* Action 2: Danh sách nhân viên */}
          <button
            onClick={onGoToRosterTab || scrollToRoster}
            className="bg-white hover:bg-slate-50 text-slate-700 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 hover:border-slate-200 active:scale-95 transition-all gap-1.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={16} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-extrabold leading-tight">Danh sách<br />nhân viên</span>
          </button>

          {/* Action 3: Báo cáo Claim */}
          <button
            onClick={() => setShowReportModal(true)}
            className="bg-white hover:bg-slate-50 text-slate-700 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 hover:border-slate-200 active:scale-95 transition-all gap-1.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <BarChart3 size={16} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-extrabold leading-tight">Báo cáo<br />Claim EB</span>
          </button>
        </div>
      </div>

      {/* Role-Based Disclaimer Panel */}
      <div className="bg-red-50/80 border border-red-200/50 p-4 rounded-2.5xl flex gap-3 text-red-900 shadow-sm">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-600" />
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-800">
            QUY ĐỊNH PHÂN QUYỀN MÔ HÌNH DOANH NGHIỆP
          </p>
          <ul className="text-[10px] space-y-1 text-slate-600 font-semibold list-disc pl-4 leading-relaxed">
            <li>HR chỉ thực hiện <strong>Tạo, bổ sung hồ sơ và ký xác nhận bảo lãnh</strong> hộ nhân viên.</li>
            <li>HR <strong className="text-red-600 font-black">KHÔNG CÓ QUYỀN nhận tiền chi trả</strong> thay cho nhân sự của công ty.</li>
            <li>Tiền bồi thường luôn được PTI chi trả <strong>trực tiếp về tài khoản người được bảo hiểm / người giám hộ đã đăng ký</strong>.</li>
          </ul>
        </div>
      </div>

      {/* 4. Roster Employee Listing */}
      {!hideRoster && (
        <div id="roster-section" className="space-y-3 scroll-mt-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} className="text-blue-500" /> Danh sách nhân sự & Người phụ thuộc
            </h3>
            <span className="text-[9px] font-bold text-slate-400">LỚP 1 - MA TRẬN 1</span>
          </div>

          {/* Sync Auto Banner */}
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center justify-between text-blue-900 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-blue-600" />
              <span className="text-[10px] font-bold">Liên kết dữ liệu định danh đồng bộ tự động</span>
            </div>
            <span className="text-[9px] font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase">Active</span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
              placeholder="Tìm theo tên, mã nhân viên (ví dụ: FPT-00812)..."
            />
          </div>

          {/* Segmented Controls for Roster view */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setRosterTab("all")}
              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                rosterTab === "all" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              }`}
            >
              Tất cả ({SAMPLE_ROSTER.length})
            </button>
            <button
              onClick={() => setRosterTab("primary")}
              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                rosterTab === "primary" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              }`}
            >
              Chính ({SAMPLE_ROSTER.filter(r => !r.isDependent).length})
            </button>
            <button
              onClick={() => setRosterTab("dependent")}
              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                rosterTab === "dependent" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              }`}
            >
              Phụ thuộc ({SAMPLE_ROSTER.filter(r => r.isDependent).length})
            </button>
          </div>

          {/* Roster list */}
          <div className="space-y-3 pt-1">
            {filteredRoster.map(emp => {
              const isExpired = emp.status === "HetHan";
              return (
                <div 
                  key={emp.id}
                  className={`bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm relative transition-all ${
                    isExpired ? "opacity-60 bg-slate-50/50" : "hover:border-blue-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
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
                        {emp.isDependent && (
                          <span className="text-[9px] text-slate-400 font-semibold">
                            Phụ thuộc: <strong className="text-slate-600">{emp.dependentOf}</strong>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-slate-800 tracking-tight pt-1">
                        {emp.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-500">Mã thẻ: {emp.cardNumber}</p>
                    </div>

                    {isExpired ? (
                      <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                        Hết hiệu lực
                      </span>
                    ) : (
                      <button
                        onClick={() => onCreateOnBehalf(emp)}
                        className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-[10px] font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Tạo hộ</span>
                        <ArrowRight size={11} className="stroke-[2.5]" />
                      </button>
                    )}
                  </div>

                  {/* Subinfo bank auto details info */}
                  <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-slate-400 font-semibold">
                    <div>Ngân hàng thụ hưởng: <span className="text-slate-600 font-bold">{emp.bankName}</span></div>
                    <div>Chủ TK nhận tiền: <span className="text-slate-600 font-bold">{emp.bankOwner}</span></div>
                  </div>

                  {/* Hạn mức quyền lợi còn lại */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Hạn mức quyền lợi còn lại (PTI Care):</p>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Nội trú */}
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/50 space-y-1">
                        <div className="flex justify-between text-[8px] font-bold text-slate-500">
                          <span>Nội trú</span>
                          <span className="font-mono text-slate-800">
                            {emp.remainingNoiTruLimit !== undefined ? (emp.remainingNoiTruLimit / 1000000).toFixed(1) : "-"}M
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${emp.remainingNoiTruLimit && emp.totalNoiTruLimit ? (emp.remainingNoiTruLimit / emp.totalNoiTruLimit) * 100 : 0}%` }} 
                          />
                        </div>
                        <p className="text-[7px] text-slate-400 font-bold text-right font-mono">
                          / {emp.totalNoiTruLimit !== undefined ? (emp.totalNoiTruLimit / 1000000).toFixed(0) : "-"}M đ
                        </p>
                      </div>

                      {/* Ngoại trú */}
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/50 space-y-1">
                        <div className="flex justify-between text-[8px] font-bold text-slate-500">
                          <span>Ngoại trú</span>
                          <span className="font-mono text-slate-800">
                            {emp.remainingNgoaiTruLimit !== undefined ? (emp.remainingNgoaiTruLimit / 1000000).toFixed(1) : "-"}M
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${emp.remainingNgoaiTruLimit && emp.totalNgoaiTruLimit ? (emp.remainingNgoaiTruLimit / emp.totalNgoaiTruLimit) * 100 : 0}%` }} 
                          />
                        </div>
                        <p className="text-[7px] text-slate-400 font-bold text-right font-mono">
                          / {emp.totalNgoaiTruLimit !== undefined ? (emp.totalNgoaiTruLimit / 1000000).toFixed(0) : "-"}M đ
                        </p>
                      </div>

                      {/* Phẫu thuật */}
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/50 space-y-1">
                        <div className="flex justify-between text-[8px] font-bold text-slate-500">
                          <span>Phẫu thuật</span>
                          <span className="font-mono text-slate-800">
                            {emp.remainingPhauThuatLimit !== undefined ? (emp.remainingPhauThuatLimit / 1000000).toFixed(1) : "-"}M
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${emp.remainingPhauThuatLimit && emp.totalPhauThuatLimit ? (emp.remainingPhauThuatLimit / emp.totalPhauThuatLimit) * 100 : 0}%` }} 
                          />
                        </div>
                        <p className="text-[7px] text-slate-400 font-bold text-right font-mono">
                          / {emp.totalPhauThuatLimit !== undefined ? (emp.totalPhauThuatLimit / 1000000).toFixed(0) : "-"}M đ
                        </p>
                      </div>
                    </div>
                  </div>

                  {emp.isDependent && (
                    <div className="mt-2 bg-amber-50/60 p-2 rounded-lg text-[9px] text-amber-800 font-bold border border-amber-100 flex items-center gap-1.5">
                      <FileUp size={11} className="shrink-0 text-amber-600" />
                      <span>Yêu cầu đính kèm giấy ủy quyền bồi thường khi nộp hộ.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. HR Historic Submissions & Confirmations */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={14} className="text-blue-500" /> Danh sách Yêu cầu bồi thường
          </h3>
          <span className="text-[9px] font-bold text-slate-400">({filteredCorpClaims.length} hồ sơ)</span>
        </div>

        {/* Claim Status Filtering Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setClaimStatusTab("all")}
            className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
              claimStatusTab === "all" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setClaimStatusTab("ChoDuyet")}
            className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
              claimStatusTab === "ChoDuyet" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Chờ xác nhận
          </button>
          <button
            onClick={() => setClaimStatusTab("YeuCauBoSung")}
            className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
              claimStatusTab === "YeuCauBoSung" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Bổ sung hồ sơ
          </button>
          <button
            onClick={() => setClaimStatusTab("DaDuyet")}
            className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
              claimStatusTab === "DaDuyet" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Đã chi trả
          </button>
        </div>

        {filteredCorpClaims.length === 0 ? (
          <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 font-semibold">
            Không tìm thấy hồ sơ nào ở trạng thái này.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCorpClaims.map(claim => {
              return (
                <div 
                  key={claim.id}
                  className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {claim.id}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">{claim.date}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800">
                        Nội dung: {claim.insuredName}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">Điều trị tại: {claim.hospital} • {claim.cause}</p>
                    </div>

                    <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full ${
                      claim.status === "DaDuyet"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                        : claim.status === "YeuCauBoSung"
                        ? "bg-amber-50 text-amber-600 border border-amber-200/50 animate-pulse"
                        : "bg-blue-50 text-blue-600 border border-blue-200/50"
                    }`}>
                      {claim.status === "DaDuyet" ? "Đã duyệt chi" : claim.status === "YeuCauBoSung" ? "Cần bổ sung" : "Đang thẩm định"}
                    </span>
                  </div>

                  {/* Actions Bar for HR */}
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center gap-2">
                    <div className="text-[10px] font-black text-slate-700">
                      Số tiền: <span className="text-blue-600">{claim.amount.toLocaleString("vi-VN")} đ</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectClaim(claim)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[10px] text-slate-600 font-bold transition-all border border-slate-100 cursor-pointer"
                      >
                        Chi tiết
                      </button>

                      {claim.status === "ChoDuyet" && (
                        <button
                          onClick={() => handleSimulateCompanySign(claim.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[10px] text-emerald-700 font-black transition-all border border-emerald-100 flex items-center gap-1 cursor-pointer"
                        >
                          <Send size={10} />
                          <span>Ký bảo lãnh HR</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {showSignedNotice === claim.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="bg-emerald-500 text-white rounded-xl p-2.5 text-[9px] leading-normal font-bold flex items-start gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 size={13} className="shrink-0 mt-0.5" />
                        <div>
                          <p>Đã Ký Xác Nhận Bảo Lãnh EB thành công!</p>
                          <p className="opacity-90 font-medium">Bản xác nhận điện tử đóng mộc số FPT Software đã được gửi tự động tới cổng PTI CARE & thông báo SMS đã được kích hoạt tới máy nhân viên.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Claim Report Modal popup (Báo cáo Claim EB) */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 150 }}
              className="bg-white rounded-t-3xl rounded-b-xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white px-5 py-4 border-b border-slate-100 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Báo cáo Claim bảo hiểm EB</h3>
                    <p className="text-[9px] font-bold text-slate-400 font-mono">PTI-EB-FPT-2026 • Tháng này</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Content */}
              {(() => {
                // Dynamic calculations based on department and dateRange
                let baseAmount = 42400000;
                let approvalRate = "96.8%";
                let ngoaiTruPercent = 68;
                let noiTruPercent = 24;
                let taiNanPercent = 8;
                let labelPeriod = "Tháng 07/2026";
                let labelDept = "Toàn bộ Công ty";

                // Period multiplier
                let mult = 1.0;
                if (reportDateRange === "quarter") {
                  mult = 3.03;
                  labelPeriod = "Quý 3/2026 (Lũy kế)";
                } else if (reportDateRange === "year") {
                  mult = 12.08;
                  labelPeriod = "Cả năm 2026 (Lũy kế)";
                }

                // Department filter offsets
                if (reportDepartment === "it") {
                  baseAmount = Math.round(baseAmount * 0.68 * mult);
                  approvalRate = "97.2%";
                  ngoaiTruPercent = 75;
                  noiTruPercent = 18;
                  taiNanPercent = 7;
                  labelDept = "Phòng Công nghệ (IT/R&D)";
                } else if (reportDepartment === "hr") {
                  baseAmount = Math.round(baseAmount * 0.08 * mult);
                  approvalRate = "100%";
                  ngoaiTruPercent = 55;
                  noiTruPercent = 40;
                  taiNanPercent = 5;
                  labelDept = "Phòng Hành chính - Nhân sự";
                } else if (reportDepartment === "sales") {
                  baseAmount = Math.round(baseAmount * 0.24 * mult);
                  approvalRate = "94.5%";
                  ngoaiTruPercent = 62;
                  noiTruPercent = 30;
                  taiNanPercent = 8;
                  labelDept = "Phòng Kinh doanh / Marketing";
                } else {
                  baseAmount = Math.round(baseAmount * mult);
                  labelDept = "Toàn bộ Công ty";
                }

                const ngoaiTruVal = Math.round(baseAmount * (ngoaiTruPercent / 100));
                const noiTruVal = Math.round(baseAmount * (noiTruPercent / 100));
                const taiNanVal = Math.round(baseAmount * (taiNanPercent / 100));

                return (
                  <div className="p-5 space-y-4">
                    {/* Bộ lọc báo cáo EB linh hoạt */}
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2.5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Filter size={11} className="text-blue-500" /> Bộ lọc báo cáo linh hoạt
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {/* Khoảng thời gian */}
                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wide">Khoảng thời gian</label>
                          <select 
                            value={reportDateRange} 
                            onChange={(e: any) => setReportDateRange(e.target.value)}
                            className="w-full text-[10px] font-bold bg-white text-slate-700 p-2 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                          >
                            <option value="month">Tháng này (T7/2026)</option>
                            <option value="quarter">Quý này (Q3/2026)</option>
                            <option value="year">Toàn bộ năm 2026</option>
                          </select>
                        </div>

                        {/* Phòng ban / Bộ phận */}
                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wide">Phòng ban</label>
                          <select 
                            value={reportDepartment} 
                            onChange={(e: any) => setReportDepartment(e.target.value)}
                            className="w-full text-[10px] font-bold bg-white text-slate-700 p-2 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                          >
                            <option value="all">Tất cả phòng ban</option>
                            <option value="it">Phòng Công nghệ (IT/R&D)</option>
                            <option value="hr">Phòng Hành chính - Nhân sự</option>
                            <option value="sales">Phòng Kinh doanh / Marketing</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Visual stats summary */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-4.5 rounded-2xl relative overflow-hidden shadow-inner border border-slate-800">
                      <div className="relative z-10 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-bold tracking-wider uppercase bg-emerald-500 text-white px-2 py-0.5 rounded-full">Thống kê tổng quan</span>
                          <span className="text-[8px] text-slate-400 font-mono font-bold">{labelDept} • {labelPeriod}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Tổng bồi thường đã duyệt</p>
                            <p className="text-lg font-display font-black text-emerald-400">{baseAmount.toLocaleString("vi-VN")} đ</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Tỷ lệ duyệt hồ sơ</p>
                            <p className="text-lg font-display font-black text-blue-400">{approvalRate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute right-0 bottom-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mb-6" />
                    </div>

                    {/* mini charts / bars representation */}
                    <div className="space-y-3.5 pt-1">
                      <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Tỷ lệ sử dụng theo loại hình điều trị</h4>
                      
                      <div className="space-y-2.5">
                        {/* Ngoại trú */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-600">Ngoại trú (Khám bệnh, thuốc)</span>
                            <span className="text-slate-800 font-mono">{ngoaiTruPercent}% ({(ngoaiTruVal / 1000000).toFixed(1)} tr đ)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${ngoaiTruPercent}%` }} />
                          </div>
                        </div>

                        {/* Nội trú */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-600">Nội trú & Phẫu thuật</span>
                            <span className="text-slate-800 font-mono">{noiTruPercent}% ({(noiTruVal / 1000000).toFixed(1)} tr đ)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${noiTruPercent}%` }} />
                          </div>
                        </div>

                        {/* Tai nạn */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-600">Tai nạn & khác</span>
                            <span className="text-slate-800 font-mono">{taiNanPercent}% ({(taiNanVal / 1000000).toFixed(1)} tr đ)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${taiNanPercent}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional list of top medical institutions */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Top bệnh viện được lựa chọn nhiều nhất</h4>
                      <div className="space-y-2 text-[10px]">
                        <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-bold text-slate-700">1. Bệnh viện Đa khoa Quốc tế Thu Cúc</span>
                          <span className="font-mono font-bold text-slate-500">{Math.round(14 * mult)} ca bồi thường</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-bold text-slate-700">2. Bệnh viện Hồng Ngọc</span>
                          <span className="font-mono font-bold text-slate-500">{Math.round(11 * mult)} ca bồi thường</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-bold text-slate-700">3. Bệnh viện Việt Pháp Hà Nội</span>
                          <span className="font-mono font-bold text-slate-500">{Math.round(5 * mult)} ca bồi thường</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer disclaimer inside modal */}
                    <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-2xl text-[9px] text-blue-800 leading-relaxed font-semibold">
                      Mọi số liệu báo cáo được cập nhật thời gian thực dựa trên bộ lọc đã chọn và luồng liên kết API trực tiếp với phòng bồi thường PTI.
                    </div>

                    {/* Export button */}
                    <button
                      onClick={() => alert(`Báo cáo Excel cho bộ phận ${labelDept} (${labelPeriod}) đã được tổng hợp & gửi về email HR admin: hoang.pt@fsoft.com.vn`)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Xuất báo cáo chi tiết (.XLSX)</span>
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
