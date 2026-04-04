import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Screen, UserRole } from '../../types';
import {
  AppIcon,
  C,
  PreferenceContext,
  defaultProfile,
  getThemePalette,
  translations,
  type AppLanguage,
  type IconName,
  type Profile,
  type SubPage,
} from './profile/ProfileShared';
import { RedemptionPage } from './profile/MyRedemption';
import { TransferPointsPage } from './profile/TransferPoints';
import { MyOrdersPage } from './profile/MyOrders';
import { BankDetailsPage } from './profile/BankDetails';
import { ReferFriendPage } from './profile/ReferFriend';
import { NeedHelpPage } from './profile/NeedHelp';
import { OffersPage } from './profile/Offers';
import { NotificationsPage } from './profile/Notifications';
import { AppSettingsPage } from './profile/AppSettings';
import { ScanHistoryPage } from './profile/ScanHistory';
import { ContactSupportPage } from './profile/ContactSupport';

const quickActions: Array<{
  label: keyof (typeof translations)['English'];
  icon: IconName;
  color: string;
  bg: string;
  screen?: SubPage;
  route?: Screen;
}> = [
  { label: 'redemptionHistory', icon: 'gift', color: C.primary, bg: C.primaryLight, screen: 'My Redemption' },
  { label: 'giftStore', icon: 'gift', color: C.gold, bg: C.goldLight, route: 'rewards' },
  { label: 'transferPoint', icon: 'transfer', color: C.blue, bg: C.blueLight, screen: 'Transfer Points' },
  { label: 'myOrders', icon: 'order', color: C.purple, bg: C.purpleLight, screen: 'My Orders' },
  { label: 'bankDetails', icon: 'bank', color: C.gold, bg: C.goldLight, screen: 'Bank Details' },
  { label: 'referFriend', icon: 'refer', color: C.blue, bg: '#EFF6FF', screen: 'Refer To A Friend' },
  { label: 'needHelp', icon: 'help', color: C.teal, bg: C.tealLight, screen: 'Need Help' },
  { label: 'offer', icon: 'offer', color: C.gold, bg: C.goldLight, screen: 'Offers & Promotions' },
];

const settingsActions: Array<{
  label: keyof (typeof translations)['English'];
  icon: IconName;
  color: string;
  bg: string;
  screen: SubPage;
}> = [
  { label: 'notification', icon: 'notification', color: C.gold, bg: C.goldLight, screen: 'Notifications' },
  { label: 'appSettings', icon: 'settings', color: C.purple, bg: C.purpleLight, screen: 'App Settings' },
  { label: 'scanHistory', icon: 'history', color: C.primary, bg: C.primaryLight, screen: 'Scan History' },
  { label: 'contactSupport', icon: 'support', color: C.teal, bg: C.tealLight, screen: 'Contact Support' },
];

export function ProfileScreen({
  currentRole,
  onNavigate,
  onSignOut,
}: {
  currentRole: UserRole;
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
}) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [showEdit, setShowEdit] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [language, setLanguage] = useState<AppLanguage>('English');
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => getThemePalette(darkMode), [darkMode]);
  const t = (key: keyof (typeof translations)['English']) => translations[language][key];
  const preferenceValue = { language, setLanguage, darkMode, setDarkMode, t, theme };

  const initials = useMemo(
    () => profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    [profile.name]
  );

  const saveProfile = () => {
    setProfile(draft);
    setShowEdit(false);
  };

  const subpages: Record<Exclude<SubPage, null>, React.ReactElement> = {
    'My Redemption': (
      <RedemptionPage
        onBack={() => setSubPage(null)}
        onNavigate={onNavigate}
        onOpenBankDetails={() => setSubPage('Bank Details')}
        onOpenTransferPoints={() => setSubPage('Transfer Points')}
      />
    ),
    'Transfer Points': <TransferPointsPage onBack={() => setSubPage(null)} onNavigate={onNavigate} />,
    'My Orders': <MyOrdersPage onBack={() => setSubPage(null)} />,
    'Bank Details': <BankDetailsPage onBack={() => setSubPage(null)} />,
    'Refer To A Friend': <ReferFriendPage onBack={() => setSubPage(null)} />,
    'Need Help': <NeedHelpPage onBack={() => setSubPage(null)} />,
    'Offers & Promotions': <OffersPage onBack={() => setSubPage(null)} />,
    Notifications: <NotificationsPage onBack={() => setSubPage(null)} />,
    'App Settings': <AppSettingsPage onBack={() => setSubPage(null)} />,
    'Scan History': <ScanHistoryPage onBack={() => setSubPage(null)} />,
    'Contact Support': <ContactSupportPage onBack={() => setSubPage(null)} />,
  };

  if (subPage) {
    return <PreferenceContext.Provider value={preferenceValue}>{subpages[subPage]}</PreferenceContext.Provider>;
  }

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <>
        <ScrollView style={[styles.screen, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>{t('myProfile')}</Text>

          <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.profileTop}>
              <View style={styles.avatarWrap}>
                <View style={[styles.avatar, { backgroundColor: currentRole === 'dealer' ? C.blue : C.primary }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>L3</Text>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.textPrimary }]}>{profile.name}</Text>
                <Text style={[styles.profilePhone, { color: theme.textSecondary }]}>{profile.phone}</Text>
                <Text style={[styles.profileDealer, { color: theme.textMuted }]}>Dealer Code: {profile.dealerCode}</Text>
                <View style={[styles.roleBadge, currentRole === 'dealer' ? styles.roleBadgeDealer : styles.roleBadgeElectrician]}>
                  <Text style={[styles.roleBadgeText, currentRole === 'dealer' ? styles.roleBadgeDealerText : styles.roleBadgeElectricianText]}>
                    {currentRole === 'dealer' ? t('dealerPartner') : t('electricianPartner')}
                  </Text>
                </View>
                <View style={styles.inlineRow}>
                  <AppIcon name="location" size={13} color={theme.textMuted} />
                  <Text style={[styles.profileCity, { color: theme.textMuted }]}>
                    {profile.city}, {profile.state}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => {
                  setDraft(profile);
                  setShowEdit(true);
                }}
                style={[styles.editBtn, { backgroundColor: theme.soft, borderColor: theme.border }]}
              >
                <AppIcon name="edit" size={15} color={C.primary} />
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              {[
                { value: '24', label: t('scans'), icon: 'scan' as IconName, bg: C.primaryLight, color: C.primary, onPress: () => setSubPage('Scan History') },
                { value: '4250', label: t('points'), icon: 'star' as IconName, bg: C.goldLight, color: C.gold, onPress: () => onNavigate('wallet') },
                { value: '06', label: t('rewards'), icon: 'gift' as IconName, bg: C.tealLight, color: C.teal, onPress: () => onNavigate('rewards') },
              ].map((item) => (
                <Pressable key={item.label} style={[styles.statBox, { backgroundColor: theme.soft, borderColor: theme.border }]} onPress={item.onPress}>
                  <View style={[styles.statIcon, { backgroundColor: item.bg }]}>
                    <AppIcon name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.textPrimary }]}>{item.value}</Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('profileDetails')}</Text>
            {[
              ['Mobile Number', profile.phone],
              ['Email', profile.email || 'Not provided'],
              ['State', profile.state],
              ['City', profile.city],
              ['Pincode', profile.pincode],
              ['Address', profile.address],
              ['GST Holder Name', profile.gstHolderName],
              ['GST Number', profile.gstNumber],
              ['PAN Holder Name', profile.panHolderName || 'Not provided'],
              ['PAN Number', profile.panNumber || 'Not provided'],
              ['Dealer Code', profile.dealerCode],
            ].map(([label, value], index, arr) => (
              <View key={label} style={[styles.detailRow, index < arr.length - 1 && { borderBottomColor: theme.border }, index < arr.length - 1 && styles.detailBorder]}>
                <Text style={[styles.detailLabel, { color: theme.textMuted }]}>{label}</Text>
                <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('quickActions')}</Text>
            {quickActions.map((item, index) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  if (item.route) {
                    onNavigate(item.route);
                    return;
                  }
                  if (item.screen) {
                    setSubPage(item.screen);
                  }
                }}
                style={[styles.menuRow, index < quickActions.length - 1 && { borderBottomColor: theme.border }, index < quickActions.length - 1 && styles.detailBorder]}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                  <AppIcon name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, { color: theme.textPrimary }]}>{t(item.label)}</Text>
                <AppIcon name="chevronRight" size={18} color={theme.textMuted} />
              </Pressable>
            ))}
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('settings')}</Text>
            {settingsActions.map((item, index) => (
              <Pressable
                key={item.label}
                onPress={() => setSubPage(item.screen)}
                style={[styles.menuRow, index < settingsActions.length - 1 && { borderBottomColor: theme.border }, index < settingsActions.length - 1 && styles.detailBorder]}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                  <AppIcon name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, { color: theme.textPrimary }]}>{t(item.label)}</Text>
                <AppIcon name="chevronRight" size={18} color={theme.textMuted} />
              </Pressable>
            ))}
          </View>

          <Pressable onPress={() => setShowSignOut(true)} style={styles.signOutButton}>
            <AppIcon name="signOut" size={18} color="#B42318" />
            <Text style={styles.signOutText}>{t('signOut')}</Text>
          </Pressable>
        </ScrollView>

        <Modal visible={showEdit} animationType="slide" transparent onRequestClose={() => setShowEdit(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{t('edit')}</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {([
                  ['Full Name', 'name'],
                  ['Phone Number', 'phone'],
                  ['Email', 'email'],
                  ['City', 'city'],
                  ['State', 'state'],
                  ['Pincode', 'pincode'],
                  ['Address', 'address'],
                  ['GST Holder Name', 'gstHolderName'],
                  ['GST Number', 'gstNumber'],
                  ['PAN Holder Name', 'panHolderName'],
                  ['PAN Number', 'panNumber'],
                  ['Dealer Code', 'dealerCode'],
                ] as [string, keyof Profile][]).map(([label, key]) => (
                  <View key={key} style={styles.modalField}>
                    <Text style={[styles.modalLabel, { color: theme.textMuted }]}>{label}</Text>
                    <TextInput
                      value={draft[key]}
                      onChangeText={(value) => setDraft((current) => ({ ...current, [key]: value }))}
                      placeholder={label}
                      placeholderTextColor={theme.textMuted}
                      style={[styles.modalInput, { borderColor: theme.border, backgroundColor: theme.soft, color: theme.textPrimary }]}
                    />
                  </View>
                ))}
              </ScrollView>
              <View style={styles.modalActions}>
                <Pressable onPress={() => setShowEdit(false)} style={[styles.modalSecondary, { backgroundColor: theme.soft }]}>
                  <Text style={[styles.modalSecondaryText, { color: theme.textPrimary }]}>{t('discard')}</Text>
                </Pressable>
                <Pressable onPress={saveProfile} style={styles.modalPrimary}>
                  <Text style={styles.modalPrimaryText}>{t('saveChanges')}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showSignOut} animationType="fade" transparent onRequestClose={() => setShowSignOut(false)}>
          <View style={styles.confirmOverlay}>
            <View style={[styles.confirmCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.confirmTitle, { color: theme.textPrimary }]}>{t('signOut')}</Text>
              <Text style={[styles.confirmText, { color: theme.textMuted }]}>Are you sure you want to sign out?</Text>
              <View style={styles.confirmActions}>
                <Pressable onPress={() => setShowSignOut(false)} style={[styles.modalSecondary, { backgroundColor: theme.soft }]}>
                  <Text style={[styles.modalSecondaryText, { color: theme.textPrimary }]}>{t('cancel')}</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setShowSignOut(false);
                    onSignOut();
                  }}
                  style={styles.confirmPrimary}
                >
                  <Text style={styles.modalPrimaryText}>{t('signOut')}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </>
    </PreferenceContext.Provider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 120 },
  pageTitle: { fontSize: 26, fontWeight: '900' },
  profileCard: { borderRadius: 28, borderWidth: 1, padding: 18, gap: 18 },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 74, height: 74, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  levelBadge: { position: 'absolute', right: -2, bottom: -2, minWidth: 28, height: 28, borderRadius: 14, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  levelText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '800' },
  profilePhone: { marginTop: 4, fontSize: 13, fontWeight: '600' },
  profileDealer: { marginTop: 4, fontSize: 12, fontWeight: '600' },
  roleBadge: { marginTop: 8, alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  roleBadgeText: { fontSize: 11, fontWeight: '800' },
  roleBadgeDealer: { backgroundColor: '#EAF2FF' },
  roleBadgeElectrician: { backgroundColor: '#EAF8EF' },
  roleBadgeDealerText: { color: C.blue },
  roleBadgeElectricianText: { color: C.success },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  profileCity: { fontSize: 12, fontWeight: '600' },
  editBtn: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, borderRadius: 20, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center', gap: 6 },
  statIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 12, fontWeight: '700' },
  sectionCard: { borderRadius: 24, borderWidth: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  detailRow: { flexDirection: 'row', gap: 14, paddingVertical: 12 },
  detailBorder: { borderBottomWidth: 1 },
  detailLabel: { width: 124, fontSize: 12, fontWeight: '700' },
  detailValue: { flex: 1, fontSize: 13, fontWeight: '600' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  menuIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '700' },
  signOutButton: { minHeight: 54, borderRadius: 18, backgroundColor: '#FDECEC', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  signOutText: { color: '#B42318', fontSize: 15, fontWeight: '800' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(34, 18, 10, 0.36)' },
  modalCard: { maxHeight: '88%', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  modalField: { marginBottom: 12 },
  modalLabel: { marginBottom: 8, fontSize: 12, fontWeight: '700' },
  modalInput: { minHeight: 50, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, fontSize: 14 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalSecondary: { flex: 1, minHeight: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modalSecondaryText: { fontSize: 14, fontWeight: '800' },
  modalPrimary: { flex: 1, minHeight: 50, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  modalPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  confirmOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(34, 18, 10, 0.36)', padding: 20 },
  confirmCard: { width: '100%', maxWidth: 360, borderRadius: 24, padding: 20 },
  confirmTitle: { fontSize: 20, fontWeight: '800' },
  confirmText: { marginTop: 8, fontSize: 14, lineHeight: 20 },
  confirmActions: { flexDirection: 'row', gap: 12, marginTop: 18 },
  confirmPrimary: { flex: 1, minHeight: 50, borderRadius: 16, backgroundColor: '#B42318', alignItems: 'center', justifyContent: 'center' },
});
