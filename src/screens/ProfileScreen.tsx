import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { PageContainer } from '../components/PageContainer';
import { useAuth } from '../context/AuthContext';
import { useRecipeContext } from '../context/RecipeContext';

type ProfileStackParamList = {
  ProfileMain: undefined;
  Auth: { mode?: 'login' | 'register' };
};

type Props = StackScreenProps<ProfileStackParamList, 'ProfileMain'>;

export default function ProfileScreen({ navigation }: Props) {
  const { user, isLoggedIn, logout } = useAuth();
  const { favorites } = useRecipeContext();

  const handleSettingPress = (setting: string) => {
    Alert.alert('Inställning', `${setting} kommer snart!`);
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Är du säker på att du vill logga ut?')) {
        await logout();
      }
    } else {
      Alert.alert('Logga ut', 'Är du säker på att du vill logga ut?', [
        { text: 'Avbryt', style: 'cancel' },
        { text: 'Logga ut', style: 'destructive', onPress: async () => { await logout(); } },
      ]);
    }
  };

  const renderSettingItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    destructive?: boolean,
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress ?? (() => handleSettingPress(title))}
    >
      <View style={[styles.settingIcon, destructive && styles.settingIconDestructive]}>
        <Ionicons name={icon} size={24} color={destructive ? '#c0392b' : '#2E7D32'} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, destructive && styles.settingTitleDestructive]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <PageContainer>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨‍🍳</Text>
          </View>
          {isLoggedIn && user ? (
            <>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </>
          ) : (
            <>
              <Text style={styles.userName}>Gäst</Text>
              <Text style={styles.userEmail}>Logga in för att spara favoriter</Text>
            </>
          )}
        </View>

        {/* Login / Register buttons for guests */}
        {!isLoggedIn && (
          <>
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('Auth', { mode: 'login' })}
              >
                <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.authButtonIcon} />
                <Text style={styles.loginButtonText}>Logga in</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Auth', { mode: 'register' })}
              >
                <Ionicons name="person-add-outline" size={20} color="#2E7D32" style={styles.authButtonIcon} />
                <Text style={styles.registerButtonText}>Skapa konto</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.guestInfoBox}>
              <Ionicons name="person-outline" size={20} color="#FF9F4A" />
              <View style={styles.guestInfoContent}>
                <Text style={styles.guestInfoTitle}>Du surfar som gäst</Text>
                <Text style={styles.guestInfoText}>
                  Du kan bläddra bland alla recept och spara favoriter lokalt. Logga in för att synka dina favoriter och inställningar mellan enheter.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.getParent()?.navigate('Favoriter')}
          >
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoriter</Text>
            <Ionicons name="chevron-forward" size={12} color="#4A7C59" style={{ marginTop: 2 }} />
          </TouchableOpacity>
          <View style={[styles.statItem, styles.statItemBorder]}>
            <Text style={styles.statNumber}>—</Text>
            <Text style={styles.statLabel}>Recept gjorda</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>—</Text>
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
          {isLoggedIn ? (
            <>
              {renderSettingItem('person', 'Redigera profil')}
              {renderSettingItem('key', 'Ändra lösenord')}
              {renderSettingItem('log-out', 'Logga ut', undefined, handleLogout, true)}
            </>
          ) : (
            <>
              {renderSettingItem('log-in', 'Logga in', undefined, () =>
                navigation.navigate('Auth', { mode: 'login' }),
              )}
              {renderSettingItem('person-add', 'Skapa konto', undefined, () =>
                navigation.navigate('Auth', { mode: 'register' }),
              )}
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SnabbMat v1.0.0</Text>
          <Text style={styles.footerText}>© 2026 SnabbMat</Text>
        </View>
      </PageContainer>
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
  authButtons: {
    flexDirection: 'row',
    margin: 15,
    gap: 12,
  },
  loginButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  registerButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '700',
  },
  authButtonIcon: {
    marginRight: 6,
  },
  guestInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff8f0',
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 0,
    marginBottom: 8,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  guestInfoContent: {
    flex: 1,
  },
  guestInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e67e22',
    marginBottom: 4,
  },
  guestInfoText: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
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
  statItemBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#f0ebe3',
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
  settingIconDestructive: {
    backgroundColor: '#fdecea',
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
  settingTitleDestructive: {
    color: '#c0392b',
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
