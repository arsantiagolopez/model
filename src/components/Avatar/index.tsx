import React, { FC } from "react";

interface Props {
  image?: string;
  width?: string;
}

// Show a skeleton of the image while the image loads

const Avatar: FC<Props> = ({ image, width }) => (
  <div
    className="rounded-full overflow-hidden w-full"
    style={
      width ? { width, height: width, minWidth: width, minHeight: width } : {}
    }
  >
    {!image || (image && image.includes("undefined")) ? (
      <div className="animate-pulse bg-primary w-full h-full" />
    ) : (
      <img src={image} className="object-cover w-full h-full" />
    )}
  </div>
);

export { Avatar };
