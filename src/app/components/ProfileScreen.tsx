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
  currentRole: UserRole;
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
}) {
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showImgPicker, setShowImgPicker] = useState(false);
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [pendingDraftImage, setPendingDraftImage] = useState<string | null>(null);

  const theme = useMemo(() => getThemePalette(darkMode), [darkMode]);
  const t = (key: keyof (typeof translations)['English']) => {
    const value = translations[language][key];
    return /[Ãàâ¨]/.test(value) ? translations.English[key] : value;
  };
  const preferenceValue = { language, setLanguage, darkMode, setDarkMode, t, theme };
  const initials = useMemo(() => profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), [profile.name]);

  const openEdit = () => {
    setDraft(profile);
    setDraftImage(profileImage);
    setPendingDraftImage(null);
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
    setPendingDraftImage(null);
    setShowEdit(false);
  };
  const pickFromGallery = async () => {
    setShowImgPicker(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert('Permission required', 'Please allow gallery access.');
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.85 });
    if (!res.canceled) {
      setPendingDraftImage(res.assets[0].uri);
    }
  };
  const pickFromCamera = async () => {
    setShowImgPicker(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert('Permission required', 'Please allow camera access.');
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!res.canceled) {
      setPendingDraftImage(res.assets[0].uri);
    }
  };

  const confirmDraftPhoto = () => {
    if (!pendingDraftImage) return;
    setDraftImage(pendingDraftImage);
    setProfileImage(pendingDraftImage);
    setPendingDraftImage(null);
  };

  const cancelDraftPhoto = () => {
    setPendingDraftImage(null);
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
        <ScrollView style={[ps.screen, { backgroundColor: theme.bg }]} contentContainerStyle={ps.content} showsVerticalScrollIndicator={false}>
          <View style={ps.pageHeader}>
            <Text style={[ps.pageTitle, { color: theme.textPrimary }]}>{t('myProfile')}</Text>
            <TouchableOpacity onPress={openEdit} style={[ps.editHeaderBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} activeOpacity={0.75}>
              <AppIcon name="edit" size={16} color={C.primary} />
              <Text style={[ps.editHeaderText, { color: theme.textPrimary }]}>{t('edit')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[ps.heroCard, { backgroundColor: theme.heroSurface, borderColor: theme.border }]}>
            <View style={ps.blobTL} />
            <View style={ps.blobBR} />
            <View style={ps.heroTop}>
              <TouchableOpacity onPress={openEdit} activeOpacity={0.85} style={ps.avatarWrap}>
                <View style={ps.avatarRing}>
                  {profileImage ? <Image source={{ uri: profileImage }} style={ps.avatarImg} /> : <View style={ps.avatarFallback}><Text style={ps.avatarInitials}>{initials}</Text></View>}
                </View>
                <View style={ps.levelBadge}><Text style={ps.levelTxt}>L3</Text></View>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={[ps.heroName, { color: theme.textPrimary }]}>{profile.name}</Text>
                <Text style={[ps.heroPhone, { color: theme.textMuted }]}>+91 {profile.phone}</Text>
                <View style={ps.tagRow}>
                  <View style={[ps.tag, { backgroundColor: theme.soft }]}><Text style={[ps.tagTxt, { color: theme.textSecondary }]}>📍 {profile.city}</Text></View>
                  <View style={[ps.tag, { backgroundColor: C.primaryLight }]}><Text style={[ps.tagTxt, { color: C.primary }]}>{profile.dealerCode}</Text></View>
                </View>
              </View>
            </View>
            <View style={[ps.memberStrip, { backgroundColor: theme.heroStrip, borderTopColor: theme.border }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={ps.memberStarWrap}><AppIcon name="star" size={14} color="#F59E0B" /></View>
                <View>
                  <Text style={ps.memberTitle}>{t('goldMember')}</Text>
                  <Text style={[ps.memberSub, { color: theme.textMuted }]}>{currentRole === 'dealer' ? t('dealerPartner') : t('electricianPartner')}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 5 }}>
                <Text style={[ps.memberHint, { color: theme.textSecondary }]}>{t('toPlatinum')}</Text>
                <View style={ps.progressTrack}><View style={ps.progressFill} /></View>
              </View>
            </View>
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
            {currentRole === 'dealer' && (
              <View style={ps.kycBanner}>
                <View style={ps.kycIcon}><AppIcon name="warning" size={18} color="#B45309" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={ps.kycTitle}>Complete KYC to unlock all features</Text>
                  <Text style={ps.kycSub}>Add PAN & GST details to get verified</Text>
                </View>
                <View style={ps.kycBadge}><Text style={ps.kycBadgeTxt}>Pending</Text></View>
              </View>
            )}
            {[
              ['Mobile', profile.phone], ['Email', profile.email || 'Not provided'], ['State', profile.state], ['City', profile.city],
              ['Pincode', profile.pincode], ['Address', profile.address], ['GST Holder', profile.gstHolderName], ['GST Number', profile.gstNumber],
              ['PAN Holder', profile.panHolderName || 'Not provided'], ['PAN Number', profile.panNumber || 'Not provided'], ['Dealer Code', profile.dealerCode],
            ].slice(0, showFullProfile ? undefined : 4).map(([lbl, val], i, arr) => (
              <View key={lbl} style={[ps.detailRow, i < arr.length - 1 && [ps.detailBorder, { borderBottomColor: theme.border }]]}>
                <Text style={[ps.detailLbl, { color: theme.textMuted }]}>{lbl}</Text>
                <Text style={[ps.detailVal, { color: theme.textPrimary }, (!val || val === 'Not provided') && ps.detailEmpty]} numberOfLines={1}>{val}</Text>
              </View>
            ))}
          </View>

          <View style={[ps.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[ps.cardTitle, { color: theme.textPrimary }]}>{t('quickActions')}</Text>
            <View style={{ height: 12 }} />
            {menuItems.map((item, i) => (
              <TouchableOpacity key={item.label} style={[ps.menuRow, i < menuItems.length - 1 && [ps.menuBorder, { borderBottomColor: theme.border }]]} onPress={() => (item.route ? onNavigate(item.route) : setSubPage(item.screen as SubPage))} activeOpacity={0.75}>
                <View style={[ps.menuIcon, { backgroundColor: item.bg }]}><AppIcon name={item.icon} size={20} color={item.color} /></View>
                <Text style={[ps.menuLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                <View style={[ps.arrowWrap, { backgroundColor: theme.soft }]}><Text style={[ps.arrowTxt, { color: theme.textMuted }]}>›</Text></View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[ps.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[ps.cardTitle, { color: theme.textPrimary }]}>{t('settings')}</Text>
            <View style={{ height: 12 }} />
            {settingsItems.map((item, i) => (
              <TouchableOpacity key={item.label} style={[ps.menuRow, i < settingsItems.length - 1 && [ps.menuBorder, { borderBottomColor: theme.border }]]} onPress={() => setSubPage(item.screen)} activeOpacity={0.75}>
                <View style={[ps.menuIcon, { backgroundColor: item.bg }]}>{item.badge && <View style={ps.notifDot} />}<AppIcon name={item.icon} size={20} color={item.color} /></View>
                <Text style={[ps.menuLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                <View style={[ps.arrowWrap, { backgroundColor: theme.soft }]}><Text style={[ps.arrowTxt, { color: theme.textMuted }]}>›</Text></View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[ps.signOutBtn, { backgroundColor: theme.surface, borderColor: darkMode ? theme.border : '#FFD6D4' }]} onPress={() => setShowSignOut(true)} activeOpacity={0.8}>
            <View style={ps.signOutIconWrap}><AppIcon name="signOut" size={18} color={C.primary} /></View>
            <Text style={ps.signOutTxt}>{t('signOut')}</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>

        <Modal visible={showImgPicker} animationType="slide" transparent onRequestClose={() => setShowImgPicker(false)}>
          <Pressable style={ms.pickerOverlay} onPress={() => setShowImgPicker(false)}>
            <View style={ms.pickerSheet}>
              <View style={ms.handle} />
              <Text style={ms.pickerTitle}>{t('updateProfilePhoto')}</Text>
              {[{ icon: 'camera' as IconName, label: t('takePhoto'), sub: t('useCamera'), fn: pickFromCamera }, { icon: 'gallery' as IconName, label: t('chooseGallery'), sub: t('selectPhoto'), fn: pickFromGallery }].map((opt) => (
                <TouchableOpacity key={opt.label} style={ms.pickerOption} onPress={opt.fn} activeOpacity={0.8}>
                  <View style={ms.pickerOptionIcon}><AppIcon name={opt.icon} size={22} color={C.blue} /></View>
                  <View><Text style={ms.pickerOptionLabel}>{opt.label}</Text><Text style={ms.pickerOptionSub}>{opt.sub}</Text></View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={ms.pickerCancel} onPress={() => setShowImgPicker(false)}><Text style={ms.pickerCancelTxt}>{t('cancel')}</Text></TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        <Modal visible={showSignOut} animationType="fade" transparent onRequestClose={() => setShowSignOut(false)}>
          <View style={ms.overlay}>
            <View style={ms.confirmCard}>
              <View style={ms.confirmIconBg}><AppIcon name="signOut" size={28} color={C.primary} /></View>
              <Text style={ms.confirmTitle}>{`${t('signOut')}?`}</Text>
              <Text style={ms.confirmSub}>{'Are you sure you want to sign out?\nYour data will be saved.'}</Text>
              <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                <Pressable style={ms.cancelBtn} onPress={() => setShowSignOut(false)}><Text style={ms.cancelTxt}>{t('cancel')}</Text></Pressable>
                <Pressable style={ms.signOutActionBtn} onPress={() => { setShowSignOut(false); onSignOut(); }}><Text style={ms.signOutActionTxt}>{t('signOut')}</Text></Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={!!pendingDraftImage} animationType="fade" transparent onRequestClose={cancelDraftPhoto}>
          <View style={ms.overlay}>
            <View style={ms.confirmPhotoCard}>
              {pendingDraftImage ? <Image source={{ uri: pendingDraftImage }} style={ms.confirmPhotoPreview} /> : null}
              <Text style={ms.confirmPhotoTitle}>Use this photo?</Text>
              <View style={ms.confirmPhotoActions}>
                <Pressable onPress={cancelDraftPhoto} style={ms.cancelBtn}>
                  <Text style={ms.cancelTxt}>{t('cancel')}</Text>
                </Pressable>
                <Pressable onPress={confirmDraftPhoto} style={ms.signOutActionBtn}>
                  <Text style={ms.signOutActionTxt}>Done</Text>
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
  confirmPhotoCard: { backgroundColor: C.surface, borderRadius: 28, padding: 20, marginHorizontal: 24, width: '88%', alignItems: 'center' },
  confirmPhotoPreview: { width: 220, height: 220, borderRadius: 24, marginBottom: 16 },
  confirmPhotoTitle: { fontSize: 18, fontWeight: '800', color: C.dark, marginBottom: 18 },
  confirmPhotoActions: { flexDirection: 'row', gap: 12, width: '100%' },
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
  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 },
  input: { height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, paddingHorizontal: 16, fontSize: 14, fontWeight: '500', color: C.dark },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  discardBtn: { flex: 1, height: 54, borderRadius: 18, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  discardTxt: { fontSize: 15, fontWeight: '800', color: C.mid },
  saveBtn: { flex: 2, height: 54, borderRadius: 18, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  saveTxt: { color: '#fff', fontSize: 15, fontWeight: '900' },
});
