import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  type MantineColorsTuple,
  createTheme,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Appshell from "@/components/AppShell";
import Link from "next/link";
import SocketProvider from "@/context/SocketContext";
import HomeButton from "@/components/HomeButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tic-Tac-Toe App",
  description: "create tic-tac-toe game",
};

const myColor: MantineColorsTuple = [
  "#dffbff",
  "#caf2ff",
  "#99e2ff",
  "#64d2ff",
  "#3cc4fe",
  "#23bcfe",
  "#00b5ff",
  "#00a1e4",
  "#008fcd",
  "#007cb6",
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider theme={theme}>
          <SocketProvider>
            {/* <Appshell> */}
            <div className="relative overflow-hidden">
              <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-[#00b5ff] to-[#7b2eda] rounded-xl blur-sm opacity-95 animate-[pulse_7s_ease-in-out_infinite]"></div>
              <HomeButton />
              {children}
              {/* </Appshell> */}
            </div>
          </SocketProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
