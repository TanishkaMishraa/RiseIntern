export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      <span>
        Page {page} of {pages}
      </span>
      <button disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
