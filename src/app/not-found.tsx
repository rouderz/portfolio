import Link from "next/link";

export default function NotFound() {
  return (
    <section style={{ paddingBlock: "3rem 0" }}>
      <h1>Page not found</h1>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </section>
  );
}
