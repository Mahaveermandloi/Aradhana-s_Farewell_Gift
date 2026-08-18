import { useState } from "react";
import UploadContent from "./UploadContent";

export default function LoginPage({ onClose }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const VALID_ID = "kpmg";
  const VALID_PASSWORD = "kpmg";

  // =================================================
  // LOGIN
  // =================================================

  const handleLogin = (e) => {
    e.preventDefault();

    if (userId === VALID_ID && password === VALID_PASSWORD) {
      setError("");
      setShowUpload(true);
    } else {
      setError("Invalid ID or password");
    }
  };

  // =================================================
  // SHOW UPLOAD PAGE AFTER LOGIN
  // =================================================

  if (showUpload) {
    return (
      <UploadContent
        onClose={onClose}
      />
    );
  }

  // =================================================
  // LOGIN MODAL
  // =================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        px-4
        backdrop-blur-sm
      "
    >

      <div
        className="
          relative
          w-full
          max-w-md
          rounded-2xl
          bg-white
          p-8
          shadow-2xl
        "
      >

        {/* ================================================= */}
        {/* CLOSE BUTTON */}
        {/* ================================================= */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute
            right-4
            top-4
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            text-xl
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-800
          "
        >
          ×
        </button>

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-6">

          <h2 className="text-2xl font-semibold text-gray-800">
            Upload Memories
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter your credentials to continue
          </p>

        </div>

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form onSubmit={handleLogin}>

          {/* ================================================= */}
          {/* ID */}
          {/* ================================================= */}

          <div className="mb-4">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              ID
            </label>

            <input
              type="text"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setError("");
              }}
              placeholder="Enter ID"
              autoComplete="username"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                outline-none
                transition
                focus:border-gray-800
                focus:ring-2
                focus:ring-gray-200
              "
            />

          </div>

          {/* ================================================= */}
          {/* PASSWORD */}
          {/* ================================================= */}

          <div className="mb-4">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter password"
              autoComplete="current-password"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                outline-none
                transition
                focus:border-gray-800
                focus:ring-2
                focus:ring-gray-200
              "
            />

          </div>

          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {error && (
            <p
              className="
                mb-4
                rounded-lg
                bg-red-50
                px-3
                py-2
                text-sm
                text-red-500
              "
            >
              {error}
            </p>
          )}

          {/* ================================================= */}
          {/* BUTTONS */}
          {/* ================================================= */}

          <div className="flex gap-3">

            {/* CANCEL */}

            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                rounded-xl
                border
                border-gray-300
                py-3
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
              "
            >
              Cancel
            </button>

            {/* LOGIN */}

            <button
              type="submit"
              className="
                flex-1
                rounded-xl
                bg-gray-800
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-black
                active:scale-[0.98]
              "
            >
              Login
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}