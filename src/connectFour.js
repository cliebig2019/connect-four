import React from 'react';
import './connectFour.css';

class ConnectFour extends React.Component{
    render() {
        return (
          <div className="connect-four">
            <div className="description">
              <Description/>
            </div>
            <div className="game-board">
              <GameBoard/>
            </div>
          </div>
        );
      }
}
class GameBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            squares: Array(48).fill(null),
            xIsNext: true,
            lastMove: null,
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        
        if(calculateWinner(squares, this.state.lastMove)) {
            return;
        }
        for(let row = 5; row >=0 ; row--){
            if(squares[i + row * 7] === null) {
                squares[i + row * 7] = this.state.xIsNext ? 'X' : 'O';
                this.setState({
                    squares: squares,
                    xIsNext: !this.state.xIsNext,
                    lastMove: i + row * 7
                });
                break; 
            }
        }
    }

    renderSquare(i) {
        return ( 
            <Square
                value={this.state.squares[i]}
            />
        );
    }

    renderPlacer(i) {
        return (
            <Placer
                onClick={() => this.handleClick(i)}
            />
        );
    };

    restartGame = () => {
        this.setState({
            squares: Array(48).fill(null),
            xIsNext: this.state.xIsNext,
        })
    }

    render() {
        const winner = calculateWinner(this.state.squares, this.state.lastMove)
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
            <div className="board-placer">
                {this.renderPlacer(0)}
                {this.renderPlacer(1)}
                {this.renderPlacer(2)}
                {this.renderPlacer(3)}
                {this.renderPlacer(4)}
                {this.renderPlacer(5)}
                {this.renderPlacer(6)}
            </div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
              {this.renderSquare(6)}
            </div>
            <div className="board-row">
              {this.renderSquare(7)}
              {this.renderSquare(8)}
              {this.renderSquare(9)}
              {this.renderSquare(10)}
              {this.renderSquare(11)}
              {this.renderSquare(12)}
              {this.renderSquare(13)}
            </div>
            <div className="board-row">
              {this.renderSquare(14)}
              {this.renderSquare(15)}
              {this.renderSquare(16)}
              {this.renderSquare(17)}
              {this.renderSquare(18)}
              {this.renderSquare(19)}
              {this.renderSquare(20)}
            </div>
            <div className="board-row">
              {this.renderSquare(21)}
              {this.renderSquare(22)}
              {this.renderSquare(23)}
              {this.renderSquare(24)}
              {this.renderSquare(25)}
              {this.renderSquare(26)}
              {this.renderSquare(27)}
            </div>
            <div className="board-row">
              {this.renderSquare(28)}
              {this.renderSquare(29)}
              {this.renderSquare(30)}
              {this.renderSquare(31)}
              {this.renderSquare(32)}
              {this.renderSquare(33)}
              {this.renderSquare(34)}
            </div>
            <div className="board-row">
              {this.renderSquare(35)}
              {this.renderSquare(36)}
              {this.renderSquare(37)}
              {this.renderSquare(38)}
              {this.renderSquare(39)}
              {this.renderSquare(40)}
              {this.renderSquare(41)}
            </div>
          </div>
        );
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

function calculateWinner(squares, lastMove){
    let potentialWinner = squares[lastMove];
    // Check verticals
    let column = lastMove % 7;
    let squareColumn = squares.filter((element, index) => {
      return index % 7 === column;
    })
    if(winnerInLine(squareColumn, potentialWinner)) return potentialWinner;

    // Check horizontal
    let row = lastMove / 7;
    row = Math.floor(row);
    let squareRow = squares.slice(row * 7, row * 7 + 7);
    if(winnerInLine(squareRow, potentialWinner)) return potentialWinner;

    // Check diagonal down
    let diagonalDown = lastMove % 8;
    let squareDiagonalDown = squares.filter((element, index) =>{
      return index % 8 === diagonalDown
    })
    if(winnerInLine(squareDiagonalDown, potentialWinner)) return potentialWinner;

    // Check diagonal up
    let diagonalUp = lastMove % 6;
    let squareDiagonalUp = squares.filter((element, index) =>{
      return index % 6 === diagonalUp
    })
    if(winnerInLine(squareDiagonalUp, potentialWinner)) return potentialWinner;

    return false;
}

function winnerInLine(line, potentialWinner){
  let counterInARow = 0;
  for(let i = 0; i < line.length; i++){
    if(line[i] === potentialWinner) counterInARow += 1;
    else counterInARow = 0;
    if(counterInARow >= 4) return true
  }
  return false;
}


export default ConnectFour;