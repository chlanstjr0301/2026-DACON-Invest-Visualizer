import { useAppStore } from './store/appStore';
import StatusBar from './components/StatusBar';
import UploadScreen from './screens/UploadScreen';
import ColumnMappingScreen from './screens/ColumnMappingScreen';
import GoalInputScreen from './screens/GoalInputScreen';
import SufficiencyScreen from './screens/SufficiencyScreen';
import DashboardScreen from './screens/DashboardScreen';

export default function App() {
  const step = useAppStore((s) => s.step);

  return (
    <div className="min-h-screen bg-gray-50">
      {step > 1 && <StatusBar />}
      {step === 1 && <UploadScreen />}
      {step === 2 && <ColumnMappingScreen />}
      {step === 3 && <GoalInputScreen />}
      {step === 4 && <SufficiencyScreen />}
      {step === 5 && <DashboardScreen />}
    </div>
  );
}
