import { CircularProgress } from "@mui/material";

export interface ILoaderProps {
  className?: string;
  color?: "primary" | "secondary" | "inherit";
  size?: number;
  thickness?: number;
}

const Loader: React.FC = ({
  className = "",
  color = "primary",
  thickness = 2,
  size = 50,
}: ILoaderProps) => {
  return (
    <>
      <div id="loaderForAPICall" className="loaderHide">
        <div className={`preloader ${className} fullscreen`}>
          <CircularProgress
            className="main-loader"
            color={color}
            thickness={thickness}
            size={size}
          />
        </div>
      </div>
      <div id="loaderForBatchAPICall" className="loaderHide">
        <div className={`preloader ${className} fullscreen`}>
          <CircularProgress
            className="main-loader"
            color={color}
            thickness={thickness}
            size={size}
          />
        </div>
      </div>
    </>
  );
};

export default Loader;
