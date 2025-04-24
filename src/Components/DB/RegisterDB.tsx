import axios from "axios";
import { RegisterInformation } from "../NavbarButtons/type";


export default function sendRegisterInfoToDB(registerationInformationObject: RegisterInformation) {
    console.log('server says its okay');
    console.log(registerationInformationObject.userId);
    console.log(registerationInformationObject.fullName);
    console.log(registerationInformationObject.email);
    console.log(registerationInformationObject.pwd);

    axios.post('http://localhost:80/Form/registerDB.php', registerationInformationObject) ;
}