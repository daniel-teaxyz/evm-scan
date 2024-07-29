export default function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="z-10 px-4 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      {children}
    </div>
  );
}
