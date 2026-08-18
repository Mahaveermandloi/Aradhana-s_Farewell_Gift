import { useState } from "react";
import UploadContent from "./UploadContent";

export default function LoginPage({ onClose }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const VALID_ID = "kpmg";
  const VALID_PASSWORD = "farewell123";

  const handleLogin = (e) => {
    e.preventDefault();

    if (userId === VALID_ID && password === VALID_PASSWORD) {
      setError("");
      setShowUpload(true);
    } else {
      setError("Invalid ID or password");
    }
  };

  // After successful login, show upload page
  if (showUpload) {
    return (
      <UploadContent
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Upload Memories
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter your credentials to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin}>

          {/* ID */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              ID
            </label>

            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter ID"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="mb-4 text-sm text-red-500">
              {error}
            </p>
          )}

          {/* BUTTONS */}
          <div className="flex gap-3">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-medium text-white hover:bg-black"
            >
              Login
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}   