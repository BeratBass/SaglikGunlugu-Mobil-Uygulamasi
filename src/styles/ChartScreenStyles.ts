
import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: wp('5%'),
    paddingBottom: hp('12%'),
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  headerContainer: {
    marginBottom: hp('3%'),
    paddingTop: hp('4%'),
  },
  title: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  infoText: {
    fontSize: wp('4.5%'),
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  selectorContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: wp('1.5%'),
    marginBottom: hp('3%'),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 4,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
  },
  pickerIcon: {
    fontSize: wp('5%'),
    marginRight: wp('2%'),
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: wp('1%'),
  },
  button: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
  },
  buttonActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: COLORS.primary,
  },
  chartCard: {
    borderRadius: 24,
    marginTop: hp('2%'),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  chartGradient: {
    padding: wp('4%'),
    paddingTop: hp('2.5%'),
  },
  chartTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
});

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: wp('4.2%'),
    paddingVertical: hp('1.5%'),
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  inputAndroid: {
    fontSize: wp('4.2%'),
    paddingVertical: hp('1.5%'),
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  iconContainer: {
    top: hp('1.5%'),
    right: wp('2%'),
  },
  viewContainer: {
    borderWidth: 0,
  },
});

export default styles;