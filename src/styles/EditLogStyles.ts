// EditLogStyles.ts

import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  // --- Kapsayıcı Stilleri ---
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingBottom: hp('15%'),
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: hp('4%'),
  },
  // --- Başlık ve Geri Butonu ---
  headerContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  backButton: {
    position: 'absolute', // Başlığa göre konumlandır
    left: 0,
    padding: wp('2%'),
  },
  backButtonText: {
    fontSize: wp('7%'),
    color: COLORS.textPrimary,
  },
  header: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  // --- Kart Stili ---
  card: {
    width: wp('90%'),
    padding: wp('4%'),
    borderRadius: 20,
    marginBottom: hp('1.8%'),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
    backgroundColor: COLORS.white,
  },
  // --- Tarih Seçici ---
  dateText: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: COLORS.primary,
    paddingVertical: hp('1.2%'),
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    textAlign: 'center',
  },
  // --- Input ve Etiket Stilleri ---
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.2%'),
  },
  icon: {
    fontSize: wp('4.5%'),
    marginRight: wp('2%'),
  },
  label: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // --- Artı/Eksi Butonları ---
  controlButton: {
    width: wp('12%'),
    height: wp('12%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
  },
  controlButtonText: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  input: {
    width: wp('38%'),
    height: hp('6%'),
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
    backgroundColor: COLORS.white,
    fontSize: wp('4.5%'),
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: wp('4%'),
    color: COLORS.textSecondary,
    fontWeight: '500',
    width: wp('15%'),
    textAlign: 'right',
  },
  // --- Ana Buton ---
  actionButton: {
    width: wp('85%'),
    height: hp('7%'),
    borderRadius: 999,
    marginTop: hp('2%'),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  actionButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
  buttonText: {
    fontSize: wp('5%'),
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default styles;