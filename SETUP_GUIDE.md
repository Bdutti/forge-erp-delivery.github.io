# SETUP GUIDE

## Step-by-Step Instructions for Local Development Setup

1. **Clone the Repository**  
   Open your terminal and run the following command:  
   ```bash  
   git clone https://github.com/Bdutti/forge-erp-delivery.github.io.git  
   cd forge-erp-delivery.github.io  
   ```  

2. **Install Dependencies**  
   Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Then run:  
   ```bash  
   npm install  
   ```  

3. **Set Up the Database**  
   For database configuration, follow these steps:  
   - Install [MySQL](https://www.mysql.com/) or use a cloud database service.  
   - Create a new database using:  
     ```sql  
     CREATE DATABASE your_database_name;  
     ```  
   - Update your database connection details in the `.env` file (see the Environment Variables section).

## Database Configuration

- **Database Type:** MySQL  
- **Connection String Format:** `mysql://username:password@localhost:3306/your_database_name`

Make sure to replace `username`, `password`, and `your_database_name` with your actual database credentials.

## Environment Variables

Create a `.env` file in the root of your project with the following structure:
```plaintext
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=your_database_name
PORT=3000
```  

## Troubleshooting

- **Issue:** If you encounter an error during installation, ensure Node.js and npm versions are compatible.  
- **Issue:** If the server doesn't start, check if the port defined in the `.env` file is already in use.  
- **Issue:** If database connection fails, validate your database credentials and ensure the database server is running.

### Additional Resources
- [Node.js Documentation](https://nodejs.org/en/docs/)  
- [npm Documentation](https://docs.npmjs.com/)  
- [MySQL Documentation](https://dev.mysql.com/doc/)  

Feel free to reach out via issues on this repository if you have further questions or experience difficulties!