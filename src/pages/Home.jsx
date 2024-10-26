import PaintingsSection from "../components/PaintingsSection";
import ProjectSlider from "../components/ProjectSlider";
import HeroSection from "../components/HeroSection";
import ColumnSection from "../components/ColumnSection";

const Home = () => {
    return (
        <div>
            <ProjectSlider />
            <HeroSection />
            <PaintingsSection />
            <ColumnSection />
        </div>
    );
};

export default Home;
