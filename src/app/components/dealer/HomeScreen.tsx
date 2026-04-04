import { HomeScreen as ElectricianHomeScreen } from '../electrician/HomeScreen';
import type { Screen } from '../../../types';

export function HomeScreen({
  onNavigate,
  onOpenProductCategory,
}: {
  onNavigate: (screen: Screen) => void;
  onOpenProductCategory: (category: string) => void;
}) {
  const handleNavigate = (screen: Screen) => {
    onNavigate(screen === 'scan' ? 'electricians' : screen);
  };

  return (
    <ElectricianHomeScreen
      onNavigate={handleNavigate}
      onOpenProductCategory={onOpenProductCategory}
    />
  );
}

export { HomeScreen as Home };
