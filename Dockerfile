FROM nginx:alpine

# Set working directory to nginx asset directory
COPY ./build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 3333