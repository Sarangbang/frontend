'use client'

import { useState, useEffect } from "react"
import Logout from "../common/Logout";
import { useUserStore } from "@/lib/store/userStore";

export default function MyPageComponent() {
    const [isClient, setIsClient] = useState(false);
    const { isLoggedIn } = useUserStore(); // 전역 로그인 상태 사용

    useEffect(() => {
        setIsClient(true);
    }, []);

    return(
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-8 dark:text-white">마이페이지</h1>
            <Logout onLogout={() => {}}/>
        </div>
    )  
}