import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings, getSports } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, sports] = await Promise.all([getSettings(), getSports()]);

  return (
    <>
      <Header title={settings.title} sports={sports} />
      <main className="flex-1">{children}</main>
      <Footer organizer={settings.organizer} />
    </>
  );
}
