import { useState } from 'react';
import './App.css';
import Login from './Account/Login';
import Home from './home/Home';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Header from './header/Header';
import Create from './home/create';
import ReadMore from './home/PostDetails';
import EditPost from './home/editPost';
import MyPost from './home/myPosts';

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
    <div>
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
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              setisAuthenticated={setisAuthenticated}
            />
          }
        >
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<Create />} />
          <Route path='/posts/:id' element={<ReadMore />} />
          <Route path='/edit-post/:id' element={<EditPost />} />
          <Route path='/myPosts' element={<MyPost />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;