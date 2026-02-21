import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  type MantineColorsTuple,
  createTheme,
} from "@mantine/core";
import SocketProvider from "@/context/SocketContext";
import HomeButton from "@/components/HomeButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TicTacToe — Play Online",
  description: "Modern tic-tac-toe game. Play online with friends or offline.",
};

const accentColor: MantineColorsTuple = [
  "#e8fffe",
  "#d0fefc",
  "#a0f9f6",
  "#6df4ef",
  "#49f0ea",
  "#35eee8",
  "#29ede6",
  "#1dd4cd",
  "#0bbcb5",
  "#00a39c",
];

const theme = createTheme({
  colors: {
    accentColor,
  },
  primaryColor: "accentColor",
  fontFamily: "Inter, system-ui, sans-serif",
  defaultRadius: "md",
  components: {
    Modal: {
      defaultProps: {
        centered: true,
        overlayProps: { backgroundOpacity: 0.7, blur: 4 },
      },
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps} className={inter.variable}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <SocketProvider>
            <div style={{ position: "relative", minHeight: "100dvh", width: "100%" }}>
              <HomeButton />
              {children}
            </div>
          </SocketProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
