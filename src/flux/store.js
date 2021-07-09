import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";

let _store = {
  menuVisible: false,
  navItems: [
    {
      title: "Tổng quan",
      to: "/admin/dashboard",
      htmlBefore: '<i class="material-icons">dashboard</i>',
      htmlAfter: ""
    },
    {
      title: "Quản lý hiệu năng",
      htmlBefore: '<i class="material-icons">speed</i>',
      to: "/admin/performance",
    },
    // {
    //   title: "Blog Posts",
    //   htmlBefore: '<i class="material-icons">vertical_split</i>',
    //   to: "/blog-posts",
    // },
    // {
    //   title: "Add New Post",
    //   htmlBefore: '<i class="material-icons">note_add</i>',
    //   to: "/add-new-post",
    // },
    // {
    //   title: "Forms & Components",
    //   htmlBefore: '<i class="material-icons">view_module</i>',
    //   to: "/components-overview",
    // },
    {
      title: "Người dùng",
      htmlBefore: '<i class="material-icons">manage_accounts</i>',
      to: "/admin/users",
    },
    {
      title: "Từ khóa của bộ lọc",
      htmlBefore: '<i class="material-icons">format_list_bulleted</i>',
      to: "/admin/stop-words",
    },
    {
      title: "Cấu hình crawler",
      htmlBefore: '<i class="material-icons">settings</i>',
      to: "/admin/system-settings",
    },
    // {
    //   title: "Errors",
    //   htmlBefore: '<i class="material-icons">error</i>',
    //   to: "/errors",
    // }
  ]
};

class Store extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);

    Dispatcher.register(this.registerToActions.bind(this));
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.TOGGLE_SIDEBAR:
        this.toggleSidebar();
        break;
      default:
    }
  }

  toggleSidebar() {
    _store.menuVisible = !_store.menuVisible;
    this.emit(Constants.CHANGE);
  }

  getMenuState() {
    return _store.menuVisible;
  }

  getSidebarItems() {
    return _store.navItems;
  }

  addChangeListener(callback) {
    this.on(Constants.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback);
  }
}

export default new Store();
