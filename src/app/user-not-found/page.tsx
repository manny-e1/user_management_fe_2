import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User not found',
  description: 'User not found page for user management portal',
};

export default function ResetLinkActivation() {
  return (
    <main className="flex flex-col pt-4 md:w-full  bg-forgotten items-center  h-screen">
      <h3 className="my-2 text-2xl font-semibold">User doesn't exist</h3>
      <div className="flex flex-col mt-6  border-2 text-sm bg-white p-2 pb-4 w-1/3 gap-3">
        <p>The user no longer exists in our database.</p>
      </div>
    </main>
  );
}
