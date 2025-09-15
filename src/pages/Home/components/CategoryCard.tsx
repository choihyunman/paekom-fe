import { Card, CardContent } from "@/components/ui/Card";
import { Link } from "react-router-dom";

type Category = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <Link
      to={category.href}
      className="block rounded-xl focus-visible:ring-2 focus-visible:ring-[#6EC6FF]"
    >
      <Card className="border border-transparent shadow-sm transition-all duration-300 cursor-pointer group hover:bg-[#EAF6FF] hover:shadow-md motion-safe:hover:-translate-y-0.5">
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-3 rounded-full transition-all bg-[#E1F5FE] ring-0 group-hover:ring-2 group-hover:ring-[#BBDEFB]">
              <Icon className="h-8 w-8 text-gray-800 transition-colors group-hover:text-[#6EC6FF]" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors group-hover:text-[#FF8A65]">
            {category.title}
          </h3>

          <span className="relative mx-auto mb-3 block h-0.5 w-6 bg-[#6EC6FF] transition-[width] duration-300 group-hover:w-12 after:content-[''] after:absolute after:inset-0 after:w-0 group-hover:after:w-full after:transition-[width] after:duration-300 after:bg-[#6EC6FF]" />

          <p className="text-gray-700 text-sm text-balance">
            {category.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
