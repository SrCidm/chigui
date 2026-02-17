"use client";

import { useState, useRef, useEffect } from "react";
import { logout } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProfileMenuProps {
  user: any;
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Photo Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:ring-2 hover:ring-orange-400 transition"
      >
        {user?.photoURL && (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User"}
            fill
            className="rounded-full object-cover"
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>

          {/* Settings */}
          <button
            onClick={() => {
              setShowMenu(false);
              router.push("/settings");
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            ⚙️ Settings
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
