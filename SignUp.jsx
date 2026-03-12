import { useState } from "react";
import { useNavigate } from "react-router";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [signIn, setSignIn] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = signIn ? "sign-in" : "sign-up";
      const payload = signIn ? { email, password } : { name, email, password };

      const res = await fetch(`${API}/auth/${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(payload),
      });

      const data = res.json();

      if (!res.ok) {
        alert(data.message || "Incorrect email or password");
        return;
      }
      if (data?.data?.token) {
        localStorage.setItem("token", data.data.token);
      }

      if (signIn) {
        alert("Login successful");
      } else (setSignIn(true), alert("Account created"));

      setEmail("");
      setName("");
      setPassowrd("");

      if (signIn) {
        setTimeout(() => navigate("/Home"), 1000);
      }
    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };

  return (
    <form
      className="bg-red-400 max-w-96 min-h-[300px] md:w-[400px] mx-auto rounded-3xl md:mt-20 mt-12 p-5"
      onSubmit={handleSubmit}
    >
      <h1 className="text-lg font-bold text-center">
        {signIn ? "Sign In" : "Sign Up"} to Prize
      </h1>

      <div className="flex flex-col gap-5 py-10">
        {!signIn && (
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="bg-yellow-200 px-3 py-2 w-full rounded "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="bg-yellow-200 px-3 py-2 w-full rounded "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="bg-yellow-200 px-3 py-2 w-full rounded "
            value={password}
            onChange={(e) => setPassowrd(e.target.value)}
            required
          />
        </div>

        <button
          className="bg-green-700 rounded-xl py-2 mt-5 cursor-pointer hover:bg-green-900 transition text-yellow-200"
          type="submit"
        >
          {signIn ? "Sign In" : "Sign Up"}
        </button>
        <div className="flex gap-4 justify-center">
          <span>
            {signIn ? "Don't have an account?" : "Already have an account?"}
          </span>{" "}
          <span
            className="text-white cursor-pointer hover:border-b border-yellow-200 transition"
            onClick={() => setSignIn((prev) => !prev)}
          >
            {signIn ? "SignUp" : "SignIn"}
          </span>
        </div>
        <div className="bg-white rounded px-5 py-1 flex items-center justify-center cursor-pointer">
          <img src="./google.png" alt="logo" className="w-8 h-8" />
          <a href={`${API}/auth/google`}>
            <span>Continue with google</span>
          </a>
        </div>
      </div>
    </form>
  );
}
