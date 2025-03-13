import { useState } from "react";
import "./App.css";
import confetti from "canvas-confetti";

function App() {
  const TURNS = {
    x: "x",
    o: "o",
  };

  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.x);
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setTurn(TURNS.x);
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndBoard(newBoard)) {
      setWinner(false);
    }

    setTurn(turn === TURNS.x ? TURNS.o : TURNS.x);
  };

  const checkWinnerFrom = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  const checkEndBoard = (board) => {
    return board.every((cell) => cell !== null);
  };

  const Square = ({ index, updateBoard, children, isSelected, className }) => (
    <button
      className={`square ${isSelected ? "selected" : ""} ${className}`}
      onClick={() => updateBoard(index)}
    >
      {children}
    </button>
  );

  return (
    <>
      <main className="board">
        <h1>Tic Tac Toe</h1>

        <section className="game">
          {board.map((cell, index) => (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {cell}
            </Square>
          ))}
        </section>

        <section className="turn">
          <Square isSelected={turn === TURNS.x} className="turn-x">
            {TURNS.x}
          </Square>
          <Square isSelected={turn === TURNS.o} className="turn-o">
            {TURNS.o}
          </Square>
        </section>

        {winner !== null && (
          <section className="winner">
            <div className="text">
              <h2>{winner === false ? "Empate" : "Gana"}</h2>

              <header className="win">
                {winner && <Square>{winner}</Square>}
              </header>

              <footer>
                <button onClick={resetGame}>Empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default App;
