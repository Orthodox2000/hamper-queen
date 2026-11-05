/**
 * shop layout
 * -----------------------------------------------------------------------------
 * Outer (server-component) layout. Provides the shared client store so that
 * the entire shop subtree — layout chrome and every route page — shares one
 * cart, language, drawer and booking-modal state.
 *
 * Legal pages (terms/privacy/eula) live outside this route group and render as
 * clean, focused documents without the shop chrome.
 */

import { ShopStoreProvider } from '../../store/shop-store';
import { ShopChrome } from './shop-chrome';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShopStoreProvider>
      <ShopChrome>{children}</ShopChrome>
    </ShopStoreProvider>
  );
}