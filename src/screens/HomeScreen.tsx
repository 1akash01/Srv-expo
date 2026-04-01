import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenTitle, SectionCard, StatPill } from '../components/Common';
import { banners, featuredProducts, recentActivity } from '../data/mock';
import { colors } from '../theme';
import type { Screen, UserRole } from '../types';

export function HomeScreen({ onNavigate, role }: { onNavigate: (screen: Screen) => void; role: UserRole }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((value) => (value + 1) % banners.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#6E241B', '#B13127', '#D56C3E']} style={styles.hero}>
        <ScreenTitle
          title="Good morning"
          subtitle={role === 'dealer' ? 'Dealer dashboard' : 'Electrician dashboard'}
          right={<Text style={styles.heroChip}>4,250 pts</Text>}
        />
        <View style={styles.statRow}>
          <StatPill label="Weekly" value="+120" accent="#FFD27A" />
          <StatPill label="Level" value="Gold" accent="#FFFFFF" />
          <StatPill label="Role" value={role === 'dealer' ? 'Dealer' : 'Electrician'} accent="#FFFFFF" />
        </View>
      </LinearGradient>

      <LinearGradient colors={banners[slide].colors} style={styles.banner}>
        <Text style={styles.bannerTag}>{banners[slide].tag}</Text>
        <Text style={styles.bannerBrand}>SRV ELECTRICALS</Text>
        <Text style={styles.bannerTitle}>{banners[slide].title}</Text>
        <Text style={styles.bannerSub}>{banners[slide].subtitle}</Text>
        <Pressable style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Shop Now</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.dotRow}>
        {banners.map((item, index) => (
          <Pressable key={item.id} onPress={() => setSlide(index)} style={[styles.dot, index === slide && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.quickGrid}>
        {[
          { key: 'scan', label: 'Scan QR', sub: 'Earn points', glyph: 'QR', action: () => onNavigate('scan') },
          { key: 'wa', label: 'WhatsApp', sub: 'Support', glyph: 'WA', action: () => Linking.openURL('https://wa.me/918837684004?text=Hello%20SRV%20Electricals') },
          { key: 'reward', label: 'Rewards', sub: 'Redeem now', glyph: 'RW', action: () => onNavigate('rewards') },
          { key: 'profile', label: 'Profile', sub: 'More options', glyph: 'ME', action: () => onNavigate('profile') },
        ].map((item) => (
          <Pressable key={item.key} onPress={item.action} style={styles.quickCard}>
            <View style={styles.quickGlyphBox}>
              <Text style={styles.quickGlyph}>{item.glyph}</Text>
            </View>
            <Text style={styles.quickTitle}>{item.label}</Text>
            <Text style={styles.quickSub}>{item.sub}</Text>
          </Pressable>
        ))}
      </View>

      <SectionCard>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <Pressable onPress={() => onNavigate('product')}>
            <Text style={styles.linkText}>View all</Text>
          </Pressable>
        </View>
        <View style={styles.productGrid}>
          {featuredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <LinearGradient colors={product.colors} style={styles.productImageWrap}>
                <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
              </LinearGradient>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <View style={styles.productMeta}>
                <Text style={styles.productPrice}>{product.price}</Text>
                <Text style={styles.productPoints}>+{product.points} pts</Text>
              </View>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={{ marginTop: 10 }}>
          {recentActivity.map((item, index) => (
            <View key={item.id} style={[styles.activityRow, index < recentActivity.length - 1 && styles.activityBorder]}>
              <View style={styles.activityGlyph}>
                <Text style={styles.activityGlyphText}>{item.positive ? '+' : '-'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityLabel}>{item.label}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              <Text style={[styles.activityAmount, item.positive ? styles.positive : styles.negative]}>{item.amount}</Text>
            </View>
          ))}
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBackground },
  content: { padding: 18, gap: 16, paddingBottom: 120 },
  hero: { borderRadius: 28, padding: 18 },
  heroChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.16)', color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  statRow: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  banner: { borderRadius: 26, padding: 20, minHeight: 176 },
  bannerTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)', color: '#FFD8CA', fontSize: 11, fontWeight: '800' },
  bannerBrand: { marginTop: 18, color: 'rgba(255,255,255,0.62)', letterSpacing: 2.2, fontSize: 11, fontWeight: '800' },
  bannerTitle: { marginTop: 10, fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  bannerSub: { marginTop: 6, color: 'rgba(255,255,255,0.82)', fontSize: 12, letterSpacing: 2 },
  bannerButton: { alignSelf: 'flex-start', marginTop: 18, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.14)' },
  bannerButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  dotRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: -4 },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: '#D7C7BD' },
  dotActive: { width: 22, backgroundColor: colors.primary },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard: { width: '48.2%', borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border, padding: 14 },
  quickGlyphBox: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FCECE5', alignItems: 'center', justifyContent: 'center' },
  quickGlyph: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  quickTitle: { marginTop: 12, fontSize: 15, fontWeight: '800', color: colors.text },
  quickSub: { marginTop: 4, fontSize: 12, color: colors.mutedText },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  linkText: { fontSize: 12, fontWeight: '800', color: colors.primary },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productCard: { width: '48.1%' },
  productImageWrap: { borderRadius: 18, minHeight: 112, alignItems: 'center', justifyContent: 'center' },
  productImage: { width: 92, height: 92 },
  productName: { marginTop: 10, fontSize: 13, fontWeight: '800', color: colors.text },
  productDescription: { marginTop: 4, fontSize: 11, color: colors.mutedText },
  productMeta: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 12, fontWeight: '800', color: colors.text },
  productPoints: { fontSize: 11, fontWeight: '800', color: colors.success },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: '#F2E7DE' },
  activityGlyph: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FCECE5', alignItems: 'center', justifyContent: 'center' },
  activityGlyphText: { color: colors.primary, fontSize: 16, fontWeight: '900' },
  activityLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
  activityTime: { marginTop: 3, fontSize: 11, color: colors.mutedText },
  activityAmount: { fontSize: 13, fontWeight: '800' },
  positive: { color: colors.success },
  negative: { color: colors.primary },
});
