import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const logoImage = require('../../../assets/banners/srv-logo.jpeg');

interface Profile {
  name?: string;
  phone?: string;
  dealer_code?: string;
  electrician_code?: string;
  dealer_name?: string;
  dealer_town?: string;
  dealer_phone?: string;
  town?: string;
  district?: string;
  state?: string;
}

interface Props {
  profile?: Profile;
  role?: 'dealer' | 'electrician';
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailPill}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

export default function ProfileFlipCard({ profile, role = 'electrician' }: Props) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const initials = (profile?.name || 'U')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const code = role === 'dealer' ? profile?.dealer_code : profile?.electrician_code;
  const qrValue = code || profile?.phone || 'SRV';
  const qrUrl = 'https://quickchart.io/qr?text=' + encodeURIComponent(qrValue) + '&size=220&margin=1&dark=111827&light=FFFFFF';

  const frontRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [0, 0, 1, 1] });

  const animateTo = (toBack: boolean) => {
    setFlipped(toBack);
    Animated.spring(flipAnim, {
      toValue: toBack ? 1 : 0,
      useNativeDriver: true,
      tension: 70,
      friction: 9,
    }).start();
  };

  useEffect(() => {
    const showBack = setTimeout(() => animateTo(true), 4500);
    const showFront = setTimeout(() => animateTo(false), 9000);
    return () => {
      clearTimeout(showBack);
      clearTimeout(showFront);
    };
  }, []);

  const onToggle = () => {
    const next = !flipped;
    animateTo(next);
    if (next) {
      setTimeout(() => animateTo(false), 4500);
    }
  };

  const backTitle = role === 'dealer' ? (profile?.name || 'Harshvardhan') : (profile?.dealer_name || 'Bansal Chauke');
  const backSub = role === 'dealer'
    ? ((profile?.district || 'Mansa') + ', ' + (profile?.state || 'Punjab'))
    : ((profile?.dealer_town || 'Chauke') + ' • +91 ' + (profile?.dealer_phone || '9465258788'));

  return (
    <TouchableOpacity activeOpacity={0.98} onPress={onToggle}>
      <View style={styles.container}>
        <Animated.View style={[styles.face, { opacity: frontOpacity, transform: [{ rotateY: frontRotate }] }]}> 
          <LinearGradient colors={['#152848', '#12213A', '#0C1628']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientFill}>
            <View style={styles.textureOne} />
            <View style={styles.textureTwo} />

            <View style={styles.frontTopRow}>
              <View style={styles.identityWrap}>
                <View style={styles.avatarWrap}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleText}>{role === 'dealer' ? 'Dealer Partner' : 'Electrician Partner'}</Text>
                  <Text style={styles.nameText} numberOfLines={1}>{profile?.name || 'Harshvardhan'}</Text>
                  <Text style={styles.phoneText}>+91 {profile?.phone || '9162038214'}</Text>
                </View>
              </View>
              <View style={styles.logoMiniWrap}>
                <Image source={logoImage} style={styles.logoMini} resizeMode="contain" />
              </View>
            </View>

            <View style={styles.frontBottomRow}>
              <DetailPill label="Code" value={code || 'PB03900-001'} />
              <DetailPill label="Location" value={profile?.town || 'Chauke, Punjab'} />
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.face, { opacity: backOpacity, transform: [{ rotateY: backRotate }] }]}> 
          <LinearGradient colors={['#0B1324', '#101D35', '#172C52']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientFill}>
            <View style={styles.backContent}>
              <View style={styles.backLeft}>
                <Text style={styles.backHeading}>{role === 'dealer' ? 'Business Details' : 'Connected Dealer'}</Text>
                <Text style={styles.backMain} numberOfLines={1}>{backTitle}</Text>
                <Text style={styles.backSub}>{backSub}</Text>

                <View style={styles.metaStack}>
                  <DetailPill label="Dealer Code" value={profile?.dealer_code || 'PB-03-900017-001'} />
                  <DetailPill label="Tap Action" value="Flip to profile" />
                </View>
              </View>

              <View style={styles.qrPanel}>
                <View style={styles.qrFrame}>
                  <Image source={{ uri: qrUrl }} style={styles.qrImage} resizeMode="contain" />
                </View>
                <Text style={styles.qrCodeText} numberOfLines={2}>{qrValue}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      <Text style={styles.tapHint}>Tap card to {flipped ? 'view profile front' : 'view QR & details'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 172,
    position: 'relative',
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: 172,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 9,
  },
  gradientFill: {
    flex: 1,
    padding: 18,
  },
  textureOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(59,130,246,0.16)',
    top: -30,
    right: -40,
  },
  textureTwo: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(232,69,60,0.14)',
    bottom: -24,
    left: -18,
  },
  frontTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  identityWrap: { flexDirection: 'row', gap: 12, flex: 1 },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#10254A', fontSize: 24, fontWeight: '900' },
  roleText: { color: '#AFC0E4', fontSize: 10.5, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.1, marginBottom: 4 },
  nameText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  phoneText: { color: '#D8E3F8', fontSize: 12.5, marginTop: 5 },
  logoMiniWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 6,
  },
  logoMini: { width: '100%', height: '100%', borderRadius: 12 },
  frontBottomRow: { flexDirection: 'row', gap: 10 },
  detailPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  detailLabel: { color: '#96A7C5', fontSize: 10, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  detailValue: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  backContent: { flexDirection: 'row', flex: 1, gap: 14 },
  backLeft: { flex: 1, justifyContent: 'space-between' },
  backHeading: { color: '#9AB0D5', fontSize: 10.5, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  backMain: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', marginTop: 6 },
  backSub: { color: '#C3D2EA', fontSize: 12, lineHeight: 18, marginTop: 6 },
  metaStack: { gap: 9, marginTop: 12 },
  qrPanel: { width: 96, alignItems: 'center', justifyContent: 'center' },
  qrFrame: {
    width: 92,
    height: 92,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  qrImage: { width: '100%', height: '100%' },
  qrCodeText: { color: '#AFC0E4', fontSize: 9.5, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  tapHint: { textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 10.5, marginTop: 8, marginBottom: 2 },
});
