import { Hono } from 'hono';
import connectDB from './config/db.config';
import mediaRoute from './services/media';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';

const app = new Hono();


//? Serve static files from the main static directory
app.use('/static/*', serveStatic({ root: "./" }));

//? Enable CORS for all routes
app.use('*', cors()); 

//? Set up media routes
app.route('/api/media', mediaRoute);

//? 404 page
app.notFound((c) => {
    return c.html("<h1>404 page not found</h1>")
})

//? Connect to the database
connectDB();

export default app;