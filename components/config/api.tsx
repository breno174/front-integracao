import axios from 'axios';

const backendUrl = 'http://127.0.0.1:5000';
axios.defaults.baseURL = backendUrl;
axios.create({
  baseURL: backendUrl,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export default axios;
// export const uploadFile = async (file: File, userId: string) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('user_id', userId);
    
//     try {
//         const response = await axios.post('/', formData);
//         return response.data;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//         throw new Error(error.response?.data.message || 'Erro ao enviar o arquivo');
//         } else {
//         throw new Error('Erro desconhecido ao enviar o arquivo');
//         }
//     }
//     }