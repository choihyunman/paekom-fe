import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button"; // shadcn/ui
import { cn } from "@/lib/utils";

type Banner = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
};

type Props = {
  items: Banner[];
  autoAdvanceMs?: number;
  overlayColor?: string;
  heightClass?: string;
};

export default function BannerCarousel({
  items,
  autoAdvanceMs = 5000,
  overlayColor = "rgba(202,232,250,0.7)",
  heightClass = "h-[clamp(220px,30vh,380px)] sm:h-[clamp(260px,34vh,440px)]", // 기본값을 vh 기반으로로
}: Props) {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (!pausedRef.current) setIndex((p) => (p + 1) % items.length);
    }, autoAdvanceMs);
    return () => clearInterval(t);
  }, [autoAdvanceMs, items.length]);

  const go = (dir: 1 | -1) =>
    setIndex((p) => (p + dir + items.length) % items.length);

  return (
    <section
      className="relative pb-8"
      aria-roledescription="carousel"
      aria-label="소개 배너"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((b) => (
              <div
                key={b.id}
                className={cn("w-full flex-shrink-0 relative", heightClass)}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: overlayColor }}
                >
                  <div className="text-center text-gray-800 px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                      {b.title}
                    </h2>
                    <p className="text-lg md:text-xl text-balance">
                      {b.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            aria-label="이전 배너"
            onClick={() => go(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            aria-label="다음 배너"
            onClick={() => go(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2"
            role="tablist"
            aria-label="배너 인디케이터"
          >
            {items.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`${i + 1}번째 배너 보기`}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
