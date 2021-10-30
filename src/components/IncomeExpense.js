import React from "react";

const Ledger = (props) => {


    return (<div className="ledger">
        <div><h5>TOTAL INCOME</h5>
            {props.inc}
        </div>
        <div className="vline">
        </div>

        <div>
            <h5>TOTAL EXPENSES</h5>
            {props.exp}
        </div>

    </div>)
}

export default Ledger;