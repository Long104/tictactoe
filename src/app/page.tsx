"use client";
import { SimpleGrid, Tabs } from "@mantine/core";
import { useTicTacToe } from "./useTicTacToe";
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";

const Page = () => {
  // try to declare destructure everything include useState and functions
  const {
    XOStatus,
    xScore,
    oScore,
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
    <div className="bg-gradient-to-r from-[#00b5ff] to-[#7b2eda]">
      <div className="w-svw h-svh grid grid-cols-1 lg:grid-cols-[60%_40%] xl:grid-cols-3 place-items-center">
        {/* <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-[#00b5ff] to-[#7b2eda] rounded-xl blur-sm opacity-95 animate-[pulse_7s_ease-in-out_infinite]"></div> */}
        <div className="max-xl:hidden relative  w-[18rem] h-[18rem] sm:w-[18rem] sm:h-[24rem] md:w-[20rem] md:h-[28rem] lg:w-[20rem] lg:h-[32rem] 2xl:w-[24rem] 2xl:h-[36rem] bg-black/80 rounded-xl text-white mix-blend-multiply"></div>
        <div className="flex justify-center items-center relative rounded-lg h-full w-full flex-col">
          <div className="xl:hidden text-5xl py-2 px-6 rounded-lg my-2 bg-black/80 mix-blend-multiply text-white">
            X : {xScore}{" "}
          </div>
          <SimpleGrid
            cols={3}
            spacing={"sm"}
            className="*:h-full *:w-full *:rounded-xl *:flex *:items-center *:justify-center *:bg-black/80 *:font-bold *:text-6xl sm:*:text-7xl lg:*:text-8xl xl:*:text-9xl *:text-white mix-blend-multiply auto-rows-fr w-[18rem] h-[18rem] sm:w-sm sm:h-[24rem] md:w-md md:h-[28rem] lg:w-lg lg:h-[32rem] 2xl:w-[36rem] 2xl:h-[36rem]"
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
          <div className="xl:hidden text-5xl py-2 px-6 rounded-lg my-2 bg-black/80 mix-blend-multiply text-white">
            O : {oScore}{" "}
          </div>
        </div>
        <div className="max-lg:hidden relative w-[18rem] h-[18rem] sm:w-[18rem] sm:h-[24rem] md:w-[20rem] md:h-[28rem] lg:w-[20rem] lg:h-[32rem] 2xl:w-[24rem] 2xl:h-[36rem] bg-black/80 rounded-xl text-white mix-blend-multiply">
          <div className="grid h-full w-full grid-rows-3 place-items-center">
            <div className="text-8xl">X : {xScore} </div>
            <div className="h-full w-full flex justify-center items-center flex-col">
              <div className="flex flex-1 h-full w-full justify-center items-center bg-gray-600">
                {gameStatus == "X Wins!" && gameStatus
                  ? "X won the game"
                  : gameStatus == "Draw!" && gameStatus
                    ? "The game is draw"
                    : "O Wins!"}
              </div>
              <button className="font-bold block cursor-pointer select-none flex-1 bg-gray-500 h-full w-full">
                {gameStatus ? (
                  <div onClick={resetGame}>Play again</div>
                ) : (
                  "In game"
                )}
              </button>
            </div>
            <div className="text-8xl">O : {oScore}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-end h-full w-full p-4 lg:hidden">
        <div className="w-[18rem] h-[18rem] sm:w-[24rem] sm:h-[24rem] max-xl:order-3 p-4 relative xl:hidden bg-black/80 rounded-xl text-white mix-blend-multiply"></div>
      </div>
    </div>
  );
};
export default Page;
