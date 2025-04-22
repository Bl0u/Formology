
import "./ToggleSwitch.css";
interface ToggleSwitchProps {
  label: string;
  questionId: string;
}
const ToggleSwitch = ({ label, questionId }: ToggleSwitchProps) => {
// console.log(questionId);

  return (
    <div className="container">
      {/* {label}{" "} */}
      <div className="toggle-switch">
        <input type="checkbox" className="checkbox" 
               name={label} id={questionId} />
        <label className="label" htmlFor={questionId}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
      <label className="requiredToggle" style={{
          color: "black"
        }}>
        Required |
        </label>
    </div>
  );
};

export default ToggleSwitch;
