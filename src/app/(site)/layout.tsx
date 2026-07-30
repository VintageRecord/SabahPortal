import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllStreams, getSettings, getSports } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, sports, streams] = await Promise.all([
    getSettings(),
    getSports(),
    getAllStreams(),
  ]);

  return (
    <>
      <Header title={settings.title} sports={sports} streams={streams} />
      <main className="flex-1">{children}</main>
      <Footer organizer={settings.organizer} />
    </>
  );
}
