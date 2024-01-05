/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {AppState, Appearance} from 'react-native';

import MainNavigator from './src/navigator/main';
import {SWRConfig} from 'swr';

function App(): React.JSX.Element {
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => {
          return true;
        },
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState: typeof appState) => {
            if (
              appState.match(/inactive|background/) &&
              nextAppState === 'active'
            ) {
              callback();
            }
            appState = nextAppState;
          };

          const subscription = AppState.addEventListener(
            'change',
            onAppStateChange,
          );

          return () => {
            subscription.remove();
          };
        },
      }}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </SWRConfig>
  );
}

export default App;
