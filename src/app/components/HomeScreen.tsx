import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { Screen, UserRole } from '../../types';
import ProfileFlipCard from './ProfileFlipCard';

const logoImage = require('../../../assets/banners/srv-logo.jpeg');

const BANNER_SLIDES = [
  { image: require('../../../assets/banners/aco.jpg.jpeg') },
  { image: require('../../../assets/banners/appliances.jpg.jpeg') },
  { image: require('../../../assets/banners/co.jpg.jpeg') },
  { image: require('../../../assets/banners/light.jpg.jpeg') },
  { image: require('../../../assets/banners/mcb-box.jpg.jpeg') },
  { image: require('../../../assets/banners/vs-poster.jpg.jpeg') },
];

const PRODUCTS = [
  {
    name: 'Fan Box 3" Range',
    description: 'F8 / FC / FDB 18-40 PC',
    img: 'https://srvelectricals.com/cdn/shop/files/F8_3_18-40.png?v=1757426631&width=300',
    category: 'fanbox',
    price: 'Rs 89',
    points: 10,
    colors: ['#FFF6E8', '#FAD7A0', '#F59E0B'] as const,
  },
  {
    name: 'Concealed Box 3"',
    description: 'CRD PL precision series',
    img: 'https://srvelectricals.com/cdn/shop/files/CRD_PL_3.png?v=1757426566&width=300',
    category: 'concealedbox',
    price: 'Rs 120',
    points: 15,
    colors: ['#EFF6FF', '#BFDBFE', '#3B82F6'] as const,
  },
  {
    name: 'Module Box Platinum',
    description: 'Premium modular metal box',
    img: 'https://srvelectricals.com/cdn/shop/files/3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=300',
    category: 'modular',
    price: 'Rs 245',
    points: 25,
    colors: ['#F5F3FF', '#DDD6FE', '#8B5CF6'] as const,
  },
  {
    name: 'Kitchen Fan Turtle',
    description: 'Ventilation with premium styling',
    img: 'https://srvelectricals.com/cdn/shop/files/AP-Turtle-Fan.webp?v=1747938680&width=300',
    category: 'exhaust',
    price: 'Rs 1,610',
    points: 45,
    colors: ['#ECFEFF', '#BAE6FD', '#0EA5E9'] as const,
  },
];

const RECENT_ACTIVITY = [
  { title: 'QR scanned successfully', time: 'Today, 10:23 AM', amount: '+50', amountColor: '#22C55E' },
  { title: 'Reward redeemed', time: 'Yesterday', amount: '-200', amountColor: '#E8453C' },
  { title: 'Referral bonus added', time: '2 days ago', amount: '+100', amountColor: '#22C55E' },
];

const DUMMY_PROFILE = {
  name: 'Harshvardhan',
  phone: '9162038214',
  electrician_code: 'PB03900-001',
  dealer_code: 'PB-03-900017-001',
  dealer_name: 'Bansal Chauke',
  dealer_town: 'Chauke',
  dealer_phone: '9465258788',
  town: 'Chauke',
  district: 'Mansa',
  state: 'Punjab',
};

function WalletIcon({ color = '#10254A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="13" rx="2.4" stroke={color} strokeWidth={1.8} />
      <Path d="M15.5 11.5H21V16h-5.5a2.25 2.25 0 010-4.5z" stroke={color} strokeWidth={1.8} />
      <Circle cx="16.8" cy="13.75" r="1.05" fill={color} />
      <Path d="M7 6V4.8A1.8 1.8 0 018.8 3h7.7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function BellIcon({ color = '#10254A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 16.5V11a6 6 0 1112 0v5.5l1.2 1.2a.8.8 0 01-.57 1.36H5.37a.8.8 0 01-.57-1.36L6 16.5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M10 20a2 2 0 004 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function ScanIcon({ color = '#10254A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="6" height="6" rx="1.2" stroke={color} strokeWidth={1.8} />
      <Rect x="14" y="4" width="6" height="6" rx="1.2" stroke={color} strokeWidth={1.8} />
      <Rect x="4" y="14" width="6" height="6" rx="1.2" stroke={color} strokeWidth={1.8} />
      <Path d="M14 14h2v2h-2zM18 14h2v6h-6v-2h4v-4z" fill={color} />
    </Svg>
  );
}

function GiftIcon({ color = '#10254A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="8" width="18" height="4" rx="1.2" stroke={color} strokeWidth={1.8} />
      <Path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" stroke={color} strokeWidth={1.8} />
      <Path d="M12 8v13M12 8C12 8 9 6 9 4.5a3 3 0 016 0C15 6 12 8 12 8z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function WhatsAppIcon({ color = '#10254A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4.25A7.75 7.75 0 005.21 15.7L4 19.75l4.17-1.1A7.75 7.75 0 1012 4.25z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path
        d="M9.15 8.95c.18-.4.39-.42.57-.42h.49c.15 0 .36.06.54.46.18.4.6 1.45.66 1.56.06.11.1.24.02.38-.08.15-.13.25-.25.38-.11.13-.24.29-.34.39-.11.11-.22.22-.09.42.13.2.58.95 1.25 1.54.86.76 1.58 1 1.8 1.1.22.1.35.09.48-.07.13-.16.54-.64.68-.86.14-.22.29-.18.48-.11.2.07 1.24.59 1.45.7.21.1.35.16.4.25.05.09.05.54-.13 1.04-.18.51-1.02.98-1.42 1.03-.37.06-.85.09-1.36-.07-.31-.1-.71-.23-1.23-.46-2.15-.94-3.56-3.16-3.67-3.32-.11-.16-.89-1.18-.89-2.25 0-1.07.56-1.6.76-1.82z"
        fill={color}
      />
    </Svg>
  );
}

function ChevronRight({ color = '#10254A', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M6 3.5L10.5 8 6 12.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function HomeScreen({
  currentRole,
  onNavigate,
  onOpenProductCategory,
}: {
  currentRole: UserRole;
  onNavigate: (screen: Screen) => void;
  onOpenProductCategory: (category: string) => void;
}) {
  const { width } = useWindowDimensions();
  const [slide, setSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardW = (width - 28 - 12) / 2;
  const heroImageHeight = Math.round((width - 28) * 0.56);

  const goToSlide = (next: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.45, duration: 140, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  };

  const resetAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    autoSlideRef.current = setInterval(() => {
      setSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 4200);
  };

  useEffect(() => {
    resetAutoSlide();
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 12 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -40) {
          setSlide((prev) => {
            const next = (prev + 1) % BANNER_SLIDES.length;
            goToSlide(next);
            return next;
          });
          resetAutoSlide();
        } else if (gs.dx > 40) {
          setSlide((prev) => {
            const next = (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length;
            goToSlide(next);
            return next;
          });
          resetAutoSlide();
        }
      },
    })
  ).current;

  const quickActions = [
    {
      title: 'Scan & Earn',
      sub: 'Instant points',
      icon: ScanIcon,
      iconColors: ['#E0F2FE', '#BAE6FD'] as const,
      iconTint: '#0369A1',
      onPress: () => onNavigate('scan'),
    },
    {
      title: 'Wallet',
      sub: 'Balance & history',
      icon: WalletIcon,
      iconColors: ['#FEF3C7', '#FDE68A'] as const,
      iconTint: '#B45309',
      onPress: () => onNavigate('wallet'),
    },
    {
      title: 'Gift Store',
      sub: 'Redeem rewards',
      icon: GiftIcon,
      iconColors: ['#F3E8FF', '#DDD6FE'] as const,
      iconTint: '#7C3AED',
      onPress: () => onNavigate('rewards'),
    },
    {
      title: 'WhatsApp',
      sub: 'Premium support',
      icon: WhatsAppIcon,
      iconColors: ['#DCFCE7', '#BBF7D0'] as const,
      iconTint: '#16A34A',
      onPress: () => Linking.openURL('https://wa.me/918837684004?text=Hello%20SRV%20Electricals%2C%20I%20need%20support'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#08111F', '#10254A', '#142E59']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroShell}>
        <View style={styles.heroGlowOne} />
        <View style={styles.heroGlowTwo} />

        <View style={styles.topRow}>
          <View style={styles.brandLockup}>
            <View style={styles.logoWrap}>
              <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
            </View>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity onPress={() => onNavigate('wallet')} style={styles.topActionBtn} activeOpacity={0.85}>
              <WalletIcon color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('notification')} style={styles.topActionBtn} activeOpacity={0.85}>
              <BellIcon color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ProfileFlipCard profile={DUMMY_PROFILE} role={currentRole} />

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Points</Text>
            <Text style={styles.statValue}>4,250</Text>
            <Text style={styles.statHint}>+120 this week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Member Tier</Text>
            <Text style={styles.statValue}>Gold</Text>
            <Text style={styles.statHint}>750 to Platinum</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <Animated.View style={{ opacity: fadeAnim }} {...panResponder.panHandlers}>
          <View style={[styles.bannerCard, { height: heroImageHeight }]}>
            <Image source={BANNER_SLIDES[slide].image} style={styles.bannerImage} resizeMode="cover" />
          </View>
        </Animated.View>

        <View style={styles.dotsRow}>
          {BANNER_SLIDES.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => { goToSlide(index); setSlide(index); resetAutoSlide(); }} activeOpacity={0.8}>
              <View style={[styles.dot, index === slide && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickGrid}>
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={item.title} style={[styles.quickCard, { width: cardW }]} onPress={item.onPress} activeOpacity={0.9}>
                <LinearGradient colors={item.iconColors} style={styles.quickIconBox}>
                  <Icon color={item.iconTint} size={24} />
                </LinearGradient>
                <Text style={styles.quickTitle}>{item.title}</Text>
                <Text style={styles.quickSub}>{item.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Top Picks</Text>
            <Text style={styles.sectionTitle}>Featured products</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('product')} style={styles.inlineAction} activeOpacity={0.85}>
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight color="#E8453C" />
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {PRODUCTS.map((product) => (
            <TouchableOpacity key={product.name} onPress={() => onOpenProductCategory(product.category)} style={[styles.productCard, { width: cardW }]} activeOpacity={0.9}>
              <LinearGradient colors={product.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.productImageZone}>
                <Image source={{ uri: product.img }} style={styles.productImage} resizeMode="contain" />
              </LinearGradient>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.productDesc} numberOfLines={2}>{product.description}</Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <View style={styles.pointsPill}>
                    <Text style={styles.pointsPillText}>+{product.points} pts</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Recent Activity</Text>
            <Text style={styles.sectionTitle}>Latest actions</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('notification')} style={styles.inlineAction} activeOpacity={0.85}>
            <Text style={styles.viewAllText}>Notifications</Text>
            <ChevronRight color="#E8453C" />
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          {RECENT_ACTIVITY.map((item, index) => (
            <View key={item.title} style={[styles.activityRow, index < RECENT_ACTIVITY.length - 1 && styles.activityDivider]}>
              <View style={styles.activityIconWrap}>
                <BellIcon color="#24437A" size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              <Text style={[styles.activityAmount, { color: item.amountColor }]}>{item.amount}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF3F8' },
  heroShell: {
    paddingTop: 26,
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  heroGlowOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(37,99,235,0.24)',
    top: -50,
    right: -35,
  },
  heroGlowTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(232,69,60,0.16)',
    bottom: 20,
    left: -35,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  brandLockup: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  logoWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
  },
  logoImage: { width: 64, height: 64 },
  topActions: { flexDirection: 'row', gap: 8 },
  topActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderRadius: 20,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statLabel: { color: 'rgba(255,255,255,0.58)', fontSize: 10.5, fontWeight: '700', marginBottom: 5 },
  statValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  statHint: { color: '#B8C6E5', fontSize: 11, marginTop: 3 },
  body: { paddingHorizontal: 14, paddingTop: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  sectionEyebrow: { color: '#7D8AA5', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.1, marginBottom: 5 },
  sectionTitle: { color: '#14213D', fontSize: 21, fontWeight: '900' },
  bannerCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#D9E3F2',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 9,
  },
  bannerImage: { width: '100%', height: '100%' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 14, marginBottom: 22 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C7D2E3' },
  dotActive: { width: 28, backgroundColor: '#0F172A' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 22 },
  quickCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4,
  },
  quickIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  quickTitle: { color: '#152238', fontSize: 14, fontWeight: '800' },
  quickSub: { color: '#74829D', fontSize: 11.5, marginTop: 3 },
  inlineAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { color: '#E8453C', fontSize: 13, fontWeight: '800' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  productImageZone: { height: 138, alignItems: 'center', justifyContent: 'center' },
  productImage: { width: 112, height: 112 },
  productInfo: { padding: 13 },
  productName: { color: '#152238', fontSize: 13.5, fontWeight: '800' },
  productDesc: { color: '#70819C', fontSize: 11, lineHeight: 16, marginTop: 4, minHeight: 32 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  productPrice: { color: '#152238', fontSize: 15, fontWeight: '900' },
  pointsPill: { backgroundColor: '#EAF8F0', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  pointsPillText: { color: '#16A34A', fontSize: 10.5, fontWeight: '800' },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: '#EEF2F7' },
  activityIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EDF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: { color: '#152238', fontSize: 13, fontWeight: '700' },
  activityTime: { color: '#7E8BA5', fontSize: 11, marginTop: 3 },
  activityAmount: { fontSize: 14, fontWeight: '900' },
});
