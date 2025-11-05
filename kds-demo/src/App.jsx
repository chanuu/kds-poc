import KDSDashboard from './components/KDSDashboard';

function App() {
  const STATION_ID = 'station_ghi789';
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