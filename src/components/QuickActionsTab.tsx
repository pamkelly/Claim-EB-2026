import React, { useState } from "react";
import { 
  CreditCard, Shield, Check, Info, FileText, ArrowRight, ArrowLeft, 
  MapPin, Phone, User, Mail, DollarSign, Wallet, ArrowRightLeft, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InsuranceCard } from "../types";

// ==========================================
// CARD DETAIL MODAL COMPONENT
// ==========================================
interface CardDetailModalProps {
  card: InsuranceCard;
  onClose: () => void;
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-[340px] bg-white rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100"
      >
        <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 text-white text-center">
          <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
            Thẻ Bảo Hiểm Điện Tử
          </span>
          <h3 className="font-display font-bold text-base mt-1.5">{card.name}</h3>
          <p className="text-[10px] opacity-80 font-mono mt-0.5">{card.cardNumber}</p>
        </div>

        <div className="p-5 text-center space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl inline-block border border-slate-100 shadow-inner">
            {/* Mock QR Code representation with canvas lookalike */}
            <div className="w-40 h-40 bg-white p-2.5 rounded-xl flex flex-col justify-between items-center border border-slate-200 mx-auto">
              <div className="w-full flex-grow bg-slate-900 rounded-lg flex flex-col justify-center items-center relative overflow-hidden">
                {/* SVG Mock QR Code */}
                <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M10,10 h25 v25 h-25 z M15,15 h15 v15 h-15 z M10,65 h25 v25 h-25 z M15,70 h15 v15 h-15 z M65,10 h25 v25 h-25 z M70,15 h15 v15 h-15 z" />
                  <path d="M45,10 h10 v10 h-10 z M45,30 h10 v10 h-10 z M10,45 h10 v10 h-10 z M30,45 h20 v10 h-20 z M65,45 h10 v10 h-10 z M80,45 h10 v10 h-10 z" />
                  <path d="M45,65 h10 v10 h-10 z M65,65 h10 v25 h-10 z M80,80 h10 v10 h-10 z M45,80 h10 v10 h-10 z M55,55 h10 v10 h-10 z M55,75 h10 v10 h-10 z" />
                </svg>
                {/* Embedded PTI Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-md p-1 border-2 border-white shadow-md flex items-center justify-center">
                  <Shield size={16} />
                </div>
              </div>
              <span className="text-[8px] font-bold text-slate-400 font-mono tracking-widest mt-1.5">PTI SCAN CARD FOR DIRECT BILLING</span>
            </div>
          </div>

          <div className="text-left space-y-2 text-xs border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Căn cước công dân:</span>
              <span className="font-semibold text-slate-700">{card.idCardNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Quan hệ:</span>
              <span className="font-semibold text-slate-700">{card.relationship}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Thời hạn bảo hiểm:</span>
              <span className="font-semibold text-slate-700">{card.expiryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Tình trạng:</span>
              <span className="font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px]">Đang hiệu lực</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-2.5 rounded-2xl text-xs font-semibold shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Đóng thẻ bảo hiểm
          </button>
        </div>
      </motion.div>
    </div>
  );
}


// ==========================================
// QUICK ACTIONS PORTAL COMPONENT
// ==========================================
interface QuickActionsTabProps {
  actionType: "payment" | "profile";
  onBack: () => void;
  primaryCccd: string;
}

export default function QuickActionsTab({ actionType, onBack, primaryCccd }: QuickActionsTabProps) {
  // PAYMENT STATES
  const [payStep, setPayStep] = useState<"form" | "confirm" | "success">("form");
  const [contractNo, setContractNo] = useState("PTI-CON-9912");
  const [selectedPackage, setSelectedPackage] = useState("gold"); // bronze, silver, gold, diamond
  const [payGateway, setPayGateway] = useState("momo");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // PROFILE STATES
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [fullName, setFullName] = useState("Nguyễn Văn An");
  const [phone, setPhone] = useState("0961234345");
  const [email, setEmail] = useState("htthien20101996@gmail.com");
  const [address, setAddress] = useState("12B Lý Thường Kiệt, Hoàn Kiếm, Hà Nội");
  const [payoutBank, setPayoutBank] = useState("Vietcombank (VCB)");
  const [payoutAccount, setPayoutAccount] = useState("101889922233");

  const PACKAGES = [
    { id: "bronze", name: "PTI Care Phổ Thông", price: 850000, desc: "Hạn mức nội trú 40tr/năm, ngoại trú 4tr/năm" },
    { id: "silver", name: "PTI Care Tiêu Chuẩn", price: 1500000, desc: "Hạn mức nội trú 100tr/năm, ngoại trú 8tr/năm" },
    { id: "gold", name: "PTI Care Vàng (Khuyên dùng)", price: 2800000, desc: "Hạn mức nội trú 250tr/năm, ngoại trú 15tr/năm" },
    { id: "diamond", name: "PTI Care Kim Cương VIP", price: 4500000, desc: "Hạn mức nội trú 500tr/năm, ngoại trú 30tr/năm" }
  ];

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPayStep("confirm");
  };

  const executePayment = () => {
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setPayStep("success");
    }, 1800);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => {
      setProfileSuccess(false);
    }, 3000);
  };

  const activePackage = PACKAGES.find(p => p.id === selectedPackage) || PACKAGES[2];

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden">
      {/* Mini-Header */}
      <div className="bg-white/40 border-b border-slate-100/50 px-5 py-3 flex items-center justify-between z-10">
        <button 
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-slate-100/50 text-slate-500 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-sm font-bold text-slate-800 font-display text-center">
          {actionType === "payment" ? "Đóng phí bảo hiểm" : "Điều chỉnh thông tin"}
        </h3>
        <div className="w-8 h-8" /> {/* Balance */}
      </div>

      <div className="flex-grow overflow-y-auto px-5 py-4">
        {actionType === "payment" ? (
          <AnimatePresence mode="wait">
            
            {/* PAYMENT STEP 1: FORM SELECTION */}
            {payStep === "form" && (
              <motion.div
                key="pay-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-blue-50/50 border border-blue-100/30 p-3.5 rounded-2xl flex gap-3">
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed text-slate-600 font-medium">
                    Nhập mã số hợp đồng/đơn bảo hiểm của bạn để nộp phí gia hạn hoặc thanh toán phí định kỳ trực tiếp bằng ví điện tử/ngân hàng.
                  </p>
                </div>

                <form onSubmit={handlePaySubmit} className="space-y-4">
                  <div className="bg-white/80 border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                        Mã hợp đồng / Số chứng thư bảo hiểm
                      </label>
                      <input
                        type="text"
                        value={contractNo}
                        onChange={(e) => setContractNo(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 glass-input font-mono"
                        placeholder="PTI-CON-XXXX"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2 ml-1">
                        Gia hạn / Nâng cấp gói bảo hiểm Care
                      </label>
                      <div className="space-y-2">
                        {PACKAGES.map((pkg) => (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg.id)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                              selectedPackage === pkg.id
                                ? "border-blue-500 bg-blue-50/20 shadow-sm"
                                : "border-slate-100 bg-white/40"
                            }`}
                          >
                            <div className="space-y-1 pr-2">
                              <p className="text-xs font-bold text-slate-800">{pkg.name}</p>
                              <p className="text-[9px] text-slate-400 font-medium leading-normal">{pkg.desc}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold text-blue-600">
                                {pkg.price.toLocaleString("vi-VN")}đ
                              </p>
                              <p className="text-[8px] text-slate-400 font-medium">/năm</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-3.5 rounded-2xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center gap-1.5 cursor-pointer"
                  >
                    Tiếp tục thanh toán <ArrowRight size={14} />
                  </button>
                </form>
              </motion.div>
            )}

            {/* PAYMENT STEP 2: PAYMENT GATEWAY CONFIRMATION */}
            {payStep === "confirm" && (
              <motion.div
                key="pay-confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="bg-white/80 border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 border-b border-slate-50 pb-2 flex items-center gap-1.5">
                    <DollarSign size={15} className="text-blue-500" /> Xác nhận hóa đơn thanh toán
                  </h4>

                  <div className="space-y-2 text-xs border-b border-slate-100 pb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Hợp đồng bảo hiểm:</span>
                      <span className="font-bold text-slate-700 font-mono">{contractNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Sản phẩm đăng ký:</span>
                      <span className="font-bold text-slate-700">{activePackage.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Thời gian bảo hiểm:</span>
                      <span className="font-semibold text-slate-700">12 tháng (Gia hạn tự động)</span>
                    </div>
                    <div className="flex justify-between text-sm pt-1 border-t border-dashed border-slate-100">
                      <span className="font-bold text-slate-800">Tổng số tiền thanh toán:</span>
                      <span className="font-extrabold text-blue-600">{activePackage.price.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 ml-1">
                      Lựa chọn cổng thanh toán an toàn *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPayGateway("momo")}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          payGateway === "momo"
                            ? "border-pink-500 bg-pink-50/10 text-pink-600 font-semibold"
                            : "border-slate-100 bg-white/40 text-slate-500"
                        }`}
                      >
                        <Wallet size={16} className={payGateway === "momo" ? "text-pink-500" : "text-slate-400"} />
                        <span className="text-xs">Ví MoMo</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPayGateway("bank")}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          payGateway === "bank"
                            ? "border-blue-500 bg-blue-50/10 text-blue-600 font-semibold"
                            : "border-slate-100 bg-white/40 text-slate-500"
                        }`}
                      >
                        <ArrowRightLeft size={16} className={payGateway === "bank" ? "text-blue-500" : "text-slate-400"} />
                        <span className="text-xs">Chuyển khoản</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPayStep("form")}
                    className="flex-1 border border-slate-200 text-slate-500 py-3 rounded-2xl text-xs font-semibold cursor-pointer"
                  >
                    Thay đổi
                  </button>
                  <button
                    onClick={executePayment}
                    disabled={paymentLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl text-xs font-semibold shadow-lg shadow-blue-500/15 flex justify-center items-center gap-1.5 cursor-pointer"
                  >
                    {paymentLoading ? (
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                    ) : (
                      "Thanh toán ngay"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* PAYMENT STEP 3: TRANSACTION SUCCESS */}
            {payStep === "success" && (
              <motion.div
                key="pay-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto shadow-lg shadow-green-100/30">
                  <Check size={40} className="stroke-[2.5]" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-lg text-slate-800">Thanh toán thành công!</h3>
                  <p className="text-xs text-slate-400 font-medium">Hóa đơn điện tử đang được gửi tới Email của bạn.</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-100 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số giao dịch:</span>
                    <span className="font-semibold text-slate-700">PTI-TXN-2026-9812</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hợp đồng đã gia hạn:</span>
                    <span className="font-bold text-slate-700 font-mono">{contractNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số tiền:</span>
                    <span className="font-bold text-green-600">{activePackage.price.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Thời gian hiệu lực mới:</span>
                    <span className="font-semibold text-slate-700">31/12/2027</span>
                  </div>
                </div>

                <button
                  onClick={onBack}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl text-xs font-semibold shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  Quay lại Trang chủ
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        ) : (
          
          // ==========================================
          // PROFILE ADJUSTMENT VIEW
          // ==========================================
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-blue-50/50 border border-blue-100/30 p-3.5 rounded-2xl flex gap-3">
              <Sparkles size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-slate-600 font-medium">
                Cập nhật thông tin cá nhân và tài khoản thụ hưởng của bạn. Thông tin này sẽ tự động điền khi tạo yêu cầu bồi thường bảo hiểm.
              </p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="bg-white/80 border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3.5">
                {profileSuccess && (
                  <div className="flex gap-2 items-center text-xs text-green-700 bg-green-50 p-3 rounded-xl border border-green-100 font-semibold">
                    <Check size={16} className="shrink-0" />
                    <span>Thông tin đã được lưu thành công!</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Căn cước công dân (Không thể tự ý sửa)
                  </label>
                  <input
                    type="text"
                    value={primaryCccd}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Họ và tên chủ hợp đồng
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Số điện thoại liên hệ
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Thư điện tử (Email) nhận tin nhắn
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                    Địa chỉ liên lạc hiện tại
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-800 glass-input"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <span className="block text-xs font-bold text-slate-700">Tài khoản nhận tiền bồi thường mặc định</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                        Ngân hàng
                      </label>
                      <input
                        type="text"
                        value={payoutBank}
                        onChange={(e) => setPayoutBank(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-800 glass-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                        Số tài khoản
                      </label>
                      <input
                        type="text"
                        value={payoutAccount}
                        onChange={(e) => setPayoutAccount(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono font-medium text-slate-800 glass-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-3 rounded-2xl text-xs font-semibold shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
              >
                Lưu thay đổi thông tin
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
