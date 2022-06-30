//Following this here tutorial: https://reactjs.org/tutorial/tutorial.html

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

//value = {i} being passed via props
// class Square extends React.Component {
//   render() {
//     return (
//       //informs the board component when it is clicked via props
//       <button className="square" onClick={() => this.props.onClick()}>
//         {/* Re-render the square whenever its clicked  */}
//         {this.props.value}
//       </button>
//     );
//   }
//}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  //Square state being stored in Board component, not Square

  renderSquare(i) {
    return (
      //passing value and onClick props from Board to Square component
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  //board state being stored in game compoment
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      //initial state
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? ":3" : ">:(";
    this.setState({
      //concat doesn't mutate the original array
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      //set xIsNext to true if the number that we’re changing stepNumber to is even
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    //rendering game status
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //step = current history element value
    //move = current history element index
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next plater: " + (this.state.xIsNext ? ":3" : ">:(");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

//===========================Notes=====================================

//React classes have constructors....Initialising state

//In JavaScript classes, you need to always call super when defining the constructor of a subclass. All React component classes that have a constructor should start with a super(props) call.

//onClick prop on the built-in DOM <button> component tells React to set up a click event listener

//When the button is clicked, React will call the onClick event handler that is defined in Square component's render() method

//This event handler calls this.props.onClick(). Square's onClick prop specified by Board

//Since the board component passed onClick={() => this.handleClick(i)} to Square, the Square calls the Board's handleClick(i) when clicked
