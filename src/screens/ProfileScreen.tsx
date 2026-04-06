import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const handleSettingPress = (setting: string) => {
    Alert.alert('Inställning', `${setting} kommer snart!`);
  };

  const renderSettingItem = (icon: keyof typeof Ionicons.glyphMap, title: string, subtitle?: string) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => handleSettingPress(title)}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color="#2E7D32" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👨‍🍳</Text>
        </View>
        <Text style={styles.userName}>Kock</Text>
        <Text style={styles.userEmail}>kock@snabbmat.se</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Recept gjorda</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Favoriter</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Veckor aktiv</Text>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Inställningar</Text>
        
        {renderSettingItem('notifications', 'Notifieringar', 'Få påminnelser om måltider')}
        {renderSettingItem('language', 'Språk', 'Svenska')}
        {renderSettingItem('theme', 'Tema', 'Ljust tema')}
        {renderSettingItem('units', 'Måttenheter', 'Metriska enheter')}
      </View>

      {/* App Info */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Om appen</Text>
        
        {renderSettingItem('information-circle', 'Om SnabbMat', 'Version 1.0.0')}
        {renderSettingItem('help-circle', 'Hjälp & Support')}
        {renderSettingItem('star', 'Betygsätt appen')}
        {renderSettingItem('share', 'Dela med vänner')}
      </View>

      {/* Account */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Konto</Text>
        
        {renderSettingItem('person', 'Redigera profil')}
        {renderSettingItem('key', 'Ändra lösenord')}
        {renderSettingItem('log-out', 'Logga ut', undefined)}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SnabbMat v1.0.0</Text>
        <Text style={styles.footerText}>© 2024 SnabbMat</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6',
  },
  profileHeader: {
    backgroundColor: '#FF9F4A',
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A7C59',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  settingsSection: {
    margin: 15,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
  },
  settingItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    padding: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});
