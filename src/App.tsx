import { Route, Routes } from 'react-router-dom';
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
import { AdminIngestPage } from './pages/AdminIngestPage';
import { EvidenceIngestPage } from './pages/EvidenceIngestPage';
import { ReconstructionPage } from './pages/ReconstructionPage';
import { ReconstructionJobsPage } from './pages/ReconstructionJobsPage';

export default function App() {
  return <Routes><Route element={<AppLayout />}><Route index element={<HomePage />} /><Route path="scan" element={<ScanPage />} /><Route path="explore" element={<ExplorePage />} /><Route path="map" element={<MapPage />} /><Route path="discoveries" element={<DiscoveriesPage />} /><Route path="profile" element={<ProfilePage />} /><Route path="search" element={<SearchPage />} /><Route path="entity/:id" element={<EntityPage />} /><Route path="timeline/:id" element={<TimelinePage />} /><Route path="reconstruction/:id" element={<ReconstructionPage />} /><Route path="admin/reconstruction-jobs" element={<ReconstructionJobsPage />} /><Route path="admin/ingest" element={<AdminIngestPage />} /><Route path="admin/evidence" element={<EvidenceIngestPage />} /></Route></Routes>;
}
