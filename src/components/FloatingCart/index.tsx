import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const totalPrice = products.reduce((total, product) => {
      // eslint-disable-next-line no-param-reassign
      total += product.quantity * product.price;
      return total;
    }, 0);

    return formatValue(totalPrice);
  }, [products]);

  const cartTotalItems = useMemo(() => {
    const totalItems = products.reduce((total, product) => {
      // eslint-disable-next-line no-param-reassign
      total += product.quantity;
      return total;
    }, 0);

    return formatValue(totalItems);
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${cartTotalItems} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
