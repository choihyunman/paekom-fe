import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/Home/HomePage";
import VideoCounselingPage from "./pages/VideoCounseling/VideoCounselingPage";
import ReportsPage from "./pages/Report/ReportsPage";
import ReportDetailPage from "./pages/Report/ReportDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "reports/:id", element: <ReportDetailPage /> },
      //   { path: "missions", element: <MissionsPage /> },
      //   { path: "notices", element: <NoticesPage /> },
      { path: "video-counseling", element: <VideoCounselingPage /> },
    ],
  },
]);
