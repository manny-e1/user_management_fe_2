import { MouseEventHandler } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export default function Modal({
  error = false,
  message,
  onClick,
}: {
  error?: boolean;
  message: string | JSX.Element;
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-1/3 h-1/3 p-5 rounded flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <h5 className="text-lg font-semibold">{error ? 'Error' : 'Info'}</h5>
          <button
            onClick={onClick}
            className="text-gray-600 hover:text-gray-800"
          >
            <AiOutlineClose size={22} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center my-4">
          <h3
            className={`text-xl text-center font-semibold mt-2 ${
              error && 'text-red-500'
            }`}
          >
            {message}
          </h3>
        </div>
        <div className="flex justify-center">
          <button
            onClick={onClick}
            className="px-4 py-1.5 w-20 rounded text-center font-normal text-lg text-white bg-blue-500 hover:bg-blue-600 mr-2"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
