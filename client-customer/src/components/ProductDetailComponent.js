import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext; // Kết nối với context để dùng mycart
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1
    };
  }

  render() {
    const prod = this.state.product;
    if (prod != null) { 
      return (
        <div className="align-center">
          <h2 className="text-center">PRODUCT DETAILS</h2>
          <figure className="caption-right">
            <img src={"data:image/jpg;base64," + prod.image} width="400px" height="400px" alt="" />
            <figcaption>
              <form>
                <table>
                  <tbody>
                    <tr>
                      <td align="right">ID:</td>
                      <td>{prod._id}</td>
                    </tr>
                    <tr>
                      <td align="right">Name:</td>
                      <td>{prod.name}</td>
                    </tr>
                    <tr>
                      <td align="right">Price:</td>
                      <td>{prod.price}</td>
                    </tr>
                    <tr>
                      <td align="right">Category:</td>
                      <td>{prod.category.name}</td>
                    </tr>
                    <tr>
                      <td align="right">Quantity:</td>
                      <td>
                        <input type="number" min="1" max="99" value={this.state.txtQuantity} onChange={(e) => { this.setState({ txtQuantity: e.target.value }) }} />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <input type="submit" value="ADD TO CART" onClick={(e) => this.btnAdd2CartClick(e)} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </figcaption>
          </figure>
        </div>
      );
    }
    return (<div />);
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id); // Lấy ID từ URL để gọi API [cite: 1080]
  }

  // apis
  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    });
  }

  // event-handlers
  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
    if (quantity > 0) {
      const mycart = this.context.mycart;
      const index = mycart.findIndex(item => item.product._id === product._id); // Kiểm tra sản phẩm đã tồn tại chưa
      if (index === -1) { // Nếu chưa có: Thêm mới
        const item = { product: product, quantity: quantity };
        mycart.push(item);
      } else { // Nếu đã có: Cộng dồn số lượng
        mycart[index].quantity += quantity;
      }
      this.context.setMycart(mycart); // Lưu lại vào Global State
      alert('OK BABY!');
    } else {
      alert('Please input quantity');
    }
  }
}
export default withRouter(ProductDetail);