"use client";

import { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl w-full max-w-lg mx-2 flex flex-col animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="닫기"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
          </button>
        </div>
        {/* 본문 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {children}
        </div>
        {/* 푸터 */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            닫기
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 