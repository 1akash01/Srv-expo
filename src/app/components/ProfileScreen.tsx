import React, { useMemo, useState } from 'react';
import { Alert, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { UserRole } from '../../types';
import { AppIcon, C, defaultProfile, getThemePalette, IconName, PreferenceContext, Profile, Screen, SubPage, translations } from './profile/ProfileShared';
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

const menuItems = [
  { label: 'My Redemption', icon: 'gift' as IconName, bg: C.primaryLight, screen: 'My Redemption' as SubPage, color: C.primary },
  { label: 'Gift Store', icon: 'gift' as IconName, bg: C.tealLight, route: 'rewards' as Screen, color: C.teal },
  { label: 'Transfer Points', icon: 'transfer' as IconName, bg: C.blueLight, screen: 'Transfer Points' as SubPage, color: C.blue },
  { label: 'My Orders', icon: 'order' as IconName, bg: C.purpleLight, screen: 'My Orders' as SubPage, color: C.purple },
  { label: 'Bank Details', icon: 'bank' as IconName, bg: C.goldLight, screen: 'Bank Details' as SubPage, color: C.gold },
  { label: 'Refer To A Friend', icon: 'refer' as IconName, bg: '#EFF6FF', screen: 'Refer To A Friend' as SubPage, color: C.blue },
  { label: 'Need Help', icon: 'help' as IconName, bg: C.tealLight, screen: 'Need Help' as SubPage, color: C.teal },
  { label: 'Offers & Promotions', icon: 'offer' as IconName, bg: C.goldLight, screen: 'Offers & Promotions' as SubPage, color: C.gold },
];

const settingsItems = [
  { label: 'Notifications', icon: 'notification' as IconName, bg: C.goldLight, screen: 'Notifications' as SubPage, badge: true, color: C.gold },
  { label: 'App Settings', icon: 'settings' as IconName, bg: C.purpleLight, screen: 'App Settings' as SubPage, badge: false, color: C.purple },
  { label: 'Scan History', icon: 'history' as IconName, bg: C.primaryLight, screen: 'Scan History' as SubPage, badge: false, color: C.primary },
  { label: 'Contact Support', icon: 'support' as IconName, bg: C.tealLight, screen: 'Contact Support' as SubPage, badge: false, color: C.teal },
];

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
  const [showImgPicker, setShowImgPicker] = useState(false);
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const theme = useMemo(() => getThemePalette(darkMode), [darkMode]);
  const t = (key: keyof (typeof translations)['English']) => translations[language][key];
  const preferenceValue = { language, setLanguage, darkMode, setDarkMode, t, theme };
  const initials = useMemo(() => profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), [profile.name]);

  const openEdit = () => {
    setDraft(profile);
    setDraftImage(profileImage);
    setPhotoUploaded(false);
    setShowEdit(true);
  };
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
  const saveProfile = () => {
    if (draft.name.trim() && !/^[A-Za-z ]+$/.test(draft.name.trim())) {
      return Alert.alert('Invalid name', 'Name should contain only alphabets and spaces.');
    }
    if (draft.phone.trim() && !/^\d+$/.test(draft.phone.trim())) {
      return Alert.alert('Invalid phone number', 'Phone number should contain only integers.');
    }
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      return Alert.alert('Invalid email', 'Please enter a valid email address.');
    }
    if (draft.city.trim() && !/^[A-Za-z ]+$/.test(draft.city.trim())) {
      return Alert.alert('Invalid city', 'City should contain only alphabets and spaces.');
    }
    if (draft.state.trim() && !/^[A-Za-z ]+$/.test(draft.state.trim())) {
      return Alert.alert('Invalid state', 'State should contain only alphabets and spaces.');
    }
    if (draft.pincode.trim() && !/^\d+$/.test(draft.pincode.trim())) {
      return Alert.alert('Invalid pincode', 'Pincode should contain only integers.');
    }
    setProfile(draft);
    setProfileImage(draftImage);
    setPhotoUploaded(false);
    setShowEdit(false);
  };
  const pickFromGallery = async () => {
    setShowImgPicker(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert('Permission required', 'Please allow gallery access.');
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.85 });
    if (!res.canceled) {
      setDraftImage(res.assets[0].uri);
      setPhotoUploaded(false);
    }
  };
  const pickFromCamera = async () => {
    setShowImgPicker(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert('Permission required', 'Please allow camera access.');
    }
    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.85 });
    if (!res.canceled) {
      setDraftImage(res.assets[0].uri);
      setPhotoUploaded(false);
    }
  };

  const uploadDraftPhoto = () => {
    if (!draftImage) return;
    setProfileImage(draftImage);
    setPhotoUploaded(true);
    Alert.alert('Photo uploaded', 'Your selected profile image has been uploaded. Tap Save Changes to keep it.');
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

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { val: '24', label: t('scans'), icon: 'scan' as IconName, bg: C.primaryLight, color: C.primary, onPress: () => setSubPage('Scan History') },
              { val: '4,250', label: t('points'), icon: 'star' as IconName, bg: C.goldLight, color: C.gold, onPress: () => onNavigate('wallet') },
              { val: '6', label: t('rewards'), icon: 'gift' as IconName, bg: C.tealLight, color: C.teal, onPress: () => onNavigate('rewards') },
            ].map((s) => (
              <TouchableOpacity key={s.label} style={[ps.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={s.onPress} activeOpacity={0.8}>
                <View style={[ps.statIcon, { backgroundColor: s.bg }]}><AppIcon name={s.icon} size={18} color={s.color} /></View>
                <Text style={[ps.statVal, { color: s.color }]}>{s.val}</Text>
                <Text style={[ps.statLbl, { color: theme.textMuted }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[ps.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={ps.cardHead}>
              <Text style={[ps.cardTitle, { color: theme.textPrimary }]}>{t('profileDetails')}</Text>
              <TouchableOpacity onPress={() => setShowFullProfile((current) => !current)} style={ps.visibilityBtn} activeOpacity={0.75}>
                <AppIcon name={showFullProfile ? 'eyeOff' : 'eye'} size={16} color={C.blue} />
                <Text style={ps.visibilityText}>{showFullProfile ? t('hide') : t('show')}</Text>
              </TouchableOpacity>
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
          <View style={ms.editOverlay}>
            <View style={ms.editSheet}>
              <View style={ms.handle} />
              <View style={ms.editHeader}>
                <Text style={ms.editTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setShowEdit(false)} style={ms.closeBtn}><Text style={ms.closeTxt}>✕</Text></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={ms.avatarSection}>
                  <TouchableOpacity onPress={() => setShowImgPicker(true)} activeOpacity={0.85} style={{ alignItems: 'center' }}>
                    <View style={ms.editAvatarRing}>
                      {draftImage ? <Image source={{ uri: draftImage }} style={ms.editAvatarImg} /> : <View style={ms.editAvatarFallback}><Text style={ms.editAvatarInitials}>{initials}</Text></View>}
                      <View style={ms.cameraOverlay}><AppIcon name="camera" size={18} color="#fff" /></View>
                    </View>
                    <Text style={ms.changePhotoTxt}>{t('tapToChangePhoto')}</Text>
                  </TouchableOpacity>
                  {draftImage ? (
                    <TouchableOpacity onPress={uploadDraftPhoto} activeOpacity={0.85} style={photoUploaded ? ms.photoUploadedBtn : ms.photoUploadBtn}>
                      <AppIcon name="check" size={16} color="#fff" />
                      <Text style={ms.photoUploadText}>{photoUploaded ? 'Uploaded' : 'Upload Photo'}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                {([
                  ['Full Name', 'name'], ['Phone Number', 'phone'], ['Email', 'email'], ['City', 'city'], ['State', 'state'], ['Pincode', 'pincode'],
                  ['Address', 'address'], ['GST Holder Name', 'gstHolderName'], ['GST Number', 'gstNumber'], ['PAN Holder Name', 'panHolderName'],
                  ['PAN Number', 'panNumber'], ['Dealer Code', 'dealerCode'],
                ] as [string, keyof Profile][]).map(([label, key]) => (
                  <View key={key} style={ms.field}>
                    <Text style={ms.fieldLabel}>{label}</Text>
                    <TextInput value={draft[key]} onChangeText={(v) => updateDraftField(key, v)} placeholder={`Enter ${label}`} placeholderTextColor={C.muted} style={ms.input} />
                  </View>
                ))}
              </ScrollView>
              <View style={ms.editActions}>
                <Pressable onPress={() => setShowEdit(false)} style={ms.discardBtn}><Text style={ms.discardTxt}>{t('discard')}</Text></Pressable>
                <Pressable onPress={saveProfile} style={ms.saveBtn}><Text style={ms.saveTxt}>{t('saveChanges')}</Text></Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </>
    </PreferenceContext.Provider>
  );
}

const ps = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, gap: 14, paddingBottom: 120 },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: 26, fontWeight: '900' },
  editHeaderBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1 },
  editHeaderText: { fontSize: 14, fontWeight: '700' },
  heroCard: { borderRadius: 28, overflow: 'hidden', borderWidth: 1 },
  blobTL: { position: 'absolute', top: -40, left: -40, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(232,69,60,0.1)' },
  blobBR: { position: 'absolute', bottom: -30, right: -30, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(37,99,235,0.08)' },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 22, paddingBottom: 16 },
  avatarWrap: { position: 'relative', paddingBottom: 4, paddingRight: 4 },
  avatarRing: { width: 80, height: 80, borderRadius: 26, borderWidth: 2.5, borderColor: 'rgba(15,17,32,0.08)', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  avatarFallback: { flex: 1, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: '#fff', fontSize: 28, fontWeight: '900' },
  levelBadge: { position: 'absolute', right: 2, bottom: 2, minWidth: 34, height: 34, borderRadius: 17, backgroundColor: C.gold, borderWidth: 2, borderColor: C.surface, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 7 },
  levelTxt: { color: '#fff', fontSize: 10, fontWeight: '900' },
  heroName: { fontSize: 20, fontWeight: '900', marginBottom: 3 },
  heroPhone: { fontSize: 13, marginBottom: 10 },
  tagRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  tagTxt: { fontSize: 11, fontWeight: '700' },
  memberStrip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingHorizontal: 22, paddingVertical: 14 },
  memberStarWrap: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(245,158,11,0.14)', alignItems: 'center', justifyContent: 'center' },
  memberTitle: { fontSize: 13, fontWeight: '800', color: '#F59E0B' },
  memberSub: { fontSize: 11, marginTop: 1 },
  memberHint: { fontSize: 11, fontWeight: '600' },
  progressTrack: { width: 100, height: 5, borderRadius: 3, backgroundColor: '#E8EAF1' },
  progressFill: { width: '72%', height: '100%', borderRadius: 3, backgroundColor: '#F59E0B' },
  statBox: { flex: 1, borderRadius: 20, padding: 14, alignItems: 'center', gap: 6, borderWidth: 1 },
  statIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statVal: { fontSize: 18, fontWeight: '900' },
  statLbl: { fontSize: 11, fontWeight: '600' },
  card: { borderRadius: 24, padding: 20, borderWidth: 1 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 17, fontWeight: '800' },
  visibilityBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.blueLight, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  visibilityText: { fontSize: 13, fontWeight: '700', color: C.blue },
  kycBanner: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#FFFBEB', borderWidth: 1.5, borderColor: '#FDE68A', borderRadius: 16, padding: 12, marginBottom: 14 },
  kycIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  kycTitle: { fontSize: 13, fontWeight: '800', color: '#92400E' },
  kycSub: { fontSize: 12, color: '#B45309', marginTop: 2 },
  kycBadge: { backgroundColor: '#F59E0B', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  kycBadgeTxt: { fontSize: 11, fontWeight: '800', color: '#fff' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F2FA' },
  detailLbl: { fontSize: 13, fontWeight: '500', width: 100 },
  detailVal: { flex: 1, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  detailEmpty: { color: C.muted, fontStyle: 'italic', fontWeight: '400' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F2FA' },
  menuIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  arrowWrap: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  arrowTxt: { fontSize: 20, lineHeight: 24 },
  notifDot: { position: 'absolute', top: 7, right: 7, width: 9, height: 9, borderRadius: 5, backgroundColor: C.primary, borderWidth: 1.5, borderColor: C.surface },
  signOutBtn: { borderRadius: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1.5 },
  signOutIconWrap: { width: 34, height: 34, borderRadius: 11, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  signOutTxt: { fontSize: 16, fontWeight: '700', color: C.primary },
});

const ms = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15,17,32,0.55)' },
  confirmCard: { backgroundColor: C.surface, borderRadius: 32, padding: 30, marginHorizontal: 28, width: '86%', alignItems: 'center' },
  confirmIconBg: { width: 74, height: 74, borderRadius: 22, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  confirmTitle: { fontSize: 21, fontWeight: '900', color: C.dark, marginBottom: 8 },
  confirmSub: { fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 21, marginBottom: 26 },
  cancelBtn: { flex: 1, height: 52, borderRadius: 17, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  cancelTxt: { fontSize: 15, fontWeight: '800', color: C.dark },
  signOutActionBtn: { flex: 1, height: 52, borderRadius: 17, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  signOutActionTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
  pickerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,17,32,0.45)' },
  pickerSheet: { backgroundColor: C.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  pickerTitle: { fontSize: 18, fontWeight: '800', color: C.dark, marginBottom: 20 },
  pickerOption: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  pickerOptionIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center' },
  pickerOptionLabel: { fontSize: 16, fontWeight: '700', color: C.dark },
  pickerOptionSub: { fontSize: 13, color: C.muted, marginTop: 2 },
  pickerCancel: { marginTop: 16, height: 52, borderRadius: 18, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  pickerCancelTxt: { fontSize: 15, fontWeight: '700', color: C.mid },
  editOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,17,32,0.45)' },
  editSheet: { maxHeight: '92%', backgroundColor: C.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24 },
  handle: { width: 42, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 16 },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  editTitle: { fontSize: 20, fontWeight: '900', color: C.dark },
  closeBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontSize: 15, color: C.mid, fontWeight: '700' },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  editAvatarRing: { width: 96, height: 96, borderRadius: 30, borderWidth: 3, borderColor: C.primary, overflow: 'hidden', marginBottom: 8, position: 'relative' },
  editAvatarImg: { width: '100%', height: '100%' },
  editAvatarFallback: { flex: 1, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  editAvatarInitials: { color: '#fff', fontSize: 32, fontWeight: '900' },
  cameraOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 32, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  changePhotoTxt: { fontSize: 13, color: C.muted, fontWeight: '600' },
  photoUploadBtn: { marginTop: 12, minWidth: 144, height: 42, borderRadius: 14, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16 },
  photoUploadedBtn: { marginTop: 12, minWidth: 144, height: 42, borderRadius: 14, backgroundColor: C.success, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16 },
  photoUploadText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 },
  input: { height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, paddingHorizontal: 16, fontSize: 14, fontWeight: '500', color: C.dark },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  discardBtn: { flex: 1, height: 54, borderRadius: 18, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  discardTxt: { fontSize: 15, fontWeight: '800', color: C.mid },
  saveBtn: { flex: 2, height: 54, borderRadius: 18, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  saveTxt: { color: '#fff', fontSize: 15, fontWeight: '900' },
});
