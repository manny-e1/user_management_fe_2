import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activation Link Expired',
  description: 'Activation Link Expired page for user management portal',
};

export default function ActivationExpired() {
  return (
    <main className="flex flex-col pt-4 md:w-full  bg-forgotten items-center  h-screen">
      <h3 className="my-2 text-2xl font-semibold">
        Account Activation Link Expired
      </h3>
      <div className="flex mt-6 flex-col border-2 text-sm bg-white p-2 pb-4 w-1/3 gap-3">
        <p>Sorry, 30 minute has passed.</p>
        <p>Account activation session is only available within 30 minutes</p>
        <p>Please request for account activation email again</p>
      </div>
    </main>
  );
}
