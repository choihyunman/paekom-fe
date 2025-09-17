import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useHeader } from "@/components/shared/AppHeader";
import BookingListItem from "./components/BookingListItem";
import StatusBadge from "./components/StatusBadge";
import { loadBookings, updateBooking, type Booking } from "./bookingStorage";

const bookingsSeed: Booking[] = [
  {
    id: 1,
    date: "2025-09-17",
    time: "10:00",
    counselor: "김상담 전문가",
    method: "화상",
    status: "확정",
    createdAt: "2025-09-15T10:00:00",
  },
  {
    id: 2,
    date: "2025-09-12",
    time: "16:00",
    counselor: "이상담 전문가",
    method: "화상",
    status: "완료",
    createdAt: "2025-09-10T16:00:00",
  },
  {
    id: 3,
    date: "2025-09-20",
    time: "18:00",
    counselor: "박상담 전문가",
    method: "화상",
    status: "대기",
    createdAt: "2025-09-18T18:00:00",
  },
  {
    id: 4,
    date: "2025-09-10",
    time: "11:00",
    counselor: "정상담 전문가",
    method: "화상",
    status: "취소",
    createdAt: "2025-09-08T11:00:00",
  },
];

type TabKey = "upcoming" | "past" | "all";

export default function BookingListPage() {
  const navigate = useNavigate();
  const { setHeader, reset } = useHeader();
  const [tab, setTab] = useState<TabKey>("upcoming");
  const [saved, setSaved] = useState<Booking[]>([]);

  // 공통 헤더
  useEffect(() => {
    setHeader({
      title: "상담 예약 목록",
      showBack: true,
      backTo: "/",
      backLabel: "홈으로",
    });
    return reset;
  }, [setHeader, reset]);

  useEffect(() => {
    setSaved(loadBookings()); // 마운트 1회만
  }, []);

  // 표시 리스트: 저장된 것(최신 우선) + seed
  const list = useMemo(() => [...saved, ...bookingsSeed], [saved]);

  // 분류
  const now = new Date();
  const upcoming = useMemo(
    () =>
      list.filter(
        (b) =>
          new Date(b.date) >= new Date(now.toDateString()) &&
          b.status !== "취소"
      ),
    [list]
  );
  const past = useMemo(
    () => list.filter((b) => new Date(b.date) < new Date(now.toDateString())),
    [list]
  );
  const display = tab === "upcoming" ? upcoming : tab === "past" ? past : list;

  // 액션
  const handleOpen = (id: number) => {
    // 상세 페이지가 아직 없다면 예약 페이지로 이동하거나 state 전달
    // 여기선 예약 상세 라우트를 /booking/:id 로 가정 (원하면 바꿔도 OK)
    navigate(`/booking/${id}`, { state: { from: "/bookings" } });
  };

  const handleReschedule = (id: number) => {
    // 재예약 흐름: 기존 정보를 state 로 넘겨 예약 페이지에서 초기값으로 사용하기
    const target = list.find((b) => b.id === id);
    navigate(`/booking`, { state: target });
  };

  // ✅ 취소 시 스토리지 업데이트 + 화면 갱신
  const handleCancel = (id: number) => {
    updateBooking(id, { status: "취소" });
    setSaved(loadBookings()); // 갱신 반영
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 탭 */}
        <div className="mb-6 flex items-center gap-2">
          <TabButton
            active={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
          >
            다가오는 예약 <Count n={upcoming.length} />
          </TabButton>
          <TabButton active={tab === "past"} onClick={() => setTab("past")}>
            지난 예약 <Count n={past.length} />
          </TabButton>
          <TabButton active={tab === "all"} onClick={() => setTab("all")}>
            전체 <Count n={list.length} />
          </TabButton>
          <div className="ml-auto">
            <Button
              className="bg-[#6EC6FF] hover:bg-[#5BB8F3] text-white cursor-pointer"
              onClick={() => navigate("/booking")}
            >
              새 예약 만들기
            </Button>
          </div>
        </div>

        {/* 리스트 */}
        {display.length ? (
          <div className="space-y-4">
            {display
              .sort(
                (a, b) =>
                  a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
              )
              .map((b) => (
                <BookingListItem
                  key={b.id}
                  booking={{ ...b, counselor: b.counselor || "배정 대기" }}
                  statusBadge={<StatusBadge status={b.status} />}
                  onOpen={() => handleOpen(b.id)}
                  onReschedule={() => handleReschedule(b.id)}
                  onCancel={() => handleCancel(b.id)}
                />
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">표시할 예약이 없습니다.</p>
              <Button
                className="bg-[#6EC6FF] hover:bg-[#5BB8F3] text-white cursor-pointer"
                onClick={() => navigate("/booking")}
              >
                첫 예약 만들기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      className={
        active
          ? "bg-[#6EC6FF] hover:bg-[#5BB8F3] text-white cursor-pointer"
          : "hover:bg-[#EAF6FF] hover:border-[#6EC6FF] cursor-pointer"
      }
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function Count({ n }: { n: number }) {
  return (
    <span className="ml-1 text-xs rounded-full bg-black/10 px-2 py-0.5">
      {n}
    </span>
  );
}
