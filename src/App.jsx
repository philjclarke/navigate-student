import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import NextShell from './next/components/Shell'
import NextFeed from './next/pages/Feed'
import NextStart from './next/pages/Start'
import NextExplore from './next/pages/Explore'
import NextSaved from './next/pages/Saved'
import NextMe from './next/pages/Me'
import NextCourse from './next/pages/Course'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Timeline from './pages/Timeline'
import Skills from './pages/Skills'
import Placements from './pages/Placements'
import Opportunities from './pages/Opportunities'
import Targets from './pages/Targets'
import Future from './pages/Future'
import CareersBank from './pages/CareersBank'
import SubjectDetail from './pages/SubjectDetail'
import CareerDetail from './pages/CareerDetail'
import ExploreSection from './pages/ExploreSection'
import Universities from './pages/Universities'
import UniversityResults from './pages/UniversityResults'
import InstitutionDetail from './pages/InstitutionDetail'
import UniversityShortlist from './pages/UniversityShortlist'
import UniversityApplications from './pages/UniversityApplications'
import Profile from './pages/Profile'
import DigitalCv from './pages/DigitalCv'
import SponsoredContent from './pages/SponsoredContent'
import SponsoredLog from './pages/SponsoredLog'

export default function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/placements" element={<Placements />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/targets" element={<Targets />} />
        <Route path="/future" element={<Future />} />
        <Route path="/future/careers-bank" element={<CareersBank />} />
        <Route path="/future/subject/:subject" element={<SubjectDetail />} />
        <Route path="/future/career/:slug" element={<CareerDetail />} />
        <Route path="/future/explore/:key" element={<ExploreSection />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/universities/matches" element={<UniversityResults />} />
        <Route path="/universities/shortlist" element={<UniversityShortlist />} />
        <Route path="/universities/applications" element={<UniversityApplications />} />
        <Route path="/universities/institution/:name" element={<InstitutionDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/digital-cv" element={<DigitalCv />} />
        <Route path="/sponsored/log" element={<SponsoredLog />} />
        <Route path="/sponsored/:id" element={<SponsoredContent />} />
      </Route>
      <Route path="/next" element={<NextShell />}>
        <Route index element={<NextFeed />} />
        <Route path="start" element={<NextStart />} />
        <Route path="explore" element={<NextExplore />} />
        <Route path="shortlist" element={<NextSaved />} />
        <Route path="me" element={<NextMe />} />
        <Route path="course/:key" element={<NextCourse />} />
      </Route>
    </Routes>
    </>
  )
}
