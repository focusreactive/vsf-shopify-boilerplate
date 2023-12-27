import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk } from '~/sdk';
import { Product, Variant } from '~/sdk/shopify/types';

interface CartContextType {
  cartId: string | null;
  addOrUpdateCartItem: (quantity: number) => void;
  removeCartItem: (lineId: string) => void;
  changeCartItemQuantity: (lineId: string, quantity: number) => void;
  setSelectedVariant: (selectedOptions: Record<string, string>) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

const findVariantBySelectedOptions = (
  product: Product,
  selectedOptions: Record<string, string>,
): Variant | undefined => {
  return product.variants.find((variant) =>
    variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value),
  );
};

export const useCart = (product: Product): CartContextType => {
  const queryClient = useQueryClient();
  const [cartId, setCartId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  useEffect(() => {
    const storedCartId = localStorage.getItem('cartId');
    if (storedCartId) {
      setCartId(storedCartId);
      queryClient.prefetchQuery(['cart', storedCartId], () => sdk.shopify.getCart({ cartId: storedCartId }));
    }
  }, [queryClient]);

  const updateCartMutation = useMutation(sdk.shopify.updateCart, {
    onSuccess: (data) => {
      queryClient.setQueryData(['cart', cartId], data);
    },
  });

  const initCartMutation = useMutation(sdk.shopify.initCart, {
    onSuccess: (data) => {
      localStorage.setItem('cartId', data.id);
      setCartId(data.id);
      queryClient.setQueryData(['cart', data.id], data);
    },
  });

  const setSelectedVariant = useCallback(
    (selectedOptions) => {
      const variant = findVariantBySelectedOptions(product, selectedOptions);
      if (variant) {
        setSelectedVariantId(variant.id);
      }
    },
    [product],
  );

  const addOrUpdateCartItem = useCallback(
    (quantity = 1) => {
      if (!selectedVariantId) throw new Error('No variant selected');

      if (!cartId) {
        return initCartMutation.mutate({ lines: [{ merchandiseId: selectedVariantId, quantity }] });
      }
      return updateCartMutation.mutate({ cartId, addLines: [{ merchandiseId: selectedVariantId, quantity }] });
    },
    [cartId, selectedVariantId, initCartMutation, updateCartMutation],
  );

  const removeCartItem = useCallback(
    (lineId) => {
      return updateCartMutation.mutate({ cartId, removeLineIds: [lineId] });
    },
    [cartId, updateCartMutation],
  );

  const changeCartItemQuantity = useCallback(
    (lineId, quantity) => {
      return updateCartMutation.mutate({ cartId, updateLines: [{ id: lineId, quantity }] });
    },
    [cartId, updateCartMutation],
  );

  return {
    cartId,
    addOrUpdateCartItem,
    removeCartItem,
    changeCartItemQuantity,
    setSelectedVariant,
  };
};

interface CartProviderProps {
  children: React.ReactNode;
  product: Product;
}

export const CartProvider = ({ children, product }: CartProviderProps) => {
  const cart = useCart(product);

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};
