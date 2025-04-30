import { createSlice } from "@reduxjs/toolkit";
import { FormContent, generateUniqueId } from "../../NavbarButtons/type";

interface FormState {
  value: FormContent;
}

const initialState: FormState = {
  value: {
    formId: generateUniqueId(), // Or generate a unique ID if needed
    sections: [],
  },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormRedux: (state, action) => {
      state.value = action.payload;
    },
    resetForm: (state) => {
      console.log('reseted');
      
      state.value = {
        formId: generateUniqueId(),
        sections: [],
      };
    },
    isRequired: (state, action) => {
      state.value.sections = state.value.sections.map((section) => ({
        ...section,
        questions: section.questions?.map((question) =>
          question.questionId === action.payload
            ? { ...question, required: question.required === 1 ? 0 : 1 } // Toggle logic
            : question
        ),
      }));
      console.log("here from required = ", action.payload);
    },
  },
});

export const { setFormRedux, resetForm, isRequired } = formSlice.actions;
export default formSlice.reducer;