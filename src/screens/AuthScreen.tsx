import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';

export type AuthStackParamList = {
  Auth: { mode?: 'login' | 'register' };
};

type Props = StackScreenProps<AuthStackParamList, 'Auth'>;

export default function AuthScreen({ route, navigation }: Props) {
  const initialMode = route.params?.mode ?? 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async () => {
    setError(null);

    if (mode === 'register' && password !== confirmPassword) {
      setError('Lösenorden matchar inte.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result =
        mode === 'login'
          ? await login(email, password)
          : await register(name, email, password);

      if (result.success) {
        navigation.goBack();
      } else {
        setError(result.error ?? 'Något gick fel.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>👨‍🍳</Text>
          </View>
          <Text style={styles.appName}>SnabbMat</Text>
          <Text style={styles.tagline}>
            {mode === 'login' ? 'Välkommen tillbaka!' : 'Skapa ditt konto'}
          </Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]}
            onPress={() => switchMode('login')}
          >
            <Text style={[styles.modeButtonText, mode === 'login' && styles.modeButtonTextActive]}>
              Logga in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'register' && styles.modeButtonActive]}
            onPress={() => switchMode('register')}
          >
            <Text style={[styles.modeButtonText, mode === 'register' && styles.modeButtonTextActive]}>
              Skapa konto
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'register' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Namn</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ditt namn"
                  placeholderTextColor="#bbb"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-post</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="din@epost.se"
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lösenord</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={mode === 'register' ? 'Minst 6 tecken' : 'Ditt lösenord'}
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeButton}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>

          {mode === 'register' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bekräfta lösenord</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Upprepa lösenordet"
                  placeholderTextColor="#bbb"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={18} color="#c0392b" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === 'login' ? 'Logga in' : 'Skapa konto'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchLink} onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
            <Text style={styles.switchLinkText}>
              {mode === 'login'
                ? 'Inget konto? Skapa ett gratis'
                : 'Har du redan ett konto? Logga in'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>eller</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.guestButton} onPress={() => navigation.goBack()}>
            <Ionicons name="person-outline" size={18} color="#888" style={styles.guestButtonIcon} />
            <Text style={styles.guestButtonText}>Fortsätt som gäst</Text>
          </TouchableOpacity>

          <View style={styles.guestInfo}>
            <Ionicons name="information-circle-outline" size={16} color="#aaa" />
            <Text style={styles.guestInfoText}>
              Som gäst kan du bläddra bland recept. Favoriter sparas lokalt och synkas inte mellan enheter.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFF4E6',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6',
  },
  content: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
  },
  modeToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#e8e0d8',
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#888',
  },
  modeButtonTextActive: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0d8d0',
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdecea',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    color: '#c0392b',
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  switchLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLinkText: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0d8d0',
  },
  dividerText: {
    color: '#aaa',
    fontSize: 13,
    marginHorizontal: 12,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f0ea',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0d8d0',
  },
  guestButtonIcon: {
    marginRight: 8,
  },
  guestButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9f6f2',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginBottom: 8,
  },
  guestInfoText: {
    flex: 1,
    fontSize: 13,
    color: '#aaa',
    lineHeight: 18,
  },
});
