import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MessageSquareText } from "lucide-react";
import type { DetailOutletContext } from "./ReportDetailPage";
import { useMemo } from "react";

// 문장 분리 유틸 (마침표/느낌표/물음표/…/중국·일본 구두점 포함)
function splitSentences(text: string): string[] {
  if (!text) return [];
  const cleaned = text.replace(/\s+/g, " ").trim();
  // 문장 단위로 캡처: 구두점(.!?？！。…)으로 끝나면 포함
  const matches = cleaned.match(/[^.!?？！。…]+(?:[.!?？！。…]+|$)/g);
  return (matches || []).map((s) => s.trim()).filter(Boolean);
}
export default function ReplayTranscriptTab() {
  const { transcript } = useOutletContext<DetailOutletContext>();
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
          {sentences.length > 0 ? (
            <div className="rounded-2xl space-y-3">
              {sentences.map((s, i) => (
                <p key={i} className="text-sm text-gray-800 leading-7">
                  {s}
                </p>
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
