import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, IconName, PageHeader, usePreferenceContext } from './ProfileShared';

export function ContactSupportPage({ onBack }: { onBack: () => void }) {
  const { t } = usePreferenceContext();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'contact' | 'faq'>('contact');
  const contactItems = [
    { icon: 'phone' as IconName, label: 'Phone', value: '8837668004, 8837684004', action: () => Alert.alert('Call', 'Call support at 8837668004 or 8837684004.') },
    { icon: 'mail' as IconName, label: 'Email', value: 'info@srvelectricals.com', action: () => Alert.alert('Email', 'Email support at info@srvelectricals.com.') },
    { icon: 'building' as IconName, label: 'Head Office', value: 'Paul Electricals\nNangal kalan road, Village Jawaharke, Mansa, Punjab - 151505', action: () => Alert.alert('Address', 'Paul Electricals, Nangal kalan road, Village Jawaharke, Mansa, Punjab - 151505') },
  ];
  const faqData = [{ q: 'Q1. What is SRV Electricals?', a: 'SRV Electricals is a leading manufacturer of electrical products.' }, { q: 'Q2. What products do you manufacture?', a: 'We manufacture MCB boxes, junction boxes and more.' }];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader title={t('contactSupport')} onBack={onBack} />
      <View style={styles.tabSwitcher}>
        {(['contact', 'faq'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} onPress={() => setActiveTab(tab)} activeOpacity={0.8}>
            <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>{tab === 'contact' ? t('contactUs') : t('faqs')}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
        {activeTab === 'contact' ? contactItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.contactCard} onPress={item.action} activeOpacity={0.8}>
            <View style={styles.contactIcon}><AppIcon name={item.icon} size={22} color={C.primary} /></View>
            <View style={{ flex: 1 }}><Text style={styles.contactLabel}>{item.label}</Text><Text style={styles.contactValue}>{item.value}</Text></View>
          </TouchableOpacity>
        )) : faqData.map((item, i) => (
          <TouchableOpacity key={i} style={[styles.faqCard, expandedIdx === i && styles.faqCardActive]} onPress={() => setExpandedIdx(expandedIdx === i ? null : i)} activeOpacity={0.8}>
            <View style={styles.faqRow}><View style={styles.faqNumWrap}><Text style={styles.faqNum}>{i + 1}</Text></View><Text style={[styles.faqQ, { flex: 1 }]}>{item.q}</Text><Text style={styles.faqChevron}>{expandedIdx === i ? '∧' : '∨'}</Text></View>
            {expandedIdx === i && <View style={styles.faqAnswer}><Text style={styles.faqA}>{item.a}</Text></View>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabSwitcher: { flexDirection: 'row', marginHorizontal: 16, marginVertical: 12, backgroundColor: C.bg, borderRadius: 16, padding: 4, borderWidth: 1, borderColor: C.border },
  tabBtn: { flex: 1, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  tabBtnActive: { backgroundColor: C.surface },
  tabBtnText: { fontSize: 14, fontWeight: '700', color: C.muted },
  tabBtnTextActive: { color: C.dark },
  contactCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: C.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border },
  contactIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  contactLabel: { fontSize: 12, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  contactValue: { fontSize: 14, fontWeight: '700', color: C.dark, lineHeight: 21 },
  faqCard: { backgroundColor: C.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border },
  faqCardActive: { borderColor: C.primary, borderWidth: 1.5 },
  faqRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  faqNumWrap: { width: 28, height: 28, borderRadius: 9, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  faqNum: { fontSize: 12, fontWeight: '900', color: C.primary },
  faqQ: { fontSize: 14, fontWeight: '700', color: C.dark },
  faqChevron: { fontSize: 16, fontWeight: '900', color: C.muted },
  faqAnswer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  faqA: { fontSize: 14, color: C.mid, lineHeight: 21 },
});
