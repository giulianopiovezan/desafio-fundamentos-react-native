import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsStored = await AsyncStorage.getItem('Products');
      if (productsStored) {
        setProducts(JSON.parse(productsStored));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      const productIndex = products.findIndex(prd => prd.id === product.id);

      if (productIndex !== -1) {
        products[productIndex].quantity += 1;

        setProducts(prevState => [
          ...prevState.filter(prev => prev.id !== product.id),
          products[productIndex],
        ]);
      } else {
        setProducts(prevState => [...prevState, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem('Products', JSON.stringify(products));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const product = products.find(prd => prd.id === id);

      if (!product) {
        return;
      }

      setProducts(prevState => [
        ...prevState.filter(prev => prev.id !== product.id),
        { ...product, quantity: product.quantity + 1 },
      ]);
      await AsyncStorage.setItem('Products', JSON.stringify(products));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const product = products.find(prd => prd.id === id);

      if (!product) {
        return;
      }

      if (product.quantity === 1) {
        setProducts(prevState => [
          ...prevState.filter(prev => prev.id !== product.id),
        ]);
      } else {
        setProducts(prevState => [
          ...prevState.filter(prev => prev.id !== product.id),
          { ...product, quantity: product.quantity - 1 },
        ]);
      }

      await AsyncStorage.setItem('Products', JSON.stringify(products));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({
      addToCart,
      increment,
      decrement,
      products,
    }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
