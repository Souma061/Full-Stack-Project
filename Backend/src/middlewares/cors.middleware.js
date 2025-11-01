import cors from 'cors';

const corsOptions = {
  origin: 'http://your-allowed-origin.com', // Replace with your allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

const corsMiddleware = cors(corsOptions);
export default corsMiddleware;
