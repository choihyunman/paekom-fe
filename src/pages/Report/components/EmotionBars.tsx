type Evidence = { POSITIVE: number; NEUTRAL: number; NEGATIVE: number };
type Props = { evidence: Evidence };

export default function EmotionBars({ evidence }: Props) {
  const rows: Array<{
    label: string;
    value: number;
    bar: string;
    text: string;
  }> = [
    {
      label: "긍정",
      value: evidence.POSITIVE,
      bar: "bg-green-500",
      text: "text-green-600",
    },
    {
      label: "중립",
      value: evidence.NEUTRAL,
      bar: "bg-blue-500",
      text: "text-blue-600",
    },
    {
      label: "부정",
      value: evidence.NEGATIVE,
      bar: "bg-red-500",
      text: "text-red-600",
    },
  ];

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${r.text}`}>{r.label}</span>
            <span className={`text-lg font-bold ${r.text}`}>{r.value}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`${r.bar} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${r.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
