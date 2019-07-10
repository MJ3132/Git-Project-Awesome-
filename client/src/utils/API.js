require('dotenv').config()
const axios = require('axios')
const api = {
    createProject: (userInput) => {
            return axios.post('/projects/create', userInput);
    },

    getdbProjects: () => {
        return axios.get('/projects/everything')
    },

    getUserProjects: (userId) => {
        return axios.get(`/projects/all/${userId}`)
    },

    // getUserObject: () => {
    //     return axios.get('/users/user-object')
    // },

    collabProject: (gigster) => {
        return axios.post('/collaborators/collab-pending', gigster)
    }, 

    collabedProjects: (gigsterId) => {
        return axios.get(`/collaborators/collab/all/${gigsterId}`)
    }, 

    approveProject: (gigsterId)  =>
    {
        return axios.post(`/collaborators/collab-approval/${gigsterId}`);
    }, 

    deleteProject: (projectId) => {
        return axios.delete(`/projects/delete/${projectId}`);
    },

    updateProject: (updatedProject) => {
        return axios.put('/projects/update', updatedProject)
    }
}

export default api
