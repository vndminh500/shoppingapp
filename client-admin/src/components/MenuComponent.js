import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';

class Menu extends Component {
  static contextType = MyContext; // Sử dụng context để truy cập trạng thái toàn cục

  render() {
    return (
      <div className="border-bottom">
        <div className="float-left">
          <ul className="menu">
            <li className="menu"><Link to='/admin/home'>Home</Link></li>
            <li className="menu"><Link to='/admin/category'>Category</Link></li>
            <li className="menu"><Link to='/admin/product'>Product</Link></li>
            <li className="menu"><Link to='/admin/order'>Order</Link></li>
             <li className="menu"><Link to='/admin/customer'>Customer</Link></li>
          </ul>
        </div>
        <div className="float-right">
          Hello <b>{this.context.username}</b> | 
          <Link to='/admin/home' onClick={() => this.lnkLogoutClick()}>Logout</Link>
        </div>
        <div className="float-clear" />
      </div>
    );
  }

  // Xử lý sự kiện nhấn nút Logout
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}

export default Menu;