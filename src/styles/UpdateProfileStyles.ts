// UpdateProfileStyles.ts

import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLORS } from '../constants/colors';

export default StyleSheet.create({
  // --- Ana Kapsayıcılar ---
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: wp('5%'),
    paddingBottom: hp('15%'),
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  
  // --- Başlık ---
  title: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: hp('4%'),
    textAlign: 'center',
  },

  // --- Input Alanları ---
  inputContainer: {
    marginBottom: hp('2.5%'),
  },
  label: {
    fontSize: wp('4%'),
    color: COLORS.textSecondary,
    marginBottom: hp('1%'),
    fontWeight: '500',
    paddingLeft: wp('2%'),
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 16,
    paddingHorizontal: wp('4%'),
  },
  icon: {
    marginRight: wp('3%'),
  },
  input: {
    flex: 1,
    height: hp('7%'),
    fontSize: wp('4%'),
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: hp('15%'),
    textAlignVertical: 'top',
    paddingVertical: hp('2%'), 
  },

  // --- Buton ---
  button: {
    height: hp('7%'),
    borderRadius: 999, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
});