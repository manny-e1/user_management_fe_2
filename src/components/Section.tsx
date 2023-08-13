import { ReactNode } from 'react';

export type SectionProps = {
  outerTitle: string;
  innerTitle: string;
  children: ReactNode;
};
export default function Section({
  children,
  innerTitle,
  outerTitle,
}: SectionProps) {
  return (
    <>
      <h3 className="text-[1.3125rem] text-black leading-[1.2] mb-4">
        {outerTitle}
      </h3>
      <div className="bg-white">
        <div className="py-4 px-5 ">
          <h5 className="text-[#939ba2] text-[.925rem] font-semibold">
            {innerTitle}
          </h5>
        </div>
        <div className="py-5 px-5">{children}</div>
      </div>
    </>
  );
}
