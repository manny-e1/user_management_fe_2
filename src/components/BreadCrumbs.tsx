import { Fragment } from 'react';
import { BsChevronRight } from 'react-icons/bs';
type BreadCrumbProps = {
  breadCrumbs: {
    name: string;
    url?: string;
  }[];
};

export default function BreadCrumbs({ breadCrumbs }: BreadCrumbProps) {
  return (
    <section className="mb-3">
      <ul className="py-2.5 px-4 flex items-center text-sm md:text-lg space-x-2">
        {breadCrumbs.map((breadCrumb, idx) => (
          <Fragment key={`${breadCrumb}${idx}`}>
            <li key={breadCrumb.name}>{breadCrumb.name}</li>
            <BsChevronRight className="last:hidden" />
          </Fragment>
        ))}
      </ul>
    </section>
  );
}
