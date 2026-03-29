import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = { products: [] };
  }
  render() {
    const prods = this.state.products.map((item) => (
      <div key={item._id} className="inline">
        <figure>
          <Link to={'/product/' + item._id}>
            <img src={"data:image/jpg;base64," + item.image} width="300px" height="300px" alt="" />
          </Link>
          <figcaption className="text-center">{item.name}<br />Price: {item.price}</figcaption>
        </figure>
      </div>
    ));
    return (
      <div className="text-center">
        <h2 className="text-center">LIST PRODUCTS</h2>
        {prods}
      </div>
    );
  }
  componentDidMount() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) { // Trường hợp tìm kiếm [cite: 901]
      this.apiGetProductsByKeyword(params.keyword);
    }
  }
  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) { // Cập nhật khi đổi từ khóa [cite: 916]
      this.apiGetProductsByKeyword(params.keyword);
    }
  }
  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      this.setState({ products: res.data });
    });
  }
  // API lấy sản phẩm theo từ khóa [cite: 928-933]
  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      this.setState({ products: res.data });
    });
  }
}
export default withRouter(Product);