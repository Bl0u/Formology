import "./ToggleSwitch.css";
import { isRequired } from "../state/Form/FormSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store"; // Replace with your actual RootState type

interface ToggleSwitchProps {
  label: string;
  questionId: string;
}

const ToggleSwitch = ({ label, questionId }: ToggleSwitchProps) => {
  const dispatch = useDispatch();

  // Get the current "required" state for the question from Redux
  const isChecked = useSelector((state: RootState) =>
    state.form.value.sections.some((section) =>
      section.questions?.some(
        (question) => question.questionId === questionId && question.required === 1
      )
    )
  );

  return (
    <div className="container">
      <div className="toggle-switch">
        <input
          type="checkbox"
          className="checkbox"
          name={label}
          id={questionId}
        />
        <label className="label" htmlFor={questionId}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
      <label
        className="requiredToggle"
        style={{
          color: "black",
        }}
      >
        Required |
      </label>
    </div>
  );
};

export default ToggleSwitch;