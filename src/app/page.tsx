"use client";
import react, { use, useState } from "react";

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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
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
        setGameStatus("end");
      }
      setXOStatus("O");
    } else {
    }
  }

  return (
    <div className="w-svw h-svh flex justify-center items-center">
      <table className="border table-fixed w-[18rem] h-[18rem] sm:w-sm sm:h-[24rem] md:w-md md:h-[28rem] lg:w-lg lg:h-[32rem] xl:w-xl xl:h-[36rem] 2xl:w-2xl 2xl:h-[42rem]">
        <tbody className="[&>tr>td]:border">
          <tr>
            <td onClick={changeFirstTable}>{firstTB}</td>
            <td onClick={changeSecondTable}>{secondTB}</td>
            <td onClick={changeThirdTable}>{thirdTB}</td>
          </tr>
          <tr>
            <td onClick={changeForthTable}>{forthTB}</td>
            <td onClick={changeFifthTable}>{fifthTB}</td>
            <td onClick={changeSixthTable}>{sixthTB}</td>
          </tr>
          <tr>
            <td onClick={changeSeventhTable}>{sevenTB}</td>
            <td onClick={changeEighthTable}>{eigthTB}</td>
            <td onClick={changeNinthTable}>{ninthTB}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Page;
