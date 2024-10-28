// app/EditProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

export default function EditProfileScreen() {
  const [name, setName] = useState("Võ Hoàng Vũ");
  const [email, setEmail] = useState("vuvhse172148@fpt.edu.vn");

  const handleSave = () => {
    console.log("Saving profile information...");
    // Thực hiện lưu thông tin chỉnh sửa ở đây
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chỉnh sửa thông tin cá nhân</Text>

      <Text style={styles.label}>Họ và tên</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Button title="Lưu" onPress={handleSave} color="#3F72AF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9F7F7' },
  header: { fontSize: 20, fontWeight: 'bold', color: '#112D4E', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#112D4E', marginBottom: 8 },
  input: { borderColor: '#DBE2EF', borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 5, fontSize: 16, color: '#112D4E' },
});
