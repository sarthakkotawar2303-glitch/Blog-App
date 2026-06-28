import { useState } from 'react';
import './App.css';
import Login from './Account/Login';
import Home from './home/Home';
import LandingPage from './home/LandingPage';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Header from './header/Header';
import Create from './home/create';
import ReadMore from './home/PostDetails';
import EditPost from './home/editPost';
import MyPost from './home/myPosts';
import SavedPosts from './home/SavedPosts';
import LikedPosts from './home/LikedPosts';
import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ isAuthenticated, setisAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate replace to='/login' />;
  }
  return (
    <div id="page-wrapper" className="animate-page-in">
      <Header setisAuthenticated={setisAuthenticated} />
      <Outlet />
    </div>
  );
};

function App() {
  const [isAuthenticated, setisAuthenticated] = useState(() => {
    return !!localStorage.getItem("accessToken");
  });

  return (
    <div className='min-h-[100vh]'>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path='/login'
          element={
            isAuthenticated
              ? <Navigate replace to='/' />
              : <Login setisAuthenticated={setisAuthenticated} />
          }
        />
        <Route
          path='/'
          element={
            isAuthenticated
              ? <Navigate replace to='/feed' />
              : <LandingPage />
          }
        />
        <Route
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              setisAuthenticated={setisAuthenticated}
            />
          }
        >
          <Route path='/feed' element={<Home />} />
          <Route path='/create' element={<Create />} />
          <Route path='/posts/:id' element={<ReadMore />} />
          <Route path='/edit-post/:id' element={<EditPost />} />
          <Route path='/myPosts' element={<MyPost />} />
          <Route path='/savedPosts' element={<SavedPosts />} />
          <Route path='/likedPosts' element={<LikedPosts />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;