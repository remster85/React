function Square(props) {
  return (
    <button className={props.style} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    

    if(this.props.win && this.props.win.includes(i)){
        style = 'square squarewinner';
    }else if(this.props.currentselection && this.props.currentselection == i){
        style = 'square highlightedsquare';
    }else{
        style = 'square';
     }
 
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        style={style}
        key={i.toString()}
        
      />
    );
  }
  
  render() {
      var rows = [];
      for (var j = 0; j < 3; j++) {
        var squares = [];
        for (var i = 0; i < 3; i++) {
            squares.push(this.renderSquare(j * 3 + i));
        }
        rows.push(<div key ={j} className="board-row">{squares}</div>)
      }

    return (
      <div>
          {rows}        
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        }
      ],
      positions : [],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const positions = this.state.positions.slice();
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    positions.push(i);
    
    this.setState({
      history: history.concat([
        {
         squares: squares,
        }
      ]),
      positions: positions,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  
  getPositionDescr(i){
    var row =  Math.floor(i / 3);
    var col = i - row * 3;
    return row + ',' + col
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const winningsquares = getWinningSquares(current.squares);
    const win = winningsquares;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + '(' + this.getPositionDescr(this.state.positions[move-1]) + ')':
        'Go to game start';
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
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            win={win}
            currentselection={this.state.positions[this.state.stepNumber-1]}
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

ReactDOM.render(<Game />, document.getElementById("root"));


function getWinningSquares(squares){
   const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return [];
  
  
}

function calculateWinner(squares) {
  const winningsquares = this.getWinningSquares(squares);
  if(winningsquares){
    return squares[winningsquares[0]];
  }
  return null;
}



function calculateWinnerOld(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
