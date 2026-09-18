import React from 'react';
import Navbar from '../components/Navbar';
import StudentDashboard from '../components/StudentDashboard';
import NastavnikDashboard from '../components/NastavnikDashboard'; 
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.uloga || user?.role;

  return (
    <div>
      <Navbar />
      
      {userRole === 'STUDENT' && (
        <StudentDashboard user={user} />
      )}

      {(userRole === 'PROFESOR' || userRole === 'NASTAVNIK') && (
        <NastavnikDashboard user={user} />
      )}

      {userRole === 'ADMIN' && (
        <AdminDashboard user={user} /> 
      )}
    </div>
  );
};

export default Dashboard;