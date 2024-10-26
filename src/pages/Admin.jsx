import ArchivedExhibitionsManager from "../components/ArchivedExhibitionsManager"
import PaintingsManager from "../components/PaintingsManager"
import ProjectsManager from "../components/ProjectsManager"
import SplashManager from "../components/SplashManager"
import ExhibitionImageCarouselManager from "../components/ExhibitionImageCarouselManager"

const Admin = () => {
  return (
    <div>
      <SplashManager />
      <ProjectsManager />
      <PaintingsManager />
      <ArchivedExhibitionsManager />
      <ExhibitionImageCarouselManager />
    </div>
  )
}

export default Admin;