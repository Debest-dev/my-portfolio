import React from "react";

interface SectionProps {
  id?: string;
  alt?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  alt = false,
  className = "",
  children,
}) => {
  return (
    <section
      id={id}
      className={`w-full py-14 md:py-20 ${
        alt ? "bg-[var(--bg-alt)]" : "bg-[var(--bg)]"
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-[1140px] px-4 md:px-6">{children}</div>
    </section>
  );
};
