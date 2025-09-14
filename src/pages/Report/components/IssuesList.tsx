type Props = {
  issues: string[];
  dense?: boolean; // true면 간격을 조금 더 촘촘하게
};

export default function IssuesList({ issues, dense = false }: Props) {
  return (
    <ul className={dense ? "space-y-2" : "space-y-3"}>
      {issues.map((issue, index) => (
        <li key={index} className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-[#FF8C69] rounded-full mt-2 flex-shrink-0" />
          <span className="text-gray-700 leading-relaxed">{issue}</span>
        </li>
      ))}
    </ul>
  );
}
