export default function Footer({ name }) {
  return (
    <footer className="mx-auto mt-10 max-w-5xl px-1 py-8 text-xs text-muted">
      © {new Date().getFullYear()} {name}
    </footer>
  );
}
