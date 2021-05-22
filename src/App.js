import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from './pages/user/login';
import Register from './pages/user/register';
// import ResetPassword from './Pages/User/ResetPassword';
import history from '../src/utils/history'
// import { ProtectedRoute } from './auth/protectedRoute' // This one for middleware
// import { ProtectedAdminRoute } from './auth/protectedAdminRoute' // This one for admin middleware
// import Admin from './layouts/DashboardLayout';
// import NotFound from './pages/NotFound'


function App() {
  return (
    <Router history={history}>
    <div className="App">
    <Switch>
      <Route path="/login" exact component={Login}></Route>
      <Route path="/register" exact component={Register}></Route>
      {/* <Route path="/reset" exact component={ResetPassword}></Route> */}
      <Route path="/admin/login" exact component={()=><Login loginAsAdmin={true}/>}></Route>
      {/* <ProtectedAdminRoute path="/admin" component={Admin}></ProtectedAdminRoute> */}
      {/* <Route path="*" component ={NotFound}/> */}
    </Switch>
    </div>
    </Router>

  );
}
export default App;
