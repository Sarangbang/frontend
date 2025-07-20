'use client'

import { useState, useEffect } from "react"
import Logout from "../common/Logout";

export default function MyPageComponent() {
    const [isClient, setIsClient] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const token = localStorage.getItem("am");
        setIsLoggedIn(!!token);
      }, []);

    return(
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-8 dark:text-white">마이페이지</h1>
            <Logout onLogout={() => setIsLoggedIn(false)}/>
        </div>
    )  
}