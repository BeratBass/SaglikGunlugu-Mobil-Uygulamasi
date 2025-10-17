
import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  // --- Ana Kapsayıcılar ---
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  centeredText: {
    fontSize: wp('4.5%'),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: hp('3%'),
  },
  // --- Başlık ---
  headerContainer: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('6%'), 
    paddingBottom: hp('4%'),
  },
  title: {
    fontSize: wp('7.5%'), 
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: wp('3.8%'), 
    color: COLORS.textSecondary,
    marginTop: hp('0.5%'),
  },
  // --- Liste ---
  scrollContainer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('15%'),
  },
  // --- Kart Tasarımı ---
  card: {
    borderRadius: 20, 
    marginBottom: hp('2%'), 
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: wp('4.5%'), 
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  cardHeaderText: {
    fontSize: wp('4.5%'), 
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: wp('2%'),
    borderRadius: 12,
    width: wp('9%'),
    height: wp('9%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonEmoji: {
    fontSize: wp('4.5%'), 
  },
  // --- Bilgi Satırları ---
  cardContent: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.1%'), 
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  icon: {
    fontSize: wp('5%'), 
    marginRight: wp('3.5%'),
  },
  label: {
    fontSize: wp('3.8%'), 
    color: COLORS.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: wp('4%'), 
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});

export default styles;