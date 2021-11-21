import React from "react";
import ExperienceCard from "../../components/experienceCard/ExperienceCard.js";
import "./ExperienceAccordion.css";
import { Accordion, Panel } from "baseui/accordion";
import { DarkTheme, LightTheme, ThemeProvider } from "baseui";

function ExperienceAccordion(props) {
  const theme = props.theme;

  return (
    <div style={{ alignSelf: "center" }}>
      <ThemeProvider theme={theme.name === "light" ? LightTheme : DarkTheme}>
        {props.sections.map((section) => {
          return (
            <>
              {section["experiences"].map((experience) => {
                return <ExperienceCard experience={experience} theme={theme} />;
              })}
            </>
          );
        })}
      </ThemeProvider>
    </div>
  );
}

export default ExperienceAccordion;
