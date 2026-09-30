export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Navbar</h1>
      {children}
      <h2>Footer</h2>
    </div>
  );
}
