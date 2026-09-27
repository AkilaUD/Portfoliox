import { SelectedBuilds } from '../components/builds/SelectedBuilds'
import { Divider } from '../components/common/Divider'
import { OpenChannel } from '../components/contact/OpenChannel'
import { CareerTrace } from '../components/experience/CareerTrace'
import { Hero } from '../components/hero/Hero'
import { Intro } from '../components/motion/Intro'
import { StackMarquee } from '../components/motion/StackMarquee'
import { CaseIndex } from '../components/projects/CaseIndex'
import { EFinancialsCase } from '../components/projects/EFinancialsCase'
import { FirstMicroCase } from '../components/projects/FirstMicroCase'
import { VDeployCase } from '../components/projects/VDeployCase'
import { EducationFocus } from '../components/signals/EducationFocus'
import { EngineeringSignature } from '../components/signals/EngineeringSignature'
import { EvidenceWall } from '../components/signals/EvidenceWall'
import { ProductionSignals } from '../components/signals/ProductionSignals'
import { TechMap } from '../components/systems/TechMap'
import { sections } from '../data/navigation'
import { SiteShell } from './SiteShell'

export default function App() {
  return (
    <SiteShell sections={sections} overlay={<Intro />}>
      <Hero />
      <EngineeringSignature />
      <Divider index="02" />
      <ProductionSignals />
      <StackMarquee />
      <CareerTrace />
      <CaseIndex />
      <FirstMicroCase />
      <EFinancialsCase />
      <SelectedBuilds />
      <TechMap />
      <Divider index="07" />
      <EvidenceWall />
      <Divider index="08" note="Origin" />
      <VDeployCase />
      <Divider index="09" />
      <EducationFocus />
      <Divider index="10" />
      <OpenChannel />
    </SiteShell>
  )
}
