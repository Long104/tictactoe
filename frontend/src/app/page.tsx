import { Textarea } from "@mantine/core";
import Link from "next/link";
import react from "react";

const page = () => {
  return (
      <div className="relative w-svw h-svh grid grid-cols-1 md:grid-cols-2 place-items-center">
        {/* choose between online and offline */}
        <div className="*:text-4xl w-lg h-2/3 bg-black/80 text-white mix-blend-multiply grid grid-rows-2 place-items-center rounded-lg">
          <Link href={"online"} className="w-full h-full">
            <div className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg">
              Play Online
            </div>
          </Link>
          <Link href={"offline"} className="w-full h-full">
            <div className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg">
              Play Offline
            </div>
          </Link>
        </div>
        {/* open chat */}
        <div className="flex flex-col justify-end w-md h-2/3 bg-black/80 text-white mix-blend-multiply rounded-lg">
          <Textarea
            // label="Input label"
            // description="Input description"
            placeholder="Chat with friend"
            w={"100%"}
            p={6}
          />
        </div>
      </div>
  );
};

export default page;
