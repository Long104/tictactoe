"use client";
import { Button, Flex, SimpleGrid } from "@mantine/core";
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
                  onClick={resetGame}
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
