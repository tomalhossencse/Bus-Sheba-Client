import { Navbar } from "@/components/shared/Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* <h1>Navbar</h1> */}
      <Navbar />
      {children}
      <h2>Footer</h2>
    </div>
  );
}
