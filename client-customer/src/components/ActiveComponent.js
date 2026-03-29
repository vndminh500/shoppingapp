import axios from 'axios';
import React, { Component } from 'react';

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtToken: ''
    };
  }

  // Event handler for the button click
  btnActiveClick = (e) => {
    e.preventDefault();
    const { txtID, txtToken } = this.state;

    if (txtID && txtToken) {
      this.apiActive(txtID, txtToken);
    } else {
      alert('Please input ID and Token');
    }
  };

  // API call logic
  apiActive(id, token) {
    const body = { id: id, token: token };
    axios.post('/api/customer/active', body)
      .then((res) => {
        const result = res.data;
        if (result) {
          alert('OK BABY!');
        } else {
          alert('SORRY BABY!');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('An error occurred during activation.');
      });
  }

  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">ACTIVE ACCOUNT</h2>
        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <input 
                    type="text" 
                    value={this.state.txtID} 
                    onChange={(e) => this.setState({ txtID: e.target.value })} 
                  />
                </td>
              </tr>
              <tr>
                <td>Token</td>
                <td>
                  <input 
                    type="text" 
                    value={this.state.txtToken} 
                    onChange={(e) => this.setState({ txtToken: e.target.value })} 
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input 
                    type="submit" 
                    value="ACTIVE" 
                    onClick={(e) => this.btnActiveClick(e)} 
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}

export default Active;