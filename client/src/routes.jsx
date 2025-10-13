import Home from "./Home";
import KnottingUnknottingGame from "./KnottingUnknottingGame";
import MosaicMaker from "./MosaicMaker";

const routes = [
    {path: "/", element: <Home />},
    {path: "/mosaic-maker", element: <MosaicMaker />},
    {path: "/knotting", element: <KnottingUnknottingGame />},
];

export default routes;
