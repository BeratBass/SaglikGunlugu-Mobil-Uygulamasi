// ProfileScreenStyles.ts

import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  // --- Kapsayıcılar ---
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: wp('5%'),
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  // --- Header ve Profil Resmi ---
  headerContainer: {
    alignItems: 'center',
    marginBottom: hp('5%'),
    paddingTop: hp('4%'),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: hp('2%'),
  },
  profileImage: {
    width: wp('28%'),
    height: wp('28%'),
    borderRadius: wp('14%'),
    borderWidth: 4,
    borderColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  displayName: {
    fontSize: wp('6.5%'),
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  username: {
    fontSize: wp('4%'),
    color: COLORS.textSecondary,
    marginTop: hp('0.5%'),
  },
  // --- Bölüm Başlıkları ---
  sectionTitle: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: hp('1.5%'),
    paddingHorizontal: wp('2%'),
  },
  // --- Menü Öğeleri ---
  menuContainer: {
    marginBottom: hp('4%'),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  menuItemIconContainer: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4%'),
    marginTop: hp('0.5%'),
  },
  menuItemText: {
    fontSize: wp('4%'),
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
    lineHeight: hp('3%'),
  },
  menuItemValue: {
    fontSize: wp('3.8%'),
    color: COLORS.textSecondary,
    fontWeight: '400',
    flexShrink: 1,
    textAlign: 'right',
    lineHeight: hp('3%'),
  },
  signOutText: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
});

export default styles;