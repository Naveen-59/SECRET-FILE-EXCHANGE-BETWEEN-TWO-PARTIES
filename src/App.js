import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Register from './components/Register';
import AdminRegistration from './components/AdminRegistration';
import AdminLogin from './components/AdminLogin';
import UserLogin from './components/UserLogin';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import UploadData from './components/UploadData';
import DisplayFiles from './components/DisplayFiles';
import AdminLogout from './components/AdminLogout'; 
import UserAdminboard from './components/UserAdminboard';
import UserLogout from './components/UserLogout';
import ViewFiles from './components/ViewFiles';
import ViewRequests from './components/ViewRequests';
import ForgotPassword from './components/ForgotPassword';








function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/UserLogin" element={<UserLogin/>} />
          <Route path="/Register" element={<Register/>} />
          <Route path="/AdminRegistration" element={<AdminRegistration/>} />
          <Route path="/admindashboard" element={<AdminDashboard/>} />
          <Route path="/UploadData" element={<UploadData/>} />
          <Route path="/DisplayFiles" element={<DisplayFiles/>} />
          <Route path="/AdminLogout" element={<AdminLogout/>}/>
          <Route path="/UserAdminboard" element={<UserAdminboard/>} />
          <Route path="/UserLogout" element={<UserLogout/>} />
          <Route path="/ViewFiles" element={<ViewFiles/>} />
          <Route path="/ViewRequests" element={<ViewRequests/>} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />

          
          </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;