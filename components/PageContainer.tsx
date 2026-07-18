type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={`
        mx-auto
        min-h-screen
        w-full
        max-w-[30rem]
        px-[clamp(1rem,6vw,2rem)]
        pt-[clamp(2.5rem,8vw,4rem)]
        text-center
        ${className}
      `}
    >
      {children}

      <div
        aria-hidden="true"
        className="h-40"
        style={{
          height: "calc(10rem + env(safe-area-inset-bottom))",
        }}
      />
    </div>
  );
}