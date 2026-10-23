import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing.jsx';
import MembersPage from './components/MembersPage.jsx';
import SurveyPage from './components/SurveyPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/join" element={<SurveyPage />} />
        <Route path="/join/:code" element={<SurveyPage />} />
        <Route path="/answers/:code" element={<MembersPage />} />
      </Routes>
    </BrowserRouter>
  );
}
