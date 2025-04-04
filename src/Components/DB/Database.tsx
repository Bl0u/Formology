import axios from "axios";
import { SectionContent } from "../../App.tsx";
import { sendQuestion } from "./questions.tsx";
import { sendValues } from "./values.tsx";
import { sendSection } from "./sections.tsx";

export function sendToDB(sectionContent: SectionContent) {
  try {
    // connect to the DB
    // console.log('send to DB is good');
    
    sendSection(sectionContent);
    // sendQuestion(sectionContent.questions ?? []);

    // there is multiple question, so i can't send sectionContent.questions.values
    // i have to send values for specific question index
    // sendValues(sectionContent.questions ?? []) ;
  } catch (error) {
    console.log('error at sendToDB');
    
  }
}
