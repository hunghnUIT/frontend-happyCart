import React from "react";
import { Router, Route } from "react-router-dom"; // eslint-disable-line no-unused-vars

import DefaultLayout from '../../layouts/Default';
import Dashboard from './Dashboard';
import UserManagement from './userManagement/UserManagement';


import "bootstrap/dist/css/bootstrap.min.css";
import "../../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

const routes = [
    {
        path: "/users",
        layout: DefaultLayout,
        component: UserManagement,
    },
    {
        path: "/dashboard",
        layout: DefaultLayout,
        component: Dashboard
    },
]

export default function Admin({...props}) {
    return (
        // <Router basename={process.env.REACT_APP_BASENAME || ""}>
        <div>
            {routes.map((route, index) => {
                return (
                    <Route
                        key={index}
                        path={`${props.match.path}${route.path}`}
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
    )};