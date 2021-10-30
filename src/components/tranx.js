import './style.css';
import React, { useState} from "react";
import History from "./history";
import Ledger from "./IncomeExpense";
import BalanceCheck from "./balance";

const Web3 = require('web3')
const Tx = require("ethereumjs-tx").Transaction;

const infura_link = "https://ropsten.infura.io/v3/fa46fd160fd847c39ce43273c683de53";
const deployed_contract_address = "0xa0f88C95851891feb5A3e5761fe8e135D6db481f";
const account1_public_address = "0x579a84923cB461E5a130B1Bfd28480834781C470";
const account1_privatekey = Buffer.from("d225ffdc07585f0bb743eb515c478869d34a1be7756be415ccec224a13af7352", 'hex');
const web3 = new Web3(infura_link);

const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "_data",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "_val",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_type",
				"type": "string"
			}
		],
		"name": "Tranx",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "dt",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "exp",
				"type": "int256"
			}
		],
		"name": "Expense",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "GetExpense",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "GetIncome",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "dt",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "inc",
				"type": "int256"
			}
		],
		"name": "Income",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "bals",
				"type": "int256"
			}
		],
		"name": "currentBal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentBalance",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contract = new web3.eth.Contract(ABI, deployed_contract_address);


function Transaction() {
	const [text, setText] = useState();
	const [num, setNum] = useState(0);
	const [event, setEvent] = useState();
	const [inc, setInc] = useState(0);
	const [exp, setExp] = useState(0);
	const [balance, setBalance] = useState(0);
	const state = {
		bal: balance,
		Income: inc,
		Expense: exp,
		AllEvents: event
	}

	function ExpenseTransaction() {
		async function doTrnx() {
			try {
				const txCount = await web3.eth.getTransactionCount(account1_public_address);
				const TxObject = {
					nonce: web3.utils.toHex(txCount),
					data: contract.methods.Expense(text, Math.abs(num)).encodeABI(),
					to: "0x579a84923cB461E5a130B1Bfd28480834781C470",
					gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gWei')),
					gasLimit: web3.utils.toHex(3000000)
				}
				const tx = new Tx(TxObject, { 'chain': 'ropsten' });
				tx.sign(account1_privatekey);
				const serializedTX = tx.serialize();
				const raw = '0x' + serializedTX.toString('hex');
				 await web3.eth.sendSignedTransaction(raw);
				console.log("Transaction Succesful");
				eventFunction();
				ap();
			} catch (err) {
				console.log("This is Error:", err);
			}
		}
		doTrnx();
	}


	function IncomeTransaction() {
		async function doTrnx() {
			try {
				const txCount = await web3.eth.getTransactionCount(account1_public_address);
				const TxObject = {
					nonce: web3.utils.toHex(txCount),
					data: contract.methods.Income(text, num).encodeABI(),
					to: "0x579a84923cB461E5a130B1Bfd28480834781C470",
					gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gWei')),
					gasLimit: web3.utils.toHex(3000000)
				}
				const tx = new Tx(TxObject, { 'chain': 'ropsten' });
				tx.sign(account1_privatekey);
				const serializedTX = tx.serialize();
				const raw = '0x' + serializedTX.toString('hex');
				 await web3.eth.sendSignedTransaction(raw);
				console.log("Transaction Succesful");
				eventFunction();
				ap();
			} catch (err) {
				console.log("This is Error:", err);
			}
		}
		doTrnx();
	}


	function ap() {
		contract.methods.getCurrentBalance().call((err, result) => {
			if (!err) {
				console.log("reuturned value of retrieve", result);
				setBalance(result);
			}
			else {
				console.log("Returned Error", err);
			}
		});

		contract.methods.GetExpense().call((err, result) => {
			if (!err) {
				console.log("reuturned value of retrieve", result);
				setExp(result);
			}
			else {
				console.log("Returned Error", err);
			}
		});

		contract.methods.GetIncome().call((err, result) => {
			if (!err) {
				console.log("reuturned value of retrieve", result);
				setInc(result);
				
			}
			else {
				console.log("Returned Error", err);
			}
		});
	}

	const eventFunction = async () => {
		try {
			let getAllEvent = await contract.getPastEvents("AllEvents", {
				fromBlock: 0,
				toBlock: "latest"
			});
			setEvent(getAllEvent);


		} catch (err) {
			console.log(err);
		}
	}

	return (<div>
		
		<div>
			<BalanceCheck name={state.bal} />
			<Ledger inc={state.Income} exp={state.Expense} />
			<History name={event} />
			<br />
			<h5>ADD TRANSACTION</h5>
			<input type="text" value={text} id="ex" onChange={(e) => setText(e.target.value)} placeholder="Enter Details..." />
			<br />
			<input type="number" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Enter Number..." />

			<button onClick={() => {
			if (num > 0) {
				console.log("Positive")
				IncomeTransaction();

			}
			else {
				console.log("Negative")
				ExpenseTransaction();
			}
		}}>Process Transaction</button>


		</div>
		


	</div>)
}

export default Transaction;