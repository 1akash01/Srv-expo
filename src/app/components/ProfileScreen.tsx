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
import { AppSettingsPage } from './profile/AppSettings';
import { BankDetailsPage } from './profile/BankDetails';
import { ContactSupportPage } from './profile/ContactSupport';
import { MyOrdersPage } from './profile/MyOrders';
import { RedemptionPage } from './profile/MyRedemption';
import { NeedHelpPage } from './profile/NeedHelp';
import { NotificationsPage } from './profile/Notifications';
import { OffersPage } from './profile/Offers';
import { ReferFriendPage } from './profile/ReferFriend';
import { ScanHistoryPage } from './profile/ScanHistory';
import { TransferPointsPage } from './profile/TransferPoints';

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
  { label: 'referFriend', icon: 'refer', color: C.teal, bg: C.tealLight, screen: 'Refer To A Friend' },
  { label: 'needHelp', icon: 'help', color: C.primary, bg: C.primaryLight, screen: 'Need Help' },
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

const fallbackT = (language: AppLanguage, key: keyof (typeof translations)['English']) => {
  const value = translations[language][key];
  return /[Ãàâ¨]/.test(value) ? translations.English[key] : value;
};

export function ProfileScreen({
  currentRole,
  onNavigate,
  onSignOut,
}: {
  currentRole: UserRole;
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
}) {
  const [language, setLanguage] = useState<AppLanguage>('English');
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [showEdit, setShowEdit] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [subPage, setSubPage] = useState<SubPage>(null);

  const theme = useMemo(() => getThemePalette(darkMode), [darkMode]);
  const t = (key: keyof (typeof translations)['English']) => fallbackT(language, key);
  const preferenceValue = { language, setLanguage, darkMode, setDarkMode, t, theme };
  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .map((chunk) => chunk[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const updateDraftField = (key: keyof Profile, value: string) => {
    let nextValue = value;
    if (key === 'name' || key === 'city' || key === 'state' || key === 'gstHolderName' || key === 'panHolderName') {
      nextValue = value.replace(/[^A-Za-z ]/g, '');
    } else if (key === 'phone' || key === 'pincode' || key === 'dealerCode') {
      nextValue = value.replace(/\D/g, '');
    } else if (key === 'email') {
      nextValue = value.replace(/\s/g, '');
    }
    setDraft((current) => ({ ...current, [key]: nextValue }));
  };

  const openEdit = () => {
    setDraft(profile);
    setShowEdit(true);
  };

  const closeEdit = () => {
    setDraft(profile);
    setShowEdit(false);
  };

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

  const roleColor = currentRole === 'dealer' ? C.blue : C.primary;
  const roleSoft = currentRole === 'dealer' ? C.blueLight : C.primaryLight;

  return (
    <PreferenceContext.Provider value={preferenceValue}>
      <>
        <ScrollView
          style={[styles.screen, { backgroundColor: theme.bg }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.heroHead}>
              <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>{t('myProfile')}</Text>
              <Pressable style={[styles.editHeaderBtn, { backgroundColor: theme.soft, borderColor: theme.border }]} onPress={openEdit}>
                <AppIcon name="edit" size={16} color={roleColor} />
                <Text style={[styles.editHeaderTxt, { color: theme.textPrimary }]}>{t('edit')}</Text>
              </Pressable>
            </View>

            <View style={styles.profileRow}>
              <View style={[styles.avatar, { backgroundColor: roleColor }]}>
                <Text style={styles.avatarTxt}>{initials}</Text>
              </View>

              <View style={styles.profileMeta}>
                <Text style={[styles.name, { color: theme.textPrimary }]}>{profile.name}</Text>
                <Text style={[styles.phone, { color: theme.textSecondary }]}>+91 {profile.phone}</Text>
                <Text style={[styles.city, { color: theme.textMuted }]}>
                  {profile.city}, {profile.state}
                </Text>
              </View>

              <View style={[styles.rolePill, { backgroundColor: roleSoft }]}>
                <Text style={[styles.rolePillTxt, { color: roleColor }]}>
                  {currentRole === 'dealer' ? t('dealerPartner') : t('electricianPartner')}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              {[
                { icon: 'scan' as IconName, label: t('scans'), value: '24', bg: C.primaryLight, color: C.primary, onPress: () => setSubPage('Scan History') },
                { icon: 'star' as IconName, label: t('points'), value: '4250', bg: C.goldLight, color: C.gold, onPress: () => onNavigate('wallet') },
                { icon: 'gift' as IconName, label: t('rewards'), value: '06', bg: C.tealLight, color: C.teal, onPress: () => onNavigate('rewards') },
              ].map((item) => (
                <Pressable key={item.label} style={[styles.statBox, { backgroundColor: theme.soft, borderColor: theme.border }]} onPress={item.onPress}>
                  <View style={[styles.statIcon, { backgroundColor: item.bg }]}>
                    <AppIcon name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.statVal, { color: theme.textPrimary }]}>{item.value}</Text>
                  <Text style={[styles.statLbl, { color: theme.textMuted }]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('profileDetails')}</Text>
            {[
              ['Mobile Number', `+91 ${profile.phone}`],
              ['Email', profile.email || 'Not provided'],
              ['Address', profile.address],
              ['State', profile.state],
              ['City', profile.city],
              ['Pincode', profile.pincode],
              ['GST Holder Name', profile.gstHolderName],
              ['GST Number', profile.gstNumber],
              ['PAN Holder Name', profile.panHolderName || 'Not provided'],
              ['PAN Number', profile.panNumber || 'Not provided'],
              ['Dealer Code', profile.dealerCode],
            ].map(([label, value], index, arr) => (
              <View
                key={label}
                style={[
                  styles.detailRow,
                  index < arr.length - 1 ? { borderBottomWidth: 1, borderBottomColor: theme.border } : null,
                ]}
              >
                <Text style={[styles.detailLbl, { color: theme.textMuted }]}>{label}</Text>
                <Text style={[styles.detailVal, { color: theme.textPrimary }]}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('quickActions')}</Text>
            <View style={styles.grid}>
              {quickActions.map((item) => (
                <Pressable
                  key={item.label}
                  style={[styles.gridCard, { backgroundColor: theme.soft, borderColor: theme.border }]}
                  onPress={() => {
                    if (item.route) {
                      onNavigate(item.route);
                      return;
                    }
                    if (item.screen) {
                      setSubPage(item.screen);
                    }
                  }}
                >
                  <View style={[styles.gridIcon, { backgroundColor: item.bg }]}>
                    <AppIcon name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.gridLabel, { color: theme.textPrimary }]}>{t(item.label)}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('settings')}</Text>
            {settingsActions.map((item, index, arr) => (
              <Pressable
                key={item.label}
                style={[
                  styles.settingRow,
                  index < arr.length - 1 ? { borderBottomWidth: 1, borderBottomColor: theme.border } : null,
                ]}
                onPress={() => setSubPage(item.screen)}
              >
                <View style={[styles.settingLeft, { backgroundColor: item.bg }]}>
                  <AppIcon name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>{t(item.label)}</Text>
                <AppIcon name="chevronRight" size={18} color={theme.textMuted} />
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.signOutBtn} onPress={() => setShowSignOut(true)}>
            <AppIcon name="signOut" size={18} color="#fff" />
            <Text style={styles.signOutTxt}>{t('signOut')}</Text>
          </Pressable>
        </ScrollView>

        <Modal visible={showEdit} animationType="slide" transparent onRequestClose={closeEdit}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{t('edit')} Profile</Text>
              {[
                { key: 'name' as const, label: 'Name' },
                { key: 'phone' as const, label: 'Phone Number' },
                { key: 'email' as const, label: 'Email' },
                { key: 'address' as const, label: 'Address' },
                { key: 'state' as const, label: 'State' },
                { key: 'city' as const, label: 'City' },
                { key: 'pincode' as const, label: 'Pincode' },
              ].map((field) => (
                <View key={field.key} style={styles.modalField}>
                  <Text style={[styles.modalLabel, { color: theme.textMuted }]}>{field.label}</Text>
                  <TextInput
                    value={draft[field.key]}
                    onChangeText={(value) => updateDraftField(field.key, value)}
                    placeholder={field.label}
                    placeholderTextColor={theme.textMuted}
                    style={[styles.modalInput, { backgroundColor: theme.soft, borderColor: theme.border, color: theme.textPrimary }]}
                  />
                </View>
              ))}
              <View style={styles.modalActions}>
                <Pressable style={[styles.modalSecondary, { backgroundColor: theme.soft, borderColor: theme.border }]} onPress={closeEdit}>
                  <Text style={[styles.modalSecondaryTxt, { color: theme.textPrimary }]}>{t('cancel')}</Text>
                </Pressable>
                <Pressable style={styles.modalPrimary} onPress={saveProfile}>
                  <Text style={styles.modalPrimaryTxt}>{t('saveChanges')}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showSignOut} animationType="fade" transparent onRequestClose={() => setShowSignOut(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.confirmCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.confirmTitle, { color: theme.textPrimary }]}>{t('signOut')}</Text>
              <Text style={[styles.confirmText, { color: theme.textSecondary }]}>Do you want to sign out of this account?</Text>
              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalSecondary, { backgroundColor: theme.soft, borderColor: theme.border }]}
                  onPress={() => setShowSignOut(false)}
                >
                  <Text style={[styles.modalSecondaryTxt, { color: theme.textPrimary }]}>{t('cancel')}</Text>
                </Pressable>
                <Pressable
                  style={styles.modalPrimary}
                  onPress={() => {
                    setShowSignOut(false);
                    onSignOut();
                  }}
                >
                  <Text style={styles.modalPrimaryTxt}>{t('signOut')}</Text>
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
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 18,
    gap: 18,
  },
  heroHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  editHeaderBtn: {
    minHeight: 38,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  editHeaderTxt: {
    fontSize: 13,
    fontWeight: '700',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarTxt: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
  },
  phone: {
    fontSize: 14,
    fontWeight: '700',
  },
  city: {
    fontSize: 13,
    fontWeight: '600',
  },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    marginLeft: 12,
  },
  rolePillTxt: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  statLbl: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 14,
  },
  detailRow: {
    paddingVertical: 12,
  },
  detailLbl: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  detailVal: {
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  gridIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gridLabel: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingLeft: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  signOutBtn: {
    height: 54,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  signOutTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,17,32,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 26,
    borderWidth: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16,
  },
  modalField: {
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  modalInput: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalSecondary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryTxt: {
    fontSize: 15,
    fontWeight: '700',
  },
  modalPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  confirmCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
});
