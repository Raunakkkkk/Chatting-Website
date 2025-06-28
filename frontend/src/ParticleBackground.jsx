import React from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useLocation } from "react-router-dom";
import { useTheme } from "./Context/themeProvider";

const ParticleBackground = () => {
  const [init, setInit] = React.useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { theme } = useTheme();

  React.useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  // Don't render particles on the chat page
  if (!isHomePage) return null;

  // Define colors based on theme
  const particleColor =
    theme === "dark" ? "rgba(147, 197, 253, 0.6)" : "rgba(66, 153, 225, 0.6)";
  const linkColor =
    theme === "dark" ? "rgba(147, 197, 253, 0.3)" : "rgba(66, 153, 225, 0.3)";

  return (
    init && (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
                parallax: { enable: true, force: 60, smooth: 10 },
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
            parallax: { enable: true, force: 60, smooth: 10 },
          },
          particles: {
            color: {
              value: particleColor,
            },
            links: {
              color: linkColor,
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60, // Reduced number of particles
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 2, max: 5 }, // Slightly smaller particles
            },
          },
          detectRetina: true,
        }}
      />
    )
  );
};

export default ParticleBackground;
