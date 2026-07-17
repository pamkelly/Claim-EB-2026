import { InsuranceCard, NewsItem, NotificationItem, ClaimRequest } from "./types";

export const SAMPLE_CARDS: InsuranceCard[] = [
  {
    id: "card-1",
    name: "NGUYỄN VĂN AN",
    idCardNumber: "001096012345",
    cardNumber: "PTI-VIP-998877",
    qrCode: "PTI_CARD_NGUYEN_VAN_AN_998877",
    birthday: "15/10/1996",
    status: "HieuLuc",
    expiryDate: "31/12/2026",
    relationship: "Bản thân"
  },
  {
    id: "card-1-tai-nan",
    name: "NGUYỄN VĂN AN",
    idCardNumber: "001096012345",
    cardNumber: "PTI-ACC-110255",
    qrCode: "PTI_CARD_NGUYEN_VAN_AN_ACCIDENT",
    birthday: "15/10/1996",
    status: "HieuLuc",
    expiryDate: "31/12/2026",
    relationship: "Bản thân"
  },
  {
    id: "card-1-nha-khoa",
    name: "NGUYỄN VĂN AN",
    idCardNumber: "001096012345",
    cardNumber: "PTI-DEN-440255",
    qrCode: "PTI_CARD_NGUYEN_VAN_AN_DENTAL",
    birthday: "15/10/1996",
    status: "HieuLuc",
    expiryDate: "31/12/2026",
    relationship: "Bản thân"
  },
  {
    id: "card-1-ung-thu",
    name: "NGUYỄN VĂN AN",
    idCardNumber: "001096012345",
    cardNumber: "PTI-CAN-550255",
    qrCode: "PTI_CARD_NGUYEN_VAN_AN_CANCER",
    birthday: "15/10/1996",
    status: "HieuLuc",
    expiryDate: "31/12/2026",
    relationship: "Bản thân"
  },
  {
    id: "card-1-tro-cap",
    name: "NGUYỄN VĂN AN",
    idCardNumber: "001096012345",
    cardNumber: "PTI-HOS-660255",
    qrCode: "PTI_CARD_NGUYEN_VAN_AN_HOSPITAL",
    birthday: "15/10/1996",
    status: "HieuLuc",
    expiryDate: "31/12/2026",
    relationship: "Bản thân"
  },
  {
    id: "card-1-car",
    name: "NGUYỄN VĂN AN",
    idCardNumber: "001096012345",
    cardNumber: "PTI-CAR-882211",
    qrCode: "PTI_CARD_NGUYEN_VAN_AN_CAR",
    birthday: "15/10/1996",
    status: "HieuLuc",
    expiryDate: "14/02/2027",
    relationship: "Bản thân"
  },
  {
    id: "card-1-moto",
    name: "NGUYỄN VĂN AN",
    idCardNumber: "001096012345",
    cardNumber: "PTI-MOTO-334255",
    qrCode: "PTI_CARD_NGUYEN_VAN_AN_MOTO",
    birthday: "15/10/1996",
    status: "HieuLuc",
    expiryDate: "09/03/2027",
    relationship: "Bản thân"
  },
  {
    id: "card-1-home",
    name: "NGUYỄN VĂN AN",
    idCardNumber: "001096012345",
    cardNumber: "PTI-HOME-774411",
    qrCode: "PTI_CARD_NGUYEN_VAN_AN_HOME",
    birthday: "15/10/1996",
    status: "HieuLuc",
    expiryDate: "30/06/2027",
    relationship: "Bản thân"
  },
  {
    id: "card-2",
    name: "NGUYỄN MINH KHANG",
    idCardNumber: "001202009876",
    cardNumber: "PTI-CHI-112233",
    qrCode: "PTI_CARD_NGUYEN_MINH_KHANG_112233",
    birthday: "20/05/2018",
    status: "HieuLuc",
    expiryDate: "31/12/2026",
    relationship: "Con trai"
  },
  {
    id: "card-3",
    name: "TRẦN THỊ MAI",
    idCardNumber: "001198007654",
    cardNumber: "PTI-SPO-445566",
    qrCode: "PTI_CARD_TRAN_THI_MAI_445566",
    birthday: "12/08/1998",
    status: "HieuLuc",
    expiryDate: "31/12/2026",
    relationship: "Vợ"
  },
  {
    id: "card-4",
    name: "NGUYỄN THỊ HOA",
    idCardNumber: "001065004321",
    cardNumber: "PTI-PAR-778899",
    qrCode: "PTI_CARD_NGUYEN_THI_HOA_778899",
    birthday: "04/02/1965",
    status: "HetHan",
    expiryDate: "01/01/2025",
    relationship: "Mẹ ruột"
  }
];

export const SAMPLE_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "PTI Care ra mắt Thẻ bảo hiểm điện tử e-Card 2.0 mới",
    summary: "Trải nghiệm dịch vụ bảo lãnh viện phí không giấy tờ tại hơn 300 bệnh viện/phòng khám liên kết trên toàn quốc cực kỳ mượt mà, tiện lợi.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
    date: "02/07/2026",
    category: "Tính năng",
    content: "Tổng Công ty Cổ phần Bảo hiểm Bưu điện (PTI) chính thức nâng cấp tính năng Thẻ bảo hiểm điện tử (e-Card 2.0). Khách hàng chỉ cần xuất trình mã QR trên ứng dụng PTI Care khi làm thủ tục nhập viện tại hệ thống bệnh viện bảo lãnh để được khấu trừ trực tiếp viện phí, không cần đem theo thẻ vật lý hay giấy tờ rườm rà."
  },
  {
    id: "news-2",
    title: "Hướng dẫn chuẩn bị chứng từ yêu cầu bồi thường nhanh chóng",
    summary: "Bỏ túi các mẹo kiểm tra đơn thuốc, hóa đơn VAT và sổ y bạ để hồ sơ yêu cầu bồi thường được duyệt ngay trong vòng 24 giờ.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    date: "28/06/2026",
    category: "Cẩm nang",
    content: "Để yêu cầu giải quyết bồi thường qua PTI Care được phê duyệt nhanh nhất, khách hàng cần lưu ý chụp rõ ràng 2 loại chứng từ: 1. Chứng từ y tế: Sổ khám bệnh, chỉ định xét nghiệm, toa thuốc có chữ ký bác sĩ. 2. Chứng từ thanh toán: Hóa đơn điện tử (Hóa đơn tài chính VAT), bảng kê chi tiết viện phí có dấu tròn của cơ sở điều trị."
  },
  {
    id: "news-3",
    title: "PTI mở rộng mạng lưới bảo lãnh viện phí chất lượng cao",
    summary: "Hợp tác chiến lược thêm 25 bệnh viện quốc tế lớn tại Hà Nội, Đà Nẵng và TP.HCM giúp mang lại dịch vụ chăm sóc sức khỏe tối ưu.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    date: "15/06/2026",
    category: "Tin tức",
    content: "PTI tự hào ký kết hợp tác với hệ thống y tế quốc tế, tăng tổng số cơ sở bảo lãnh lên hơn 320 điểm trên toàn quốc. Các khách hàng sở hữu thẻ bảo hiểm PTI hạng Gold và VIP có thể trải nghiệm ngay quyền lợi bảo lãnh viện phí nội trú và ngoại trú 5 sao hoàn toàn miễn phí."
  }
];

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Yêu cầu bồi thường đã được DUYỆT CHI TRẢ 🎉",
    content: "Yêu cầu bồi thường mã #PTI-9821 cho sự kiện khám chữa bệnh của bé Nguyễn Minh Khang tại BV Nhi Trung Ương đã được duyệt số tiền 1.500.000đ. Tiền đã được chuyển khoản tới tài khoản ngân hàng của bạn.",
    date: "06/07/2026 14:30",
    read: false,
    claimId: "mock-claim-1"
  },
  {
    id: "notif-2",
    title: "CẦN BỔ SUNG CHỨNG TỪ BỒI THƯỜNG ⚠️",
    content: "Hồ sơ yêu cầu bồi thường mã #PTI-7402 điều trị ngoại trú tại PK Đa Khoa Hồng Ngọc đang thiếu 'Bảng kê chi tiết tiền thuốc'. Vui lòng chọn hồ sơ này để bổ sung chứng từ y tế.",
    date: "05/07/2026 09:15",
    read: false,
    claimId: "mock-claim-2"
  },
  {
    id: "notif-3",
    title: "Chào mừng bạn đến với PTI Care",
    content: "Ứng dụng cổng bảo hiểm điện tử e-Card và nộp hồ sơ bồi thường online nhanh gọn của Bảo hiểm Bưu điện PTI. Chúc bạn có trải nghiệm tuyệt vời!",
    date: "01/07/2026 08:00",
    read: true
  }
];

export const MOCK_HISTORIC_CLAIMS: ClaimRequest[] = [
  {
    id: "mock-claim-1",
    cardId: "card-2",
    insuredName: "NGUYỄN MINH KHANG",
    cardNumber: "PTI-CHI-112233",
    hospital: "Bệnh viện Nhi Trung Ương",
    treatmentType: "NgoaiTru",
    cause: "Sốt siêu vi, ho khan kéo dài",
    amount: 1500000,
    hasOtherInsurance: false,
    receiveMethod: "ChuyenKhoan",
    bankName: "Vietcombank (VCB)",
    bankAccount: "101889922233",
    bankOwner: "NGUYEN VAN AN",
    email: "htthien20101996@gmail.com",
    medicalDocs: [
      { name: "PhieuKhamNhi.png", size: "245 KB", type: "image/png" },
      { name: "DonThuoc_SotSieuVi.png", size: "180 KB", type: "image/png" }
    ],
    paymentDocs: [
      { name: "HoaDon_VCB.png", size: "320 KB", type: "image/png" },
      { name: "PhieuThu_NhiTW.png", size: "150 KB", type: "image/png" }
    ],
    status: "DaDuyet",
    date: "06/07/2026 14:30"
  },
  {
    id: "mock-claim-2",
    cardId: "card-1",
    insuredName: "NGUYỄN VĂN AN",
    cardNumber: "PTI-VIP-998877",
    hospital: "Bệnh viện Đa Khoa Hồng Ngọc",
    treatmentType: "NgoaiTru",
    cause: "Khám viêm họng cấp, nội soi tai mũi họng",
    amount: 850000,
    hasOtherInsurance: false,
    receiveMethod: "ChuyenKhoan",
    bankName: "Vietcombank (VCB)",
    bankAccount: "101889922233",
    bankOwner: "NGUYEN VAN AN",
    email: "htthien20101996@gmail.com",
    medicalDocs: [
      { name: "PhieuKhamHongNgoc.png", size: "210 KB", type: "image/png" }
    ],
    paymentDocs: [
      { name: "HoaDonVAT_HongNgoc.pdf", size: "1.2 MB", type: "application/pdf" }
    ],
    status: "YeuCauBoSung",
    supplementNotes: "Vui lòng chụp và bổ sung thêm 'Bảng kê chi tiết tiền thuốc/vật tư tiêu hao' để đối chiếu danh mục thuốc được bảo hiểm.",
    date: "05/07/2026 09:15"
  },
  {
    id: "mock-claim-3",
    cardId: "card-3",
    insuredName: "TRẦN THỊ MAI",
    cardNumber: "PTI-SPO-445566",
    hospital: "Bệnh viện Bạch Mai",
    treatmentType: "NoiTru",
    cause: "Điều trị viêm phổi cấp",
    amount: 5400000,
    hasOtherInsurance: false,
    receiveMethod: "ChuyenKhoan",
    bankName: "Vietcombank (VCB)",
    bankAccount: "101889922233",
    bankOwner: "NGUYEN VAN AN",
    email: "htthien20101996@gmail.com",
    medicalDocs: [
      { name: "GiayRaVien_BachMai.pdf", size: "1.5 MB", type: "application/pdf" }
    ],
    paymentDocs: [
      { name: "HoaDon_VienPhi_BachMai.jpg", size: "850 KB", type: "image/jpeg" }
    ],
    status: "TuChoi",
    supplementNotes: "Rủi ro viêm phổi đã tồn tại từ trước thời gian hiệu lực hợp đồng bảo hiểm và bị loại trừ theo điều khoản 4.2.",
    date: "03/07/2026 11:20"
  },
  {
    id: "mock-claim-4",
    cardId: "card-1",
    insuredName: "NGUYỄN VĂN AN",
    cardNumber: "PTI-VIP-998877",
    hospital: "Bệnh viện Đa khoa Tâm Anh",
    treatmentType: "NhaKhoa",
    cause: "Nhổ răng khôn mọc lệch số 8",
    amount: 3200000,
    hasOtherInsurance: false,
    receiveMethod: "ChuyenKhoan",
    bankName: "Vietcombank (VCB)",
    bankAccount: "101889922233",
    bankOwner: "NGUYEN VAN AN",
    email: "htthien20101996@gmail.com",
    medicalDocs: [],
    paymentDocs: [],
    status: "Nhap",
    date: "06/07/2026 18:00"
  }
];
