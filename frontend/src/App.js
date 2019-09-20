import React, { Component, Fragment } from 'react';
import './bootstrap.min.css';
import Header from './components/Header.js';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Swal from 'sweetalert2';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      columns: [],
      checked: [],
      selectedKeys: []
    };
    this.handleSingleCheckboxChange = this.handleSingleCheckboxChange.bind(this);
  }  
  
  handleSingleCheckboxChange = (index,id) => {
    let checkedCopy = [...this.state.checked];
    let selectedKeysCopy = [...this.state.selectedKeys];    
    checkedCopy[index] = !this.state.checked[index];

    if (checkedCopy[index] === false) {
      let search = selectedKeysCopy.findIndex(x=> x === id);
      if (search !== -1) {
        selectedKeysCopy.splice(search,1);
        this.setState({ selectedKeys : selectedKeysCopy });
      }
    } else {
      selectedKeysCopy.push(id);
      this.setState({ selectedKeys : selectedKeysCopy });
    }

    this.setState({ checked: checkedCopy });
  };  

  async componentDidMount() {
    this.setupColumns();    
    await this.getInvoiceList();
  }

  setupColumns() {
    let columns = [
      {
        Header: <div></div>,
        Cell: row => (
          <input
            type="checkbox"
            checked={this.state.checked[row.index]}
            onChange={() => this.handleSingleCheckboxChange(row.index, row.row._id)}
          />
        ),
        sortable: false,
        filterable: false,
        headerStyle: {textAlign: 'left'},
        width: 35
      },      
      {
        Header:   "ID",
        accessor:  "_id",
        show: false
      },      
      {
        Header:   "Invoice Number",
        accessor:  "invoice_number"
      },
      {
        Header: "Vendor Name",
        accessor: "vendor_name"
      },
      {
        Header: "Vendor Address",
        accessor: "remittance_address"
      },
      {
        Header: "Invoice Total",
        accessor: "total"
      },
      {
        Header: "Invoice Date",
        accessor: "invoice_date"
      },
      {
        Header: "Due Date",
        accessor: "due_date"
      }      
    ];

    this.setState({
      columns : columns
    });
  }  

  getInvoiceList = async () => {
    const url = `http://localhost:3001/invoices/unapproved/
    `;

    const response = await fetch(url);
    const data = await response.json();

    var checkedCopy = [];
    data.forEach(function(e, index) {
      checkedCopy.push(false);
    });

    this.setState({
      data : data,
      checked: checkedCopy,
      selectedKeys: []
    });
  }

  sendToApprove = async () => {
    if (this.state.selectedKeys.length === 0) {
      Swal.fire({
        title: 'Message',
        text: 'Please select at least one invoice',
        type: 'error'
      });
    } else {
      let body = [];
      let selectedKeysCopy = [...this.state.selectedKeys];
      selectedKeysCopy.forEach(element => {
        body.push({ _id: element });
      });
      const rawResponse = await fetch('http://localhost:3001/invoices/approved/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      await rawResponse.json();
      await this.getInvoiceList();
      Swal.fire({
        title: 'Message',
        text: 'Invoices were approved',
        type: 'success'
      });    
    }
  }  

  render() {
    return (
      <Fragment>
        <div className="container">      
          <div className="row">
            <div className="mt-2 col-md-12 mx-auto">
              <Header
                titulo='Invoice List'
              />
            </div>
          </div>                  
          <div className="row">
            <div className="col-md-12 mx-auto">
              <button onClick={this.sendToApprove} className="py-3 mt-2 btn btn-success btn-block" value="Approve">Approve</button>
            </div>            
          </div>          
          <div className="row">
            <div className="col-md-12 mx-auto">
              <div className="card">
                <div className="card-body">
                  <ReactTable
                    data={this.state.data}
                    columns={this.state.columns}
                    defaultPageSize={10}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>        
      </Fragment>
    );
  }
}

export default App;
