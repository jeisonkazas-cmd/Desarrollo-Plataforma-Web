import { Menu } from "lucide-react";

export default function MenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-md hover:bg-muted transition flex items-center justify-center"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}
