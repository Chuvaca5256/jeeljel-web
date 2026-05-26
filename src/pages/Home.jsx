import Hero from '../components/Hero'
import Stats from '../components/Stats'
import AppsGrid from '../components/AppsGrid'
import WorldCup from '../components/WorldCup'
import Mission from '../components/Mission'
import Organizations from '../components/Organizations'
import QuetzalDivider from '../components/QuetzalDivider'

export default function Home() {
  return (
    <>
      <Hero />
      <QuetzalDivider />
      <Stats />
      <QuetzalDivider />
      <AppsGrid />
      <QuetzalDivider />
      <WorldCup />
      <QuetzalDivider />
      <Mission />
      <QuetzalDivider />
      <Organizations />
    </>
  )
}
