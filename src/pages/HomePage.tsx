import { useNavigate } from "react-router-dom";
import { products } from "../data/products";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <img src={product.image} alt={product.name} className="w-full h-60 object-cover rounded-xl mb-4" />
          <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
          <p className="text-purple-600 font-bold">{product.price.toLocaleString()}₫</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;