import { useCallback, type ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import type { To } from "react-router-dom";

type HeaderConfig = {
  title: string;
  showBack: boolean;
  backTo?: number | To; // ← string 경로, 또는 { pathname, search, state } 객체 지원
  backReplace?: boolean; // ← 히스토리 쌓지 않고 대체할지 옵션
  right?: { label: string; to?: string; onClick?: () => void } | null;
  backLabel?: ReactNode; // 백버튼 문구 (undefined면 '뒤로가기기' 기본값)
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
export default function AppHeader() {
  const { config } = useHeader();
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof config.backTo === "number") {
      navigate(config.backTo);
    } else if (config.backTo) {
      navigate(config.backTo, { replace: !!config.backReplace });
    } else {
      navigate(-1);
    }
  };

  const backLabel = config.backLabel ?? "뒤로 가기";

  return (
    <div className="bg-[#CAE8FA]">
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
              <h1 className="text-2xl font-bold text-gray-800">
                {config.title || " "}
              </h1>
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
