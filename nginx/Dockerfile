# Use the official NGINX image
FROM nginx:latest

# Remove default NGINX configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional: expose port (for clarity, although handled by docker-compose)
EXPOSE 80
