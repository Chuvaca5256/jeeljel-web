import Hero from '../components/Hero'
import Stats from '../components/Stats'
import AppsGrid from '../components/AppsGrid'
import WorldCup from '../components/WorldCup'
import Mission from '../components/Mission'
import Organizations from '../components/Organizations'
import Divider from '../components/Divider'

export default function Home() {
  return (
    <>
      <Hero />
      <Divider />
      <Stats />
      <Divider />
      <AppsGrid />
      <Divider />
      <WorldCup />
      <Divider />
      <Mission />
      <Divider />
      <Organizations />
    </>
  )
}
