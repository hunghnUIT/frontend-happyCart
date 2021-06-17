import React from "react";
import { Nav } from "shards-react";

// import Notifications from "./Notifications";
import UserActions from "./UserActions";

const NavBarNav = (props) => (
  <Nav navbar className="border-left flex-row">
    {/* <Notifications /> */}
    <UserActions history={props.history}/>
  </Nav>
);
export default NavBarNav;