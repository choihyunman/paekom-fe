export type Mission = {
  id: number;
  title: string;
  category: string; // 목록 카드에서 쓰는 "표시용 카테고리" (예: "자기관리")
  date: string; // YYYY-MM-DD
  content: string;
  status: "완료" | "진행중";
  memo?: string;
  feedback?: string;
};

const STORAGE_KEY = "app.missions";

export function loadMissions(): Mission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveMissions(list: Mission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addMission(m: Omit<Mission, "id">): Mission {
  const list = loadMissions();
  const id = Date.now(); // 간단한 고유 id
  const item: Mission = { id, ...m };
  // 최신이 위로 보이게
  list.unshift(item);
  saveMissions(list);
  return item;
}

export function getMissionById(id: number): Mission | undefined {
  return loadMissions().find((m) => m.id === id);
}
