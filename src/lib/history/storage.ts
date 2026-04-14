import type { DiagnosisReport } from "@/types/diagnosis";

const STORAGE_KEY = "verdant-ai-history";
const HISTORY_LIMIT = 8;

function hasWindow() {
  return typeof window !== "undefined";
}

export function readHistory(): DiagnosisReport[] {
  if (!hasWindow()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DiagnosisReport[];
    return parsed.sort((a, b) => +new Date(b.analyzedAt) - +new Date(a.analyzedAt));
  } catch {
    return [];
  }
}

export function saveReport(report: DiagnosisReport) {
  if (!hasWindow()) return [];
  const current = readHistory().filter((entry) => entry.id !== report.id);
  const next = [report, ...current].slice(0, HISTORY_LIMIT);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getReportById(id: string) {
  return readHistory().find((entry) => entry.id === id) ?? null;
}

export function removeReport(id: string) {
  if (!hasWindow()) return [];
  const next = readHistory().filter((entry) => entry.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

