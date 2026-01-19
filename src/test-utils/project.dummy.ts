import { ProjectFile, ProjectState } from '@/types';
import { ProjectStatus } from '@/enums';

export const initialProjectFiles: ProjectFile[] = [
  {
    path: 'src/App.tsx',
    name: 'App.tsx',
    language: 'typescript',
    content: `import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProductGrid />
      </main>
    </div>
  );
}`,
  },
  {
    path: 'src/components/Header.tsx',
    name: 'Header.tsx',
    language: 'typescript',
    content: `// Este arquivo será gerado pela IA na Activity 1`,
  },
  {
    path: 'src/components/ProductCard.tsx',
    name: 'ProductCard.tsx',
    language: 'typescript',
    content: `import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export function ProductCard({ id, name, price, image, description }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  
  // ⚠️ Problema: recalcula a cada render
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
  
  // ⚠️ Problema: nova função a cada render
  const handleAddToCart = () => {
    console.log('Adding to cart:', { id, quantity });
  };

  return (
    <div className="bg-white border border-black/10 rounded-lg overflow-hidden">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-black">{name}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        <p className="text-xl font-bold text-black mt-2">{formattedPrice}</p>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 border border-black/20 rounded px-2 py-1"
          />
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white py-2 rounded hover:bg-black/80"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}`,
  },
  {
    path: 'src/components/ProductGrid.tsx',
    name: 'ProductGrid.tsx',
    language: 'typescript',
    content: `import { ProductCard } from './ProductCard';

const products = [
  {
    id: '1',
    name: 'Luva de Boxe Pro',
    price: 299.90,
    image: '/products/gloves.jpg',
    description: 'Luva profissional 14oz em couro sintético',
  },
  {
    id: '2',
    name: 'Saco de Pancada 1.20m',
    price: 459.90,
    image: '/products/bag.jpg',
    description: 'Saco de pancada profissional com enchimento',
  },
  {
    id: '3',
    name: 'Bandagem Elástica 5m',
    price: 29.90,
    image: '/products/wrap.jpg',
    description: 'Par de bandagens elásticas para proteção',
  },
  {
    id: '4',
    name: 'Protetor Bucal',
    price: 49.90,
    image: '/products/mouthguard.jpg',
    description: 'Protetor bucal moldável premium',
  },
];

export function ProductGrid() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-6">Equipamentos de Boxe</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}`,
  },
];

export const initialProjectState: ProjectState = {
  id: 'project-boxshop',
  name: 'BoxShop - E-commerce de Boxe',
  status: ProjectStatus.OK,
  currentActivityIndex: 0,
  files: initialProjectFiles,
  decisions: [],
};
