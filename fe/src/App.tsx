import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserPage from './components/UserPage';

export default function App() {
  return <MantineProvider defaultColorScheme='dark'>
    <Router>
      <Routes>
        <Route path="/" element={<UserPage />}></Route>
      </Routes>
    </Router>
  </MantineProvider>
}
