import { NavigatorScreenParams } from '@react-navigation/native';
import { ROUTES } from '../constants/routes';

export interface Log {
  id: string;
  date: string;
  weight: number;
  sleep: number;
  water: number;
  steps: number;
  calories: number;
  userId: string;
  createdAt?: string;
}

export type TabParamList = {
  [ROUTES.DAILY_LOG]: undefined;
  [ROUTES.HEALTH_TRACKER]: undefined;
  [ROUTES.CHART_SCREEN]: undefined;
  [ROUTES.PROFILE_SCREEN]: undefined;
};

export type RootStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.CREATE]: undefined;
  [ROUTES.INFORMATION]: undefined;
  [ROUTES.TAB_NAVIGATOR]: NavigatorScreenParams<TabParamList>; 
  [ROUTES.EDIT_LOG]: { log: Log };
  [ROUTES.UPDATE_PROFILE]: undefined;
  Auth: undefined; 
};