import { useState } from "react";

export function useTicTacToe() {
  const [XOStatus, setXOStatus] = useState("O");
  const [firstTB, setFirstTB] = useState("");
  const [secondTB, setSecondTB] = useState("");
  const [thirdTB, setThirdTB] = useState("");
  const [forthTB, setForthTB] = useState("");
  const [fifthTB, setFifthTB] = useState("");
  const [sixthTB, setSixthTB] = useState("");
  const [sevenTB, setSeventhTB] = useState("");
  const [eigthTB, setEighthTB] = useState("");
  const [ninthTB, setNinthTB] = useState("");
  const [gameStatus, setGameStatus] = useState("");

  function changeFirstTable() {
    if (XOStatus === "O" && firstTB === "" && gameStatus === "") {
      setFirstTB("O");
      if (
        (secondTB === "O" && thirdTB === "O") ||
        (fifthTB === "O" && ninthTB === "O") ||
        (forthTB === "O" && sevenTB === "O")
      ) {
        setGameStatus("O Wins!");
      }
      if (
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("X");
    } else if (XOStatus === "X" && firstTB === "" && gameStatus === "") {
      setFirstTB("X");
      if (
        (secondTB === "X" && thirdTB === "X") ||
        (fifthTB === "X" && ninthTB === "X") ||
        (forthTB === "X" && sevenTB === "X")
      ) {
        setGameStatus("X Wins!");
      }
      if (
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("O");
    }
  }

  function changeSecondTable() {
    if (XOStatus === "O" && secondTB === "" && gameStatus === "") {
      setSecondTB("O");
      if (
        (firstTB === "O" && thirdTB === "O") ||
        (fifthTB === "O" && eigthTB === "O")
      ) {
        setGameStatus("O Wins!");
      }

      if (
        firstTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }

      setXOStatus("X");
    } else if (XOStatus === "X" && secondTB === "" && gameStatus === "") {
      setSecondTB("X");
      if (
        (firstTB === "X" && thirdTB === "X") ||
        (fifthTB === "X" && eigthTB === "X")
      ) {
        setGameStatus("X Wins!");
      }

      if (
        firstTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }

      setXOStatus("O");
    }
  }

  function changeThirdTable() {
    if (XOStatus === "O" && thirdTB === "" && gameStatus === "") {
      setThirdTB("O");
      if (
        (firstTB === "O" && secondTB === "O") ||
        (fifthTB === "O" && sevenTB === "O") ||
        (sixthTB === "O" && ninthTB === "O")
      ) {
        setGameStatus("O Wins!");
      }

      if (
        firstTB !== "" &&
        secondTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("X");
    } else if (XOStatus === "X" && thirdTB === "" && gameStatus === "") {
      setThirdTB("X");
      if (
        (firstTB === "X" && secondTB === "X") ||
        (fifthTB === "X" && sevenTB === "X") ||
        (sixthTB === "X" && ninthTB === "X")
      ) {
        setGameStatus("X Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("O");
    }
  }

  function changeForthTable() {
    if (XOStatus === "O" && forthTB === "" && gameStatus === "") {
      setForthTB("O");
      if (
        (firstTB === "O" && sevenTB === "O") ||
        (fifthTB === "O" && sixthTB === "O")
      ) {
        setGameStatus("O Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("X");
    } else if (XOStatus === "X" && forthTB === "" && gameStatus === "") {
      setForthTB("X");
      if (
        (firstTB === "X" && sevenTB === "X") ||
        (fifthTB === "X" && sixthTB === "X")
      ) {
        setGameStatus("X Wins!");
      }

      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("O");
    }
  }

  function changeFifthTable() {
    if (XOStatus === "O" && fifthTB === "" && gameStatus === "") {
      setFifthTB("O");
      if (
        (firstTB === "O" && ninthTB === "O") ||
        (thirdTB === "O" && sevenTB === "O") ||
        (secondTB === "O" && eigthTB === "O") ||
        (forthTB === "O" && sixthTB === "O")
      ) {
        setGameStatus("O Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("X");
    } else if (XOStatus === "X" && fifthTB === "" && gameStatus === "") {
      setFifthTB("X");
      if (
        (firstTB === "X" && ninthTB === "X") ||
        (thirdTB === "X" && sevenTB === "X") ||
        (secondTB === "X" && eigthTB === "X") ||
        (forthTB === "X" && sixthTB === "X")
      ) {
        setGameStatus("X Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("O");
    }
  }

  function changeSixthTable() {
    if (XOStatus === "O" && sixthTB === "" && gameStatus === "") {
      setSixthTB("O");
      if (
        (forthTB === "O" && fifthTB === "O") ||
        (thirdTB === "O" && ninthTB === "O")
      ) {
        setGameStatus("O Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("X");
    } else if (XOStatus === "X" && sixthTB === "" && gameStatus === "") {
      setSixthTB("X");
      if (
        (forthTB === "X" && fifthTB === "X") ||
        (thirdTB === "X" && ninthTB === "X")
      ) {
        setGameStatus("X Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("O");
    }
  }

  function changeSeventhTable() {
    if (XOStatus === "O" && sevenTB === "" && gameStatus === "") {
      setSeventhTB("O");
      if (
        (firstTB === "O" && forthTB === "O") ||
        (thirdTB === "O" && fifthTB === "O") ||
        (eigthTB === "O" && ninthTB === "O")
      ) {
        setGameStatus("O Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("X");
    } else if (XOStatus === "X" && sevenTB === "" && gameStatus === "") {
      setSeventhTB("X");
      if (
        (firstTB === "X" && forthTB === "X") ||
        (thirdTB === "X" && fifthTB === "X") ||
        (eigthTB === "X" && ninthTB === "X")
      ) {
        setGameStatus("X Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        eigthTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("O");
    }
  }

  function changeEighthTable() {
    if (XOStatus === "O" && eigthTB === "" && gameStatus === "") {
      setEighthTB("O");
      if (
        (secondTB === "O" && fifthTB === "O") ||
        (sevenTB === "O" && ninthTB === "O")
      ) {
        setGameStatus("O Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("X");
    } else if (XOStatus === "X" && eigthTB === "" && gameStatus === "") {
      setEighthTB("X");
      if (
        (secondTB === "X" && fifthTB === "X") ||
        (sevenTB === "X" && ninthTB === "X")
      ) {
        setGameStatus("X Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        ninthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("O");
    }
  }

  function changeNinthTable() {
    if (XOStatus === "O" && ninthTB === "" && gameStatus === "") {
      setNinthTB("O");
      if (
        (firstTB === "O" && fifthTB === "O") ||
        (thirdTB === "O" && sixthTB === "O") ||
        (sevenTB === "O" && eigthTB === "O")
      ) {
        setGameStatus("O Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("X");
    } else if (XOStatus === "X" && ninthTB === "" && gameStatus === "") {
      setNinthTB("X");
      if (
        (firstTB === "X" && fifthTB === "X") ||
        (thirdTB === "X" && sixthTB === "X") ||
        (sevenTB === "X" && eigthTB === "X")
      ) {
        setGameStatus("X Wins!");
      }
      if (
        firstTB !== "" &&
        secondTB !== "" &&
        thirdTB !== "" &&
        forthTB !== "" &&
        fifthTB !== "" &&
        sixthTB !== "" &&
        sevenTB !== "" &&
        eigthTB !== ""
      ) {
        setGameStatus("Draw!");
      }
      setXOStatus("O");
    }
  }

  function resetGame() {
    setXOStatus("O");
    setFirstTB("");
    setSecondTB("");
    setThirdTB("");
    setForthTB("");
    setFifthTB("");
    setSixthTB("");
    setSeventhTB("");
    setEighthTB("");
    setNinthTB("");
    setGameStatus("");
  }

  return {
    XOStatus,
    firstTB,
    secondTB,
    thirdTB,
    forthTB,
    fifthTB,
    sixthTB,
    sevenTB,
    eigthTB,
    ninthTB,
    gameStatus,
    changeFirstTable,
    changeSecondTable,
    changeThirdTable,
    changeForthTable,
    changeFifthTable,
    changeSixthTable,
    changeSeventhTable,
    changeEighthTable,
    changeNinthTable,
    resetGame,
  };
}
