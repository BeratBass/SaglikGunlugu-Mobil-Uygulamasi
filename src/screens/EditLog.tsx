// EditLog.tsx

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { FC, memo, useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

import { db } from '../config/firebase';
import { COLORS } from '../constants/colors';
import styles from '../styles/EditLogStyles';
import { RootStackParamList } from '../types/navigation';

// Form state'i için veri yapısını tanımlar.
interface FormData {
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
  field: keyof FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onIncrement: (field: keyof FormData) => void;
  onDecrement: (field: keyof FormData) => void;
}

/**
 * Değer artırma/azaltma butonları içeren yeniden kullanılabilir input kartı bileşeni.
 */
const InputCard: FC<InputCardProps> = memo(({ icon, label, value, unit, field, onChange, onIncrement, onDecrement }) => (
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
));

// Navigasyon rotasından gelen parametrelerin ve navigasyon prop'larının tiplerini belirler.
type EditLogRouteProp = RouteProp<RootStackParamList, 'EditLog'>;
type EditLogNavigationProp = StackNavigationProp<RootStackParamList, 'EditLog'>;

interface EditLogProps {
  route: EditLogRouteProp;
  navigation: EditLogNavigationProp;
}

/**
 * Kullanıcının mevcut bir sağlık kaydını düzenlemesini sağlayan ekran bileşeni.
 */
const EditLog: React.FC<EditLogProps> = ({ route, navigation }) => {
  // Navigasyon ile gönderilen ve düzenlenecek olan log verisini alır.
  const { log } = route.params;

  // Formdaki input alanlarının güncel değerlerini tutar.
  const [formData, setFormData] = useState<FormData>({
    sleep: log.sleep.toString(),
    water: log.water.toString(),
    steps: log.steps.toString(),
    calories: log.calories.toString(),
    weight: log.weight.toString(),
  });

  // Kaydın tarih bilgisini tutar.
  const [date, setDate] = useState<Date>(() => new Date(log.date));
  // Tarih seçici modal'ının görünürlüğünü yönetir.
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // Güncelleme işlemi sırasındaki yükleme durumunu yönetir.
  const [loading, setLoading] = useState(false);

  // Formdaki metin alanlarının manuel olarak değiştirilmesini yönetir.
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [field]: value }));
    }
  }, []);
  
  // Artı/eksi butonları ile formdaki sayısal değerlerin değiştirilmesini yönetir.
  const handleValueChange = (field: keyof FormData, increment: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentValue = parseFloat(formData[field]) || 0;
    const { step, max } = VALIDATION_LIMITS[field];
    let newValue = increment ? Math.min(currentValue + step, max) : Math.max(0, currentValue - step);
    const decimalPlaces = step.toString().includes('.') ? step.toString().split('.')[1].length : 0;
    setFormData((prev) => ({ ...prev, [field]: newValue.toFixed(decimalPlaces) }));
  };

  // Form verilerini doğrular ve Firestore üzerinde güncellemeyi gerçekleştirir.
  const handleUpdate = useCallback(async () => {
    if (Object.values(formData).some(val => !val)) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    
    setLoading(true);
    try {
      const logRef = db.collection('logs').doc(log.id);
      const updatedLog = {
        date: date.toISOString().split('T')[0],
        weight: Number(formData.weight),
        sleep: Number(formData.sleep),
        water: Number(formData.water),
        steps: Number(formData.steps),
        calories: Number(formData.calories),
      };

      await logRef.update(updatedLog);

      Alert.alert('Başarılı', 'Kayıt başarıyla güncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Firestore Hatası:', error.message);
      Alert.alert('Hata', `Kayıt güncellenirken bir hata oluştu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [formData, date, log.id, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Kayıt Düzenle</Text>
        </View>

        <Animated.View entering={FadeInUp.duration(400)} style={{width: '100%', alignItems: 'center'}}>
          <LinearGradient colors={[COLORS.white, '#FDFDFD']} style={styles.card}>
              <View style={styles.labelContainer}>
                  <Text style={styles.icon}>🗓️</Text>
                  <Text style={styles.label}>Tarih Seç</Text>
              </View>
              <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                  <Text style={styles.dateText}>{date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  date={date}
                  onConfirm={(d) => { setDatePickerVisibility(false); setDate(d || new Date()); }}
                  onCancel={() => setDatePickerVisibility(false)}
              />
          </LinearGradient>
        </Animated.View>

        <InputCard icon="😴" label="Alınan Uyku" value={formData.sleep} onChange={handleInputChange} field="sleep" unit="Saat" onIncrement={() => handleValueChange('sleep', true)} onDecrement={() => handleValueChange('sleep', false)} />
        <InputCard icon="💧" label="İçilen Su" value={formData.water} onChange={handleInputChange} field="water" unit="Litre" onIncrement={() => handleValueChange('water', true)} onDecrement={() => handleValueChange('water', false)} />
        <InputCard icon="👟" label="Atılan Adım" value={formData.steps} onChange={handleInputChange} field="steps" unit="Adım" onIncrement={() => handleValueChange('steps', true)} onDecrement={() => handleValueChange('steps', false)} />
        <InputCard icon="🔥" label="Alınan Kalori" value={formData.calories} onChange={handleInputChange} field="calories" unit="Kcal" onIncrement={() => handleValueChange('calories', true)} onDecrement={() => handleValueChange('calories', false)} />
        <InputCard icon="⚖️" label="Kilo" value={formData.weight} onChange={handleInputChange} field="weight" unit="Kg" onIncrement={() => handleValueChange('weight', true)} onDecrement={() => handleValueChange('weight', false)} />

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={handleUpdate} activeOpacity={0.8}>
            <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.actionButtonGradient}>
              <Text style={styles.buttonText}>Değişiklikleri Kaydet</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default EditLog;