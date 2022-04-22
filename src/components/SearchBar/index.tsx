import React, { ChangeEventHandler, Dispatch, FC, SetStateAction } from "react";
import { CgSearch } from "react-icons/cg";

interface Props {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

const SearchBar: FC<Props> = ({ query, setQuery }) => {
  const handleSetQuery: ChangeEventHandler<HTMLInputElement> = ({ target }) =>
    setQuery(target?.value);

  return (
    <div className="relative flex items-center mt-2 shadow-xl">
      <input
        onChange={handleSetQuery}
        className="rounded-md w-full p-1 px-2 focus:outline-0"
      />
      {!query && <CgSearch className="absolute left-2.5" />}
    </div>
  );
};

export { SearchBar };
