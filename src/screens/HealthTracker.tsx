// HealthTracker.tsx

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { FC, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { auth, db } from '../config/firebase';
import { COLORS } from '../constants/colors';
import { ROUTES } from '../constants/routes';
import styles from '../styles/HealthTrackerStyles';
import { TabParamList } from '../types/navigation';

// Android'de LayoutAnimation'ı etkinleştirir.
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Navigasyon prop'larının tip tanımını yapar.
type HealthTrackerProps = BottomTabScreenProps<TabParamList, 'HealthTracker'>;

// Form state'i için veri yapısını tanımlar.
interface HealthFormData {
  sleep: string;
  water: string;
  steps: string;
  calories: string;
  weight: string;
}

// Form alanları için geçerlilik limitlerini ve artış adımlarını belirler.
const VALIDATION_LIMITS = {
  sleep: { max: 24, label: 'Uyku süresi', step: 0.5 },
  water: { max: 10, label: 'Su miktarı', step: 0.25 },
  steps: { max: 100000, label: 'Adım sayısı', step: 100 },
  calories: { max: 10000, label: 'Kalori', step: 50 },
  weight: { max: 300, label: 'Kilo', step: 0.1 },
};

// InputCard bileşeni için prop tiplerini tanımlar.
interface InputCardProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
  field: keyof HealthFormData;
  onChange: (field: keyof HealthFormData, value: string) => void;
  onIncrement: (field: keyof HealthFormData) => void;
  onDecrement: (field: keyof HealthFormData) => void;
}

/**
 * Değer artırma/azaltma butonları içeren yeniden kullanılabilir input kartı bileşeni.
 */
const InputCard: FC<InputCardProps> = React.memo(
  ({ icon, label, value, unit, field, onChange, onIncrement, onDecrement }) => (
    <Animated.View entering={FadeInUp.delay(200).duration(400)} layout={Layout.springify()}>
      <LinearGradient colors={[COLORS.white, '#FDFDFD']} style={styles.card}>
        <View style={styles.labelContainer}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.counter}>
          <TouchableOpacity style={styles.controlButton} onPress={() => onDecrement(field)}>
            <Text style={styles.controlButtonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={value}
            onChangeText={(text) => onChange(field, text)}
            placeholder="0"
            placeholderTextColor={COLORS.lightGray}
          />
          <TouchableOpacity style={styles.controlButton} onPress={() => onIncrement(field)}>
            <Text style={styles.controlButtonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  )
);

/**
 * Kullanıcının günlük sağlık verilerini (uyku, su, adım vb.) girdiği ve kaydettiği ekran.
 */
const HealthTracker: FC<HealthTrackerProps> = ({ navigation }) => {
  // Formdaki input alanları için başlangıç değerlerini tanımlar.
  const initialFormData: HealthFormData = {
    sleep: '8',
    water: '2',
    steps: '10000',
    calories: '2000',
    weight: '70',
  };
  // Seçilen tarih bilgisini tutar.
  const [date, setDate] = useState<Date>(new Date());
  // Tarih seçici modal'ının görünürlüğünü yönetir.
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // Formdaki input alanlarının güncel değerlerini tutar.
  const [formData, setFormData] = useState<HealthFormData>(initialFormData);
  // Kayıt oluşturma işlemi sırasındaki yükleme durumunu yönetir.
  const [loading, setLoading] = useState(false);

  // Formu ve tarihi başlangıç değerlerine sıfırlar.
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setDate(new Date());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Formdaki metin alanlarının manuel olarak değiştirilmesini yönetir.
  const handleInputChange = useCallback((field: keyof HealthFormData, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  }, []);

  // Formdaki tüm alanların geçerli olup olmadığını kontrol eder.
  const validateForm = (): boolean => {
    for (const key in formData) {
      const field = key as keyof HealthFormData;
      if (!formData[field]) {
        Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
        return false;
      }
      const value = Number(formData[field]);
      const { max, label } = VALIDATION_LIMITS[field];
      if (isNaN(value) || value < 0 || value > max) {
        Alert.alert('Hata', `${label} için girdiğiniz değer geçersiz (0 ile ${max} arasında olmalı).`);
        return false;
      }
    }
    return true;
  };

  // Artı/eksi butonları ile formdaki sayısal değerlerin değiştirilmesini yönetir.
  const handleValueChange = (field: keyof HealthFormData, increment: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentValue = parseFloat(formData[field]) || 0;
    const { step, max } = VALIDATION_LIMITS[field];
    let newValue: number;
    if (increment) {
      newValue = Math.min(currentValue + step, max);
    } else {
      newValue = Math.max(0, currentValue - step);
    }
    const decimalPlaces = step.toString().includes('.') ? step.toString().split('.')[1].length : 0;
    const formattedValue = newValue.toFixed(decimalPlaces);
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
  };

  // Form verilerini doğrular ve yeni bir log olarak Firestore'a kaydeder.
  const handleCreate = useCallback(async () => {
    if (!validateForm()) return;
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Hata', 'Kayıt oluşturmak için oturum açmalısınız.');
      return;
    }
    setLoading(true);
    try {
      const newLog = {
        userId: currentUser.uid,
        date: date.toISOString().split('T')[0],
        weight: Number(formData.weight),
        sleep: Number(formData.sleep),
        water: Number(formData.water),
        steps: Number(formData.steps),
        calories: Number(formData.calories),
        createdAt: new Date().toISOString(),
      };
      await db.collection('logs').add(newLog);
      Alert.alert('Başarılı', 'Kayıt başarıyla oluşturuldu.', [
        {
          text: 'Tamam',
          onPress: () => {
            resetForm();
            navigation.navigate(ROUTES.DAILY_LOG);
          },
        },
      ]);
    } catch (error: any) {
      console.error('Firestore Hatası:', error);
      Alert.alert('Hata', `Kayıt oluşturulurken bir hata oluştu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [formData, date, navigation, resetForm]);

  // Kayıt oluşturma butonuna basıldığında dokunsal geri bildirim sağlar ve kaydetme işlemini başlatır.
  const onButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleCreate();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Kayıt Ekle</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
            <Text style={styles.resetButtonText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>
        <Animated.View entering={FadeInUp.duration(400)} style={{ width: '100%', alignItems: 'center' }}>
          <LinearGradient colors={[COLORS.white, '#FDFDFD']} style={styles.card}>
            <View style={styles.labelContainer}>
              <Text style={styles.icon}>🗓️</Text>
              <Text style={styles.label}>Tarih Seç</Text>
            </View>
            <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
              <Text style={styles.dateText}>
                {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={date}
              minimumDate={new Date()}
              onConfirm={(selectedDate: Date) => {
                setDatePickerVisibility(false);
                setDate(selectedDate || new Date());
              }}
              onCancel={() => setDatePickerVisibility(false)}
            />
          </LinearGradient>
        </Animated.View>
        <InputCard icon="😴" label="Alınan Uyku" value={formData.sleep} unit="Saat" field="sleep" onChange={handleInputChange} onIncrement={() => handleValueChange('sleep', true)} onDecrement={() => handleValueChange('sleep', false)} />
        <InputCard icon="💧" label="İçilen Su" value={formData.water} unit="Litre" field="water" onChange={handleInputChange} onIncrement={() => handleValueChange('water', true)} onDecrement={() => handleValueChange('water', false)} />
        <InputCard icon="👟" label="Atılan Adım" value={formData.steps} unit="Adım" field="steps" onChange={handleInputChange} onIncrement={() => handleValueChange('steps', true)} onDecrement={() => handleValueChange('steps', false)} />
        <InputCard icon="🔥" label="Alınan Kalori" value={formData.calories} unit="Kcal" field="calories" onChange={handleInputChange} onIncrement={() => handleValueChange('calories', true)} onDecrement={() => handleValueChange('calories', false)} />
        <InputCard icon="⚖️" label="Kilo" value={formData.weight} unit="Kg" field="weight" onChange={handleInputChange} onIncrement={() => handleValueChange('weight', true)} onDecrement={() => handleValueChange('weight', false)} />
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.createButton} onPress={onButtonPress} activeOpacity={0.8}>
            <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.createButtonGradient}>
              <Text style={styles.buttonText}>Kaydı Oluştur</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default HealthTracker;