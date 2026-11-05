/**
 * Re-mounts on every navigation, giving each page a soft fade-up entrance so
 * route changes feel continuous instead of a hard swap.
 */
export default function ShopTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
