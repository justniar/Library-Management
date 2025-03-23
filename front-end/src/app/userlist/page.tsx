"use client";
import Pagination from '@/components/atom/pagination';
import { AuthContext } from '@/context/AuthContext';
import { UserProps } from '@/utils/types';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const UserList = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const userPerPage = 8
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter()
  const authContext = useContext(AuthContext);
    
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await authContext?.isUserAuthenticated();
      if (!isAuthenticated) {
        router.push("/");
      }
    };
  
    checkAuth();
  }, [authContext]);
    
  
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          throw new Error("Token tidak tersedia");
        }
        const response = await fetch(`http://localhost:8080/users?page=${currentPage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch All users");
        }
        console.log(Error)

        const data = await response.json();
        console.log(data);
        setUsers(data.users);
        setTotalPages(data.total_pages)
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchAllUsers();
  }, [currentPage]);
  

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl text-red-900 font-bold mb-4 text-center">User List</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse overflow-x-scroll">
          <thead>
            <tr className="bg-red-900 text-amber-50">
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">FullName</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-center">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.full_name}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{user.address}</td>
                <td className="p-3">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}

export default UserList;