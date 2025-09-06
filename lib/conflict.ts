export type Slot = {
  day: string;
  start: number;
  end: number;
};

export function hasConflict(existing: Slot[], incoming: Slot[]) {
  for (const a of existing) {
    for (const b of incoming) {
      if (
        a.day === b.day &&
        ((a.start < b.end && a.end > b.start) ||
          (b.start < a.end && b.end > a.start))
      ) {
        return true;
      }
    }
  }
  return false;
}