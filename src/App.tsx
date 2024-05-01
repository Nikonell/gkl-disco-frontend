import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { GradientBackground } from './components/GradientBackground/GradientBackground'
import { SongRequestScreen } from './screens/SongRequest/SongRequest'
import { Toaster } from './components/ui/toaster'

function App() {
	return (
		<>
			<GradientBackground />
			<BrowserRouter>
				<Routes>
					<Route path="/*" element={<SongRequestScreen />} />
				</Routes>
			</BrowserRouter>
			<Toaster />
		</>
	)
}

export default App
