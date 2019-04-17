import React, { Component } from "react";
import "./App.css";

function MessageBox(props) {
  return <input type="textbox" onChange={props.onChange} />;
}

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = props.onSubmit;
    this.state = { msgText: "" };
  }

  handleOnMessageBoxChange(ev) {
    this.setState({ msgText: ev.currentTarget.value });
  }

  onSubmitButtonClicked() {
    this.onSubmit(this.state.msgText);
  }

  render() {
    return (
      <div>
        <MessageBox onChange={this.handleOnMessageBoxChange.bind(this)} />
        <button onClick={this.onSubmitButtonClicked.bind(this)}>Submit</button>
      </div>
    );
  }
}

function ReplyMsg(props) {
  return <p>{props.text}</p>;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { replyMsg: "Ganesh" };
  }

  async handleOnSubmit(text) {
    let response = await fetch("/msg", {
      method: "POST",
      body: text
    });
    let replyMsg = await response.text();
    this.setState({ replyMsg });
  }

  render() {
    return (
      <div>
        <ChatBox onSubmit={this.handleOnSubmit.bind(this)} />
        <ReplyMsg text={this.state.replyMsg} />
      </div>
    );
  }
}

export default App;
