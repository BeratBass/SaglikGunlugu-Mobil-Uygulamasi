import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  heading: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: hp('3%'),
    textAlign: 'center',
    paddingHorizontal: wp('5%'),
  },
  icon: {
    width: wp('30%'),
    height: wp('30%'),
    marginBottom: hp('3%'),
  },
  input: {
    width: wp('85%'),
    padding: hp('2%'),
    marginVertical: hp('1%'),
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    fontSize: wp('4%'),
  },
  forgotPasswordText: {
    fontSize: wp('4%'),
    color: COLORS.primary,
    marginTop: hp('1%'),
    textDecorationLine: 'underline',
  },
  loginButton: {
    width: wp('85%'),
    padding: hp('2%'),
    backgroundColor: COLORS.black,
    borderRadius: 10,
    marginTop: hp('3%'),
    alignItems: 'center',
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  googleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginTop: hp('2%'),
    elevation: 3,
  },
  googleLogo: {
    width: wp('6%'),
    height: wp('6%'),
  },
  continueText: {
    fontSize: wp('4%'),
    marginTop: hp('2%'),
    color: COLORS.textPrimary,
  },
  registerButton: {
    marginTop: hp('2%'),
    backgroundColor: COLORS.black,
    padding: hp('2%'),
    width: wp('85%'),
    alignItems: 'center',
    borderRadius: 10,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
});

export default styles; 