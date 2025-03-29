import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';

// Register the app with both methods for maximum compatibility
AppRegistry.registerComponent('main', () => App);
registerRootComponent(App); 