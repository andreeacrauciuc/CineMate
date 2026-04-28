import { useState, useEffect } from "react";
import "./SearchBar.css";

export function SearchBar({
  initialValue = "",
  onSearch,
  placeholder = "Search…",
  autoFocus = false,
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit} role="search">
      <div className="searchbar__wrap">
        <input
          type="text"
          className="searchbar__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck="false"
        />
        {value && (
          <button
            type="button"
            className="searchbar__clear"
            onClick={() => {
              setValue("");
              onSearch("");
            }}
            aria-label="Clear"
          >
            ×
          </button>
        )}
      </div>
      <button type="submit" className="searchbar__btn">
        Search
      </button>
    </form>
  );
}
