"use client";
import { Grid } from "@mantine/core";
import react, { useState } from "react";

const Page = () => {
  // useState variable for indicate whether should label O or X
  const [XOStatus, setXOStatus] = useState("O");
  // useState for the first Table
  const [firstTB, setFirstTB] = useState("");
  // useState for the second table
  const [secondTB, setSecondTB] = useState("");
  // useState for the third table
  const [thirdTB, setThirdTB] = useState("");
  // useState for the forth table
  const [forthTB, setForthTB] = useState("");
  //useState for the fifth table
  const [fifthTB, setFifthTB] = useState("");
  //useState for the sixth table
  const [sixthTB, setSixthTB] = useState("");
  //useState for the seventh table
  const [sevenTB, setSeventhTB] = useState("");
  //useState for the eighth table
  const [eigthTB, setEighthTB] = useState("");
  //useState for the ninth table
  const [ninthTB, setNinthTB] = useState("");

  //useStatee for the game status
  const [gameStatus, setGameStatus] = useState("");

  //useState for showing restart button
  const [restartButton, setRestartButton] = useState(
    "Play Again",
    // <button
    //   className="bg-green-400 px-2 cursor-pointer rounded-sm"
    //   onClick={() => {
    //     setFirstTB("");
    //     setSecondTB("");
    //     setThirdTB("");
    //     setForthTB("");
    //     setFifthTB("");
    //     setSixthTB("");
    //     setSeventhTB("");
    //     setEighthTB("");
    //     setNinthTB("");
    //     setXOStatus("O");
    //     setGameStatus("");
    //   }}
    // >
    //   Play Again
    // </button>
  );

  //function for setting the first table value
  function changeFirstTable() {
    if (XOStatus == "O" && firstTB == "" && gameStatus == "") {
      setFirstTB("O");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (secondTB == "O" && thirdTB == "O") ||
        (fifthTB == "O" && ninthTB == "O") ||
        (forthTB == "O" && sevenTB == "O")
      ) {
        setGameStatus("O won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("X");
    } else if (XOStatus == "X" && firstTB == "" && gameStatus == "") {
      setFirstTB("X");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (secondTB == "X" && thirdTB == "X") ||
        (fifthTB == "X" && ninthTB == "X") ||
        (forthTB == "X" && sevenTB == "X")
      ) {
        setGameStatus("X won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }
      setXOStatus("O");
    } else {
    }
  }

  //function for setting the second table value
  function changeSecondTable() {
    if (XOStatus == "O" && secondTB == "" && gameStatus == "") {
      setSecondTB("O");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "O" && thirdTB == "O") ||
        (fifthTB == "O" && eigthTB == "O")
      ) {
        setGameStatus("O won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("X");
    } else if (XOStatus == "X" && secondTB == "" && gameStatus == "") {
      setSecondTB("X");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "X" && thirdTB == "X") ||
        (fifthTB == "X" && eigthTB == "X")
      ) {
        setGameStatus("X won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("O");
    } else {
    }
  }

  //function for setting the third table value
  function changeThirdTable() {
    if (XOStatus == "O" && thirdTB == "" && gameStatus == "") {
      setThirdTB("O");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "O" && secondTB == "O") ||
        (sixthTB == "O" && ninthTB == "O") ||
        (fifthTB == "O" && sevenTB == "O")
      ) {
        setGameStatus("O won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("X");
    } else if (XOStatus == "X" && thirdTB == "" && gameStatus == "") {
      setThirdTB("X");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "X" && secondTB == "X") ||
        (sixthTB == "X" && ninthTB == "X") ||
        (fifthTB == "X" && sevenTB == "X")
      ) {
        setGameStatus("X won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("O");
    } else {
    }
  }

  //function for setting the forth table value
  function changeForthTable() {
    if (XOStatus == "O" && forthTB == "" && gameStatus == "") {
      setForthTB("O");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "O" && sevenTB == "O") ||
        (fifthTB == "O" && sixthTB == "O")
      ) {
        setGameStatus("O won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("X");
    } else if (XOStatus == "X" && forthTB == "" && gameStatus == "") {
      setForthTB("X");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "x" && sevenTB == "X") ||
        (fifthTB == "X" && sixthTB == "X")
      ) {
        setGameStatus("X won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("O");
    } else {
    }
  }

  //function for setting the fifth table value
  function changeFifthTable() {
    if (XOStatus == "O" && fifthTB == "" && gameStatus == "") {
      setFifthTB("O");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "O" && ninthTB == "O") ||
        (thirdTB == "O" && sevenTB == "O") ||
        (secondTB == "O" && eigthTB == "O") ||
        (forthTB == "O" && sixthTB == "O")
      ) {
        setGameStatus("O won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("X");
    } else if (XOStatus == "X" && fifthTB == "" && gameStatus == "") {
      setFifthTB("X");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "X" && ninthTB == "X") ||
        (thirdTB == "X" && sevenTB == "X") ||
        (secondTB == "X" && eigthTB == "X") ||
        (forthTB == "X" && sixthTB == "X")
      ) {
        setGameStatus("X won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("O");
    } else {
    }
  }

  //function for setting the sixth table value
  function changeSixthTable() {
    if (XOStatus == "O" && sixthTB == "" && gameStatus == "") {
      setSixthTB("O");
      /*if either one of this is true, it will change the game
      status to end */
      if (
        (thirdTB == "O" && ninthTB == "O") ||
        (forthTB == "O" && fifthTB == "O")
      ) {
        setGameStatus("O won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("X");
    } else if (XOStatus == "X" && sixthTB == "" && gameStatus == "") {
      setSixthTB("X");

      /*if either one of this is true, it will change the game
      status to end */
      if (
        (thirdTB == "X" && ninthTB == "X") ||
        (forthTB == "X" && fifthTB == "X")
      ) {
        setGameStatus("X won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sevenTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("O");
    } else {
    }
  }

  //function for setting the seventh table value
  function changeSeventhTable() {
    if (XOStatus == "O" && sevenTB == "" && gameStatus == "") {
      setSeventhTB("O");
      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "O" && forthTB == "O") ||
        (eigthTB == "O" && ninthTB == "O") ||
        (fifthTB == "O" && thirdTB == "O")
      ) {
        setGameStatus("O won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("X");
    } else if (XOStatus == "X" && sevenTB == "" && gameStatus == "") {
      setSeventhTB("X");
      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "X" && forthTB == "X") ||
        (eigthTB == "X" && ninthTB == "X") ||
        (fifthTB == "X" && thirdTB == "X")
      ) {
        setGameStatus("X won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        eigthTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("O");
    } else {
    }
  }

  //function for setting the eighth table value
  function changeEighthTable() {
    if (XOStatus == "O" && eigthTB == "" && gameStatus == "") {
      setEighthTB("O");
      /*if either one of this is true, it will change the game
      status to end */
      if (
        (secondTB == "O" && fifthTB == "O") ||
        (sevenTB == "O" && ninthTB == "O")
      ) {
        setGameStatus("O won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("X");
    } else if (XOStatus == "X" && eigthTB == "" && gameStatus == "") {
      setEighthTB("X");
      /*if either one of this is true, it will change the game
      status to end */
      if (
        (secondTB == "X" && fifthTB == "X") ||
        (sevenTB == "X" && ninthTB == "X")
      ) {
        setGameStatus("X won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        ninthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("O");
    } else {
    }
  }

  //function for setting the ninth table value
  function changeNinthTable() {
    if (XOStatus == "O" && ninthTB == "" && gameStatus == "") {
      setNinthTB("O");
      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "O" && fifthTB == "O") ||
        (thirdTB == "O" && sixthTB == "O") ||
        (sevenTB == "O" && eigthTB == "O")
      ) {
        setGameStatus("O won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != ""
      ) {
        setGameStatus("draw");
      }

      setXOStatus("X");
    } else if (XOStatus == "X" && ninthTB == "" && gameStatus == "") {
      setNinthTB("X");
      /*if either one of this is true, it will change the game
      status to end */
      if (
        (firstTB == "X" && fifthTB == "X") ||
        (thirdTB == "X" && sixthTB == "X") ||
        (sevenTB == "X" && eigthTB == "X")
      ) {
        setGameStatus("X won");
      }

      /*if all the other tables is filled, the game is draw */
      if (
        firstTB != "" &&
        secondTB != "" &&
        thirdTB != "" &&
        forthTB != "" &&
        fifthTB != "" &&
        sixthTB != "" &&
        sevenTB != "" &&
        eigthTB != ""
      ) {
        setGameStatus("draw");
      }
      //
      setXOStatus("O");
    } else {
    }
  }

  // group-hover:opacity-100 transition duration-1000 group-hover:duration-200
  console.log(gameStatus);
  return (
    <div>
      <div className="w-svw h-svh flex justify-center items-center">
        <div className="relative group rounded-lg w-[18rem] h-[18rem] sm:w-sm sm:h-[24rem] md:w-md md:h-[28rem] lg:w-lg lg:h-[32rem] xl:w-xl xl:h-[36rem] 2xl:w-2xl 2xl:h-[42rem]">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur-sm opacity-95 animate-[pulse_7s_ease-in-out_infinite]"></div>
          <table className="relative table-fixed w-full h-full overflow-hidden rounded-lg">
            <tbody className="[&>tr>td]:text-5xl [&>tr>td]:font-bold [&>tr>td]:hover:bg-gradient-to-r [&>tr>td]:from-pink-600 [&>tr>td]:to-purple-600 h-full [&>tr>td]:border-8 lg:[&>tr>td]:border-12 [&>tr>td]:text-center">
              <tr className="h-1/3">
                <td className="group/one" onClick={changeFirstTable}>
                  {firstTB}
                </td>
                <td className="group/two" onClick={changeSecondTable}>
                  {secondTB}
                </td>
                <td className="group/three" onClick={changeThirdTable}>
                  {thirdTB}
                </td>
              </tr>
              <tr className="h-1/3">
                <td className="group/four" onClick={changeForthTable}>
                  {forthTB}
                </td>
                <td className="group/five" onClick={changeFifthTable}>
                  {fifthTB}
                </td>
                <td className="group/six" onClick={changeSixthTable}>
                  {sixthTB}
                </td>
              </tr>
              <tr className="h-1/3">
                <td className="group/seven" onClick={changeSeventhTable}>
                  {sevenTB}
                </td>
                <td className="group/eight" onClick={changeEighthTable}>
                  {eigthTB}
                </td>
                <td className="group/nine" onClick={changeNinthTable}>
                  {ninthTB}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-center">
          {gameStatus == "O won" ? (
            <div>
              <div>Game is Over. O is won the game.</div>
              <div>
                Please click here to{" "}
                <button
                  className="bg-green-400 px-2 rounded-lg"
                  onClick={() => {
                    setFirstTB("");
                    setSecondTB("");
                    setThirdTB("");
                    setForthTB("");
                    setFifthTB("");
                    setSixthTB("");
                    setSeventhTB("");
                    setEighthTB("");
                    setNinthTB("");

                    setXOStatus("O");
                    setGameStatus("");
                  }}
                >
                  Play again
                </button>
              </div>
            </div>
          ) : gameStatus == "X won" ? (
            <div>
              <div>Game is Over. X is won the game.</div>
              <div>
                Please click here{" "}
                <button
                  className="bg-green-400 px-2 rounded-lg"
                  onClick={() => {
                    setFirstTB("");
                    setSecondTB("");
                    setThirdTB("");
                    setForthTB("");
                    setFifthTB("");
                    setSixthTB("");
                    setSeventhTB("");
                    setEighthTB("");
                    setNinthTB("");

                    setXOStatus("O");
                    setGameStatus("");
                  }}
                >
                  Play again
                </button>
              </div>
            </div>
          ) : gameStatus == "draw" ? (
            <div>
              <div>Game is draw.</div>
              <div>
                Please click here{" "}
                <button
                  className="bg-green-400 px-2 rounded-lg"
                  onClick={() => {
                    setFirstTB("");
                    setSecondTB("");
                    setThirdTB("");
                    setForthTB("");
                    setFifthTB("");
                    setSixthTB("");
                    setSeventhTB("");
                    setEighthTB("");
                    setNinthTB("");

                    setXOStatus("O");
                    setGameStatus("");
                  }}
                >
                  Play again
                </button>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Page;
