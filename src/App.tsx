import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DiscoveriesPage } from './pages/DiscoveriesPage';
import { EntityPage } from './pages/EntityPage';
import { ExplorePage } from './pages/ExplorePage';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { ProfilePage } from './pages/ProfilePage';
import { ScanPage } from './pages/ScanPage';
import { SearchPage } from './pages/SearchPage';
import { TimelinePage } from './pages/TimelinePage';
import { ReconstructionPage } from './pages/ReconstructionPage';

export default function App() {
  return <Routes><Route element={<AppLayout />}><Route index element={<HomePage />} /><Route path="scan" element={<ScanPage />} /><Route path="explore" element={<ExplorePage />} /><Route path="map" element={<MapPage />} /><Route path="discoveries" element={<DiscoveriesPage />} /><Route path="profile" element={<ProfilePage />} /><Route path="search" element={<SearchPage />} /><Route path="entity/:id" element={<EntityPage />} /><Route path="timeline/:id" element={<TimelinePage />} /><Route path="reconstruction/:id" element={<ReconstructionPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>;
}
