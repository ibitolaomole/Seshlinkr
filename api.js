import axios from 'axios';

const API_URL = 'http://192.168.1.10:3000'; // Replace with your backend URL

// Fetch posts and return just an array of message strings
export const fetchChatMessages = async () => {
  try {
    const res = await axios.get(`${API_URL}/posts`);
    const messages = res.data.map((post) => post.message); // Assumes each post has a `message` field
    return messages;
  } catch (err) {
    console.error('Failed to fetch posts:', err.message);
    return [];
  }
};