import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenTitle, SectionCard } from '../components/Common';
import { defaultProfile } from '../data/mock';
import { colors } from '../theme';
import type { Screen } from '../types';

type Profile = typeof defaultProfile;

export function ProfileScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [showEdit, setShowEdit] = useState(false);

  const initials = useMemo(
    () => profile.name.split(' ').map((item) => item[0]).join('').slice(0, 2).toUpperCase(),
    [profile.name]
  );

  const saveProfile = () => {
    setProfile(draft);
    setShowEdit(false);
  };

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.phone}>{profile.phone}</Text>
              <Text style={styles.city}>{profile.city}, {profile.state}</Text>
            </View>
            <Pressable onPress={() => { setDraft(profile); setShowEdit(true); }} style={styles.editButton}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>
        </SectionCard>

        <SectionCard>
          <ScreenTitle title="Profile Details" subtitle="Keep your account and KYC information updated." />
          {[
            ['Mobile Number', profile.phone],
            ['Email ID', profile.email || 'Not provided'],
            ['State', profile.state],
            ['City', profile.city],
            ['Pincode', profile.pincode],
            ['Address', profile.address],
            ['GST Holder Name', profile.gstHolderName],
            ['GST Number', profile.gstNumber],
            ['PAN Holder Name', profile.panHolderName || 'Not provided'],
            ['PAN Number', profile.panNumber || 'Not provided'],
            ['Dealer Code', profile.dealerCode],
          ].map(([label, value], index) => (
            <View key={label} style={[styles.detailRow, index < 10 && styles.detailBorder]}>
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </SectionCard>

        <SectionCard>
          <Text style={styles.actionHeader}>Quick actions</Text>
          {[
            { label: 'My Redemption', action: () => onNavigate('wallet') },
            { label: 'Transfer Points', action: () => undefined },
            { label: 'My Orders', action: () => undefined },
            { label: 'Need Help', action: () => undefined },
            { label: 'Offers', action: () => undefined },
          ].map((item, index) => (
            <Pressable key={item.label} onPress={item.action} style={[styles.menuRow, index < 4 && styles.detailBorder]}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
          ))}
        </SectionCard>
      </ScrollView>

      <Modal visible={showEdit} animationType="slide" transparent onRequestClose={() => setShowEdit(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                ['Full Name', 'name'],
                ['Phone Number', 'phone'],
                ['Email', 'email'],
                ['City', 'city'],
                ['State', 'state'],
                ['Pincode', 'pincode'],
                ['Address', 'address'],
                ['GST Holder Name', 'gstHolderName'],
                ['GST Number', 'gstNumber'],
                ['PAN Holder Name', 'panHolderName'],
                ['PAN Number', 'panNumber'],
                ['Dealer Code', 'dealerCode'],
              ].map(([label, key]) => (
                <View key={key} style={styles.modalField}>
                  <Text style={styles.modalLabel}>{label}</Text>
                  <TextInput
                    value={draft[key as keyof Profile]}
                    onChangeText={(value) => setDraft((current) => ({ ...current, [key]: value }))}
                    placeholder={label}
                    placeholderTextColor="#AA9A90"
                    style={styles.modalInput}
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowEdit(false)} style={styles.modalSecondary}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveProfile} style={styles.modalPrimary}>
                <Text style={styles.modalPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBackground },
  content: { padding: 18, gap: 16, paddingBottom: 120 },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 72, height: 72, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  name: { fontSize: 18, fontWeight: '800', color: colors.text },
  phone: { marginTop: 4, fontSize: 13, color: colors.mutedText },
  city: { marginTop: 4, fontSize: 12, color: colors.mutedText },
  editButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, backgroundColor: '#FCECE5' },
  editText: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  detailRow: { flexDirection: 'row', gap: 14, paddingVertical: 12, marginTop: 6 },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: '#F2E7DE' },
  detailLabel: { width: 124, fontSize: 12, color: colors.mutedText },
  detailValue: { flex: 1, fontSize: 13, color: colors.text, fontWeight: '600' },
  actionHeader: { fontSize: 17, fontWeight: '800', color: colors.text },
  menuRow: { paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  menuArrow: { fontSize: 22, color: '#B19F95' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(34, 18, 10, 0.36)' },
  modalCard: { maxHeight: '88%', backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 12 },
  modalField: { marginBottom: 12 },
  modalLabel: { marginBottom: 8, fontSize: 12, fontWeight: '700', color: colors.mutedText },
  modalInput: { minHeight: 50, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFF9F4', paddingHorizontal: 14, fontSize: 14, color: colors.text },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalSecondary: { flex: 1, minHeight: 50, borderRadius: 16, backgroundColor: '#F3E9E1', alignItems: 'center', justifyContent: 'center' },
  modalSecondaryText: { fontSize: 14, fontWeight: '800', color: colors.text },
  modalPrimary: { flex: 1, minHeight: 50, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  modalPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
