import React, { createContext, useContext } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export const C = {
  primary: '#E8453C',
  primaryDark: '#C0312A',
  primaryLight: '#FFF0F0',
  bg: '#F0F1F6',
  surface: '#FFFFFF',
  border: '#EAEAF2',
  dark: '#0F1120',
  mid: '#4A4B5C',
  muted: '#9898A8',
  success: '#16A34A',
  successLight: '#DCFCE7',
  gold: '#D97706',
  goldLight: '#FEF3C7',
  blue: '#2563EB',
  blueLight: '#DBEAFE',
  purple: '#7C3AED',
  purpleLight: '#EDE9FE',
  teal: '#0D9488',
  tealLight: '#CCFBF1',
  navy: '#1E2340',
} as const;

export const defaultProfile = {
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

export type Profile = typeof defaultProfile;
export type Screen = 'home' | 'scan' | 'rewards' | 'profile' | 'product' | 'wallet';
export type SubPage =
  | null
  | 'My Redemption'
  | 'Transfer Points'
  | 'My Orders'
  | 'Bank Details'
  | 'Refer To A Friend'
  | 'Need Help'
  | 'Offers & Promotions'
  | 'Notifications'
  | 'App Settings'
  | 'Scan History'
  | 'Contact Support';

export type IconName =
  | 'edit' | 'eye' | 'eyeOff' | 'star' | 'scan' | 'gift' | 'signOut' | 'transfer'
  | 'order' | 'bank' | 'refer' | 'help' | 'offer' | 'notification' | 'settings'
  | 'history' | 'support' | 'camera' | 'gallery' | 'phone' | 'mail' | 'building'
  | 'link' | 'message' | 'whatsapp' | 'moon' | 'warning' | 'arrowLeft' | 'check'
  | 'chevronRight' | 'chevronDown' | 'chevronUp' | 'location' | 'search';

export type AppLanguage = 'English' | 'Hindi' | 'Punjabi';

export const translations = {
  English: {
    myProfile: 'My Profile', edit: 'Edit', goldMember: 'Gold Member', dealerPartner: 'Dealer Partner',
    electricianPartner: 'Electrician Partner', toPlatinum: '750 pts to Platinum', scans: 'Scans',
    points: 'Points', rewards: 'Rewards', profileDetails: 'Profile Details', show: 'Show', hide: 'Hide',
    quickActions: 'Quick Actions', settings: 'Settings', giftStore: 'Gift Store', signOut: 'Sign Out',
    appSettings: 'App Settings', preferences: 'Preferences', pushNotifications: 'Push Notifications',
    receiveAlerts: 'Receive alerts and updates', darkMode: 'Dark Mode', switchTheme: 'Switch to dark theme',
    language: 'Language', about: 'About', privacyPolicy: 'Privacy Policy', terms: 'Terms & Conditions',
    open: 'Open', english: 'English', hindi: 'Hindi', punjabi: 'Punjabi', notification: 'Notification',
    offer: 'Offer', contactSupport: 'Contact Support', contactUs: 'Contact Us', faqs: 'FAQs',
    myOrders: 'My Order', bankDetails: 'Bank Details', referFriend: 'Refer A Friend', needHelp: 'Need Help',
    transferPoint: 'Transfer Point', redemptionHistory: 'Redemption History', scanHistory: 'Scan History',
    save: 'Save', saveChanges: 'Save Changes', discard: 'Discard', cancel: 'Cancel',
    updateProfilePhoto: 'Update Profile Photo', takePhoto: 'Take a Photo', useCamera: 'Use your camera',
    chooseGallery: 'Choose from Gallery', selectPhoto: 'Select existing photo', tapToChangePhoto: 'Tap to change photo',
    submitted: 'Submitted', incompleteForm: 'Incomplete form', fillSubjectComment: 'Please fill subject and comment before submitting.',
  },
  Hindi: {
    myProfile: 'à¤®à¥‡à¤°à¥€ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤²', edit: 'à¤à¤¡à¤¿à¤Ÿ', goldMember: 'à¤—à¥‹à¤²à¥à¤¡ à¤®à¥‡à¤‚à¤¬à¤°', dealerPartner: 'à¤¡à¥€à¤²à¤° à¤ªà¤¾à¤°à¥à¤Ÿà¤¨à¤°',
    electricianPartner: 'à¤‡à¤²à¥‡à¤•à¥à¤Ÿà¥à¤°à¥€à¤¶à¤¿à¤¯à¤¨ à¤ªà¤¾à¤°à¥à¤Ÿà¤¨à¤°', toPlatinum: 'à¤ªà¥à¤²à¥ˆà¤Ÿà¤¿à¤¨à¤® à¤¤à¤• 750 à¤ªà¥‰à¤‡à¤‚à¤Ÿà¥à¤¸', scans: 'à¤¸à¥à¤•à¥ˆà¤¨',
    points: 'à¤ªà¥‰à¤‡à¤‚à¤Ÿà¥à¤¸', rewards: 'à¤°à¤¿à¤µà¥‰à¤°à¥à¤¡à¥à¤¸', profileDetails: 'à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤² à¤¡à¤¿à¤Ÿà¥‡à¤²à¥à¤¸', show: 'à¤¦à¤¿à¤–à¤¾à¤à¤‚', hide: 'à¤›à¥à¤ªà¤¾à¤à¤‚',
    quickActions: 'à¤•à¥à¤µà¤¿à¤• à¤à¤•à¥à¤¶à¤¨à¥à¤¸', settings: 'à¤¸à¥‡à¤Ÿà¤¿à¤‚à¤—à¥à¤¸', giftStore: 'à¤—à¤¿à¤«à¥à¤Ÿ à¤¸à¥à¤Ÿà¥‹à¤°', signOut: 'à¤¸à¤¾à¤‡à¤¨ à¤†à¤‰à¤Ÿ',
    appSettings: 'à¤à¤ª à¤¸à¥‡à¤Ÿà¤¿à¤‚à¤—à¥à¤¸', preferences: 'à¤ªà¤¸à¤‚à¤¦', pushNotifications: 'à¤ªà¥à¤¶ à¤¨à¥‹à¤Ÿà¤¿à¤«à¤¿à¤•à¥‡à¤¶à¤¨',
    receiveAlerts: 'à¤…à¤²à¤°à¥à¤Ÿ à¤”à¤° à¤…à¤ªà¤¡à¥‡à¤Ÿ à¤ªà¤¾à¤à¤‚', darkMode: 'à¤¡à¤¾à¤°à¥à¤• à¤®à¥‹à¤¡', switchTheme: 'à¤¡à¤¾à¤°à¥à¤• à¤¥à¥€à¤® à¤ªà¤° à¤¸à¥à¤µà¤¿à¤š à¤•à¤°à¥‡à¤‚',
    language: 'à¤­à¤¾à¤·à¤¾', about: 'à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€', privacyPolicy: 'à¤ªà¥à¤°à¤¾à¤‡à¤µà¥‡à¤¸à¥€ à¤ªà¥‰à¤²à¤¿à¤¸à¥€', terms: 'à¤¨à¤¿à¤¯à¤® à¤”à¤° à¤¶à¤°à¥à¤¤à¥‡à¤‚',
    open: 'à¤–à¥‹à¤²à¥‡à¤‚', english: 'à¤…à¤‚à¤—à¥à¤°à¥‡à¤œà¤¼à¥€', hindi: 'à¤¹à¤¿à¤‚à¤¦à¥€', punjabi: 'à¤ªà¤‚à¤œà¤¾à¤¬à¥€', notification: 'à¤¨à¥‹à¤Ÿà¤¿à¤«à¤¿à¤•à¥‡à¤¶à¤¨',
    offer: 'à¤‘à¤«à¤°', contactSupport: 'à¤¸à¤‚à¤ªà¤°à¥à¤• à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾', contactUs: 'à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚', faqs: 'à¤¸à¤µà¤¾à¤²-à¤œà¤µà¤¾à¤¬',
    myOrders: 'à¤®à¥‡à¤°à¥‡ à¤‘à¤°à¥à¤¡à¤°', bankDetails: 'à¤¬à¥ˆà¤‚à¤• à¤¡à¤¿à¤Ÿà¥‡à¤²à¥à¤¸', referFriend: 'à¤®à¤¿à¤¤à¥à¤° à¤•à¥‹ à¤°à¥‡à¤«à¤° à¤•à¤°à¥‡à¤‚', needHelp: 'à¤®à¤¦à¤¦ à¤šà¤¾à¤¹à¤¿à¤',
    transferPoint: 'à¤ªà¥‰à¤‡à¤‚à¤Ÿ à¤Ÿà¥à¤°à¤¾à¤‚à¤¸à¤«à¤°', redemptionHistory: 'à¤°à¤¿à¤¡à¥‡à¤®à¥à¤ªà¥à¤¶à¤¨ à¤¹à¤¿à¤¸à¥à¤Ÿà¥à¤°à¥€', scanHistory: 'à¤¸à¥à¤•à¥ˆà¤¨ à¤¹à¤¿à¤¸à¥à¤Ÿà¥à¤°à¥€',
    save: 'à¤¸à¥‡à¤µ', saveChanges: 'à¤¬à¤¦à¤²à¤¾à¤µ à¤¸à¥‡à¤µ à¤•à¤°à¥‡à¤‚', discard: 'à¤°à¤¦à¥à¤¦ à¤•à¤°à¥‡à¤‚', cancel: 'à¤•à¥ˆà¤‚à¤¸à¤²',
    updateProfilePhoto: 'à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤² à¤«à¥‹à¤Ÿà¥‹ à¤…à¤ªà¤¡à¥‡à¤Ÿ à¤•à¤°à¥‡à¤‚', takePhoto: 'à¤«à¥‹à¤Ÿà¥‹ à¤²à¥‡à¤‚', useCamera: 'à¤•à¥ˆà¤®à¤°à¤¾ à¤‡à¤¸à¥à¤¤à¥‡à¤®à¤¾à¤² à¤•à¤°à¥‡à¤‚',
    chooseGallery: 'à¤—à¥ˆà¤²à¤°à¥€ à¤¸à¥‡ à¤šà¥à¤¨à¥‡à¤‚', selectPhoto: 'à¤®à¥Œà¤œà¥‚à¤¦à¤¾ à¤«à¥‹à¤Ÿà¥‹ à¤šà¥à¤¨à¥‡à¤‚', tapToChangePhoto: 'à¤«à¥‹à¤Ÿà¥‹ à¤¬à¤¦à¤²à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤Ÿà¥ˆà¤ª à¤•à¤°à¥‡à¤‚',
    submitted: 'à¤¸à¤¬à¤®à¤¿à¤Ÿ à¤¹à¥‹ à¤—à¤¯à¤¾', incompleteForm: 'à¤«à¥‰à¤°à¥à¤® à¤…à¤§à¥‚à¤°à¤¾ à¤¹à¥ˆ', fillSubjectComment: 'à¤¸à¤¬à¤®à¤¿à¤Ÿ à¤•à¤°à¤¨à¥‡ à¤¸à¥‡ à¤ªà¤¹à¤²à¥‡ à¤µà¤¿à¤·à¤¯ à¤”à¤° à¤Ÿà¤¿à¤ªà¥à¤ªà¤£à¥€ à¤­à¤°à¥‡à¤‚à¥¤',
  },
  Punjabi: {
    myProfile: 'à¨®à©‡à¨°à©€ à¨ªà©à¨°à©‹à¨«à¨¾à¨‡à¨²', edit: 'à¨à¨¡à¨¿à¨Ÿ', goldMember: 'à¨—à©‹à¨²à¨¡ à¨®à©ˆà¨‚à¨¬à¨°', dealerPartner: 'à¨¡à©€à¨²à¨° à¨ªà¨¾à¨°à¨Ÿà¨¨à¨°',
    electricianPartner: 'à¨‡à¨²à©ˆà¨•à¨Ÿà©à¨°à©€à¨¸à¨¼à©€à¨…à¨¨ à¨ªà¨¾à¨°à¨Ÿà¨¨à¨°', toPlatinum: 'à¨ªà¨²à©ˆà¨Ÿà¨¿à¨¨à¨® à¨²à¨ˆ 750 à¨ªà©Œà¨‡à©°à¨Ÿ', scans: 'à¨¸à¨•à©ˆà¨¨',
    points: 'à¨ªà©Œà¨‡à©°à¨Ÿ', rewards: 'à¨‡à¨¨à¨¾à¨®', profileDetails: 'à¨ªà©à¨°à©‹à¨«à¨¾à¨‡à¨² à¨µà©‡à¨°à¨µà¨¾', show: 'à¨µà©‡à¨–à¨¾à¨“', hide: 'à¨›à©à¨ªà¨¾à¨“',
    quickActions: 'à¨•à©à¨‡à¨• à¨à¨•à¨¸à¨¼à¨¨', settings: 'à¨¸à©ˆà¨Ÿà¨¿à©°à¨—à¨œà¨¼', giftStore: 'à¨—à¨¿à¨«à¨Ÿ à¨¸à¨Ÿà©‹à¨°', signOut: 'à¨¸à¨¾à¨ˆà¨¨ à¨†à¨Šà¨Ÿ',
    appSettings: 'à¨à¨ª à¨¸à©ˆà¨Ÿà¨¿à©°à¨—à¨œà¨¼', preferences: 'à¨ªà¨¸à©°à¨¦à¨¾à¨‚', pushNotifications: 'à¨ªà©à¨¸à¨¼ à¨¨à©‹à¨Ÿà©€à¨«à¨¿à¨•à©‡à¨¸à¨¼à¨¨',
    receiveAlerts: 'à¨…à¨²à¨°à¨Ÿ à¨…à¨¤à©‡ à¨…à¨ªà¨¡à©‡à¨Ÿ à¨ªà©à¨°à¨¾à¨ªà¨¤ à¨•à¨°à©‹', darkMode: 'à¨¡à¨¾à¨°à¨• à¨®à©‹à¨¡', switchTheme: 'à¨¡à¨¾à¨°à¨• à¨¥à©€à¨® à¨šà¨¾à¨²à©‚ à¨•à¨°à©‹',
    language: 'à¨­à¨¾à¨¸à¨¼à¨¾', about: 'à¨œà¨¾à¨£à¨•à¨¾à¨°à©€', privacyPolicy: 'à¨ªà©à¨°à¨¾à¨ˆà¨µà©‡à¨¸à©€ à¨ªà¨¾à¨²à¨¿à¨¸à©€', terms: 'à¨¨à¨¿à¨¯à¨® à¨…à¨¤à©‡ à¨¸à¨¼à¨°à¨¤à¨¾à¨‚',
    open: 'à¨–à©‹à¨²à©à¨¹à©‹', english: 'à¨…à©°à¨—à¨°à©‡à¨œà¨¼à©€', hindi: 'à¨¹à¨¿à©°à¨¦à©€', punjabi: 'à¨ªà©°à¨œà¨¾à¨¬à©€', notification: 'à¨¨à©‹à¨Ÿà©€à¨«à¨¿à¨•à©‡à¨¸à¨¼à¨¨',
    offer: 'à¨†à¨«à¨°', contactSupport: 'à¨¸à¨¹à¨¾à¨‡à¨¤à¨¾ à¨¸à©°à¨ªà¨°à¨•', contactUs: 'à¨¸à¨¾à¨¡à©‡ à¨¨à¨¾à¨² à¨¸à©°à¨ªà¨°à¨•', faqs: 'à¨…à¨•à¨¸à¨° à¨ªà©à©±à¨›à©‡ à¨¸à¨µà¨¾à¨²',
    myOrders: 'à¨®à©‡à¨°à©‡ à¨†à¨°à¨¡à¨°', bankDetails: 'à¨¬à©ˆà¨‚à¨• à¨µà©‡à¨°à¨µà¨¾', referFriend: 'à¨¦à©‹à¨¸à¨¤ à¨¨à©‚à©° à¨°à¨¿à¨«à¨° à¨•à¨°à©‹', needHelp: 'à¨®à¨¦à¨¦ à¨šà¨¾à¨¹à©€à¨¦à©€ à¨¹à©ˆ',
    transferPoint: 'à¨ªà©Œà¨‡à©°à¨Ÿ à¨Ÿà©à¨°à¨¾à¨‚à¨¸à¨«à¨°', redemptionHistory: 'à¨°à¨¿à¨¡à©ˆà¨‚à¨ªà¨¸à¨¼à¨¨ à¨¹à¨¿à¨¸à¨Ÿà¨°à©€', scanHistory: 'à¨¸à¨•à©ˆà¨¨ à¨¹à¨¿à¨¸à¨Ÿà¨°à©€',
    save: 'à¨¸à©‡à¨µ', saveChanges: 'à¨¬à¨¦à¨²à¨¾à¨µ à¨¸à©‡à¨µ à¨•à¨°à©‹', discard: 'à¨°à©±à¨¦ à¨•à¨°à©‹', cancel: 'à¨°à©±à¨¦',
    updateProfilePhoto: 'à¨ªà©à¨°à©‹à¨«à¨¾à¨‡à¨² à¨«à©‹à¨Ÿà©‹ à¨…à¨ªà¨¡à©‡à¨Ÿ à¨•à¨°à©‹', takePhoto: 'à¨«à©‹à¨Ÿà©‹ à¨–à¨¿à©±à¨šà©‹', useCamera: 'à¨•à©ˆà¨®à¨°à¨¾ à¨µà¨°à¨¤à©‹',
    chooseGallery: 'à¨—à©ˆà¨²à¨°à©€ à¨¤à©‹à¨‚ à¨šà©à¨£à©‹', selectPhoto: 'à¨®à©Œà¨œà©‚à¨¦à¨¾ à¨«à©‹à¨Ÿà©‹ à¨šà©à¨£à©‹', tapToChangePhoto: 'à¨«à©‹à¨Ÿà©‹ à¨¬à¨¦à¨²à¨£ à¨²à¨ˆ à¨Ÿà©ˆà¨ª à¨•à¨°à©‹',
    submitted: 'à¨œà¨®à©à¨¹à¨¾à¨‚ à¨¹à©‹ à¨—à¨¿à¨†', incompleteForm: 'à¨«à¨¾à¨°à¨® à¨…à¨§à©‚à¨°à¨¾ à¨¹à©ˆ', fillSubjectComment: 'à¨¸à¨¬à¨®à¨¿à¨Ÿ à¨•à¨°à¨¨ à¨¤à©‹à¨‚ à¨ªà¨¹à¨¿à¨²à¨¾à¨‚ à¨µà¨¿à¨¸à¨¼à¨¾ à¨…à¨¤à©‡ à¨Ÿà¨¿à©±à¨ªà¨£à©€ à¨­à¨°à©‹à¥¤',
  },
} as const;

export type ThemePalette = {
  bg: string; surface: string; soft: string; border: string; textPrimary: string; textSecondary: string; textMuted: string; heroSurface: string; heroStrip: string;
};

export const getThemePalette = (isDark: boolean): ThemePalette => ({
  bg: isDark ? '#0B1220' : C.bg,
  surface: isDark ? '#111827' : C.surface,
  soft: isDark ? '#1F2937' : C.bg,
  border: isDark ? '#243043' : C.border,
  textPrimary: isDark ? '#F8FAFC' : C.dark,
  textSecondary: isDark ? '#D0D9E8' : C.mid,
  textMuted: isDark ? '#94A3B8' : C.muted,
  heroSurface: isDark ? '#111827' : C.surface,
  heroStrip: isDark ? '#0F172A' : '#FCFCFE',
});

export type PreferenceContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  t: (key: keyof (typeof translations)['English']) => string;
  theme: ThemePalette;
};

export const PreferenceContext = createContext<PreferenceContextValue | null>(null);
export function usePreferenceContext() {
  const value = useContext(PreferenceContext);
  if (!value) throw new Error('PreferenceContext missing');
  return value;
}

export function AppIcon({ name, size = 18, color = '#0F1120', strokeWidth = 1.8 }: { name: IconName; size?: number; color?: string; strokeWidth?: number }) {
  switch (name) {
    case 'edit': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M4 20l4.2-1 9.1-9.1a2.2 2.2 0 10-3.1-3.1L5.1 15.9 4 20z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /><Path d="M13 8l3 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    case 'eye': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M2.5 12s3.3-5 9.5-5 9.5 5 9.5 5-3.3 5-9.5 5-9.5-5-9.5-5z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /><Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} /></Svg>;
    case 'eyeOff': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M3 3l18 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /><Path d="M10.6 5.2c.5-.1.9-.2 1.4-.2 6.2 0 9.5 5 9.5 5a15.5 15.5 0 01-3.4 3.6M6.3 6.3A15.7 15.7 0 002.5 12s3.3 5 9.5 5c1 0 1.9-.1 2.7-.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /><Path d="M9.9 9.9A3 3 0 0014.1 14.1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    case 'star': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 3.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3.5z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /></Svg>;
    case 'scan': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Rect x="4" y="4" width="6" height="6" rx="1.3" stroke={color} strokeWidth={strokeWidth} /><Rect x="14" y="4" width="6" height="6" rx="1.3" stroke={color} strokeWidth={strokeWidth} /><Rect x="4" y="14" width="6" height="6" rx="1.3" stroke={color} strokeWidth={strokeWidth} /><Path d="M14 14h2v2h-2zM18 14h2v6h-6v-2h4v-4z" fill={color} /></Svg>;
    case 'gift': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Rect x="3" y="8" width="18" height="4" rx="1.2" stroke={color} strokeWidth={strokeWidth} /><Path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" stroke={color} strokeWidth={strokeWidth} /><Path d="M12 8v13M12 8C12 8 9.5 6.1 9.5 4.7a2.5 2.5 0 015 0C14.5 6.1 12 8 12 8z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'signOut': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M10 5H6a2 2 0 00-2 2v10a2 2 0 002 2h4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /><Path d="M14 8l4 4-4 4M8 12h10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'transfer': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M7 7h12M15 3l4 4-4 4M17 17H5M9 13l-4 4 4 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'order': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M4 7l8-4 8 4-8 4-8-4zM4 7v10l8 4 8-4V7" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /><Path d="M12 11v10" stroke={color} strokeWidth={strokeWidth} /></Svg>;
    case 'bank': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M3 9l9-5 9 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /><Path d="M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    case 'refer': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="8" cy="8" r="3" stroke={color} strokeWidth={strokeWidth} /><Circle cx="16.5" cy="7" r="2.5" stroke={color} strokeWidth={strokeWidth} /><Path d="M3.5 18a4.5 4.5 0 019 0M13 17a3.5 3.5 0 017 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    case 'help': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} /><Path d="M9.5 9a2.5 2.5 0 115 0c0 1.8-2.5 2.1-2.5 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /><Circle cx="12" cy="17.2" r="0.8" fill={color} /></Svg>;
    case 'offer': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M20 12l-8 8-8-8 8-8 8 8z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /><Circle cx="9" cy="9" r="1" fill={color} /><Path d="M10 14l4-4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    case 'notification': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M6 16.5V11a6 6 0 1112 0v5.5l1.2 1.2a.8.8 0 01-.57 1.36H5.37a.8.8 0 01-.57-1.36L6 16.5z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /><Path d="M10 20a2 2 0 004 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    case 'settings': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} /><Path d="M19.4 15a1 1 0 00.2 1.1l.1.1a2 2 0 010 2.8 2 2 0 01-2.8 0l-.1-.1a1 1 0 00-1.1-.2 1 1 0 00-.6.9V20a2 2 0 01-4 0v-.2a1 1 0 00-.6-.9 1 1 0 00-1.1.2l-.1.1a2 2 0 01-2.8 0 2 2 0 010-2.8l.1-.1a1 1 0 00.2-1.1 1 1 0 00-.9-.6H4a2 2 0 010-4h.2a1 1 0 00.9-.6 1 1 0 00-.2-1.1l-.1-.1a2 2 0 010-2.8 2 2 0 012.8 0l.1.1a1 1 0 001.1.2 1 1 0 00.6-.9V4a2 2 0 014 0v.2a1 1 0 00.6.9 1 1 0 001.1-.2l.1-.1a2 2 0 012.8 0 2 2 0 010 2.8l-.1.1a1 1 0 00-.2 1.1 1 1 0 00.9.6H20a2 2 0 010 4h-.2a1 1 0 00-.4.1z" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'history': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M4 4v5h5M20 12a8 8 0 10-2.3 5.7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /><Path d="M12 8v4l2.5 1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    case 'support': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M7 10a5 5 0 0110 0v1a2 2 0 012 2v2a2 2 0 01-2 2h-2v-4h2M7 13H5a2 2 0 00-2 2 2 2 0 002 2h2v-4z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /><Path d="M12 19h2.5a2 2 0 002-2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    case 'camera': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Rect x="3" y="6" width="18" height="14" rx="3" stroke={color} strokeWidth={strokeWidth} /><Path d="M8 6l1.2-2h5.6L16 6" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /><Circle cx="12" cy="13" r="3.4" stroke={color} strokeWidth={strokeWidth} /></Svg>;
    case 'gallery': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Rect x="3" y="4" width="18" height="16" rx="3" stroke={color} strokeWidth={strokeWidth} /><Circle cx="8.5" cy="9" r="1.3" fill={color} /><Path d="M5 16l4-4 3 3 3-2 4 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'phone': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M6.7 4.5h2.2c.5 0 1 .4 1.1.9l.6 3c.1.4-.1.9-.5 1.1l-1.8 1a14 14 0 006.3 6.3l1-1.8c.2-.4.7-.6 1.1-.5l3 .6c.5.1.9.6.9 1.1v2.2c0 .6-.5 1.2-1.2 1.2C10 21 3 14 5.5 5.7c0-.7.5-1.2 1.2-1.2z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'mail': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Rect x="3" y="5" width="18" height="14" rx="3" stroke={color} strokeWidth={strokeWidth} /><Path d="M5 8l7 5 7-5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'building': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M5 20V6.5A1.5 1.5 0 016.5 5h7A1.5 1.5 0 0115 6.5V20M9 20v-4h2v4M15 9h3a1 1 0 011 1v10h-4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /><Path d="M8 9h.01M12 9h.01M8 12h.01M12 12h.01" stroke={color} strokeWidth={strokeWidth + 0.4} strokeLinecap="round" /></Svg>;
    case 'link': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M10 14l4-4M8.5 15.5l-1.6 1.6a3 3 0 11-4.2-4.2L6 9.8a3 3 0 014.2 0M15.5 8.5l1.6-1.6a3 3 0 114.2 4.2L18 14.2a3 3 0 01-4.2 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'message': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M6 18l-2 2v-4.2A7 7 0 016 5h12a2 2 0 012 2v6a2 2 0 01-2 2H9.5L6 18z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /><Path d="M8.5 10.5h7M8.5 13.5h4.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    case 'whatsapp': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 3.5a8.5 8.5 0 00-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1012 3.5z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /><Path d="M9.5 8.6c.2-.5.4-.6.7-.6h.6c.2 0 .4.1.5.4l.7 1.8c.1.2 0 .5-.1.6l-.5.7c.5 1 1.3 1.9 2.3 2.4l.8-.5c.2-.1.4-.1.6 0l1.7.8c.2.1.4.3.3.5v.6c0 .3-.1.5-.5.7-.4.2-1 .3-1.6.2-1.4-.3-2.8-1.2-4-2.5-1.2-1.2-2-2.6-2.3-4-.1-.5 0-1.1.2-1.5z" fill={color} /></Svg>;
    case 'moon': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M19 14.5A7.5 7.5 0 019.5 5a8 8 0 1010 9.5z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'warning': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 4l8 14H4l8-14z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /><Path d="M12 9v4M12 16h.01" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    case 'arrowLeft': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M15 6l-6 6 6 6M9 12h10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'check': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M5 12.5l4.2 4.2L19 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'chevronRight': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'chevronDown': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'chevronUp': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M6 15l6-6 6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'location': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 21s6-4.8 6-10a6 6 0 10-12 0c0 5.2 6 10 6 10z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /><Circle cx="12" cy="11" r="2.2" stroke={color} strokeWidth={strokeWidth} /></Svg>;
    case 'search': return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth={strokeWidth} /><Path d="M16 16l4 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /></Svg>;
    default: return null;
  }
}

export function PageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const { theme } = usePreferenceContext();
  return (
    <View style={[shared.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <TouchableOpacity onPress={onBack} style={[shared.backBtn, { backgroundColor: theme.soft }]} activeOpacity={0.75}>
        <AppIcon name="arrowLeft" size={20} color={theme.textPrimary} />
      </TouchableOpacity>
      <Text style={[shared.title, { color: theme.textPrimary }]}>{title}</Text>
      <View style={{ width: 44 }} />
    </View>
  );
}

export function PrimaryBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return <TouchableOpacity style={shared.primaryBtn} onPress={onPress} activeOpacity={0.85}><Text style={shared.primaryLabel}>{label}</Text></TouchableOpacity>;
}

export function EmptyState({ emoji, message }: { emoji: string; message: string }) {
  return <View style={shared.emptyWrap}><View style={shared.emptyCircle}><Text style={shared.emptyEmoji}>{emoji}</Text></View><Text style={shared.emptyText}>{message}</Text></View>;
}

const shared = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 20, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  primaryBtn: { backgroundColor: C.primary, borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center' },
  primaryLabel: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  emptyWrap: { alignItems: 'center', paddingVertical: 60 },
  emptyCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 15, color: C.muted, fontWeight: '600', textAlign: 'center' },
});
