import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await register(username, email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Registration failed. Email or username might be taken.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-neutral-900 rounded-2xl shadow-xl border border-neutral-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">Create an account</h2>
          <p className="mt-2 text-sm text-neutral-400">Join PixLoop today</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300">Username</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 mt-1 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all outline-none"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300">Email address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 mt-1 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all outline-none"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 mt-1 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-neutral-900 transition-all disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
