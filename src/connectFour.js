import React from 'react';
import './connectFour.css';

let numberOfRows = 6;
let numberOfColumns = 7;
let numberOfPiecesToWin = 4;

class ConnectFour extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        numberOfRowsForNext: numberOfRows,
        numberOfColumnsForNext: numberOfColumns,
        numberOfPiecesToWinForNext: numberOfPiecesToWin,
      }
    }
    settingsUpdate(numOfRows, numOfColumns, numOfPiecesToWin){
      this.setState({
        numberOfRowsForNext: numOfRows,
        numberOfColumnsForNext: numOfColumns,
        numberOfPiecesToWinForNext: numOfPiecesToWin,
      })
    }
    restartGame(){
      numberOfRows = this.state.numberOfRowsForNext;
      numberOfColumns = this.state.numberOfColumnsForNext;
      numberOfPiecesToWin = this.state.numberOfPiecesToWinForNext;
    }

    render() {
      return (
        <div className="connect-four">
          <div className="settings">
            <Settings
              updateSettings={(numberOfRows, numberOfcolumns, numOfPiecesToWin) => this.settingsUpdate(numberOfRows, numberOfcolumns, numOfPiecesToWin)}
            />
          </div>
          <div className="description">
            <Description/>
          </div>
          <div className="game-board">
            <GameBoard
              restart = {() => this.restartGame()}
            />
          </div>
        </div>
      );
      }
}

class GameBoard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      squares: Array(numberOfRows * numberOfColumns).fill(null),
      xIsNext: true,
      lastMove: null,
    }
  }

  // Executes the move
  handleClick(i) {
    const squares = this.state.squares.slice();
    
    if(calculateWinner(squares, this.state.lastMove)) {
      return;
    }
    for(let row = numberOfRows-1; row >=0 ; row--){
      if(squares[i + row * numberOfColumns] === null) {
        squares[i + row * numberOfColumns] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          squares: squares,
          xIsNext: !this.state.xIsNext,
          lastMove: i + row * numberOfColumns,
        });
        break; 
      }
    }
  }

  // Creates the squares for the game board
  createSquares(amountOfRows, amountOfcolumns){
    const rows = [];
    for(let i = 0; i < amountOfRows; i++){
      let row = [];
      for(let k = 0; k < amountOfcolumns; k++){
        row.push(this.renderSquare(i * amountOfcolumns + k));
      }
      rows.push(<div className="board-row" key={i}>{row}</div>);
    }
    return rows;
  }

  // Creates the placer buttons above the columns
  createPlacers(amountOfcolumns){
    const placers = [];
    for(let i = 0; i < amountOfcolumns; i++){
      placers.push(this.renderPlacer(i));
    }
    return (<div className="board-placer" key="placers">{placers}</div>)
  }

  // Render a single square
  renderSquare(i) {
    return ( 
      <Square
        value = {this.state.squares[i]}
      />
    );
  }

  // Render a single placer
  renderPlacer(i) {
    return (
      <Placer
        onClick={() => this.handleClick(i)}
      />
    );
  };

  // Restart the game and empty the board
  restartGame = () => {
    this.props.restart()
    this.setState({
      squares: Array(numberOfRows * numberOfColumns).fill(null),
      xIsNext: this.state.xIsNext,
    })
  }

  render() {
    const winner = calculateWinner(this.state.squares, this.state.lastMove);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Turn: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div>
        <div className="status">{status}</div>
        <button onClick={this.restartGame} id="restart-game">Restart game</button>
        {this.createPlacers(numberOfColumns)}
        {this.createSquares(numberOfRows, numberOfColumns)}
      </div>
    );
  }
}

class Settings extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      numOfRows: numberOfRows,
      numOfColumns: numberOfColumns,
      numOfPiecesToWin: numberOfPiecesToWin,
    }
    this.handleChangeOfRows = this.handleChangeOfRows.bind(this);
    this.handleChangeOfColumns = this.handleChangeOfColumns.bind(this);
    this.handleChangeOfPiecesToWin = this.handleChangeOfPiecesToWin.bind(this);
  }

  handleChangeOfRows = (e) => {
    this.setState({numOfRows: e.target.value});
    this.props.updateSettings(e.target.value, this.state.numOfColumns, this.state.numOfPiecesToWin);
  }
  
  handleChangeOfColumns = (e) =>{
    this.setState({numOfColumns: e.target.value});
    this.props.updateSettings(this.state.numOfRows, e.target.value, this.state.numOfPiecesToWin);
  }

  handleChangeOfPiecesToWin = (e) =>{
    this.setState({numOfPiecesToWin: e.target.value});
    this.props.updateSettings(this.state.numOfRows, this.state.numOfColumns, e.target.value);
  }

  render() {
    return (
      <div id="settings">
        <div className="heading">Settings</div>
        Number of Rows:
        <input type="number" value={this.state.numOfRows} onChange={this.handleChangeOfRows} />
        <p></p>
        Number of Columns:
        <input type="number" value={this.state.numOfColumns} onChange={this.handleChangeOfColumns} />
        <p></p>
        Number of pieces in a line to win:
        <input type="number" value={this.state.numOfPiecesToWin} onChange={this.handleChangeOfPiecesToWin} />
        <p></p>
        <div>Click on restart game to start a game with the new settings</div>
      </div>
    )
  }
}

function Description(){
  return (
    <div>
      <p id="title">A game of connect-four</p>
      <p>Press the buttons above the columns to place your pieces</p>
    </div>
  )
}

function Placer(props){
  return (
    <button className="placer" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Square(props) {
  return (
    <div className={`square ${props.value}`}>
      {props.value}
    </div>
  );
}

// Given the board consisting of squares check for a winner
function calculateWinner(squares, lastMove){
  let potentialWinner = squares[lastMove];

  // Check verticals
  let column = lastMove % numberOfColumns;
  let squareColumn = squares.filter((element, index) => {
    return index % numberOfColumns === column;
  })
  if(winnerInLine(squareColumn, potentialWinner)) return potentialWinner;

  // Check horizontal
  let row = lastMove / numberOfColumns;
  row = Math.floor(row);
  let squareRow = squares.slice(row * numberOfColumns, row * numberOfColumns + numberOfColumns);
  if(winnerInLine(squareRow, potentialWinner)) return potentialWinner;

  // Check diagonal down
  let diagonalDown = lastMove % (numberOfColumns + 1);
  let squareDiagonalDown = squares.map((element, index) => {
    return {element: element, index: index};
  }).filter(x => {return x.index % (numberOfColumns + 1) === diagonalDown})
  if(winnerInDiagonal(squareDiagonalDown, potentialWinner)) return potentialWinner;

  // Check diagonal up
  let diagonalUp = lastMove % (numberOfColumns - 1);
  let squareDiagonalUp = squares.map((element, index) => {
    return {element: element, index: index};
  }).filter(x => {return x.index % (numberOfColumns - 1) === diagonalUp})
  if(winnerInDiagonal(squareDiagonalUp, potentialWinner)) return potentialWinner;

  return false;
}

// Check if there is a winner in a single line ingame
function winnerInLine(line, potentialWinner){
  let counterInARow = 0;
  for(let i = 0; i < line.length; i++){
    if(line[i] === potentialWinner) counterInARow += 1;
    else counterInARow = 0;
    if(counterInARow >= numberOfPiecesToWin) return true;
  }
  return false;
}

function winnerInDiagonal(diagonal, potentialWinner){
  let counterInARow = 0;
  for(let i = 0; i < diagonal.length; i++){
    if(diagonal[i]["element"] === potentialWinner) counterInARow += 1;
    else counterInARow = 0;
    if(i !== 0 && Math.abs(diagonal[i]["index"] % numberOfColumns - (diagonal[i-1]["index"] % numberOfColumns)) !== 1){
      counterInARow = 1;
    }
    if(counterInARow >= numberOfPiecesToWin) return true;
  }
  return false;
}

export default ConnectFour;