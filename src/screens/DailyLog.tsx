// DailyLog.tsx

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { FC, memo, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { auth, db } from '../config/firebase';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import styles from '../styles/DailyLogStyles';
import { Log, RootStackParamList, TabParamList } from '../types/navigation';

// Hem Tab hem de Stack navigator'larından gelen navigasyon prop'larını birleştirir.
type DailyLogProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'DailyLog'>,
  StackScreenProps<RootStackParamList>
>;

/**
 * Log kartları içinde her bir veri satırını (kilo, uyku vb.) ikonla birlikte gösteren bileşen.
 */
const InfoRow: FC<{ icon: string; label: string; value: string; unit: string; isLast?: boolean }> = 
({ icon, label, value, unit, isLast }) => (
  <View style={[styles.row, isLast && styles.lastRow]}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{`${value} ${unit}`}</Text>
  </View>
);

/**
 * Tek bir günlük kaydını, düzenleme ve silme seçenekleriyle birlikte gösteren kart bileşeni.
 */
const LogCard: FC<{ item: Log; navigation: DailyLogProps['navigation']; onDelete: (id: string) => void }> = memo(
  ({ item, navigation, onDelete }) => {
    // Tarih verisini formatlayarak "16 Ekim 2025" gibi bir formata dönüştürür.
    const logDate = new Date(item.date);
    const formattedDate = isNaN(logDate.getTime())
      ? item.date
      : logDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });

    // Kullanıcıya kaydı silmek isteyip istemediğini soran bir onay penceresi gösterir.
    const handleDelete = () => {
      Alert.alert(
        'Kaydı Sil',
        'Bu kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Sil', style: 'destructive', onPress: () => onDelete(item.id) },
        ]
      );
    };

    return (
      <Animated.View entering={FadeInUp.duration(500)} layout={Layout.springify()} style={styles.card}>
        <LinearGradient colors={[COLORS.white, COLORS.cardBackground]} style={styles.cardGradient}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{formattedDate}</Text>
            <View style={styles.buttonContainer}>
              {/* Kaydı düzenleme ekranına yönlendiren buton */}
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.EDIT_LOG, { log: item })}
                style={[styles.iconButton, { backgroundColor: 'rgba(0, 122, 255, 0.15)' }]}
              >
                <Text style={styles.buttonEmoji}>✏️</Text>
              </TouchableOpacity>
              {/* Kaydı silme fonksiyonunu tetikleyen buton */}
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.iconButton, { backgroundColor: 'rgba(255, 59, 48, 0.15)' }]}
              >
                <Text style={styles.buttonEmoji}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardContent}>
            <InfoRow icon="⚖️" label="Kilo" value={item.weight.toString()} unit="kg" />
            <InfoRow icon="😴" label="Uyku" value={item.sleep.toString()} unit="Saat" />
            <InfoRow icon="💧" label="Su" value={item.water.toString()} unit="Litre" />
            <InfoRow icon="👟" label="Adım" value={item.steps.toString()} unit="Adım" />
            <InfoRow icon="🔥" label="Kalori" value={item.calories.toString()} unit="Kcal" isLast />
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }
);

/**
 * Kullanıcının oluşturduğu tüm sağlık kayıtlarını listeleyen ana günlük ekranı.
 */
const DailyLog: React.FC<DailyLogProps> = ({ navigation }) => {
  // Firestore'dan çekilen tüm günlük kayıtlarını tutar.
  const [logs, setLogs] = useState<Log[]>([]);
  // Veri yükleme durumunu yönetir.
  const [loading, setLoading] = useState(true);
  // Olası hata mesajlarını tutar.
  const [error, setError] = useState<string | null>(null);
  // Aktif Firebase kullanıcısını değişkende tutar.
  const user = auth.currentUser;

  // Bileşen yüklendiğinde veya kullanıcı değiştiğinde Firestore'dan verileri anlık olarak dinler.
  useEffect(() => {
    if (!user) {
      setError('Kayıtları görmek için lütfen giriş yapın.');
      setLoading(false);
      return;
    }

    const unsubscribe = db
      .collection('logs')
      .where('userId', '==', user.uid)
      .orderBy('date', 'desc')
      .onSnapshot(
        (snapshot) => {
          const fetchedLogs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Log));
          setLogs(fetchedLogs);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error('Firestore Hatası:', err);
          setError('Kayıtlar yüklenirken bir hata oluştu.');
          setLoading(false);
        }
      );

    // Bileşen ekrandan kaldırıldığında Firestore dinleyicisini sonlandırır.
    return () => unsubscribe();
  }, [user]);

  // Belirtilen ID'ye sahip kaydı Firestore'dan siler.
  const handleDeleteLog = async (logId: string) => {
    try {
      await db.collection('logs').doc(logId).delete();
    } catch (error) {
      console.error("Silme Hatası: ", error);
      Alert.alert('Hata', 'Kayıt silinirken bir sorun oluştu.');
    }
  };

  // Veriler yüklenirken gösterilecek yükleme animasyonu.
  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Ekran Başlığı ve Toplam Kayıt Sayısı */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Günlüğüm</Text>
        {logs.length > 0 && <Text style={styles.subtitle}>Toplam {logs.length} kayıt bulundu.</Text>}
      </View>

      {/* Hata veya boş liste durumuna göre ilgili mesajı veya kayıt listesini render eder. */}
      {error ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.centeredText}>{error}</Text>
        </View>
      ) : logs.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.centeredText}>Henüz hiç kayıt oluşturmadınız. {"\n"}Yeni bir başlangıç için harika bir gün!</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          renderItem={({ item }) => <LogCard item={item} navigation={navigation} onDelete={handleDeleteLog} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContainer}
        />
      )}
    </SafeAreaView>
  );
};

export default DailyLog;