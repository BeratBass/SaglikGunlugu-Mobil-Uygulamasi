// BottomNavStyles.ts

import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  // Navigasyon barının ana kapsayıcı stili.
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: hp('12%'), 
    backgroundColor: COLORS.white, 
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: wp('2%'),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 12,
  },
  // Her bir navigasyon sekmesinin dokunulabilir alanını tanımlar.
  navItemTouchable: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // İkon ve metni dikey olarak hizalayan iç kapsayıcı.
  navItemContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: hp('2%'), 
  },
  // Pasif durumdaki sekme ikonlarının genel stili.
  icon: {
    width: wp('6%'),
    height: wp('6%'),
    tintColor: COLORS.textSecondary,
  },
  // Aktif (seçili) durumdaki sekme ikonunun stili.
  activeIcon: {
    tintColor: COLORS.white,
  },
  // Aktif sekme ikonunun arkasında beliren vurgu animasyonu stili.
  activeBubble: {
    position: 'absolute',
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('6%'),
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    top: hp('1%'),
  },
  // Pasif durumdaki sekme etiketlerinin (metin) stili.
  navItemText: {
    fontSize: wp('3%'),
    color: COLORS.textSecondary,
    marginTop: hp('0.5%'),
    fontWeight: '500',
  },
  // Aktif (seçili) durumdaki sekme etiketinin stili.
  activeNavItemText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Kullanılmayan aktif sekme göstergesi, gizlenmesi için sıfırlandı.
  activeIndicator: {
    width: 0,
    height: 0,
  },
});

export default styles;