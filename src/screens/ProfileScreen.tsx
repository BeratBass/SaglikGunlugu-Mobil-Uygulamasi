// ProfileScreen.tsx

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, Edit3, FileText, LogOut, Mail, Plus, User } from 'react-native-feather';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { auth, db } from '../config/firebase';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import styles from '../styles/ProfileScreenStyles';
import { RootStackParamList, TabParamList } from '../types/navigation';

// Firestore'dan gelen kullanıcı verileri için bir arayüz tanımlar.
interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  username: string;
  age: string;
  bio: string;
}

// Hem Tab hem de Stack navigator'larından gelen navigasyon prop'larını birleştirir.
type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabScreenProps<TabParamList, 'ProfileScreen'>['navigation'],
  StackScreenProps<RootStackParamList>['navigation']
>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

/**
 * Profil ekranındaki her bir menü öğesini (bilgi satırı veya buton) oluşturan yeniden kullanılabilir bileşen.
 */
const ProfileMenuItem: FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  isSignOut?: boolean;
}> = ({ icon, label, value, onPress, isSignOut }) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
    <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.menuItem}>
      {icon}
      <Text style={[styles.menuItemText, isSignOut && styles.signOutText]}>{label}</Text>
      {value ? (
        <Text style={styles.menuItemValue}>{value}</Text>
      ) : (
        onPress && !isSignOut && <ChevronRight color={COLORS.textSecondary} />
      )}
    </Animated.View>
  </TouchableOpacity>
);

/**
 * Kullanıcının profil bilgilerini görüntülediği ve düzenleme/çıkış yapma gibi eylemleri başlattığı ekran.
 */
const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
  // Oturum açmış kullanıcının birleştirilmiş verilerini tutar.
  const [user, setUser] = useState<UserData | null>(null);
  // Veri yükleme durumunu yönetir.
  const [loading, setLoading] = useState<boolean>(true);
  // Olası hata mesajlarını tutar.
  const [error, setError] = useState<string | null>(null);

  // Bileşen yüklendiğinde mevcut kullanıcının verilerini Firestore'dan anlık olarak çeker.
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return; 
    }
    const unsubscribe = db.collection('users').doc(currentUser.uid).onSnapshot(
      (docSnap) => {
        const firestoreData = docSnap.data();
        const combinedUserData: UserData = {
          uid: currentUser.uid,
          displayName: firestoreData?.name ? `${firestoreData.name} ${firestoreData.surname}` : (currentUser.displayName || 'İsimsiz Kullanıcı'),
          email: currentUser.email || 'E-posta adresi yok',
          photoURL: currentUser.photoURL || `https://ui-avatars.com/api/?name=${(firestoreData?.name || 'U').charAt(0)}&background=random`,
          username: firestoreData?.username || (currentUser.email ? `@${currentUser.email.split('@')[0]}` : '@kullanici'),
          age: firestoreData?.age || '',
          bio: firestoreData?.bio || 'Merhaba!',
        };
        setUser(combinedUserData);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore Dinleme Hatası:', err);
        setError('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Kullanıcının oturumunu sonlandırma işlemini yönetir.
  const handleSignOut = () => {
    Alert.alert("Çıkış Yap", "Oturumu sonlandırmak istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Çıkış Yap", style: "destructive", onPress: async () => {
        try {
          await auth.signOut();
        } catch (error: any) {
          Alert.alert('Hata', `Çıkış yaparken bir hata oluştu: ${error.message}`);
        }
      }}
    ]);
  };
  
  // Profil resmi güncelleme butonuna basıldığında tetiklenir (fonksiyonellik gelecekte eklenecek).
  const handleImagePicker = () => {
    Alert.alert("Fonksiyon Hazır Değil", "Profil resmi güncelleme özelliği yakında eklenecektir.");
  };

  // Veriler yüklenirken gösterilecek yükleme animasyonu.
  if (loading) {
    return (<View style={styles.centeredContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>);
  }
  // Bir hata oluştuğunda gösterilecek hata mesajı.
  if (error) {
    return (<View style={styles.centeredContainer}><Text style={styles.errorText}>{error}</Text></View>);
  }
  // Kullanıcı verisi bulunamazsa gösterilecek mesaj.
  if (!user) {
    return (<View style={styles.centeredContainer}><Text style={styles.errorText}>Kullanıcı bulunamadı.</Text></View>);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View entering={FadeInUp.duration(400)}>
            <View style={styles.headerContainer}>
                <View style={styles.profileImageContainer}>
                  <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
                  <TouchableOpacity style={styles.editImageButton} onPress={handleImagePicker}>
                    <Plus color={COLORS.white} width={20} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.displayName}>{user.displayName}</Text>
                <Text style={styles.username}>{user.username}</Text>
            </View>
        </Animated.View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
          <ProfileMenuItem 
            icon={<View style={[styles.menuItemIconContainer, {backgroundColor: '#E0F2FE'}]}><Mail color="#0EA5E9" width={20} /></View>}
            label="E-posta" 
            value={user.email} 
          />
          <ProfileMenuItem 
            icon={<View style={[styles.menuItemIconContainer, {backgroundColor: '#FEE2E2'}]}><User color="#EF4444" width={20} /></View>}
            label="Yaş" 
            value={user.age} 
          />
          <ProfileMenuItem 
            icon={<View style={[styles.menuItemIconContainer, {backgroundColor: '#F3E8FF'}]}><FileText color="#9333EA" width={20} /></View>}
            label="Bio" 
            value={user.bio} 
          />
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>
          <ProfileMenuItem 
            icon={<View style={[styles.menuItemIconContainer, {backgroundColor: '#DCFCE7'}]}><Edit3 color="#22C55E" width={20} /></View>}
            label="Profili Düzenle" 
            onPress={() => navigation.navigate(ROUTES.UPDATE_PROFILE)}
          />
          <ProfileMenuItem 
            icon={<View style={[styles.menuItemIconContainer, {backgroundColor: '#FFE4E6'}]}><LogOut color="#F43F5E" width={20} /></View>}
            label="Çıkış Yap" 
            onPress={handleSignOut}
            isSignOut
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;