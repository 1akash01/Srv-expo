import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, PageHeader, usePreferenceContext } from './ProfileShared';

const transferImage = require('./assets/transfer.png');

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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.posterCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Image source={transferImage} style={styles.heroImage} resizeMode="contain" />
        </View>

        <View style={styles.actionRow}>
          {[{ label: 'Scan QR Code', mode: 'scan' as const }, { label: 'Share QR Code', mode: 'share' as const }].map((item) => {
            const isActive = transferMode === item.mode;
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.actionBtn, { backgroundColor: isActive ? C.primary : theme.surface, borderColor: isActive ? C.primary : theme.border }]}
                onPress={() => setTransferMode(item.mode)}
                activeOpacity={0.85}
              >
                <AppIcon name={item.mode === 'scan' ? 'scan' : 'transfer'} size={18} color={isActive ? '#fff' : C.primary} />
                <Text style={[styles.actionText, { color: isActive ? '#fff' : theme.textPrimary }]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.textMuted }]}>Mobile Number</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={[styles.searchInput, { backgroundColor: theme.soft, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="Enter Your Mobile Number"
              placeholderTextColor={theme.textMuted}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
              <AppIcon name="eye" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {searchResult ? <Text style={styles.searchResult}>{searchResult}</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, gap: 16, paddingBottom: 32 },
  posterCard: { alignItems: 'center', justifyContent: 'center', borderRadius: 24, borderWidth: 1, paddingVertical: 18 },
  heroImage: { width: 310, height: 310, maxWidth: '100%' },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, gap: 6 },
  actionText: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  formCard: { borderRadius: 24, borderWidth: 1, padding: 18, gap: 12 },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  searchInput: { flex: 1, height: 52, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, fontSize: 14 },
  searchBtn: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  searchResult: { fontSize: 13, color: C.success, fontWeight: '700' },
});
