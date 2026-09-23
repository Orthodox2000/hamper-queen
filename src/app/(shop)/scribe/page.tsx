'use client';

import React from 'react';
import { CustomMessagingPlatform } from '../../../components/CustomMessagingPlatform';
import { useShopStore } from '../../../store/shop-store';

export default function ScribePage() {
  const { customHamper, attachCardToHamper } = useShopStore();

  return (
    <CustomMessagingPlatform
      initialCard={customHamper.card}
      onAttachCardToHamper={attachCardToHamper}
    />
  );
}