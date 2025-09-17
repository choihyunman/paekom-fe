import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/Home/HomePage";
import VideoCounselingPage from "./pages/VideoCounseling/VideoCounselingPage";
import ReportsPage from "./pages/Report/ReportsPage";
import ReportDetailPage from "./pages/Report/ReportDetailPage";
import ReportOverviewTab from "./pages/Report/ReportOverviewTab";
import ReplayTranscriptTab from "./pages/Report/ReplayTrancriptTab";
import MissionsPage from "./pages/Mission/MissionsPage";
import MissionDetailPage from "./pages/Mission/MissionDetailPage";
import BookingPage from "./pages/Booking/BookingPage";
import BookingListPage from "./pages/Booking/BookingListPage";
import MissionWritePage from "./pages/Mission/MissionWritePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "reports", element: <ReportsPage /> },
      {
        path: "reports/:id",
        element: <ReportDetailPage />,
        children: [
          { index: true, element: <ReportOverviewTab /> }, // 기본: 보고서
          { path: "replay", element: <ReplayTranscriptTab /> }, // 상담 다시보기
        ],
      },
      { path: "missions", element: <MissionsPage /> },
      {
        path: "missions/:id",
        element: <MissionDetailPage />,
      },
      {
        path: "missions/write",
        element: <MissionWritePage />,
      },
      //   { path: "notices", element: <NoticesPage /> },
      { path: "video-counseling", element: <VideoCounselingPage /> },
      { path: "booking", element: <BookingPage /> },
      { path: "bookings", element: <BookingListPage /> },
    ],
  },
]);
