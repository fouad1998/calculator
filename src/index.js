import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

class Lcd extends React.Component {
	constructor (props) {
		super(props)
	}

	render() {
		const style = {height: 70, width: '100%', color: '#c2b452', textAlign: "right"}
		const currentExpressionStyle = {height: 40, width: '100%',fontSize: 23}
		const expressionStyle = {height: 30, width: '100%'}
		return (<div className="lcd-watcher" style={style}>
			<div className="expression"  style={expressionStyle}>{this.props.expression}</div>
			<div className="current-click" id="display" style={currentExpressionStyle}>{this.props.currentExpression}</div>
		</div>)
	}
}

class ButtonCal extends React.Component {
  constructor(props) {
	super (props)
	this.styles = {
		normal: {width: 80, height: 65, fontSize: 23},
		ac: {width: 160, height: 65, fontSize: 23, background: '#dd1105'},
		equal: {width: 80, height: 65*2, fontSize: 24, position: 'absolute', bottom: '-1px', right: '0', background: "#22889f"},
		zero: {width: 160, height: 65, fontSize: 23},
		operator: {width: 80, height: 65, fontSize: 23},
	}

	this.buttonClick = this.buttonClick.bind(this)
	this.operatorClick = this.operatorClick.bind(this)
  }
  
  buttonClick () {
	let value = this.props.value;
	console.log(value, this.props);
	this.props.buttonClick(value);
  }

  operatorClick() {
	let value = this.props.value;
	this.props.operatorClick(value);
  }

  render() { 
	if (this.props.type === "normal" || this.props.type === "zero")
    	return (<button className="Button" id={this.props.id} onClick={this.buttonClick} style={this.styles[this.props.type]}>{this.props.value}</button>)
	else if (this.props.type === "operator")
		return (<button className="Button" id={this.props.id} onClick={this.operatorClick} style={this.styles[this.props.type]}>{this.props.value}</button>)
	else if (this.props.type === "ac")
		return (<button className="Button" id={this.props.id} onClick={this.props.acClick} style={this.styles[this.props.type]}>{this.props.value}</button>)
	else if (this.props.type === "equal")
		return (<button className="Button" id={this.props.id} onClick={this.props.equalClick} style={this.styles[this.props.type]}>{this.props.value}</button>)
	
	}
}

class Keyboard extends React.Component{

	constructor (props) {
		super(props)
	}

	render() {
		const style = {position: 'relative', height: 65*5, width: 80*4}
		return (<div className="keyboard" style={style}>
			<ButtonCal id="clear"  acClick={this.props.acClick} value="ac" type="ac" />
			<ButtonCal id="divide" operatorClick={this.props.operatorClick} value="/" type="operator" />
			<ButtonCal id="multiply" operatorClick={this.props.operatorClick} value="x" type="operator" />
			<ButtonCal id="seven" buttonClick={this.props.buttonClick} value="7" type="normal" />
			<ButtonCal id="eight" buttonClick={this.props.buttonClick} value="8" type="normal" />
			<ButtonCal id="nine" buttonClick={this.props.buttonClick} value="9" type="normal" />
			<ButtonCal id="subtract" operatorClick={this.props.operatorClick} value="-" type="operator" />
			<ButtonCal id="four" buttonClick={this.props.buttonClick} value="4" type="normal" />
			<ButtonCal id="five" buttonClick={this.props.buttonClick} value="5" type="normal" />
			<ButtonCal id="six" buttonClick={this.props.buttonClick} value="6" type="normal" />
			<ButtonCal id="add" operatorClick={this.props.operatorClick} buttonClick={this.props.buttonClick} value="+" type="operator" />
			<ButtonCal id="one" buttonClick={this.props.buttonClick} value="1" type="normal" />
			<ButtonCal id="two" buttonClick={this.props.buttonClick} value="2" type="normal" />
			<ButtonCal id="three" buttonClick={this.props.buttonClick} value="3" type="normal" />
			<ButtonCal id="zero" buttonClick={this.props.buttonClick} value="0" type="zero" />
			<ButtonCal id="decimal" buttonClick={this.props.buttonClick} value="." type="normal" />
			<ButtonCal id="equals" equalClick={this.props.equalClick} value="=" type="equal" />
		</div>)
	}
}
class Calculator extends React.Component {
  constructor(props) {
	super (props)
	this.state = {
		expression: "",
		clicked: "",
		currentExpression: '0',
		lastNumber: 0,
		previsoirResult: 0,
		results: 0,
		lastOperator: '+',
		lastCharIsOperator: false,
		cleanExpression: false,
		usedNegative: false,
	}
	this.buttonClick = this.buttonClick.bind(this);
	this.operatorClick = this.operatorClick.bind(this);
	this.acClick = this.acClick.bind(this);
	this.equalClick = this.equalClick.bind(this);
	this.keydownEvent = this.keydownEvent.bind(this);
  }

  keydownEvent(event) {
	  let key = event.key;
	  if (/[0-9]|\./.test(key)) {
		  this.buttonClick(key);
	  } else if (/[*-/+]/.test(key)) {
		  key = key == '*' ? 'x' : key;
		  this.operatorClick(key);
	  } else if (key.toLowerCase() == "enter") {
		  this.equalClick();
	  }
  }
  
  operation (n, s, o) {
	  n = n === '' ? 0 : n;
	  s = s === '' ? 0 : s;
	  switch(o) {
		  case '+' : return n + s;
		  case '-' : return n - s;
		  case 'x' : return n * s;
		  case '/' : return n / s;
	  }
	  return 0
  }

  buttonClick(value) {
	if (/[0-9]|\./.test(value)) {
		let currentExpression = this.state.currentExpression;
		let expression = this.state.expression;
		currentExpression = this.state.lastCharIsOperator && !this.state.usedNegative ? '' : currentExpression;
		let lastNumber = this.state.lastNumber;
		let results = this.state.results;
		let operator = this.state.lastOperator;
		if (this.state.cleanExpression) {
			lastNumber = 0;
			results = 0;
			operator = "+";
			expression = "0";
			currentExpression = "0";
		}
		currentExpression = currentExpression != '0' ? currentExpression : '';
		if (value === '.' && currentExpression.indexOf('.') === -1) {
			currentExpression = currentExpression === '' ? "0." : currentExpression + '.';
			expression = expression === '' ? '0' : expression;
			expression += value;
		} else if (value !== '.') {
			expression = expression != '0'? expression : '';
			currentExpression += value;
			expression += value;
		}
		results = this.operation(results, Number(currentExpression.replace('(', '')), operator)
		this.setState((state) => ({
			currentExpression,
			expression,
			lastNumber: Number(currentExpression.replace('(', '')),
			lastCharIsOperator: false,
			previsoirResult: results,
			cleanExpression: false
		}));
	}
  } 

  acClick() {
	this.setState({
		expression: "",
		clicked: "",
		currentExpression: '0',
		lastNumber: 0,
		results: 0,
		lastOperator: '+',
		lastCharIsOperator: false,
		cleanExpression: false,
		usedNegative: false	
	});
  }

  equalClick() {
	let plus = this.state.usedNegative ? ')' : '';
	  if (!this.state.lastCharIsOperator && !this.state.cleanExpression)
		this.setState((state) => ({
			cleanExpression: true,
			expression : state.expression + plus + "= " + state.previsoirResult,
			currentExpression: state.previsoirResult,
			lastNumber: 0,
			results: state.previsoirResult,
			usedNegative: false
		}));
  }

  operatorClick(value) {
	if (value === "x" || value === "-"  || value === "+" || value === "/") {
		let expression = this.state.expression;
		let currentExpression = this.state.currentExpression;
		if (this.state.cleanExpression) {
			expression = this.state.results;
		}
		currentExpression = value;
		if (this.state.lastCharIsOperator) {
			if (value === '-') {
				let usedNegative = true;
				if (expression.substr(expression.length - 2, 2) == '(-'){
					expression = expression.substring(0, expression.length - 2);
					currentExpression = ' ' + this.state.lastOperator + ' ';
					usedNegative = false; 
				}
				else{
					expression += '(-';
					currentExpression = '(-';
				}
				this.setState((state) => ({
					expression,
					currentExpression,
					cleanExpression: false,
					usedNegative
				}));
			}
			else if (!this.state.usedNegative){
				expression = expression.substring(0, expression.length-3) + ' ' + value + ' ';
				this.setState((state) => ({
					expression,
					currentExpression,
					lastOperator: value,
					cleanExpression: false
				}));
			}
		} else {
			if (this.state.usedNegative)
				expression += ')';
			expression += ' ' + value + ' ';
			this.setState((state) => ({
				lastNumber: 0,
				lastCharIsOperator: true,
				expression,
				currentExpression,
				lastOperator: value,
				results: state.previsoirResult,
				cleanExpression: 0,
				usedNegative: false
			}));
		}
	}
  }
  render() {
	  const style = {outline: "none"};
    return (<div tabIndex="0" style={style} onKeyDown={this.keydownEvent}>
		<Lcd currentExpression={this.state.currentExpression}  expression={this.state.expression}/>
		<Keyboard buttonClick={this.buttonClick} operatorClick={this.operatorClick} acClick={this.acClick} equalClick={this.equalClick} />
	</div>)
  }
}

ReactDOM.render(
	<React.StrictMode>
		<Calculator />
	</React.StrictMode>
	,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
