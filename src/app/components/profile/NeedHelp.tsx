import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIcon, C, PageHeader, PrimaryBtn, usePreferenceContext } from './ProfileShared';

export function NeedHelpPage({ onBack }: { onBack: () => void }) {
  const { t, theme } = usePreferenceContext();
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };
  const submitHelp = () => {
    if (!subject.trim() || !comment.trim()) return Alert.alert(t('incompleteForm'), t('fillSubjectComment'));
    Alert.alert(t('submitted'), 'Your support request has been submitted.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('needHelp')} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.headerRow}><View style={styles.iconWrap}><AppIcon name="support" size={24} color={C.teal} /></View><View><Text style={styles.title}>Support Request</Text><Text style={styles.sub}>We typically respond within 24 hours</Text></View></View>
          <Text style={styles.label}>Subject</Text>
          <TextInput style={[styles.input, { color: theme.textPrimary }]} placeholder="What is this about?" placeholderTextColor={theme.textMuted} value={subject} onChangeText={setSubject} />
          <Text style={styles.label}>Comment</Text>
          <TextInput style={[styles.input, { color: theme.textPrimary, height: 110, textAlignVertical: 'top', paddingTop: 14 }]} placeholder="Describe your issue in detail..." placeholderTextColor={theme.textMuted} value={comment} onChangeText={setComment} multiline />
          <TouchableOpacity style={styles.uploadBox} onPress={pickPhoto} activeOpacity={0.8}>
            {photo ? <Image source={{ uri: photo }} style={styles.previewImage} /> : <View style={styles.uploadInner}><AppIcon name="gallery" size={20} color={C.muted} /><Text style={styles.uploadText}>Upload Photo</Text></View>}
          </TouchableOpacity>
        </View>
        <PrimaryBtn label={t('save')} onPress={submitHelp} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.surface, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: C.border, gap: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  iconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.tealLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: C.dark },
  sub: { fontSize: 13, color: C.muted, marginTop: 2 },
  label: { fontSize: 12, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { height: 52, backgroundColor: C.bg, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 16, fontSize: 14, fontWeight: '500' },
  uploadBox: { height: 110, backgroundColor: C.bg, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, borderStyle: 'dashed', overflow: 'hidden' },
  uploadInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  uploadText: { fontSize: 14, color: C.muted, fontWeight: '600' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
});
