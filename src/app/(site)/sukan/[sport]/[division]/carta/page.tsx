import { notFound } from "next/navigation";
import { getBracketMatches, getDivision } from "@/lib/data";
import BracketView from "@/components/BracketView";

export default async function DivisionBracketPage({
  params,
}: {
  params: Promise<{ sport: string; division: string }>;
}) {
  const { sport: sportSlug, division: divisionSlug } = await params;
  const result = await getDivision(sportSlug, divisionSlug);
  if (!result) notFound();
  const { sport, division } = result;

  const bracketMatches = await getBracketMatches(division.id);
  if (bracketMatches.length === 0) notFound();

  const semifinals = bracketMatches
    .filter((m) => m.stage === "SEMIFINAL")
    .sort((a, b) => (a.bracketSlot ?? 0) - (b.bracketSlot ?? 0));
  const final = bracketMatches.find((m) => m.stage === "FINAL") ?? null;

  return (
    <div>
      <h2 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-100">
        Carta Play-Off
      </h2>
      <BracketView
        semifinals={semifinals}
        final={final}
        scoreLabel={sport.scoreLabel}
        sportSlug={sportSlug}
        divisionSlug={divisionSlug}
      />
    </div>
  );
}
