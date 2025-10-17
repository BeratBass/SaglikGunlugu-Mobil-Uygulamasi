// BottomNav.tsx

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { memo, useEffect } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/BottomNavStyles';
import { TabParamList } from '../types/navigation';

// Rota isimlerine karşılık gelen ikon kaynaklarını tanımlar.
const icons: Record<keyof TabParamList, any> = {
  DailyLog: require('../assets/home-icon.png'),
  HealthTracker: require('../assets/calendar-icon.png'),
  ChartScreen: require('../assets/chart-icon.png'),
  ProfileScreen: require('../assets/user-icon.png'),
};

// Rota isimlerine karşılık gelen Türkçe etiketleri tanımlar.
const labels: Record<keyof TabParamList, string> = {
  DailyLog: 'Günlük',
  HealthTracker: 'Kayıt Ekle',
  ChartScreen: 'Analiz',
  ProfileScreen: 'Profil',
};

// Tek bir navigasyon sekmesi öğesinin prop tiplerini tanımlar.
interface NavItemProps {
  route: keyof TabParamList;
  icon: any;
  label: string; 
  isActive: boolean;
  onPress: () => void;
}

/**
 * Alt navigasyon barındaki her bir sekme öğesini (ikon ve metin) animasyonlarla birlikte render eder.
 */
const NavItem = memo(({ route, icon, label, isActive, onPress }: NavItemProps) => {
  // Sekmenin aktif durumunu animasyon için paylaşılan bir değerde tutar.
  const activeProgress = useSharedValue(isActive ? 1 : 0);

  // Sekmenin aktiflik durumu değiştiğinde animasyonu tetikler.
  useEffect(() => {
    activeProgress.value = withTiming(isActive ? 1 : 0, { duration: 250 });
  }, [isActive, activeProgress]);

  // Aktif sekme vurgu balonu için animasyon stilini hesaplar.
  const bubbleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: activeProgress.value }],
    opacity: activeProgress.value,
  }));

  // Aktif sekme ikonu için hafif büyüme animasyon stilini hesaplar.
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.15 * activeProgress.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={`${route} tab`}
      accessibilityRole="button"
      style={styles.navItemTouchable}
    >
      <View style={styles.navItemContainer}>
        <Animated.View style={[styles.activeBubble, bubbleAnimatedStyle]} />
        <Animated.View style={iconAnimatedStyle}>
          <Image
            source={icon}
            style={[styles.icon, isActive && styles.activeIcon]}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={[styles.navItemText, isActive && styles.activeNavItemText]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

/**
 * Uygulamanın alt kısmında yer alan özel tasarımlı navigasyon barı bileşeni.
 */
const BottomNav = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  // Cihazın güvenli alan boşluklarını alır (özellikle iPhone çentiği için).
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.bottomNavContainer,
      // Güvenli alan varsa alt boşluğu ayarlar, yoksa platforma göre varsayılan bir boşluk bırakır.
      { paddingBottom: insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 16 : 12) }
    ]}>
      {/* Navigasyon durumundaki her bir rota için bir NavItem oluşturur. */}
      {state.routes.map((route, index) => {
        // Mevcut sekmenin aktif olup olmadığını kontrol eder.
        const isActive = state.index === index;
        // Rota ismine göre doğru ikonu alır.
        const icon = icons[route.name as keyof TabParamList];
        // Rota ismine göre doğru etiketi alır.
        const label = labels[route.name as keyof TabParamList];

        // Sekmeye basıldığında ilgili ekrana gitme işlemini yönetir.
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <NavItem
            key={route.key}
            route={route.name as keyof TabParamList}
            icon={icon}
            label={label}
            isActive={isActive}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
};

export default BottomNav;