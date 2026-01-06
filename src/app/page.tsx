"use client";
import { Grid } from "@mantine/core";
import react, { useState } from "react";
import { useTicTacToe } from "./useTicTacToe";

const Page = () => {
  // try to declare destructure everything include useState and functions
  const {
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
  } = useTicTacToe();

  // group-hover:opacity-100 transition duration-1000 group-hover:duration-200
  console.log(gameStatus);
  return (
    <div>
      <div className="w-svw h-svh flex justify-center items-center">
        <table className="border table-fixed w-[18rem] h-[18rem] sm:w-sm sm:h-[24rem] md:w-md md:h-[28rem] lg:w-lg lg:h-[32rem] xl:w-xl xl:h-[36rem] 2xl:w-2xl 2xl:h-[42rem]">
          <tbody className="[&>tr>td]:border [&>tr>td]:text-center">
            <tr className="h-1/3">
              <td onClick={changeFirstTable}>{firstTB}</td>
              <td onClick={changeSecondTable}>{secondTB}</td>
              <td onClick={changeThirdTable}>{thirdTB}</td>
            </tr>
            <tr className="h-1/3">
              <td onClick={changeForthTable}>{forthTB}</td>
              <td onClick={changeFifthTable}>{fifthTB}</td>
              <td onClick={changeSixthTable}>{sixthTB}</td>
            </tr>
            <tr className="h-1/3">
              <td onClick={changeSeventhTable}>{sevenTB}</td>
              <td onClick={changeEighthTable}>{eigthTB}</td>
              <td onClick={changeNinthTable}>{ninthTB}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center">
        {gameStatus == "O Wins!" ? (
          <div>
            <div>Game is Over. O is won the game.</div>
            <div>
              Please click here to{" "}
              <button
                className="bg-green-400 px-2 rounded-lg"
                onClick={() => {
                  resetGame();
                }}
              >
                Play again
              </button>
            </div>
          </div>
        ) : gameStatus == "X Wins!" ? (
          <div>
            <div>Game is Over. X is won the game.</div>
            <div>
              Please click here{" "}
              <button
                className="bg-green-400 px-2 rounded-lg"
                onClick={() => {
                  resetGame();
                }}
              >
                Play again
              </button>
            </div>
          </div>
        ) : gameStatus == "Draw!" ? (
          <div>
            <div>Game is draw.</div>
            <div>
              Please click here{" "}
              <button
                className="bg-green-400 px-2 rounded-lg"
                onClick={() => {
                  resetGame();
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
  );
};
export default Page;
