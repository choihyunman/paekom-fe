import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useHeader } from "@/components/shared/AppHeader";
import BookingListItem from "./components/BookingListItem";
import StatusBadge from "./components/StatusBadge";
import { useBookingListStore } from "@/stores/bookingListStore";
import { cancelBooking } from "@/api/booking";

type TabKey = "upcoming" | "past" | "all";

export default function BookingListPage() {
  const navigate = useNavigate();
  const { setHeader, reset } = useHeader();
  const [tab, setTab] = useState<TabKey>("upcoming");
  const { bookings, loading, error, fetchBookings } = useBookingListStore();

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

  // API 데이터 가져오기
  useEffect(() => {
    fetchBookings({ force: true });
  }, [fetchBookings]);

  // API 데이터를 UI 형식으로 변환
  const list = useMemo(
    () =>
      bookings.map((b) => ({
        id: b.id,
        date: b.date,
        time: b.time,
        status: b.status, // 원본 status 사용
        method: "화상" as const, // API에 없을 경우 기본값
      })),
    [bookings]
  );

  // 분류
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOnOrAfterToday = (dateStr: string) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() >= today.getTime();
  };

  const isBeforeToday = (dateStr: string) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
  };

  // ✅ 다가오는 예약: "확정"만
  const upcoming = useMemo(
    () =>
      list.filter((b) => isOnOrAfterToday(b.date) && b.status === "SCHEDULED"),
    [list]
  );

  // ✅ 지난 예약: 완료된 것 + 날짜가 지난 것(취소 제외하고 싶으면 아래에서 추가로 빼면 됨)
  const past = useMemo(
    () =>
      list.filter(
        (b) =>
          (b.status === "COMPLETED" || isBeforeToday(b.date)) &&
          b.status !== "CANCELLED"
      ),
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

  // ✅ 취소 시 API 호출
  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id);
      // 목록 새로고침
      await fetchBookings({ force: true });
    } catch (err) {
      console.error("예약 취소 실패:", err);
      // 에러 처리 (필요시 사용자에게 알림 표시)
    }
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
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">예약 목록을 불러오는 중...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                className="bg-[#6EC6FF] hover:bg-[#5BB8F3] text-white cursor-pointer"
                onClick={() => fetchBookings({ force: true })}
              >
                다시 시도
              </Button>
            </CardContent>
          </Card>
        ) : display.length ? (
          <div className="space-y-4">
            {display
              .sort(
                (a, b) =>
                  a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
              )
              .map((b) => (
                <BookingListItem
                  key={b.id}
                  booking={b}
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
                새 예약 만들기
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
