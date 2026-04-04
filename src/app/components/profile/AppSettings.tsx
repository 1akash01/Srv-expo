import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon, AppLanguage, C, IconName, PageHeader, usePreferenceContext } from './ProfileShared';

export function AppSettingsPage({ onBack }: { onBack: () => void }) {
  const { language, setLanguage, darkMode, setDarkMode, t, theme } = usePreferenceContext();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const Toggle = ({ val, onToggle }: { val: boolean; onToggle: () => void }) => <TouchableOpacity style={[styles.toggle, val && styles.toggleOn]} onPress={onToggle} activeOpacity={0.8}><View style={[styles.thumb, val && styles.thumbOn]} /></TouchableOpacity>;
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('appSettings')} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('preferences')}</Text>
          {[{ label: t('pushNotifications'), sub: t('receiveAlerts'), val: notifEnabled, toggle: () => setNotifEnabled((v) => !v), icon: 'notification' as IconName }, { label: t('darkMode'), sub: t('switchTheme'), val: darkMode, toggle: () => setDarkMode(!darkMode), icon: 'moon' as IconName }].map((item, i, arr) => (
            <View key={item.label} style={[styles.row, i < arr.length - 1 && styles.rowBorder]}>
              <View style={[styles.iconWrap, { backgroundColor: item.val ? C.primaryLight : theme.soft }]}><AppIcon name={item.icon} size={20} color={item.val ? C.primary : theme.textSecondary} /></View>
              <View style={{ flex: 1 }}><Text style={styles.rowLabel}>{item.label}</Text><Text style={styles.rowSub}>{item.sub}</Text></View>
              <Toggle val={item.val} onToggle={item.toggle} />
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          {(['English', 'Hindi', 'Punjabi'] as AppLanguage[]).map((l) => (
            <TouchableOpacity key={l} style={styles.row} onPress={() => setLanguage(l)} activeOpacity={0.8}>
              <Text style={[styles.rowLabel, { flex: 1 }]}>{l === 'English' ? t('english') : l === 'Hindi' ? t('hindi') : t('punjabi')}</Text>
              {language === l && <Text style={{ color: C.primary, fontSize: 18, fontWeight: '900' }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.surface, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: C.border, gap: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F2FA' },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 15, fontWeight: '700', color: C.dark },
  rowSub: { fontSize: 12, color: C.muted, marginTop: 2 },
  toggle: { width: 50, height: 28, borderRadius: 14, backgroundColor: C.border, justifyContent: 'center', paddingHorizontal: 3 },
  toggleOn: { backgroundColor: C.primary },
  thumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
  thumbOn: { alignSelf: 'flex-end' },
});
