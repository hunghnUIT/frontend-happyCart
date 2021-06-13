import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from './pages/user/login';
import Register from './pages/user/register';
import ForgotPassword from './pages/user/forgotPassword';
import history from '../src/utils/history';
import WishList from './pages/user/WishList/WishList';
import { ProtectedRoute } from './auth/protectedRoute' // This one for middleware
// eslint-disable-next-line
import { ProtectedAdminRoute } from './auth/protectedAdminRoute'; // This one for admin middleware 
import Admin from './pages/admin/Admin';
import NotFound from './pages/NotFound'


function App() {
  return (
    <Router history={history}>
    <div className="App">
    <Switch>
      <Route path="/login" exact component={Login}></Route>
      <Route path="/register" exact component={Register}></Route>
      <Route path="/forgot-password" exact component={ForgotPassword}></Route>
      <ProtectedRoute path="/wish-list" exact component={WishList}></ProtectedRoute>
      <Route path="/admin/login" exact component={()=><Login loginAsAdmin={true}/>}></Route>
      <ProtectedAdminRoute path="/admin" component={Admin}></ProtectedAdminRoute>
      {/* <Route path="/admin" component={Admin}></Route> */}
      <Route path="*" component ={NotFound}/>
    </Switch>
    </div>
    </Router>

  );
}
export default App;
