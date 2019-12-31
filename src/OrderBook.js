import React, { Component } from 'react'
import 'react-perfect-scrollbar/dist/css/styles.css';
import './order-book.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

const URL = 'wss://api.delta.exchange:2096'

class OrderBook extends Component {
  state = {
    name: 'Bob',
    buys: [],
    sells: [],
  }
  ws = new WebSocket(URL)
  componentDidMount() {
    const that = this
    this.ws.onopen = () => {
    	// on connecting, do nothing but log it to the console
      that.sendPayload()

    }


    this.ws.onmessage = evt => {
     // on receiving a message, add it to the list of messages
     let data = JSON.parse(evt.data)
     this.addData(data)
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addData = data =>{
  	this.setState({buys: data.buy, sells: data.sell, last_sequence_no: data.last_sequence_no, symbol: data.symbol})
  }

  sendPayload = () => {
    const data = {"type":"subscribe","payload":{"channels":[{"name":"l2_orderbook","symbols":["BTCUSD"]}]}}
    this.ws.send(JSON.stringify(data))
  }

  render() {
  	let {buys, sells} = this.state
    return (
      <div className="container">
        <div className="col-md-12 mt-20">
        	<div className="row">
        	  <div className="col-md-2"></div>
        		<div className="col-md-4">
        			<h3><b>Buys</b></h3>
	        		<div className="table-view">
	      		 	  <PerfectScrollbar>
					       <table className="table table-hover">
					        <tbody>
					       	<tr><th>Limit</th><th>Size</th></tr>
					        {(buys || []).map((buy, i)=><tr key={i}><td>{buy.limit_price}</td><td>{buy.size}</td></tr>)}
					       	</tbody>
					       </table>
				        </PerfectScrollbar>
				      </div>
			      </div>
			      <div className="col-md-4">
			       	<h3><b>Sells</b></h3>
				      <div className="table-view">
			         	<PerfectScrollbar>
					       	<table className="table table-condensed table-hover">
					        	<tbody>
					       			<tr><th>Limit</th><th>Size</th></tr>
					        		{(sells || []).map((sell, i)=><tr key={i}><td>{sell.limit_price}</td><td>{sell.size}</td></tr>)}
					       		</tbody>
					       	</table>
				       	</PerfectScrollbar>
				      </div>
			      </div>
			      <div className="col-md-2"></div>
		      </div>
	      </div>
      </div>
    )
  }
}

export default OrderBook