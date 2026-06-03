/**
 * Estimated boardroom prep duration from agent count (seconds).
 * 10 agents ≈ 01:30, 50 ≈ 03:00, 100+ ≈ 05:00.
 */
export function computeBoardroomCountdownSeconds(
  agentCount: number | null | undefined,
): number {
  const count =
    typeof agentCount === 'number' && Number.isFinite(agentCount) && agentCount > 0
      ? Math.floor(agentCount)
      : 10;

  if (count <= 10) return 90;
  if (count <= 50) return 180;
  return 300;
}

export function formatBoardroomCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
