"use client";

import { LoaderPinwheel } from "lucide-react";

const Loader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoaderPinwheel
          className="animate-spin"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
