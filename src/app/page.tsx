"use client";
import react from "react";

const Page = () => {
  return (
    <div className="w-svw h-svh flex justify-center items-center">
      <table className="border table-fixed w-[18rem] h-[18rem] sm:w-[24rem] sm:h-[24rem] md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] 2xl:w-[42rem] 2xl:h-[42rem]">
        <tbody className="[&>tr>td]:border [&>tr>td]:text-center [&>tr>td]:align-middle">
          <tr className="h-1/3">
            <td>1</td>
            <td></td>
            <td></td>
          </tr>
          <tr className="h-1/3">
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr className="h-1/3">
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Page;
