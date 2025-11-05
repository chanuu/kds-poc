import KDSDashboard from './components/KDSDashboard';
import { KDSProvider } from './contexts/KDSContext';

function App() {
  const STATION_ID = '32345678-1234-1234-1234-123456789abc';
  const STATION_NAME = 'Indian Kitchen';

  return (
    <KDSProvider stationId={STATION_ID}>
      <div className="App">
        <KDSDashboard stationName={STATION_NAME} />
      </div>
    </KDSProvider>
  );
}

export default App;