import axios from "axios";
const baseUrl = 'http://localhost:3002'

class User{
    create(formData){
        const url= baseUrl+'/api/create-user';
        const config ={
            headers:{
                'Content-Type':'multipart/form-data'
            }
        };
        return axios.post(url, formData, config);
    }
    getUser(){
        const url = baseUrl+'/api/get-users';
        return axios.get(url); 
    }
    loginUser(formData){
        // console.log(formData);
        const url = baseUrl+'/api/login';
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        return axios.post(url, formData, config)
    }
    getTasks(loggerData){
        const url = baseUrl+'/api/get-tasks';
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        return axios.post(url, loggerData,config);
    }
    getUserById(userId){
        const url = baseUrl+'/api/get-userbyid';
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        return axios.post(url, userId, config);
    }
    addSelfTask(access_token, data){
        const url = baseUrl+'/api/add-self-task';
        const config = {
            headers: {
                'Content-Type':'application/json',
                'authorization':`Bearer ${access_token}`
            }
        }
        return axios.post(url, data, config);
    }
    finishSelfTask(access_token, data){
        const url = baseUrl+'/api/delete-self-task';
        const config = {
            headers:{
                'Content-Type':'application/json',
                'authorization':`Bearer ${access_token}`
            }
        }
        return axios.post(url, data, config);
    }
    addAssignedTask(access_token, data){
        const url = baseUrl+'/api/add-assigned-task';
        const config = {
            headers:{
                'Content-Type':'application/json',
                'authorization':`Bearer ${access_token}`
            }
        }
        return axios.post(url, data, config);
    }
    getRequests(data){
        const url = baseUrl+'/api/get-requests';
        const config = {
            headers:{
                'Content-Type':'application/json',
            }
        }
        return axios.post(url, data, config);
    }
    getAllRequests(access_token){
        const url = baseUrl+'/api/get-all-requests';
        const config = {
            headers:{
                'authorization': `Bearer ${access_token}`
            }
        };
        return axios.post(url,{}, config);
    }
    makeRequest(data){
        const url = baseUrl + '/api/make-request';
        const config = {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        };
        return axios.post(url, data, config);
    }
    deleteRequest(access_token, data){
        const url = baseUrl+'/api/delete-request';
        const config = {
            headers:{
                'Content-Type':'application/json',
                'authorization':`Bearer ${access_token}`
            }
        };
        return axios.post(url, data, config);
    }
    approveRequest(access_token, data){
        const url = baseUrl+'/api/approve-request';
        const config = {
            headers:{
                'Content-Type':'application/json',
                'authorization':`Bearer ${access_token}`
            }
        };
        return axios.post(url, data, config);
    }
    createBroadcast(access_token, data){
        const url= baseUrl+'/api/create-broadcast';
        const config = {
            headers:{
                'Content-Type':'application/json',
                'authorization':`Bearer ${access_token}`
            }
        };
        return axios.post(url, data, config);
    }
    getBroadcasts(access_token){
        const url = baseUrl+"/api/get-broadcast";
        const config = {
            headers:{
                'authorization':`Bearer ${access_token}`
            }
        }
        return axios.get(url, config);
    }
    deleteBroadcast(access_token, data){
        const url = baseUrl+'/api/delete-broadcast';
        const config = {
            headers:{
                'authorization':`Bearer ${access_token}`
            }
        };
        return axios.post(url, data, config);
    }
}

export default new User();