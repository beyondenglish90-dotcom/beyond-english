import Hero from '../components/home/Hero'
import FeatureHighlights from '../components/home/FeatureHighlights'
import ProgramsPreview from '../components/home/ProgramsPreview'
import InstructorTeaser from '../components/home/InstructorTeaser'
import NoticesTeaser from '../components/home/NoticesTeaser'
import CtaBand from '../components/home/CtaBand'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureHighlights />
      <ProgramsPreview />
      <InstructorTeaser />
      <NoticesTeaser />
      <CtaBand />
    </>
  )
}
