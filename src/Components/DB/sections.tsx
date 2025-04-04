import axios from 'axios';
import { SectionContent } from "../../App";

export async function sendSection(sectionContent: SectionContent) {
    // console.log('hey from sendSection');
    // console.log('sectionContent =', sectionContent);

    try {
        const response = await axios.post("http://localhost/Form/sections.php", sectionContent);
        console.log('Server response:', response.data);
    } catch (error) {
        console.error('Axios POST error:', error);
    }
}
