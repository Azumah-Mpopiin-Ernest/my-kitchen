import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
export default function Home() {
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchIngredients = async () => {
    try {
      const res = await fetch(`${API}/ingredients/`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "Application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      setIngredients(data.ingredients);
    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [API]);

  const logOut = async () => {
    try {
      const res = await fetch(`${API}/auth/sign-out`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        alert("Logout failed");
        return;
      }

      localStorage.removeItem("token");
      alert("You have been logged out");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Logout error:", err);
      alert("Network error");
    }
  };

  const addIngredient = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/ingredients/`, {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      credentials: "include",
      body: JSON.stringify({ name: ingredient }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    await fetchIngredients();
    alert("Success");
    setIngredient("");
  };

  const deleteIngredient = async (id) => {
    try {
      const res = await fetch(`${API}/ingredients/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "Application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "something went wrong, please try again");
        return;
      }

      setIngredients((prev) => prev.filter((item) => item.id !== id));
      alert("Deleted");
    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };

  const updateIngredient = async (id, value) => {
    try {
      const res = await fetch(`${API}/ingredients/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({ name: value }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong,please try again");
        return;
      }

      alert("Updated");
    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };

  const ingredientItems = ingredients.map((item) => (
    <div
      className="flex justify-between items-center bg-green-700 mb-2 w-80 rounded px-4 py-2 text-yellow-200 transition hover:shadow-md shadow-gray-900"
      key={item.id}
    >
      <input
        type="text"
        value={item.name}
        onFocus={(e) => (e.target.dataset.original = item.name)}
        onChange={(e) =>
          setIngredients((prev) =>
            prev.map((data) =>
              data.id === item.id ? { ...data, name: e.target.value } : data,
            ),
          )
        }
        onBlur={(e) => {
          if (e.target.value !== e.target.dataset.original) {
            updateIngredient(item.id, e.target.value);
          }
        }}
        className="bg-green-700 text-lg px-2"
      />
      <span
        className="material-symbols-outlined cursor-pointer text-red-600"
        onClick={() => deleteIngredient(item.id)}
      >
        delete
      </span>
    </div>
  ));

  return (
    <>
      <nav className="fixed w-full z-10 top-0 shadow-md bg-white px-5 py-10">
        <div className="flex  justify-between">
          <h1 className="font-bold text-xl ">MyKitchen</h1>
          <div className="bg-red-700 rounded-4xl w-8 h-8 flex justify-center items-center">
            <span
              className="material-symbols-outlined cursor-pointer text-yellow-200"
              onClick={() => setTimeout(() => navigate("/Profile"), 1000)}
            >
              person
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="text-red-700 cursor-pointer"
            onClick={() => logOut()}
          >
            logout
          </button>
        </div>
      </nav>
      <form
        className="flex justify-center flex-col items-center gap-10 pb-20 pt-60"
        onSubmit={addIngredient}
      >
        <h1 className="font-bold text-xl">ENTER INGREDIENT NAME</h1>
        <input
          type="text"
          className="bg-red-700 rounded p-2 w-80 text-yellow-200"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          required
        />
        <button
          className="bg-yellow-200 hover:shadow shadow-red-700 text-green-700 px-5 py-2 rounded-xl font-bold cursor-pointer transition"
          type="submit"
        >
          ADD
        </button>
        <h1 className="font-bold text-xl">INGREDIENTS</h1>
        <div>{ingredientItems}</div>
      </form>
    </>
  );
}
