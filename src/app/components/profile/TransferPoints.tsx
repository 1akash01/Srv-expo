import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, PageHeader, usePreferenceContext } from './ProfileShared';

const transferImage = require('./assets/transferpoint-poster.jpeg');

export function TransferPointsPage({ onBack }: { onBack: () => void }) {
  const { t, theme } = usePreferenceContext();
  const [mobile, setMobile] = useState('');
  const [transferMode, setTransferMode] = useState<'scan' | 'share'>('scan');
  const [searchResult, setSearchResult] = useState('');
  const handleSearch = () => {
    if (mobile.trim().length !== 10) return Alert.alert('Invalid number', 'Please enter a valid 10-digit mobile number.');
    setSearchResult(`User found for ${mobile}. Ready to transfer points.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('transferPoint')} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[{ label: 'Scan QR Code', mode: 'scan' as const }, { label: 'Share QR Code', mode: 'share' as const }].map((item) => (
            <TouchableOpacity key={item.label} style={[styles.actionBtn, transferMode === item.mode && styles.actionBtnActive]} onPress={() => setTransferMode(item.mode)} activeOpacity={0.85}>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.searchRow}>
          <TextInput style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} placeholder="Enter Your Mobile Number" placeholderTextColor={theme.textMuted} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}><AppIcon name="eye" size={20} color="#fff" /></TouchableOpacity>
        </View>
        {searchResult ? <Text style={styles.searchResult}>{searchResult}</Text> : null}
        <View style={styles.heroCard}><Image source={transferImage} style={styles.heroImage} resizeMode="contain" /></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBtn: { flex: 1, backgroundColor: C.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center' },
  actionBtnActive: { backgroundColor: C.primaryDark },
  actionText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  searchInput: { flex: 1, height: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, fontSize: 14 },
  searchBtn: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  searchResult: { fontSize: 13, color: C.success, fontWeight: '700' },
  heroCard: { alignItems: 'center', paddingTop: 24 },
  heroImage: { width: 220, height: 220 },
});
