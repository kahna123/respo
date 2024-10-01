'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const roleId = sessionStorage.getItem('roleId')


    if (roleId == '1') {
      setIsAuthorized(true);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!isAuthorized) {
    return <div>Loading...</div>;
  }

  return <div><div className="flex h-screen">
  <Sidebar />
  <div className="flex-1 flex flex-col overflow-hidden">
    <Header />
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-3">
      {children}
    </main>
    {/* <Footer /> */}
  </div>
</div></div>;
}
