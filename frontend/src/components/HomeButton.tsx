"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HomeButton = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname != "/" && (
        <Link
          href={"/"}
          className="cursor-pointer select-none fixed z-10 left-10 top-10 bg-black/80 mix-blend-multiply text-white p-4 rounded-lg"
        >
          Back to Home
        </Link>
      )}
    </>
  );
};

export default HomeButton;
