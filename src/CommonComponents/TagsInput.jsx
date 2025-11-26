import { useEffect, useMemo, useState } from "react";
import { TextInput } from "flowbite-react";

export default function TagsInput({
  id = "tags",
  placeholder = "Type and press Enter",
  value = [],
  onChange,
  allowDuplicates = false,
  maxTags,                 // optional, e.g., 10
}) {
  const [tags, setTags] = useState(Array.isArray(value) ? value : []);
  const [text, setText] = useState("");

  // sync when parent updates value
  useEffect(() => {
    if (Array.isArray(value)) setTags(value);
  }, [value]);

  const lowerSet = useMemo(() => new Set(tags.map(t => t.toLowerCase())), [tags]);

  const emit = (next) => {
    setTags(next);
    onChange?.(next);
  };

  const addToken = (token) => {
    const t = String(token || "").trim();
    if (!t) return;
    if (maxTags && tags.length >= maxTags) return;
    if (!allowDuplicates && lowerSet.has(t.toLowerCase())) return;
    emit([...tags, t]);
  };

  const commit = () => {
    // split by comma/newline
    const parts = text.split(/[,|\n]/).map(s => s.trim()).filter(Boolean);
    parts.forEach(addToken);
    setText("");
  };

  const remove = (t) => emit(tags.filter(x => x !== t));

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !text && tags.length) {
      // remove last when input empty
      remove(tags[tags.length - 1]);
    }
  };

  const onPaste = (e) => {
    const data = e.clipboardData.getData("text");
    if (data.includes(",") || data.includes("\n")) {
      e.preventDefault();
      data.split(/[,|\n]/).map(s => s.trim()).filter(Boolean).forEach(addToken);
    }
  };

  return (
    <div>

      <TextInput
        id={id}
        className="w-full"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => text.trim() && commit()}
        onPaste={onPaste}
        placeholder={placeholder}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400 px-3 py-1 text-sm text-blue-700"
          >
            {t}
            <button
              type="button"
              onClick={() => remove(t)}
              className="rounded-full bg-blue-100 px-1.5 text-blue-700 hover:bg-blue-200"
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Optional hidden input if you need to submit in a plain form */}
      {/* <input type="hidden" name={id} value={JSON.stringify(tags)} /> */}
    </div>
  );
}