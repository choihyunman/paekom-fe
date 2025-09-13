import CategoryCard from "./CategoryCard";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function CategoryGrid({
  categories,
  className = "",
}: {
  categories: Category[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "max-w-6xl mx-auto px-4 pt-8 pb-4",
        "max-[800px]:pt-4 max-[800px]:pb-2", // 창 높이가 낮아지면 패딩/간격 축소
        className
      )}
      aria-label="카테고리"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </section>
  );
}
