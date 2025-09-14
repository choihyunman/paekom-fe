import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          요청하신 페이지를 찾을 수 없습니다.
        </h1>
        <Button className="cursor-pointer" onClick={() => navigate(-1)}>
          돌아가기
        </Button>
      </div>
    </div>
  );
}
