import axios from "axios"; 

axios.defaults.baseURL = "http://localhost:5000"; 
 
// Optionally, set other defaults like timeout 
axios.defaults.timeout = 10000; // 10 seconds 
 
export default axios;