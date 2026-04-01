import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenTitle, SectionCard } from '../components/Common';
import { productCategories, products } from '../data/mock';
import { colors } from '../theme';
import type { Screen } from '../types';

export function ProductScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [category, setCategory] = useState(productCategories[0].id);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => products.filter((item) => item.category === category && item.name.toLowerCase().includes(search.toLowerCase())),
    [category, search]
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionCard>
        <ScreenTitle title="All Products" subtitle="Browse SRV categories and scan products to earn points." />
        <TextInput value={search} onChangeText={setSearch} placeholder="Search products" placeholderTextColor="#A8978D" style={styles.search} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabList}>
          {productCategories.map((item) => {
            const active = item.id === category;
            return (
              <Pressable key={item.id} onPress={() => setCategory(item.id)} style={[styles.categoryTab, active && styles.categoryTabActive]}>
                <Text style={[styles.categoryGlyph, active && styles.categoryGlyphActive]}>{item.glyph}</Text>
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </SectionCard>

      <LinearGradient colors={['#7A2A21', '#C55032', '#EEA35D']} style={styles.headerBanner}>
        <Text style={styles.headerBannerTitle}>{productCategories.find((item) => item.id === category)?.label}</Text>
        <Text style={styles.headerBannerSub}>{filtered.length} products available • scan any QR to earn points</Text>
      </LinearGradient>

      <View style={styles.grid}>
        {filtered.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productImageWrap}>
              <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
              {product.badge ? <Text style={styles.badge}>{product.badge}</Text> : null}
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productSub}>{product.sub}</Text>
            <View style={styles.productFooter}>
              <Text style={styles.pointBadge}>+{product.points} pts</Text>
              <Pressable onPress={() => onNavigate('scan')} style={styles.scanButton}>
                <Text style={styles.scanButtonText}>Scan</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBackground },
  content: { padding: 18, gap: 16, paddingBottom: 120 },
  search: { marginTop: 14, minHeight: 52, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFFDFC', paddingHorizontal: 14, fontSize: 15, color: colors.text },
  tabList: { gap: 10, paddingTop: 14 },
  categoryTab: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, backgroundColor: '#F7EFE8' },
  categoryTabActive: { backgroundColor: colors.primary },
  categoryGlyph: { fontSize: 11, fontWeight: '800', color: '#8F7C72' },
  categoryGlyphActive: { color: '#FFFFFF' },
  categoryText: { fontSize: 12, fontWeight: '700', color: colors.text },
  categoryTextActive: { color: '#FFFFFF' },
  headerBanner: { borderRadius: 24, padding: 18 },
  headerBannerTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  headerBannerSub: { marginTop: 6, color: 'rgba(255,255,255,0.82)', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productCard: { width: '48.1%', borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border, padding: 12 },
  productImageWrap: { minHeight: 126, borderRadius: 18, backgroundColor: '#FFF6EF', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  productImage: { width: 100, height: 100 },
  badge: { position: 'absolute', top: 8, left: 8, fontSize: 10, fontWeight: '800', color: '#FFFFFF', backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  productName: { marginTop: 12, fontSize: 13, fontWeight: '800', color: colors.text },
  productSub: { marginTop: 4, fontSize: 11, color: colors.mutedText, lineHeight: 16 },
  productFooter: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointBadge: { fontSize: 11, fontWeight: '800', color: colors.success },
  scanButton: { borderRadius: 14, backgroundColor: '#FCECE5', paddingHorizontal: 14, paddingVertical: 8 },
  scanButtonText: { fontSize: 11, fontWeight: '800', color: colors.primary },
});
