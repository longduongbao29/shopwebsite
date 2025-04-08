import { useParams } from "react-router-dom";
import { products } from "../data/products";

const ProductDetailPage = () => {
    const { id } = useParams();
    const product = products.find((p) => p.id === parseInt(id || ""));

    if (!product) return <div className="p-8 text-center">Sản phẩm không tồn tại</div>;

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-2xl mb-6" />
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-purple-600 font-semibold mb-4">{product.price.toLocaleString()}₫</p>
            <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
        </div>
    );
};

export default ProductDetailPage;
