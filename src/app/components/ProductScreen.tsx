import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

const Colors = {
  primary: '#E8453C',
  primaryLight: '#FFF0F0',
  background: '#F2F3F7',
  surface: '#FFFFFF',
  border: '#EEEEF3',
  textDark: '#1C1E2E',
  textMuted: '#9898A8',
  success: '#22c55e',
  successLight: '#e6fdf0',
};

const categories = [
  { id: 'fanbox', label: 'Fan Box', emoji: '🔌', glyph: '🔌', count: 3 },
  { id: 'concealedbox', label: 'Concealed Box', emoji: '📦', glyph: '📦', count: 4 },
  { id: 'modular', label: 'Modular', emoji: '🔲', glyph: '🔲', count: 5 },
  { id: 'junction', label: 'Junction Box', emoji: '🔧', glyph: '🔧', count: 2 },
  { id: 'fans', label: 'Fans', emoji: '💨', glyph: '💨', count: 3 },
];

const allProducts = [
  // Fan Box
  { id: 'fb1', category: 'fanbox', name: 'FAN BOX 3" RANGE', sub: 'F8/FC/FDB — 18/40, 22/28 PC', img: 'https://srvelectricals.com/cdn/shop/files/F8_3_18-40.png?v=1757426631&width=240', points: 10, badge: 'Popular', bg: '#FEF9E7' },
  { id: 'fb2', category: 'fanbox', name: 'FAN BOX 4" RANGE', sub: 'FC 4" — 17/30, 20/40 PC', img: 'https://srvelectricals.com/cdn/shop/files/F8_3_18-40.png?v=1757426631&width=240', points: 12, badge: null, bg: '#FEF9E7' },
  { id: 'fb3', category: 'fanbox', name: 'FAN BOX 2.5" RANGE', sub: 'FC 2.5" — 20/50 PC', img: 'https://srvelectricals.com/cdn/shop/files/F8_3_18-40.png?v=1757426631&width=240', points: 8, badge: null, bg: '#FEF9E7' },
  // Concealed Box
  { id: 'cb1', category: 'concealedbox', name: 'CONCEALED BOX 3"', sub: 'CRD PL 3" Precision', img: 'https://srvelectricals.com/cdn/shop/files/CRD_PL_3.png?v=1757426566&width=240', points: 15, badge: 'New', bg: '#EFF6FF' },
  { id: 'cb2', category: 'concealedbox', name: 'CONCEALED BOX 4"', sub: 'CRD PL 4" Precision', img: 'https://srvelectricals.com/cdn/shop/files/CRD_PL_3.png?v=1757426566&width=240', points: 18, badge: null, bg: '#EFF6FF' },
  // Modular
  { id: 'mb1', category: 'modular', name: 'MODULE BOX PLATINUM', sub: 'Platinum 3x3 Range', img: 'https://srvelectricals.com/cdn/shop/files/3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=240', points: 25, badge: 'Popular', bg: '#F3F0FF' },
  { id: 'mb2', category: 'modular', name: 'MODULE BOX GOLD', sub: 'Gold 3x3 Series', img: 'https://srvelectricals.com/cdn/shop/files/3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=240', points: 20, badge: null, bg: '#F3F0FF' },
  // Fans
  { id: 'kf1', category: 'fans', name: 'KITCHEN FAN ROYAL', sub: 'Premium Ventilation Series', img: 'https://srvelectricals.com/cdn/shop/files/Kitchen-Fan-Royal.png?v=1741846906&width=240', points: 45, badge: 'Popular', bg: '#FFF0F0' },
];

type Screen = 'home' | 'scan' | 'rewards' | 'profile' | 'product' | 'wallet';

export function ProductScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState('fanbox');
  const [search, setSearch] = useState('');
  const cardW = (width - 14 * 2 - 12) / 2;

  const filtered = useMemo(
    () =>
      allProducts.filter(
        (p) =>
          p.category === category &&
          p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [category, search]
  );

  const currentCat = categories.find((c) => c.id === category);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.pageTitle}>All Products</Text>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={{ fontSize: 16, color: Colors.textMuted }}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products..."
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabList}>
        {categories.map((cat) => {
          const active = cat.id === category;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              style={[styles.categoryTab, active && styles.categoryTabActive]}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
              <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Category Banner */}
      <LinearGradient
        colors={['#E87820', '#F4A040']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.catBanner}
      >
        <View style={styles.catBannerLeft}>
          <Text style={{ fontSize: 36 }}>{currentCat?.emoji}</Text>
          <View>
            <Text style={styles.catBannerTitle}>{currentCat?.label}</Text>
            <Text style={styles.catBannerSub}>{filtered.length} products</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => onNavigate('scan')} style={styles.catScanBtn}>
          <Text style={styles.catScanText}>Scan &{'\n'}Earn</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Product Grid */}
      <View style={styles.grid}>
        {filtered.map((product) => (
          <View key={product.id} style={[styles.productCard, { width: cardW }]}>
            {/* Badges */}
            <View style={styles.productImgBox}>
              {product.badge && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>{product.badge}</Text>
                </View>
              )}
              <View style={styles.ptsBadge}>
                <Text style={styles.ptsBadgeText}>+{product.points} pts</Text>
              </View>
              <View style={[styles.productBg, { backgroundColor: product.bg }]}>
                <Image source={{ uri: product.img }} style={styles.productImg} resizeMode="contain" />
              </View>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.productSub} numberOfLines={2}>{product.sub}</Text>
              <TouchableOpacity onPress={() => onNavigate('scan')} style={styles.scanBtn} activeOpacity={0.8}>
                <Text style={{ fontSize: 14 }}>📷</Text>
                <Text style={styles.scanBtnText}>Scan to Earn</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Banner */}
      <View style={styles.bottomBanner}>
        <Text style={{ fontSize: 28 }}>🏭</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bottomBannerTitle}>North India's Largest Manufacturer</Text>
          <Text style={styles.bottomBannerSub}>SRV Electricals — trusted since 2000. Scan any product QR to earn reward points!</Text>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>›</Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 14, gap: 16 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: Colors.textDark, textAlign: 'center' },

  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 52 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textDark },

  tabList: { gap: 10, paddingVertical: 2 },
  categoryTab: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 22, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  categoryTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryText: { fontSize: 13, fontWeight: '600', color: Colors.textDark },
  categoryTextActive: { color: '#fff', fontWeight: '700' },

  catBanner: { borderRadius: 15, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  catBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  catBannerTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  catBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  catScanBtn: { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  catScanText: { color: '#fff', fontSize: 11, fontWeight: '800', textAlign: 'center' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productCard: { backgroundColor: Colors.surface, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  productImgBox: { position: 'relative' },
  popularBadge: { position: 'absolute', top: 10, left: 10, zIndex: 2, backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  popularBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  ptsBadge: { position: 'absolute', top: 10, right: 10, zIndex: 2, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  ptsBadgeText: { color: Colors.textDark, fontSize: 11, fontWeight: '800' },
  productBg: { height: 130, alignItems: 'center', justifyContent: 'center' },
  productImg: { width: 100, height: 100 },
  productInfo: { padding: 12 },
  productName: { fontSize: 13, fontWeight: '800', color: Colors.textDark, textTransform: 'uppercase', letterSpacing: 0.3 },
  productSub: { fontSize: 11, color: Colors.textMuted, marginTop: 3, lineHeight: 15 },
  scanBtn: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.primaryLight, borderRadius: 12, paddingVertical: 9 },
  scanBtnText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },

  bottomBanner: { backgroundColor: '#2D3561', borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  bottomBannerTitle: { fontSize: 15, fontWeight: '800', color: '#fff' },
  bottomBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3, lineHeight: 17 },
});