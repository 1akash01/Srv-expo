import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors } from '../theme';
import type { AppLanguage, Screen } from '../types';

const items: Array<{ id: Screen; label: Record<AppLanguage, string>; glyph: string }> = [
  { id: 'home', label: { en: 'Home', hi: 'होम', pa: 'ਹੋਮ' }, glyph: 'HM' },
  { id: 'product', label: { en: 'Product', hi: 'प्रोडक्ट', pa: 'ਪ੍ਰੋਡਕਟ' }, glyph: 'PD' },
  { id: 'scan', label: { en: 'Scan', hi: 'स्कैन', pa: 'ਸਕੈਨ' }, glyph: 'QR' },
  { id: 'rewards', label: { en: 'Rewards', hi: 'रिवॉर्ड्स', pa: 'ਰਿਵਾਰਡਸ' }, glyph: 'RW' },
  { id: 'profile', label: { en: 'More', hi: 'और', pa: 'ਹੋਰ' }, glyph: 'ME' },
];

export function BottomNav({ currentScreen, onNavigate, language }: { currentScreen: Screen; onNavigate: (screen: Screen) => void; language: AppLanguage }) {
  const { width } = useWindowDimensions();
  const compactPhone = width < 370;
  return (
    <View style={[styles.wrap, compactPhone && styles.wrapCompact]}>
      {items.map((item) => {
        const active = currentScreen === item.id;
        const scan = item.id === 'scan';

        return (
          <Pressable
            key={item.id}
            onPress={() => onNavigate(item.id)}
            style={[styles.item, compactPhone && styles.itemCompact, scan && styles.scanItem]}
          >
            <View style={[styles.icon, compactPhone && styles.iconCompact, active && styles.iconActive, scan && styles.scanIcon, compactPhone && scan && styles.scanIconCompact]}>
              <Text style={[styles.glyph, active && styles.glyphActive, scan && styles.scanGlyph]}>{item.glyph}</Text>
            </View>
            <Text style={[styles.label, compactPhone && styles.labelCompact, active && styles.labelActive, scan && styles.scanLabel]}>{item.label[language]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#FFFDFC',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#6F4C3A',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  wrapCompact: {
    paddingHorizontal: 6,
    paddingTop: 8,
  },
  item: {
    alignItems: 'center',
    gap: 6,
    minWidth: 54,
  },
  itemCompact: {
    minWidth: 48,
    gap: 4,
  },
  scanItem: {
    marginTop: -24,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#F5EFE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCompact: {
    width: 38,
    height: 38,
    borderRadius: 14,
  },
  iconActive: {
    backgroundColor: '#FDE7E3',
  },
  scanIcon: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: colors.primary,
  },
  scanIconCompact: {
    width: 56,
    height: 56,
    borderRadius: 20,
  },
  glyph: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A89A91',
  },
  glyphActive: {
    color: colors.primary,
  },
  scanGlyph: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9E9189',
  },
  labelCompact: {
    fontSize: 9,
  },
  labelActive: {
    color: colors.primary,
  },
  scanLabel: {
    color: colors.primary,
  },
});
