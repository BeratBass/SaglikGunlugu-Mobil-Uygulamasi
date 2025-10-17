import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', 
  },
  welcomeText: {
    fontSize: wp('8%'),
    fontWeight: '600', 
    color: COLORS.white,
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  logo: {
    width: wp('50%'),
    height: wp('50%'),
  },
});

export default styles;