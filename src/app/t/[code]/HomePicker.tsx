"use client";

import { useMemo, useState } from "react";

type Option = { slug: string; label: string };

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Type-ahead picker for the home airport. Submits the chosen airport code as "home". */
export default function HomePicker({ options }: { options: Option[] }) {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return [];
    return options.filter((o) => norm(o.label).includes(q)).slice(0, 8);
  }, [query, options]);

  function choose(o: Option) {
    setValue(o.slug);
    setQuery(o.label);
    setOpen(false);
  }

  return (
    <div className="picker">
      <input
        type="text"
        value={query}
        placeholder="Type your city or airport code"
        autoComplete="off"
        required
        onChange={(e) => {
          const text = e.target.value;
          setQuery(text);
          setOpen(true);
          const exact = options.find((o) => norm(o.label) === norm(text));
          setValue(exact ? exact.slug : "");
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Let a click on a suggestion land first; if exactly one match remains, take it.
          setTimeout(() => {
            setOpen(false);
            if (!value && matches.length === 1) choose(matches[0]);
          }, 150);
        }}
      />
      <input type="hidden" name="home" value={value} />
      {open && matches.length > 0 && (
        <ul className="picker-list">
          {matches.map((o) => (
            <li key={o.slug}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => choose(o)}>
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {query && !value && !open && (
        <small className="muted">Pick one from the list. If yours is missing, choose the nearest big airport.</small>
      )}
    </div>
  );
}
