import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom"; // eslint-disable-line no-unused-vars

import DefaultLayout from '../../layouts/Default';
import Dashboard from './Dashboard';


import "bootstrap/dist/css/bootstrap.min.css";
import "../../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

const routes = [
    {
        path: "/",
        layout: DefaultLayout,
        component: Dashboard
    },
]

const Admin = () => (
    // <Router basename={process.env.REACT_APP_BASENAME || ""}>
    <div>
        {routes.map((route, index) => {
            return (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={props => {
                        return (
                            <route.layout {...props}>
                                <route.component {...props} />
                            </route.layout>
                        );
                    }}
                />
            );
        })}
    </div>
    // </Router>
);
export default Admin;