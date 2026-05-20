import React from "react";
import { Popup } from "antd-mobile";
import { Plus, Menu, User } from "lucide-react";
import { Button } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { sleep } from "@/utils/common";

interface DrawerProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  handleNewChat: () => void;
  // handleLogout: () => void;
}

export default function Drawer(props: DrawerProps) {
  const navigate = useNavigate();
  const { menuOpen, setMenuOpen, handleNewChat } = props;
  return (
    <Popup
      position="left"
      visible={menuOpen}
      onMaskClick={() => setMenuOpen(false)}
      onClose={() => setMenuOpen(false)}
      bodyStyle={{
        width: "min(88vw, 320px)",
        height: "100vh",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="flex h-full min-h-0 flex-col bg-white"
        role="presentation"
      >
        <div className="min-h-0 flex-1 overflow-auto py-4">
          <p className="px-4 pb-2 text-xs font-medium text-slate-500">菜单</p>
          <div className="my-1 h-px bg-slate-200" />
          <button
            type="button"
            onClick={() => {
              void handleNewChat();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-800 transition-colors hover:bg-slate-50 active:bg-slate-100"
          >
            <Plus size={20} strokeWidth={2} />
            <span className="text-sm font-medium">新建会话</span>
          </button>
        </div>
        <div className="shrink-0 border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600">
              <User size={22} strokeWidth={1.75} aria-hidden />
            </div>
            <Button
              fill="solid"
              size="mini"
              color="primary"
              onClick={async () => {
                localStorage.removeItem("access_token");
                await sleep(1000);
                navigate("/landing/login");
              }}
            >
              退出登录
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
