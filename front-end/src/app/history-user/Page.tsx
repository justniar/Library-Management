"use client";
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react'

const Page = () => {
  const router = useRouter()
  const authContext = useContext(AuthContext);
  
  useEffect(() => {
    authContext?.isUserAuthenticated()
    ? router.push("/history-user")
    : router.push("/");
  }, []);

  return (
    <div>Page</div>
  )
}

export default Page