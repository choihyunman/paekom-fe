import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar } from "lucide-react";

type Mission = {
  id: number;
  title: string;
  category: string;
  date: string;
  content: string;
  status: string;
};

type Props = {
  post: Mission;
  categoryColors: Record<string, string>;
  onClick: () => void;
};

export default function MissionCard({ post, categoryColors, onClick }: Props) {
  const categoryClass =
    categoryColors[post.category] || "bg-gray-100 text-gray-800";

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className={categoryClass}>{post.category}</Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.content}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
