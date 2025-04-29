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
    //   console.log('here from setFormRedux payload = ', action.payload);
    //   console.log('here from setFormRedux value = ', state.value);
      
    },
    resetForm: (state) => {
      state.value = {
        formId: generateUniqueId(),
        sections: [],
      };
    },
  },
});

export const { setFormRedux, resetForm} = formSlice.actions;
export default formSlice.reducer;