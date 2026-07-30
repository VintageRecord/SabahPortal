import { notFound } from "next/navigation";
import DivisionFixtures from "@/components/DivisionFixtures";
import { getDivision, getDivisionMatches } from "@/lib/data";

export default async function DivisionFixturesPage({
  params,
}: {
  params: Promise<{ sport: string; division: string }>;
}) {
  const { sport: sportSlug, division: divisionSlug } = await params;
  const result = await getDivision(sportSlug, divisionSlug);
  if (!result) notFound();

  const matches = await getDivisionMatches(result.division.id);

  return <DivisionFixtures divisionId={result.division.id} initialMatches={matches} />;
}
