import axios from "axios";
import { FormContent } from "../NavbarButtons/type.ts";
import { sendQuestion } from "./questions.tsx";
import { sendValues } from "./values.tsx";
import { sendSection } from "./sections.tsx";

export function sendToDB(form: FormContent) {
  try {
    // connect to the DB
    // console.log('send to DB is good');
    
    sendSection(form.sections);
    // sendQuestion(sectionContent.questions ?? []);

    // there is multiple question, so i can't send sectionContent.questions.values
    // i have to send values for specific question index
    // sendValues(sectionContent.questions ?? []) ;
  } catch (error) {
    console.log('error at sendToDB');
    
  }
}
