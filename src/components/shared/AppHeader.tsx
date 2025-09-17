import { useCallback, type ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import type { To } from "react-router-dom";
import { cn } from "@/lib/utils";
export const APP_HEADER_H = 64; // 헤더 높이(px)

type HeaderConfig = {
  title: string;
  showBack: boolean;
  backTo?: number | To;
  backReplace?: boolean;
  right?: { label: string; to?: string; onClick?: () => void } | null;
  backLabel?: ReactNode;
  /** ✅ 내용이 없어도 배경색 바(높이 APP_HEADER_H)를 렌더 */
  showEmptyBar?: boolean;
  /** (선택) 빈 바/헤더 배경색 커스텀 */
  bg?: string; // default: "#CAE8FA"
};

type HeaderContextValue = {
  config: HeaderConfig;
  setHeader: (partial: Partial<HeaderConfig>) => void;
  reset: () => void;
};

const initialConfig: HeaderConfig = {
  title: "",
  showBack: false,
  backTo: -1,
  right: null,
  showEmptyBar: false,
  bg: "#CAE8FA",
};

const HeaderContext = createContext<HeaderContextValue | null>(null);

/** 레이아웃에서 children을 감쌈 */
export function HeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeaderConfig>(initialConfig);

  const setHeaderStable = useCallback((partial: Partial<HeaderConfig>) => {
    // 기존 값 위에 "부분 업데이트"만 원하면 아래로 교체:
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetStable = useCallback(() => {
    setConfig(initialConfig);
  }, []);

  const api = useMemo<HeaderContextValue>(
    () => ({
      config,
      setHeader: setHeaderStable,
      reset: resetStable,
    }),
    [config, setHeaderStable, resetStable]
  );

  return (
    <HeaderContext.Provider value={api}>{children}</HeaderContext.Provider>
  );
}

/** 페이지에서 사용: setHeader / reset 접근 */
export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeader must be used within <HeaderProvider>");
  return ctx;
}

/** 실제 헤더 UI */
export default function AppHeader({ className }: { className?: string }) {
  const { config } = useHeader();
  const navigate = useNavigate();

  const isEmpty = !config.title && !config.showBack && !config.right?.label;

  const handleBack = () => {
    if (typeof config.backTo === "number") {
      navigate(config.backTo);
    } else if (config.backTo) {
      navigate(config.backTo, { replace: !!config.backReplace });
    } else {
      navigate(-1);
    }
  };

  // ✅ 비어있어도 같은 높이 스페이서 렌더
  if (isEmpty && config.showEmptyBar) {
    return (
      <div
        className={cn("w-full", className)}
        style={{ backgroundColor: config.bg }}
      >
        <header
          className="border-b border-black/10"
          style={{ height: APP_HEADER_H }}
        ></header>
      </div>
    );
  }

  const backLabel = config.backLabel ?? "홈으로";

  return (
    <div className="bg-[#CAE8FA] sticky top-[64px]">
      <header className="shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {config.showBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-600 hover:text-sky-500 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backLabel}
                </Button>
              )}
              {config.title && (
                <h1 className="text-2xl font-bold text-gray-800">
                  {config.title}
                </h1>
              )}
            </div>

            {config.right?.label ? (
              config.right.to ? (
                <Link to={config.right.to}>
                  <Button className="bg-sky-400 hover:bg-sky-500 text-white">
                    {config.right.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={config.right.onClick}
                  className="bg-sky-400 hover:bg-sky-500 text-white"
                >
                  {config.right.label}
                </Button>
              )
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );
}
