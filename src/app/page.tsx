"use client";
import { Button, Flex, SimpleGrid } from "@mantine/core";
import { useState } from "react";

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

  console.log(gameStatus);
  return (
    <div>
      <div className="w-svw h-svh flex flex-1/3 justify-center items-center">
        <div className="w-svw h-svh absolute inset-0 bg-gradient-to-r from-[#00b5ff] to-[#7b2eda] rounded-xl blur-sm opacity-95 animate-[pulse_7s_ease-in-out_infinite]"></div>
        <div className="flex flex-3 justify-center items-center relative p-4">
          <div className="w-[18rem] h-[18rem] sm:w-[18rem] sm:h-[24rem] md:w-[20rem] md:h-[28rem] lg:w-[20rem] lg:h-[32rem] 2xl:w-[4rem] 2xl:h-[36rem] bg-black/80 rounded-xl"></div>
        </div>
        <div className="relative rounded-lg group w-[18rem] h-[18rem] sm:w-sm sm:h-[24rem] md:w-md md:h-[28rem] lg:w-lg lg:h-[32rem] 2xl:w-[36rem] 2xl:h-[36rem]">
          <SimpleGrid
            cols={3}
            spacing={"sm"}
            className="*:h-full *:w-full *:rounded-xl *:flex *:items-center *:justify-center *:bg-black/80 w-full h-full *:font-bold *:text-6xl sm:*:text-7xl lg:*:text-8xl xl:*:text-9xl *:text-white mix-blend-multiply auto-rows-fr"
          >
            <div onClick={changeFirstTable}>{firstTB}</div>
            <div onClick={changeSecondTable}>{secondTB}</div>
            <div onClick={changeThirdTable}>{thirdTB}</div>
            <div onClick={changeForthTable}>{forthTB}</div>
            <div onClick={changeFifthTable}>{fifthTB}</div>
            <div onClick={changeSixthTable}>{sixthTB}</div>
            <div onClick={changeSeventhTable}>{sevenTB}</div>
            <div onClick={changeEighthTable}>{eigthTB}</div>
            <div onClick={changeNinthTable}>{ninthTB}</div>
          </SimpleGrid>
        </div>
        <div className="flex flex-3 justify-center items-center relative group p-4">
          <div className="flex justify-center items-center w-[18rem] h-[18rem] sm:w-[18rem] sm:h-[24rem] md:w-[20rem] md:h-[28rem] lg:w-[20rem] lg:h-[32rem] 2xl:w-[4rem] 2xl:h-[36rem] bg-black/80 rounded-xl text-white mix-blend-multiply">
            <div className="grid h-full w-full grid-rows-3 place-items-center">
              <div className="text-8xl">X : </div>
              <div className="bg-black h-full w-full flex justify-center items-center">
                {gameStatus == "X won" && gameStatus
                  ? "X won the game"
                  : gameStatus == "draw" && gameStatus
                    ? "The game is draw"
                    : "O won"}
                <button
                  className="block cursor-pointer select-none"
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
              <div className="text-8xl">O :</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
