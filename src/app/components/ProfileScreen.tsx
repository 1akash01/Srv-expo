import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { Screen } from '../../types';

const Colors = {
  primary: '#E8453C',
  primaryLight: '#FFF0F0',
  background: '#F2F3F7',
  surface: '#FFFFFF',
  border: '#EEEEF3',
  textDark: '#1C1E2E',
  textMuted: '#9898A8',
  gold: '#F59E0B',
};

const defaultProfile = {
  name: 'Harshvardhan',
  phone: '9162038214',
  email: '',
  state: 'Punjab',
  city: 'Mansa',
  pincode: '151505',
  address: 'YOUR+PC8, Green Valley',
  gstHolderName: 'Harshvardhan',
  gstNumber: 'BIBPB7675A',
  panHolderName: '',
  panNumber: '',
  dealerCode: '215548',
};

type Profile = typeof defaultProfile;

const quickLinks: Array<{ label: string; icon: string; bg: string; screen: Screen | null }> = [
  { label: 'My Redemption', icon: 'MR', bg: Colors.primaryLight, screen: 'wallet' },
  { label: 'Gift Store', icon: 'GS', bg: '#FFF8E1', screen: 'rewards' },
  { label: 'Transfer Points', icon: 'TP', bg: Colors.primaryLight, screen: null },
  { label: 'My Orders', icon: 'MO', bg: '#EFF6FF', screen: null },
  { label: 'Bank Details', icon: 'BD', bg: '#FFF8E1', screen: null },
  { label: 'Need Help', icon: 'NH', bg: '#E6FDF0', screen: null },
];

const detailRows: Array<{ label: string; key: keyof Profile }> = [
  { label: 'Phone Number', key: 'phone' },
  { label: 'Email', key: 'email' },
  { label: 'City', key: 'city' },
  { label: 'State', key: 'state' },
  { label: 'Pincode', key: 'pincode' },
  { label: 'Address', key: 'address' },
  { label: 'GST Holder', key: 'gstHolderName' },
  { label: 'GST Number', key: 'gstNumber' },
  { label: 'PAN Holder', key: 'panHolderName' },
  { label: 'PAN Number', key: 'panNumber' },
  { label: 'Dealer Code', key: 'dealerCode' },
];

function PinIcon({ color = '#1C1E2E', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21s6-5.33 6-11a6 6 0 10-12 0c0 5.67 6 11 6 11z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="10" r="2.2" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function PencilIcon({ color = '#1C1E2E', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20l4.2-1 9-9a2.1 2.1 0 10-3-3l-9 9L4 20z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M13 7l4 4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function StarIcon({ color = '#92400E', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3l2.8 5.68 6.27.91-4.53 4.42 1.07 6.25L12 17.27 6.39 20.26l1.07-6.25L2.93 9.6l6.27-.91L12 3z" fill={color} />
    </Svg>
  );
}

function LogoutIcon({ color = '#E8453C', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10 17l5-5-5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 12H4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M20 4v16" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function MenuIcon({ kind, color = '#1C1E2E', size = 18 }: { kind: string; color?: string; size?: number }) {
  switch (kind) {
    case 'MR':
    case 'GS':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="8" width="18" height="4" rx="1.2" stroke={color} strokeWidth={1.8} />
          <Path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" stroke={color} strokeWidth={1.8} />
          <Path d="M12 8v13M12 8C12 8 9 6 9 4.5a3 3 0 016 0C15 6 12 8 12 8z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'TP':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 7h10M7 7l3-3M7 7l3 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M17 17H7m10 0l-3-3m3 3l-3 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'MO':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 6h15l-1.4 7.2a2 2 0 01-2 1.6H9a2 2 0 01-2-1.6L5.5 4H3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="10" cy="19" r="1.5" fill={color} />
          <Circle cx="17" cy="19" r="1.5" fill={color} />
        </Svg>
      );
    case 'BD':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="6" width="18" height="12" rx="2.2" stroke={color} strokeWidth={1.8} />
          <Path d="M3 10h18" stroke={color} strokeWidth={1.8} />
          <Rect x="6" y="13" width="5" height="2" rx="1" fill={color} />
        </Svg>
      );
    case 'NH':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
          <Path d="M9.7 9.2a2.8 2.8 0 015.1 1.6c0 1.9-2.1 2.4-2.8 3.7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          <Circle cx="12" cy="17.2" r="1" fill={color} />
        </Svg>
      );
    default:
      return <Circle cx="12" cy="12" r="4" fill={color} />;
  }
}

export function ProfileScreen({
  currentRole,
  onNavigate,
  onSignOut,
}: {
  currentRole: 'electrician' | 'dealer';
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
}) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [showEdit, setShowEdit] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  const initials = useMemo(
    () => profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    [profile.name]
  );

  const openEdit = () => {
    setDraft(profile);
    setShowEdit(true);
  };

  const saveProfile = () => {
    setProfile(draft);
    setShowEdit(false);
  };

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>L3</Text>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profilePhone}>{profile.phone}</Text>
              <Text style={styles.profileDealer}>Dealer: {profile.dealerCode}</Text>
              <Text style={styles.roleBadgeText}>
                Role: {currentRole === 'electrician' ? 'Electrician' : 'Dealer'}
              </Text>
              <View style={styles.inlineRow}>
                <PinIcon size={13} color={Colors.textMuted} />
                <Text style={styles.profileCity}>
                  {profile.city}, {profile.state}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={openEdit} style={styles.editBtn} activeOpacity={0.8}>
              <PencilIcon size={15} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.goldMemberRow}>
            <View style={styles.inlineRowStrong}>
              <StarIcon />
              <Text style={styles.goldMemberText}>Gold Member</Text>
            </View>
            <Text style={styles.goldHint}>750 pts to Platinum {'>'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeadRow}>
            <Text style={styles.sectionTitle}>Profile Details</Text>
            <TouchableOpacity onPress={openEdit} style={styles.editChip} activeOpacity={0.8}>
              <PencilIcon size={13} color={Colors.primary} />
              <Text style={styles.editChipText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.kycBanner}>
            <StarIcon size={13} color="#B45309" />
            <View style={styles.kycContent}>
              <Text style={styles.kycTitle}>Complete KYC to unlock all features</Text>
              <Text style={styles.kycSub}>Add PAN & GST details to get verified</Text>
            </View>
          </View>

          {detailRows.map((item, index) => {
            const value = profile[item.key];
            const empty = !String(value).trim();

            return (
              <View key={item.key} style={[styles.detailRow, index < detailRows.length - 1 && styles.detailBorder]}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={[styles.detailValue, empty && styles.detailValueEmpty]}>
                  {empty ? 'Not added' : value}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Quick Access</Text>
        <View style={styles.card}>
          {quickLinks.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => item.screen && onNavigate(item.screen)}
              style={[styles.menuRow, index < quickLinks.length - 1 && styles.menuRowBorder]}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                <MenuIcon kind={item.icon} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsCard}>
          <View style={styles.inlineRowStrongSpace}>
            <StarIcon size={13} color="#FFFFFF" />
            <Text style={styles.statsTitle}>Your Stats</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
              <Text style={[styles.statValue, { color: '#FFFFFF' }]}>4,250</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: 'rgba(255,255,255,0.16)' }]}>
              <Text style={[styles.statValue, { color: '#FDE68A' }]}>Gold</Text>
              <Text style={styles.statLabel}>Current Tier</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={() => setShowSignOut(true)} activeOpacity={0.8}>
          <LogoutIcon />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showSignOut} animationType="fade" transparent onRequestClose={() => setShowSignOut(false)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconWrap}>
              <LogoutIcon size={22} />
            </View>
            <Text style={styles.confirmTitle}>Sign Out?</Text>
            <Text style={styles.confirmSub}>
              Are you sure you want to sign out?{'\n'}Your profile data will remain safe.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable onPress={() => setShowSignOut(false)} style={styles.confirmCancel}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowSignOut(false);
                  onSignOut();
                }}
                style={styles.confirmSignOut}
              >
                <Text style={styles.confirmSignOutText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showEdit} animationType="slide" transparent onRequestClose={() => setShowEdit(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {detailRows.map((item) => (
                <View key={item.key} style={styles.modalField}>
                  <Text style={styles.modalLabel}>{item.label}</Text>
                  <TextInput
                    value={draft[item.key]}
                    onChangeText={(value) => setDraft((current) => ({ ...current, [item.key]: value }))}
                    placeholder={`Enter ${item.label}`}
                    placeholderTextColor="#AA9A90"
                    style={styles.modalInput}
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowEdit(false)} style={styles.modalSecondary}>
                <Text style={styles.modalSecondaryText}>Discard</Text>
              </Pressable>
              <Pressable onPress={saveProfile} style={styles.modalPrimary}>
                <Text style={styles.modalPrimaryText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 120 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: Colors.textDark, textAlign: 'center' },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  profileTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  profileInfo: { flex: 1 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '900' },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  levelText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  profileName: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  profilePhone: { fontSize: 13, color: Colors.textMuted, marginTop: 3 },
  profileDealer: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  roleBadgeText: { fontSize: 12, color: Colors.primary, marginTop: 4, fontWeight: '700' },
  profileCity: { fontSize: 12, color: Colors.textMuted },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  inlineRowStrong: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inlineRowStrongSpace: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  editBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  goldMemberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  goldMemberText: { fontSize: 14, fontWeight: '800', color: '#92400E' },
  goldHint: { fontSize: 12, color: '#92400E', fontWeight: '600' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textDark },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: Colors.textDark, paddingLeft: 2 },
  editChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primaryLight, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  editChipText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  kycBanner: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  kycContent: { flex: 1 },
  kycTitle: { fontSize: 13, fontWeight: '800', color: '#92400E' },
  kycSub: { fontSize: 12, color: '#B45309', marginTop: 2 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, gap: 10 },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5FB' },
  detailLabel: { fontSize: 13, color: Colors.textMuted, flex: 1 },
  detailValue: { fontSize: 13, fontWeight: '700', color: Colors.textDark, flex: 1, textAlign: 'right' },
  detailValueEmpty: { color: Colors.textMuted, fontStyle: 'italic', fontWeight: '400' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5FB' },
  menuIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textDark },
  menuArrow: { fontSize: 20, color: '#C0C0D0', fontWeight: '700' },
  statsCard: { backgroundColor: '#2D3561', borderRadius: 22, padding: 20 },
  statsTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4, fontWeight: '600' },
  signOutBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  signOutText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  confirmOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(28,30,46,0.5)' },
  confirmCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    marginHorizontal: 32,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  confirmIconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  confirmTitle: { fontSize: 20, fontWeight: '900', color: Colors.textDark, marginBottom: 8 },
  confirmSub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  confirmActions: { flexDirection: 'row', gap: 12, width: '100%' },
  confirmCancel: { flex: 1, height: 50, borderRadius: 16, backgroundColor: '#F3E9E1', alignItems: 'center', justifyContent: 'center' },
  confirmCancelText: { fontSize: 15, fontWeight: '800', color: Colors.textDark },
  confirmSignOut: { flex: 1, height: 50, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  confirmSignOutText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(28,30,46,0.4)' },
  modalCard: { maxHeight: '88%', backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20 },
  modalTitle: { fontSize: 19, fontWeight: '800', color: Colors.textDark, marginBottom: 16 },
  modalField: { marginBottom: 14 },
  modalLabel: { marginBottom: 7, fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  modalInput: { minHeight: 50, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#FFF9F4', paddingHorizontal: 14, fontSize: 14, color: Colors.textDark },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  modalSecondary: { flex: 1, minHeight: 52, borderRadius: 16, backgroundColor: '#F3E9E1', alignItems: 'center', justifyContent: 'center' },
  modalSecondaryText: { fontSize: 15, fontWeight: '800', color: Colors.textDark },
  modalPrimary: { flex: 1, minHeight: 52, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  modalPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
