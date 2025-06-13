import type { Metadata } from 'next'
import './globals.css'

const APP_URL = 'https://vcal.vercel.app/';
export const metadata: Metadata = {
  // Primary metadata
  metadataBase: new URL(APP_URL), // Essential for absolute URLs for OG/Twitter images
  title: {
    default: 'Lịch Âm Việt Nam - Tra Cứu Âm Lịch, Lễ Hội & Văn Khấn Chuẩn Xác',
    template: '%s | Lịch Âm Việt Nam', // For individual pages to prepend their title
  },
  description: 'Tra cứu lịch âm dương, xem ngày tốt xấu, thông tin lễ hội truyền thống, và thư viện văn khấn chi tiết cho mọi dịp trong năm. Nguồn tài liệu văn hóa Việt chính xác và đầy đủ.',
  keywords: [
    'lịch âm', 'lịch dương', 'lịch âm dương', 'văn khấn', 'văn khấn mồng 1',
    'văn khấn rằm', 'văn khấn tết', 'lễ hội truyền thống', 'ngày tốt xấu',
    'phong thủy', 'văn hóa việt nam', 'tín ngưỡng việt'
  ],
  authors: [{ name: 'HungVP', url: APP_URL }],
  creator: 'HungVP',
  publisher: 'HungVP',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },

  // Open Graph (for social media sharing - Facebook, Zalo, etc.)
  openGraph: {
    title: 'Lịch Âm Việt Nam - Tra Cứu Âm Lịch, Lễ Hội & Văn Khấn Chuẩn Xác',
    description: 'Tra cứu lịch âm dương, xem ngày tốt xấu, thông tin lễ hội truyền thống, và thư viện văn khấn chi tiết cho mọi dịp trong năm. Nguồn tài liệu văn hóa Việt chính xác và đầy đủ.',
    url: APP_URL,
    siteName: 'Lịch Âm Việt Nam',
    images: [
      {
        url: `${APP_URL}/images/v_lunar_cal.png`, // Path to your Open Graph image in public folder
        width: 1200,
        height: 630,
        alt: 'Lịch Âm Việt Nam Thumbnail',
      },
    ],
    locale: 'vi_VN', // Vietnamese locale
    type: 'website',
  },

  // Twitter Card (for social media sharing - Twitter/X)
  twitter: {
    card: 'summary_large_image',
    title: 'Lịch Âm Việt Nam - Tra Cứu Âm Lịch, Lễ Hội & Văn Khấn Chuẩn Xác',
    description: 'Tra cứu lịch âm dương, xem ngày tốt xấu, thông tin lễ hội truyền thống, và thư viện văn khấn chi tiết cho mọi dịp trong năm. Nguồn tài liệu văn hóa Việt chính xác và đầy đủ.',
    creator: '@yourtwitterhandle', // If you have one
    images: [`${APP_URL}/images/v_lunar_cal.png`], // Path to your Twitter image
  },
  icons: {
    icon: '/images/v_lunar_cal.png', // This will be your primary favicon
    shortcut: '/images/v_lunar_cal.png', // For older browsers/devices
    apple: '/images/v_lunar_cal.png', // For Apple touch icons
  },
    generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
