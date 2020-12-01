import React, { useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Animated from 'react-native-reanimated';
import Dashboard from './Dashboard';
import LandingScreen from './LandingScreen';
import AccountsPage from './AccountsPage';
import Aggregatorselect from './aggregatorselect';
import AccountsSubPage from './AccountsSubPage';
import AccountStatementPage from './AccountStatementPage';
import AccountStatementDetails from './AccountStatementDetails';

import { useDispatch } from 'react-redux';
import { AppConfigActions } from './redux/actions';
import AccountSubStmtPage from './AccountSubStmtPage';
import TransactionPage from './TransactionPage';
import Categories from './Categories';
import SplitTransactionPage from './SplitTransactionPage';
import UncategorizedTransactionPage from './UncategorizedTransactionPage';
import IncomeAndExpensePage from './IncomeAndExpensePage';
import MainExpensePage from './MainExpensePage';
import PromotionsPage from './PromotionsPage';
import MainIncomePage from './MainIncomePage';
import BudgetPage from './BudgetPage';
import SubBudgetPage from './SubBudgetPage';
import BudgetCreatePage from './BudgetCreatePage';
import GoalsPage from './GoalsPage';
import GoalStatementPage from './GoalStatementPage';
import CreateAndEditGoals from './CreateAndEditGoals';
import SuccessPage from './SuccessPage';
import FincastPage from './FincastPage';
import LoginPage from './LoginPage';
import App from './App';
import AddPeoplePage from './AddPeoplePage';
import LinkedPeoplePage from './LinkedPeoplePage';
import AttachmentsPage from './AttachmentsPage';
import SaveMapLocation from './SaveMapLocation';
import UserProfilePage from './UserProfilePage';
import RequestFundsPage from './RequestFundsPage';
import MemoriesPage from './MemoriesPage';
import BankAndTransactionHistoryPage from './HistoryPage';
import LocationHistoryPage from './LocationHistoryPage';
import SpentHistoryPage from './SpentHistoryPage';
import MyBadges from './MyBadges';
import LeaderBoard from './LeaderBoard';
import ScrollTest from './ScrollTest';
import SingleAccountPage from './SingleAccountPage';
const Stack = createStackNavigator();

export default ({ navigation, style }) => {
  const dispatch = useDispatch();
  const options = {
    headerLeft: () => (
      <TouchableOpacity onPress={navigation.openDrawer}>
        <Text style={{ margin: 8 }}> Left </Text>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => dispatch(AppConfigActions.toggleRightDrawer())}>
        <Text style={{ margin: 8 }}> Right </Text>
      </TouchableOpacity>
    ),
  };
  return (
    <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* <Stack.Screen name=" " component={ScrollTest} /> */}
        <Stack.Screen name=" " component={LoginPage} />
        <Stack.Screen name="landingPage" component={LandingScreen} />
        <Stack.Screen name="aggregator" component={Aggregatorselect} />
        <Stack.Screen name="dashboard" component={Dashboard} />
        <Stack.Screen name="accounts" component={AccountsPage} />
        <Stack.Screen name="accountSubPage" component={AccountsSubPage} />
        <Stack.Screen
          name="accountStatementPage"
          component={AccountStatementPage}
        />
        <Stack.Screen
          name="accountStmtDetails"
          component={AccountStatementDetails}
        />
        <Stack.Screen
          name="accountSubStmtPage"
          component={AccountSubStmtPage}
        />
        <Stack.Screen name="transactionPage" component={TransactionPage} />
        <Stack.Screen name="categoriesPage" component={Categories} />
        <Stack.Screen name="splitPage" component={SplitTransactionPage} />
        <Stack.Screen
          name="incomeExpensePage"
          component={IncomeAndExpensePage}
        />
        <Stack.Screen
          name="uncategorizedTransaction"
          component={UncategorizedTransactionPage}
        />
        <Stack.Screen name="mainExpensePage" component={MainExpensePage} />
        <Stack.Screen name="promotionsPage" component={PromotionsPage} />
        <Stack.Screen name="mainIncomePage" component={MainIncomePage} />
        <Stack.Screen name="budgetPage" component={BudgetPage} />
        <Stack.Screen name="subBudgetPage" component={SubBudgetPage} />
        <Stack.Screen name="budgetCreatePage" component={BudgetCreatePage} />
        <Stack.Screen name="goalsPage" component={GoalsPage} />
        <Stack.Screen name="goalStatementPage" component={GoalStatementPage} />
        <Stack.Screen
          name="createAndEditGoals"
          component={CreateAndEditGoals}
        />
        <Stack.Screen name="successPage" component={SuccessPage} />
        <Stack.Screen name="fincastPage" component={FincastPage} />
        <Stack.Screen name="addPeople" component={AddPeoplePage} />
        <Stack.Screen name="linkedPeople" component={LinkedPeoplePage} />
        <Stack.Screen name="attachmentsPage" component={AttachmentsPage} />
        <Stack.Screen name="saveMaps" component={SaveMapLocation} />
        <Stack.Screen name="userProfile" component={UserProfilePage} />
        <Stack.Screen name="requestFunds" component={RequestFundsPage} />
        <Stack.Screen name="memories" component={MemoriesPage} />
        <Stack.Screen name="singleAccountPage" component={SingleAccountPage} />
        <Stack.Screen
          name="bankAndTransactionHistory"
          component={BankAndTransactionHistoryPage}
        />
        <Stack.Screen name="locationHistory" component={LocationHistoryPage} />
        <Stack.Screen name="spentHistory" component={SpentHistoryPage} />
        {/* <Stack.Screen name="offlineNotice" component={OfflineNotice}/> */}
        <Stack.Screen name="myBadges" component={MyBadges} />
        <Stack.Screen name="leaderBoard" component={LeaderBoard} />
      </Stack.Navigator>
    </Animated.View>
  );
};
