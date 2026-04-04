import { ProductScreen as ElectricianProductScreen } from '../electrician/ProductScreen';
import type { Screen } from '../../../types';

export function ProductScreen({
  onNavigate,
  initialCategory,
}: {
  onNavigate: (screen: Screen) => void;
  initialCategory?: string;
}) {
  const handleNavigate = (screen: Screen) => {
    onNavigate(screen === 'scan' ? 'electricians' : screen);
  };

  return (
    <ElectricianProductScreen
      onNavigate={handleNavigate}
      initialCategory={initialCategory}
    />
  );
}
