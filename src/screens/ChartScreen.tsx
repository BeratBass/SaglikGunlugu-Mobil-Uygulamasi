// ChartScreen.tsx

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ChevronDown } from 'react-native-feather';
import RNPickerSelect from 'react-native-picker-select';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { auth, db } from '../config/firebase';
import { COLORS } from '../constants/colors';
import styles, { pickerSelectStyles } from '../styles/ChartScreenStyles';
import { Log } from '../types/navigation';
import { processChartData } from '../utils/chartDataProcessor';

// Grafik dropdown menüsünde kullanılacak veri türlerini, etiketlerini ve ikonlarını tanımlar.
type DataType = 'steps' | 'sleep' | 'calories' | 'water' | 'weight';
const DATA_TYPE_OPTIONS = [
  { label: 'Adım Sayısı', value: 'steps', icon: '👟' },
  { label: 'Uyku Süresi', value: 'sleep', icon: '😴' },
  { label: 'Alınan Kalori', value: 'calories', icon: '🔥' },
  { label: 'İçilen Su', value: 'water', icon: '💧' },
  { label: 'Kilo Değişimi', value: 'weight', icon: '⚖️' },
];

/**
 * Kullanıcının sağlık verilerini analiz edip grafik üzerinde görselleştiren ekran.
 */
const ChartScreen = () => {
  // Firestore'dan çekilen ve filtrelenen günlük kayıtları tutar.
  const [logs, setLogs] = useState<Log[]>([]);
  // Veri yükleme durumunu yönetir.
  const [loading, setLoading] = useState(true);
  // Olası hata mesajlarını tutar.
  const [error, setError] = useState<string | null>(null);
  // Aktif Firebase kullanıcısının durumunu tutar.
  const [user, setUser] = useState<any>(null);
  // Grafiğin zaman periyodunu yönetir (Günlük, Haftalık, Aylık).
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  // Grafikte gösterilecek veri türünü yönetir (Adım, Uyku vb.).
  const [dataType, setDataType] = useState<DataType>('steps');
  // Cihazın ekran genişliğini alarak grafiği duyarlı hale getirir.
  const { width } = useWindowDimensions();

  // Bileşen yüklendiğinde kullanıcı oturum durumunu dinler.
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setError('Grafikleri görmek için lütfen giriş yapın.');
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Kullanıcı veya seçilen veri türü değiştiğinde Firestore'dan ilgili günlükleri çeker.
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = db.collection('logs').where('userId', '==', user.uid)
      .onSnapshot(
        (snapshot) => {
          const fetchedLogs = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as Log))
            .filter((log): log is Log => !!log.date && typeof log[dataType] === 'number');
          fetchedLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setLogs(fetchedLogs);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error('Firestore Hatası:', err);
          setError('Veriler yüklenirken bir hata oluştu.');
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, [user, dataType]);

  // Veriler veya görünüm modu değiştiğinde grafik verisini performans için yeniden hesaplar.
  const chartData = useMemo(() => {
    if (logs.length === 0) return { labels: [], datasets: [{ data: [] }] };
    return processChartData(logs, viewMode, dataType);
  }, [logs, viewMode, dataType]);
  
  // Seçili veri türü ve zaman periyoduna göre dinamik bir grafik başlığı oluşturur.
  const getChartTitle = () => {
    const period = viewMode === 'daily' ? 'Günlük' : viewMode === 'weekly' ? 'Haftalık' : 'Aylık';
    const type = DATA_TYPE_OPTIONS.find(opt => opt.value === dataType)?.label || '';
    return `${period} ${type} Analizi`;
  };
  
  // Grafiğin Y ekseni için doğru birim ekini (sa, L, kg) döndürür.
  const getYAxisSuffix = () => {
    switch (dataType) {
      case 'sleep': return ' sa';
      case 'water': return ' L';
      case 'weight': return ' kg';
      default: return '';
    }
  };

  // Veri yüklenirken gösterilecek yükleme animasyonu.
  if (loading) {
    return (<SafeAreaView style={styles.centeredContainer}><ActivityIndicator size="large" color={COLORS.primary} /></SafeAreaView>);
  }

  // Bir hata oluştuğunda gösterilecek hata mesajı.
  if (error) {
    return (<SafeAreaView style={styles.centeredContainer}><Text style={styles.infoText}>{error}</Text></SafeAreaView>);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Ekran Başlığı */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sağlık Analizi</Text>
        </View>
        
        {/* Veri Türü Seçim Menüsü */}
        <View style={styles.selectorContainer}>
            <View style={styles.pickerWrapper}>
                <Text style={styles.pickerIcon}>{DATA_TYPE_OPTIONS.find(opt => opt.value === dataType)?.icon}</Text>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                      onValueChange={(value) => value && setDataType(value)}
                      items={DATA_TYPE_OPTIONS}
                      style={pickerSelectStyles}
                      value={dataType}
                      placeholder={{}}
                      useNativeAndroidPickerStyle={false} 
                      Icon={() => <ChevronDown width={24} height={24} color={COLORS.gray} />}
                  />
                </View>
            </View>
        </View>

        {/* Zaman Periyodu Seçim Butonları */}
        <View style={[styles.selectorContainer, {padding: wp('1%')}]}>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.button, viewMode === 'daily' && styles.buttonActive]} onPress={() => setViewMode('daily')}>
              <Text style={[styles.buttonText, viewMode === 'daily' && styles.buttonTextActive]}>Günlük</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, viewMode === 'weekly' && styles.buttonActive]} onPress={() => setViewMode('weekly')}>
              <Text style={[styles.buttonText, viewMode === 'weekly' && styles.buttonTextActive]}>Haftalık</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, viewMode === 'monthly' && styles.buttonActive]} onPress={() => setViewMode('monthly')}>
              <Text style={[styles.buttonText, viewMode === 'monthly' && styles.buttonTextActive]}>Aylık</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Grafik Kartı */}
        <View style={styles.chartCard}>
          <LinearGradient colors={[COLORS.white, '#F8FDFF']} style={styles.chartGradient}>
            <Text style={styles.chartTitle}>{getChartTitle()}</Text>
            {/* Veri yeterliyse çizgi grafiğini, değilse bilgi mesajını gösterir. */}
            {chartData.datasets[0].data.length > 1 ? (
              <LineChart
                data={chartData}
                width={width - wp('18%')}
                height={hp('28%')}
                yAxisSuffix={getYAxisSuffix()}
                chartConfig={{
                  backgroundGradientFrom: COLORS.white,
                  backgroundGradientTo: '#F8FDFF',
                  decimalPlaces: dataType === 'water' || dataType === 'weight' ? 1 : 0,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
                  propsForDots: { r: '5', strokeWidth: '2', stroke: COLORS.primary },
                  propsForBackgroundLines: { stroke: COLORS.divider, strokeDasharray: "" },
                }}
                bezier
                style={{ borderRadius: 16, marginLeft: -wp('2%')}}
              />
            ) : (
              <View style={{height: hp('28%'), justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.infoText}>Grafik için yeterli veri bulunmuyor.</Text>
              </View>
            )}
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChartScreen;