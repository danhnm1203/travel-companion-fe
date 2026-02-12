import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lịch trình Hà Giang - Chi tiết đến từng giờ",
  description:
    "Tạo lịch trình Hà Giang cá nhân hóa chỉ trong 30 giây. Từ điểm đến, quán ăn đến local tips ít ai biết.",
  keywords: ["Hà Giang", "lịch trình", "du lịch", "travel", "Vietnam"],
  openGraph: {
    title: "Lịch trình Hà Giang - Chi tiết đến từng giờ",
    description:
      "Tạo lịch trình Hà Giang cá nhân hóa chỉ trong 30 giây.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
