import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { C, PageHeader, usePreferenceContext } from './ProfileShared';

const noDataImage = require('./assets/nodata.png');

export function OffersPage({ onBack }: { onBack: () => void }) {
  const { t } = usePreferenceContext();
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader title={t('offer')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
        <Image source={noDataImage} style={styles.heroImage} resizeMode="contain" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: 'center', justifyContent: 'center', minHeight: 520 },
  heroImage: { width: '100%', height: 360, maxWidth: 320 },
});
