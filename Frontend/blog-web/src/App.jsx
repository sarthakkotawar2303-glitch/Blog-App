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

// Private route component
const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <Navigate replace to={'/login'} />
  );
};

function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false);

  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login setisAuthenticated={setisAuthenticated} />} />

        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
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
