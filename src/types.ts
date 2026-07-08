export type TreatmentType = "NoiTru" | "NgoaiTru" | "NhaKhoa" | "PhauThuat";
export type ClaimStatus = "ChoDuyet" | "YeuCauBoSung" | "DaDuyet" | "TuChoi" | "Nhap";
export type ReceiveMethod = "ChuyenKhoan" | "TienMat";

export interface InsuranceCard {
  id: string;
  name: string;
  idCardNumber: string; // CCCD
  cardNumber: string;
  qrCode: string;
  birthday: string;
  status: "HieuLuc" | "HetHan";
  expiryDate: string;
  relationship: string; // Bản thân, Con, Vợ, Chồng...
}

export interface ClaimRequest {
  id: string;
  cardId: string;
  insuredName: string;
  cardNumber: string;
  hospital: string;
  treatmentType: TreatmentType;
  cause: string;
  amount: number;
  hasOtherInsurance: boolean;
  receiveMethod: ReceiveMethod;
  bankName?: string;
  bankAccount?: string;
  bankOwner?: string;
  email: string;
  medicalDocs: { name: string; size: string; type: string; base64?: string }[];
  paymentDocs: { name: string; size: string; type: string; base64?: string }[];
  status: ClaimStatus;
  date: string;
  supplementNotes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
  claimId?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  category: string;
  content: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  timestamp: string;
}
