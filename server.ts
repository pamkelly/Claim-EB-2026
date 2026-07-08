import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System instructions for the PTI AI Assistant
const SYSTEM_INSTRUCTION = `Bạn là Trợ lý ảo PTI Care - Trợ lý AI thông minh chuyên hỗ trợ về bảo hiểm bưu điện PTI (Tổng Công ty Cổ phần Bảo hiểm Bưu điện).
Nhiệm vụ của bạn:
1. Giải đáp thắc mắc về điều khoản bảo hiểm, quyền lợi, phí đóng, và quy trình yêu cầu bồi thường tại PTI.
2. Hướng dẫn khách hàng chuẩn bị hồ sơ chứng từ (chứng từ y tế: sổ khám bệnh, đơn thuốc, chỉ định xét nghiệm; chứng từ thanh toán: hóa đơn tài chính, phiếu thu, bảng kê chi tiết viện phí).
3. Hỗ trợ khách hàng hiểu các bước trên ứng dụng: Đăng nhập bằng CCCD, Quản lý thẻ bảo hiểm điện tử (e-card), và Tạo yêu cầu giải quyết bồi thường qua 4 bước trên app.
4. Thái độ: Luôn lịch sự, tận tâm, chuyên nghiệp, hỗ trợ khách hàng hết mình bằng tiếng Việt.
Lưu ý quan trọng: Vì bạn đang được chạy trong ứng dụng mô phỏng PTI Care, hãy cung cấp các câu trả lời ngắn gọn, trực quan, hỗ trợ tối đa quy trình trải nghiệm của người dùng.`;

// API routes first
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  if (!ai) {
    return res.json({
      text: "Xin chào! Hiện tại Trợ lý ảo PTI Care đang chạy ở chế độ offline do chưa có API Key. Bạn có thể hỏi tôi các câu hỏi mẫu, tôi vẫn sẽ cố gắng hỗ trợ bạn bằng phản hồi giả lập!",
    });
  }

  try {
    // Standard chats with Gemini SDK
    // Convert messages to Gemini format: content has parts, role can be 'user' or 'model'
    const contents = messages.map((m: any) => {
      const role = m.role === "assistant" ? "model" : "user";
      return {
        role,
        parts: [{ text: m.content }],
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Đã xảy ra lỗi khi kết nối với Trợ lý AI. Vui lòng thử lại sau.",
      details: error.message,
    });
  }
});

// Setup Vite or Static File Serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupServer();
