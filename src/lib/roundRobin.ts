/** Circle-method round robin pairing. Returns rounds of [indexA, indexB] pairs. */
export function roundRobinRounds(n: number): [number, number][][] {
  if (n < 2) return [];
  const ids = [...Array(n).keys()];
  const rounds: [number, number][][] = [];
  const fixed = ids[0];
  const rest = ids.slice(1);
  const totalRounds = n - 1;
  for (let r = 0; r < totalRounds; r++) {
    const pairs: [number, number][] = [];
    const cur = [fixed, ...rest];
    for (let i = 0; i < n / 2; i++) {
      pairs.push([cur[i], cur[n - 1 - i]]);
    }
    rounds.push(pairs);
    rest.push(rest.shift()!);
  }
  return rounds;
}
