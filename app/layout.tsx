import type { Metadata } from "next";
import { Toaster } from "sonner";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: { default: "DuoTier", template: "%s · DuoTier" },
  description: "Votre atelier de classements à deux. Jeux, personnages, armures et direction artistique : composez vos tier lists en temps réel.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster theme="dark" richColors position="bottom-right" />
      </body>
    </html>
  );
}
