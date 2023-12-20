import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk } from '~/sdk';
import { Product, Variant, CartDetails } from '~/sdk/shopify/types';

type Options = Record<string, string>;
interface CartContextType {
  cartId: string | null;
  selectedVariantId: string | null;
  cart: CartDetails | null;
  addOrUpdateCartItem: (quantity: number) => void;
  removeCartItem: (lineId: string) => void;
  changeCartItemQuantity: (lineId: string, quantity: number) => void;
  setSelectedVariant: (selectedOptions: Options) => void;
  addSelectedVariantToCart: (quantity: number) => void;
  addCustomVariantToCart: (quantity: number, variantId: string) => void;
  isLoading: boolean;
  totalItems: { count: number; lines?: number };
}

const CartContext = createContext<CartContextType | null>(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

function calcTotalItems(cart?: CartDetails | null): { count: number; lines?: number } {
  if (!cart) {
    return { count: 0 };
  }
  if (cart.lines.length === 1) {
    return { count: cart.lines[0].quantity };
  }
  const sum = cart.lines.reduce((accumulator, { quantity }) => accumulator + quantity, 0);
  if (cart.lines.length === sum) {
    return { count: sum };
  }

  return { count: sum, lines: cart.lines.length };
}

const findVariantBySelectedOptions = (product: Product, selectedOptions: Options): Variant | undefined => {
  return product?.variants.find((variant) =>
    variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value),
  );
};

export const useCart = (product?: Product): CartContextType => {
  const queryClient = useQueryClient();
  const [cartId, setCartId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<CartDetails | null>(null);

  const { refetch: refetchCart, isFetching: queryIsLoading } = useQuery<CartDetails | null, Error>(
    ['cart', cartId],
    () => (cartId ? sdk.shopify.getCart({ cartId }) : null),
    {
      enabled: !!cartId,
      onError: (err) => {
        console.error('Error fetching cart:', err);
      },
      onSuccess: (data: CartDetails) => {
        setCart(data);
      },
    },
  );

  React.useDebugValue({ isLoading, cartId, cart, selectedVariantId, queryIsLoading });
  useEffect(() => {
    setIsLoading(queryIsLoading);
  }, [queryIsLoading]);

  useEffect(() => {
    const storedCartId = localStorage.getItem('cartId');
    if (storedCartId) {
      setCartId(storedCartId);
    } else if (!product) {
      refetchCart();
    }

    if (product?.variants?.length && product?.variants?.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product, queryClient, refetchCart]);

  const initCartMutation = useMutation(sdk.shopify.initCart, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data: CartDetails) => {
      localStorage.setItem('cartId', data.id);
      setCartId(data.id);
      setCart(data);
      queryClient.setQueryData(['cart', data.id], data);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const updateCartMutation = useMutation(sdk.shopify.updateCart, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data: CartDetails) => {
      setCart(data);
      queryClient.setQueryData(['cart', cartId], data);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const setSelectedVariant = useCallback(
    (selectedOptions: Options) => {
      if (!product) {
        return;
      }
      const variant = findVariantBySelectedOptions(product, selectedOptions);
      if (variant) {
        setSelectedVariantId(variant.id);
      }
    },
    [product],
  );

  const addSelectedVariantToCart = useCallback(
    (quantity = 1) => {
      if (isLoading) {
        console.error('Add to cart operation cannot be performed: cart is currently loading');
        return;
      }
      if (!selectedVariantId) {
        console.error('Add to cart operation cannot be performed: specify variantId');
        return;
      }

      const lineItem = { merchandiseId: selectedVariantId, quantity };

      if (cartId) {
        updateCartMutation.mutate({ cartId, addLines: [lineItem] });
      } else {
        initCartMutation.mutate({ lines: [lineItem] });
      }
    },
    [selectedVariantId, cartId, initCartMutation, updateCartMutation, isLoading],
  );

  const addCustomVariantToCart = useCallback(
    (quantity = 1, variantId = selectedVariantId) => {
      if (isLoading) {
        console.error('Add to cart operation cannot be performed: cart is currently loading');
        return;
      }
      if (!variantId || quantity < 1) {
        console.error('Add to cart operation cannot be performed: specify variantId and quantity');
        return;
      }

      const lineItem = { merchandiseId: variantId, quantity };

      if (cartId) {
        updateCartMutation.mutate({ cartId, addLines: [lineItem] });
      } else {
        initCartMutation.mutate({ lines: [lineItem] });
      }
    },
    [selectedVariantId, cartId, initCartMutation, updateCartMutation, isLoading],
  );

  const addOrUpdateCartItem = useCallback(
    (quantity = 1) => {
      if (isLoading) {
        console.error('Update cart operation cannot be performed: cart is currently loading');
        return;
      }
      if (!selectedVariantId) {
        console.error('Update to cart operation cannot be performed: specify variantId');
        return;
      }

      if (cartId) {
        updateCartMutation.mutate({ cartId, addLines: [{ merchandiseId: selectedVariantId, quantity }] });
      } else {
        initCartMutation.mutate({ lines: [{ merchandiseId: selectedVariantId, quantity }] });
      }
    },
    [selectedVariantId, cartId, initCartMutation, updateCartMutation, isLoading],
  );

  const removeCartItem = useCallback(
    (lineId: string) => {
      if (isLoading) {
        console.error('Remove item operation cannot be performed: cart is currently loading');
        return;
      }
      if (!cartId) {
        console.error('Remove to cart operation cannot be performed: specify cartId');
        return;
      }

      updateCartMutation.mutate({ cartId, removeLineIds: [lineId] });
    },
    [cartId, updateCartMutation, isLoading],
  );

  const changeCartItemQuantity = useCallback(
    (lineId: string, quantity: number) => {
      if (isLoading) {
        console.error('Change quantity operation cannot be performed: cart is currently loading');
        return;
      }
      if (!cartId) {
        console.error('Change quantity operation cannot be performed: specify cartId');
        return;
      }

      updateCartMutation.mutate({ cartId, updateLines: [{ id: lineId, quantity }] });
    },
    [cartId, updateCartMutation, isLoading],
  );

  return {
    cartId,
    cart,
    totalItems: calcTotalItems(cart),
    selectedVariantId,
    addOrUpdateCartItem,
    removeCartItem,
    changeCartItemQuantity,
    setSelectedVariant,
    addSelectedVariantToCart,
    addCustomVariantToCart,
    isLoading,
  };
};

interface CartProviderProps {
  children: React.ReactNode;
  product?: Product;
}

export const CartProvider = ({ children, product }: CartProviderProps) => {
  const cart = useCart(product);

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};
