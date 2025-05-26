import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

// PUBLIC_INTERFACE
const TicTacToe = () => {
  /**
   * Main TicTacToe component that implements a classic Tic-Tac-Toe game 
   * with a 3x3 grid where two players take turns marking X and O.
   * The game tracks turns, detects wins/draws, and allows restarting.
   */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // true for X, false for O
  const [gameStatus, setGameStatus] = useState(''); // '', 'winner', or 'draw'
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    draws: 0
  });

  // Check for winner or draw after each move
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setGameStatus('winner');
      setWinner(result.winner);
      setWinningLine(result.line);
      
      // Update scores
      setScores(prevScores => ({
        ...prevScores,
        [result.winner]: prevScores[result.winner] + 1
      }));
    } else if (isBoardFull(board)) {
      setGameStatus('draw');
      
      // Update draw count
      setScores(prevScores => ({
        ...prevScores,
        draws: prevScores.draws + 1
      }));
    }
  }, [board]);

  // Handle square click
  const handleClick = (index) => {
    // Return if square is filled or game is over
    if (board[index] || gameStatus) return;

    // Create a new copy of the board
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';

    // Update state
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('');
    setWinner(null);
    setWinningLine([]);
  };

  // Determine current status message
  const getStatusMessage = () => {
    if (gameStatus === 'winner') {
      return `Winner: ${winner}`;
    } else if (gameStatus === 'draw') {
      return 'Game ended in a draw';
    } else {
      return `Current player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  // Render a single square
  const renderSquare = (index) => {
    const isWinningSquare = winningLine.includes(index);
    
    return (
      <button 
        className={`square ${board[index]} ${isWinningSquare ? 'winning' : ''}`} 
        onClick={() => handleClick(index)}
        disabled={gameStatus !== '' || board[index] !== null}
        aria-label={`square ${index}`}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="game">
      <h2 className="game-title">Tic-Tac-Toe Classic</h2>
      
      <div className="scoreboard">
        <div className="score">
          <div className="player">Player X</div>
          <div className="score-value">{scores.X}</div>
        </div>
        <div className="score">
          <div className="player">Draws</div>
          <div className="score-value">{scores.draws}</div>
        </div>
        <div className="score">
          <div className="player">Player O</div>
          <div className="score-value">{scores.O}</div>
        </div>
      </div>
      
      <div className="status-message">{getStatusMessage()}</div>
      
      <div className="game-board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      
      <button className="btn reset-button" onClick={resetGame}>
        Restart Game
      </button>
    </div>
  );
};

// Helper function to check if there's a winner
const calculateWinner = (squares) => {
  // All possible winning combinations
  const lines = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6]  // diagonal top-right to bottom-left
  ];

  // Check if any winning pattern is satisfied
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c]
      };
    }
  }
  return null;
};

// Helper function to check if the board is full (draw condition)
const isBoardFull = (squares) => {
  return squares.every(square => square !== null);
};

export default TicTacToe;
