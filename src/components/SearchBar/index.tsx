import React, { ChangeEventHandler, Dispatch, FC, SetStateAction } from "react";
import { CgSearch } from "react-icons/cg";

interface Props {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  placeholder?: string;
}

const SearchBar: FC<Props> = ({ query, setQuery, placeholder }) => {
  const handleSetQuery: ChangeEventHandler<HTMLInputElement> = ({ target }) =>
    setQuery(target?.value);

  return (
    <div className="relative flex items-center mt-2 shadow-xl text-sm text-primary">
      <input
        placeholder={placeholder ?? ""}
        onChange={handleSetQuery}
        className={`rounded-md w-full p-1 px-2 focus:outline-0 ${
          placeholder && !query.length && "pl-7"
        }`}
      />
      {!query && <CgSearch className="absolute left-2" />}
    </div>
  );
};

export { SearchBar };
