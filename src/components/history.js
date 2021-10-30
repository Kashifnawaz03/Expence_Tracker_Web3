import './style.css';
import React from "react";
//import { ContextApi } from './tranx';
const History = (props) => {
  
 const ev=props.name;
  return (<div>
    <h4>Previous Transactions</h4>
    <p>
    <table cellspacing="0" cellpadding="0" border="0">
    {
    ev?  ev.map((e) => {
        return(
          <tr>
            <td>TYPE
            <h6>{e.returnValues._type}</h6>  
            </td>
            <td>DETAIL
            <h6>{e.returnValues._data}</h6> 
            </td>
            <td>AMOUNT
            <h6>{e.returnValues._val}</h6> 
            </td>
          </tr>
      )
      }):""
    }
  </table>
    </p>
  </div>)
}

export default History;