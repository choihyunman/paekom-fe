import { useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MessageSquareText } from "lucide-react";
import { useSttStore } from "@/stores/sttStore";

// 문장 분리 유틸
function splitSentences(text: string): string[] {
  if (!text) return [];
  const cleaned = text.replace(/\s+/g, " ").trim();
  const matches = cleaned.match(/[^.!?？！。…]+(?:[.!?？！。…]+|$)/g);
  return (matches || []).map((s) => s.trim()).filter(Boolean);
}

type TabContext = { report: { id: number } };

export default function ReplayTranscriptTab() {
  // ✅ 부모 Outlet에서 report.id만 받음
  const { report } = useOutletContext<TabContext>();
  const id = report?.id;

  const { byId, loading, error, fetch } = useSttStore();

  // 마운트 시(or id 변경 시) transcript 가져오기 (캐시되어 있으면 skip됨)
  useEffect(() => {
    if (Number.isFinite(id)) fetch(id);
  }, [id, fetch]);

  const transcript = (id && byId[id]) || "";
  const sentences = useMemo(() => splitSentences(transcript), [transcript]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquareText className="h-5 w-5 text-[#6EC6FF]" />
          상담 다시보기
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg bg-white border border-gray-400 p-4 max-h-[70vh] overflow-auto">
          {loading[id!] ? (
            <p className="text-sm text-gray-600">불러오는 중…</p>
          ) : error[id!] ? (
            <p className="text-sm text-red-600">{error[id!]}</p>
          ) : sentences.length ? (
            <div className="space-y-2">
              {sentences.map((s, i) => (
                <div key={i} className="flex justify-end">
                  <div className="inline-block max-w-[80%] lg:max-w-[70%] rounded-2xl border border-[#D7ECFF] bg-[#EAF6FF] px-3 py-2 shadow-sm">
                    <p className="text-sm text-gray-900 leading-7">{s}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              표시할 상담 내용이 없습니다.
            </p>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          ※ 상담 내역을 텍스트로 변환하여 표시합니다.
        </p>
      </CardContent>
    </Card>
  );
}
